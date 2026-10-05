import { Policy, DiscountStatus } from '../../types/policy.types';
import { storageService } from '../storage/storage.service';
import { computePolicyFinancials } from '../../utils/calculation.utils';
import { derivePolicyStatus, derivePaymentStatus, deriveCompanyPaymentStatus } from '../../utils/policy.utils';
import { CommissionRecord } from '../../types/commission.types';

export interface IPolicyService {
  getAll(): Promise<Policy[]>;
  getById(id: string): Promise<Policy | null>;
  create(data: Partial<Policy>): Promise<Policy>;
  update(id: string, data: Partial<Policy>): Promise<Policy>;
  renew(id: string, renewalData: Partial<Policy>): Promise<Policy>;
  approveDiscount(id: string, approved: boolean): Promise<Policy>;
  delete(id: string): Promise<boolean>;
}

export class MockPolicyService implements IPolicyService {
  async getAll(): Promise<Policy[]> {
    const policies = storageService.getPolicies();
    
    // Auto sync dynamic statuses based on dates and payment values
    return policies.map(p => {
      const financials = computePolicyFinancials({
        grossPremium: p.grossPremium,
        discount: p.discountStatus === 'APPROVED' || p.discountStatus === 'NONE' ? p.discount : 0,
        paidAmount: p.paidAmount,
        commissionRate: p.commissionRate,
        companyPaidAmount: p.companyPaidAmount,
      });

      const updatedPolicyStatus = derivePolicyStatus({ ...p, expiryDate: p.expiryDate });
      const updatedPaymentStatus = derivePaymentStatus(financials.netPremium, p.paidAmount, p.expiryDate);
      const updatedCompanyPaymentStatus = deriveCompanyPaymentStatus(financials.companyPayableAmount, p.companyPaidAmount);

      return {
        ...p,
        ...financials,
        policyStatus: p.policyStatus === 'CANCELLED' || p.policyStatus === 'RENEWED' ? p.policyStatus : updatedPolicyStatus,
        paymentStatus: updatedPaymentStatus,
        companyPaymentStatus: updatedCompanyPaymentStatus,
      };
    });
  }

  async getById(id: string): Promise<Policy | null> {
    const policies = await this.getAll();
    return policies.find(p => p.id === id) || null;
  }

  async create(data: Partial<Policy>): Promise<Policy> {
    const policies = storageService.getPolicies();
    const newId = `pol-${Date.now()}`;
    
    const customers = storageService.getCustomers();
    const customer = customers.find(c => c.id === data.customerId);
    const companies = storageService.getCompanies();
    const company = companies.find(c => c.id === data.insuranceCompanyId);

    const financials = computePolicyFinancials({
      grossPremium: data.grossPremium || 0,
      discount: data.discount || 0,
      paidAmount: data.paidAmount || 0,
      commissionRate: data.commissionRate || company?.defaultCommissionRate || 10,
      companyPaidAmount: 0,
    });

    const discountStatus: DiscountStatus = (data.discount || 0) > 0 ? (data.discountStatus || 'PENDING') : 'NONE';

    const newPolicy: Policy = {
      id: newId,
      policyNumber: data.policyNumber || `POL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: data.customerId || '',
      customerName: customer?.fullName || data.customerName || 'Unknown Customer',
      customerMobile: customer?.mobile || data.customerMobile || '',
      insuranceCompanyId: data.insuranceCompanyId || '',
      insuranceCompanyName: company?.name || data.insuranceCompanyName || 'Unknown Company',
      insuranceType: data.insuranceType || 'HEALTH',
      startDate: data.startDate || new Date().toISOString(),
      expiryDate: data.expiryDate || new Date(Date.now() + 365*24*60*60*1000).toISOString(),
      
      ...financials,
      discountReason: data.discountReason || '',
      discountStatus,
      
      policyStatus: 'ACTIVE',
      paymentStatus: derivePaymentStatus(financials.netPremium, financials.paidAmount, data.expiryDate),
      companyPaymentStatus: 'PENDING_REMITTANCE',
      
      agentId: data.agentId || storageService.getAuthUser()?.id,
      agentName: data.agentName || storageService.getAuthUser()?.name || 'Agent',
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.savePolicies([newPolicy, ...policies]);

    // Create matching commission record
    if (newPolicy.commissionAmount > 0) {
      const commissions = storageService.getCommissions();
      const newCommission: CommissionRecord = {
        id: `comm-${Date.now()}`,
        policyId: newId,
        policyNumber: newPolicy.policyNumber,
        customerName: newPolicy.customerName,
        insuranceCompanyId: newPolicy.insuranceCompanyId,
        insuranceCompanyName: newPolicy.insuranceCompanyName,
        netPremium: newPolicy.netPremium,
        commissionRate: newPolicy.commissionRate,
        commissionAmount: newPolicy.commissionAmount,
        agentId: newPolicy.agentId,
        agentName: newPolicy.agentName,
        policyDate: newPolicy.startDate,
        status: newPolicy.paidAmount >= newPolicy.netPremium ? 'EARNED' : 'PENDING',
        createdAt: new Date().toISOString(),
      };
      storageService.saveCommissions([newCommission, ...commissions]);
    }

    storageService.logActivity({
      userId: storageService.getAuthUser()?.id || 'sys',
      userName: storageService.getAuthUser()?.name || 'System',
      userRole: storageService.getAuthUser()?.role || 'ADMIN',
      action: 'CREATE_POLICY',
      module: 'Policies',
      entityId: newId,
      description: `Issued policy '${newPolicy.policyNumber}' for customer '${newPolicy.customerName}'`,
    });

    return newPolicy;
  }

  async update(id: string, updates: Partial<Policy>): Promise<Policy> {
    const policies = storageService.getPolicies();
    const index = policies.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Policy not found');

    const existing = policies[index];
    const updatedPolicy = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    policies[index] = updatedPolicy;
    storageService.savePolicies(policies);

    return updatedPolicy;
  }

  async renew(id: string, renewalData: Partial<Policy>): Promise<Policy> {
    const oldPolicy = await this.getById(id);
    if (!oldPolicy) throw new Error('Policy not found for renewal');

    // Mark old policy as RENEWED
    await this.update(id, { policyStatus: 'RENEWED' });

    // Create new policy linking to old policy ID
    const newPolicy = await this.create({
      ...oldPolicy,
      ...renewalData,
      policyNumber: `${oldPolicy.policyNumber}-R1`,
      previousPolicyId: oldPolicy.id,
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365*24*60*60*1000).toISOString(),
      paidAmount: 0,
      companyPaidAmount: 0,
    });

    storageService.logActivity({
      userId: storageService.getAuthUser()?.id || 'sys',
      userName: storageService.getAuthUser()?.name || 'System',
      userRole: storageService.getAuthUser()?.role || 'ADMIN',
      action: 'RENEW_POLICY',
      module: 'Renewals',
      entityId: newPolicy.id,
      description: `Renewed policy '${oldPolicy.policyNumber}' into new policy '${newPolicy.policyNumber}'`,
    });

    return newPolicy;
  }

  async approveDiscount(id: string, approved: boolean): Promise<Policy> {
    const policy = await this.getById(id);
    if (!policy) throw new Error('Policy not found');

    const newDiscountStatus: DiscountStatus = approved ? 'APPROVED' : 'REJECTED';
    const updated = await this.update(id, { discountStatus: newDiscountStatus });

    storageService.logActivity({
      userId: storageService.getAuthUser()?.id || 'sys',
      userName: storageService.getAuthUser()?.name || 'System',
      userRole: storageService.getAuthUser()?.role || 'ADMIN',
      action: approved ? 'APPROVE_DISCOUNT' : 'REJECT_DISCOUNT',
      module: 'Discounts',
      entityId: id,
      description: `${approved ? 'Approved' : 'Rejected'} discount of ₹${policy.discount} for Policy ${policy.policyNumber}`,
    });

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const policies = storageService.getPolicies();
    const filtered = policies.filter(p => p.id !== id);
    storageService.savePolicies(filtered);
    return true;
  }
}

export const mockPolicyService = new MockPolicyService();

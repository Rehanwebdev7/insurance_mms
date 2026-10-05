import { CustomerPayment, CompanyPayment } from '../../types/payment.types';
import { storageService } from '../storage/storage.service';
import { mockPolicyService } from './mockPolicy.service';

export interface IPaymentService {
  getCustomerPayments(): Promise<CustomerPayment[]>;
  recordCustomerPayment(payment: Omit<CustomerPayment, 'id' | 'receiptNumber' | 'createdAt'>): Promise<CustomerPayment>;
  getCompanyPayments(): Promise<CompanyPayment[]>;
  recordCompanyPayment(payment: Omit<CompanyPayment, 'id' | 'remittanceNumber' | 'createdAt'>): Promise<CompanyPayment>;
}

export class MockPaymentService implements IPaymentService {
  async getCustomerPayments(): Promise<CustomerPayment[]> {
    return storageService.getPayments();
  }

  async recordCustomerPayment(data: Omit<CustomerPayment, 'id' | 'receiptNumber' | 'createdAt'>): Promise<CustomerPayment> {
    const payments = storageService.getPayments();
    const newId = `pay-${Date.now()}`;
    const receiptNumber = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPayment: CustomerPayment = {
      ...data,
      id: newId,
      receiptNumber,
      createdAt: new Date().toISOString(),
    };

    storageService.savePayments([newPayment, ...payments]);

    // Update target policy's paidAmount
    const policy = await mockPolicyService.getById(data.policyId);
    if (policy) {
      const updatedPaid = policy.paidAmount + data.amount;
      const updatedPending = Math.max(0, policy.netPremium - updatedPaid);

      await mockPolicyService.update(policy.id, {
        paidAmount: updatedPaid,
        pendingAmount: updatedPending,
      });

      // If policy is now fully paid, mark commission as EARNED
      if (updatedPaid >= policy.netPremium) {
        const commissions = storageService.getCommissions();
        const updatedCommissions = commissions.map(c => 
          c.policyId === policy.id ? { ...c, status: 'EARNED' as const } : c
        );
        storageService.saveCommissions(updatedCommissions);
      }
    }

    storageService.logActivity({
      userId: storageService.getAuthUser()?.id || 'sys',
      userName: storageService.getAuthUser()?.name || 'System',
      userRole: storageService.getAuthUser()?.role || 'ACCOUNTANT',
      action: 'RECORD_PAYMENT',
      module: 'Payments',
      entityId: newId,
      description: `Recorded customer payment of ₹${data.amount} for Policy ${data.policyNumber}`,
    });

    return newPayment;
  }

  async getCompanyPayments(): Promise<CompanyPayment[]> {
    return storageService.getCompanyPayments();
  }

  async recordCompanyPayment(data: Omit<CompanyPayment, 'id' | 'remittanceNumber' | 'createdAt'>): Promise<CompanyPayment> {
    const companyPayments = storageService.getCompanyPayments();
    const newId = `cpay-${Date.now()}`;
    const remittanceNumber = `REM-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newPayment: CompanyPayment = {
      ...data,
      id: newId,
      remittanceNumber,
      createdAt: new Date().toISOString(),
    };

    storageService.saveCompanyPayments([newPayment, ...companyPayments]);

    // Update companyPaidAmount for linked policies
    if (data.policyIds && data.policyIds.length > 0) {
      const perPolicyPayment = Math.round(data.amount / data.policyIds.length);
      for (const polId of data.policyIds) {
        const pol = await mockPolicyService.getById(polId);
        if (pol) {
          const updatedCompanyPaid = pol.companyPaidAmount + perPolicyPayment;
          const updatedBalance = Math.max(0, pol.companyPayableAmount - updatedCompanyPaid);
          await mockPolicyService.update(polId, {
            companyPaidAmount: updatedCompanyPaid,
            companyBalanceAmount: updatedBalance,
          });
        }
      }
    }

    storageService.logActivity({
      userId: storageService.getAuthUser()?.id || 'sys',
      userName: storageService.getAuthUser()?.name || 'System',
      userRole: storageService.getAuthUser()?.role || 'ACCOUNTANT',
      action: 'RECORD_COMPANY_REMITTANCE',
      module: 'Company Remittance',
      entityId: newId,
      description: `Remitted ₹${data.amount} to ${data.insuranceCompanyName}`,
    });

    return newPayment;
  }
}

export const mockPaymentService = new MockPaymentService();

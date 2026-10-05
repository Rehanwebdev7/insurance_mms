import { InsuranceCompany } from '../../types/company.types';
import { storageService } from '../storage/storage.service';

export class MockCompanyService {
  async getAll(): Promise<InsuranceCompany[]> {
    const companies = storageService.getCompanies();
    const policies = storageService.getPolicies();

    return companies.map(comp => {
      const compPolicies = policies.filter(p => p.insuranceCompanyId === comp.id);
      
      const totalGrossPremium = compPolicies.reduce((acc, p) => acc + p.grossPremium, 0);
      const totalCommissionEarned = compPolicies.reduce((acc, p) => acc + p.commissionAmount, 0);
      const totalCompanyPayable = compPolicies.reduce((acc, p) => acc + p.companyPayableAmount, 0);
      const totalCompanyPaid = compPolicies.reduce((acc, p) => acc + p.companyPaidAmount, 0);
      const totalCompanyBalance = compPolicies.reduce((acc, p) => acc + p.companyBalanceAmount, 0);

      return {
        ...comp,
        totalPoliciesCount: compPolicies.length,
        totalGrossPremium,
        totalCommissionEarned,
        totalCompanyPayable,
        totalCompanyPaid,
        totalCompanyBalance,
      };
    });
  }

  async getById(id: string): Promise<InsuranceCompany | null> {
    const companies = await this.getAll();
    return companies.find(c => c.id === id) || null;
  }

  async create(data: Omit<InsuranceCompany, 'id' | 'createdAt'>): Promise<InsuranceCompany> {
    const companies = storageService.getCompanies();
    const newId = `comp-${Date.now()}`;
    const newCompany: InsuranceCompany = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    storageService.saveCompanies([newCompany, ...companies]);
    return newCompany;
  }

  async update(id: string, updates: Partial<InsuranceCompany>): Promise<InsuranceCompany> {
    const companies = storageService.getCompanies();
    const index = companies.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Company not found');

    const updated = { ...companies[index], ...updates };
    companies[index] = updated;
    storageService.saveCompanies(companies);
    return updated;
  }
}

export const mockCompanyService = new MockCompanyService();

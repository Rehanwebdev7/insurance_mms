export interface InsuranceCompany {
  id: string;
  code: string;
  name: string;
  logo?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  defaultCommissionRate: number; // e.g. 12%
  status: 'ACTIVE' | 'INACTIVE';
  
  // Aggregate financial metrics
  totalPoliciesCount?: number;
  totalGrossPremium?: number;
  totalCommissionEarned?: number;
  totalCompanyPayable?: number;
  totalCompanyPaid?: number;
  totalCompanyBalance?: number;
  
  createdAt: string;
}

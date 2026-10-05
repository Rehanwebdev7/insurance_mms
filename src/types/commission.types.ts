export interface CommissionRecord {
  id: string;
  policyId: string;
  policyNumber: string;
  customerName: string;
  insuranceCompanyId: string;
  insuranceCompanyName: string;
  netPremium: number;
  commissionRate: number;
  commissionAmount: number;
  agentId?: string;
  agentName?: string;
  policyDate: string;
  status: 'EARNED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
}

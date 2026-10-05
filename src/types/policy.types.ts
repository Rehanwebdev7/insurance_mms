export type InsuranceType = 'HEALTH' | 'MOTOR' | 'LIFE' | 'PROPERTY' | 'TRAVEL' | 'COMMERCIAL' | 'CORP_GROUP';

export type PolicyStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'RENEWED' | 'PENDING_APPROVAL';

export type PaymentStatus = 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';

export type CompanyPaymentStatus = 'REMITTED' | 'PARTIAL_REMITTED' | 'PENDING_REMITTANCE';

export type DiscountStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Policy {
  id: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  insuranceCompanyId: string;
  insuranceCompanyName: string;
  insuranceType: InsuranceType;
  startDate: string;
  expiryDate: string;
  
  // Financial breakdown
  grossPremium: number;
  discount: number;
  discountReason?: string;
  discountStatus: DiscountStatus;
  netPremium: number; // grossPremium - discount
  
  // Customer Payments
  paidAmount: number;
  pendingAmount: number; // netPremium - paidAmount
  
  // Commission & Company Payable
  commissionRate: number; // percentage e.g. 10%
  commissionAmount: number; // netPremium * (commissionRate / 100)
  companyPayableAmount: number; // netPremium - commissionAmount
  companyPaidAmount: number;
  companyBalanceAmount: number; // companyPayableAmount - companyPaidAmount
  
  // Statuses (Separated)
  policyStatus: PolicyStatus;
  paymentStatus: PaymentStatus;
  companyPaymentStatus: CompanyPaymentStatus;
  
  // Renewal tracking
  previousPolicyId?: string;
  renewedPolicyId?: string;
  renewalNoticeSent?: boolean;
  
  agentId?: string;
  agentName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

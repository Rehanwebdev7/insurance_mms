import { Policy, PaymentStatus, PolicyStatus, CompanyPaymentStatus } from '../types/policy.types';
import { getDaysRemaining } from './date.utils';

export function getPolicyStatusLabel(status: PolicyStatus): string {
  switch (status) {
    case 'ACTIVE': return 'Active';
    case 'EXPIRED': return 'Expired';
    case 'RENEWED': return 'Renewed';
    case 'CANCELLED': return 'Cancelled';
    case 'PENDING_APPROVAL': return 'Pending Approval';
    default: return status;
  }
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case 'PAID': return 'Fully Paid';
    case 'PARTIAL': return 'Partially Paid';
    case 'PENDING': return 'Unpaid Pending';
    case 'OVERDUE': return 'Overdue Payment';
    default: return status;
  }
}

export function getCompanyPaymentStatusLabel(status: CompanyPaymentStatus): string {
  switch (status) {
    case 'REMITTED': return 'Remitted';
    case 'PARTIAL_REMITTED': return 'Partially Remitted';
    case 'PENDING_REMITTANCE': return 'Pending Remittance';
    default: return status;
  }
}

export function derivePolicyStatus(policy: Partial<Policy>): PolicyStatus {
  if (policy.policyStatus === 'CANCELLED') return 'CANCELLED';
  if (policy.policyStatus === 'RENEWED') return 'RENEWED';
  
  if (policy.expiryDate) {
    const days = getDaysRemaining(policy.expiryDate);
    if (days < 0) return 'EXPIRED';
  }
  return 'ACTIVE';
}

export function derivePaymentStatus(netPremium: number, paidAmount: number, expiryDate?: string): PaymentStatus {
  if (paidAmount >= netPremium && netPremium > 0) return 'PAID';
  if (paidAmount > 0 && paidAmount < netPremium) return 'PARTIAL';
  
  if (expiryDate && getDaysRemaining(expiryDate) < 0) {
    return 'OVERDUE';
  }
  return 'PENDING';
}

export function deriveCompanyPaymentStatus(companyPayable: number, companyPaid: number): CompanyPaymentStatus {
  if (companyPaid >= companyPayable && companyPayable > 0) return 'REMITTED';
  if (companyPaid > 0 && companyPaid < companyPayable) return 'PARTIAL_REMITTED';
  return 'PENDING_REMITTANCE';
}

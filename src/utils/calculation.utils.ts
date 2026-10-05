/**
 * CENTRALIZED BUSINESS CALCULATION ENGINE
 * Rule: Financial calculations must NEVER be hardcoded inside components.
 */

export function calculateNetPremium(grossPremium: number, discount: number): number {
  const safeGross = Math.max(0, grossPremium || 0);
  const safeDiscount = Math.max(0, discount || 0);
  // Prevent discount from exceeding gross premium
  const validatedDiscount = Math.min(safeGross, safeDiscount);
  return safeGross - validatedDiscount;
}

export function calculateDiscount(grossPremium: number, discountValue: number, isPercentage = false): number {
  const safeGross = Math.max(0, grossPremium || 0);
  if (isPercentage) {
    const rate = Math.min(100, Math.max(0, discountValue || 0));
    return Math.round(safeGross * (rate / 100));
  }
  return Math.min(safeGross, Math.max(0, discountValue || 0));
}

export function calculateCustomerPending(netPremium: number, paidAmount: number): number {
  const safeNet = Math.max(0, netPremium || 0);
  const safePaid = Math.max(0, paidAmount || 0);
  return Math.max(0, safeNet - safePaid);
}

export function calculateCommission(netPremium: number, commissionRate: number): number {
  const safeNet = Math.max(0, netPremium || 0);
  const safeRate = Math.max(0, commissionRate || 0);
  return Math.round(safeNet * (safeRate / 100));
}

export function calculateCompanyPayable(netPremium: number, commissionAmount: number): number {
  const safeNet = Math.max(0, netPremium || 0);
  const safeCommission = Math.max(0, commissionAmount || 0);
  return Math.max(0, safeNet - safeCommission);
}

export function calculateCompanyBalance(companyPayableAmount: number, companyPaidAmount: number): number {
  const safePayable = Math.max(0, companyPayableAmount || 0);
  const safePaid = Math.max(0, companyPaidAmount || 0);
  return Math.max(0, safePayable - safePaid);
}

export interface PolicyFinancials {
  grossPremium: number;
  discount: number;
  netPremium: number;
  paidAmount: number;
  pendingAmount: number;
  commissionRate: number;
  commissionAmount: number;
  companyPayableAmount: number;
  companyPaidAmount: number;
  companyBalanceAmount: number;
}

export function computePolicyFinancials(params: {
  grossPremium: number;
  discount: number;
  paidAmount: number;
  commissionRate: number;
  companyPaidAmount?: number;
}): PolicyFinancials {
  const grossPremium = Math.max(0, params.grossPremium || 0);
  const discount = Math.min(grossPremium, Math.max(0, params.discount || 0));
  const netPremium = calculateNetPremium(grossPremium, discount);
  const paidAmount = Math.min(netPremium, Math.max(0, params.paidAmount || 0));
  const pendingAmount = calculateCustomerPending(netPremium, paidAmount);
  
  const commissionRate = Math.max(0, params.commissionRate || 0);
  const commissionAmount = calculateCommission(netPremium, commissionRate);
  
  const companyPayableAmount = calculateCompanyPayable(netPremium, commissionAmount);
  const companyPaidAmount = Math.min(companyPayableAmount, Math.max(0, params.companyPaidAmount || 0));
  const companyBalanceAmount = calculateCompanyBalance(companyPayableAmount, companyPaidAmount);

  return {
    grossPremium,
    discount,
    netPremium,
    paidAmount,
    pendingAmount,
    commissionRate,
    commissionAmount,
    companyPayableAmount,
    companyPaidAmount,
    companyBalanceAmount,
  };
}

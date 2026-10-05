export type PaymentMethod = 'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CHEQUE' | 'CASH';

export type CustomerPaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';

export interface CustomerPayment {
  id: string;
  receiptNumber: string;
  customerId: string;
  customerName: string;
  policyId: string;
  policyNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  status: CustomerPaymentStatus;
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

export interface CompanyPayment {
  id: string;
  remittanceNumber: string;
  insuranceCompanyId: string;
  insuranceCompanyName: string;
  policyIds: string[];
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

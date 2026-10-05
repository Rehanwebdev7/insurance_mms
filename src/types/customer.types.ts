export type CustomerType = 'INDIVIDUAL' | 'CORPORATE';

export interface CustomerDocument {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface Customer {
  id: string;
  code: string;
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  customerType: CustomerType;
  panNumber?: string;
  aadhaarNumber?: string;
  gstin?: string;
  status: 'ACTIVE' | 'INACTIVE';
  totalPolicies?: number;
  totalPremiumPaid?: number;
  totalPendingAmount?: number;
  createdAt: string;
  updatedAt: string;
  documents?: CustomerDocument[];
}

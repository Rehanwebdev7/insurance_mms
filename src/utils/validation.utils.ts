export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\+\(\)]/g, '');
  return cleaned.length >= 10 && /^\d+$/.test(cleaned);
}

export function validatePolicyForm(data: {
  policyNumber: string;
  customerId: string;
  insuranceCompanyId: string;
  grossPremium: number;
  discount: number;
  startDate: string;
  expiryDate: string;
  commissionRate: number;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.policyNumber || !data.policyNumber.trim()) {
    errors.policyNumber = 'Policy number is required';
  }

  if (!data.customerId) {
    errors.customerId = 'Customer selection is required';
  }

  if (!data.insuranceCompanyId) {
    errors.insuranceCompanyId = 'Insurance company is required';
  }

  if (isNaN(data.grossPremium) || data.grossPremium <= 0) {
    errors.grossPremium = 'Gross premium must be greater than 0';
  }

  if (isNaN(data.discount) || data.discount < 0) {
    errors.discount = 'Discount cannot be negative';
  } else if (data.discount > data.grossPremium) {
    errors.discount = 'Discount cannot exceed gross premium amount';
  }

  if (!data.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (!data.expiryDate) {
    errors.expiryDate = 'Expiry date is required';
  }

  if (data.startDate && data.expiryDate) {
    const start = new Date(data.startDate);
    const expiry = new Date(data.expiryDate);
    if (expiry <= start) {
      errors.expiryDate = 'Expiry date must be after start date';
    }
  }

  if (isNaN(data.commissionRate) || data.commissionRate < 0 || data.commissionRate > 100) {
    errors.commissionRate = 'Commission rate must be between 0% and 100%';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validatePaymentForm(data: {
  amount: number;
  pendingAmount: number;
  paymentDate: string;
  paymentMethod: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (isNaN(data.amount) || data.amount <= 0) {
    errors.amount = 'Payment amount must be greater than 0';
  } else if (data.amount > data.pendingAmount) {
    errors.amount = `Payment amount (₹${data.amount}) cannot exceed pending amount (₹${data.pendingAmount})`;
  }

  if (!data.paymentDate) {
    errors.paymentDate = 'Payment date is required';
  }

  if (!data.paymentMethod) {
    errors.paymentMethod = 'Payment method is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

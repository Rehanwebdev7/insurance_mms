import React from 'react';
import { Badge } from '../ui/Badge';
import { PolicyStatus, PaymentStatus, CompanyPaymentStatus } from '../../types/policy.types';
import { getPolicyStatusLabel, getPaymentStatusLabel, getCompanyPaymentStatusLabel } from '../../utils/policy.utils';

export interface StatusBadgeProps {
  type: 'policy' | 'payment' | 'companyPayment' | 'generic';
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, status }) => {
  let label = status;
  let variant: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral' = 'neutral';

  if (type === 'policy') {
    label = getPolicyStatusLabel(status as PolicyStatus);
    switch (status) {
      case 'ACTIVE': variant = 'success'; break;
      case 'EXPIRED': variant = 'danger'; break;
      case 'RENEWED': variant = 'info'; break;
      case 'CANCELLED': variant = 'neutral'; break;
      case 'PENDING_APPROVAL': variant = 'warning'; break;
    }
  } else if (type === 'payment') {
    label = getPaymentStatusLabel(status as PaymentStatus);
    switch (status) {
      case 'PAID': variant = 'success'; break;
      case 'PARTIAL': variant = 'warning'; break;
      case 'PENDING': variant = 'info'; break;
      case 'OVERDUE': variant = 'danger'; break;
    }
  } else if (type === 'companyPayment') {
    label = getCompanyPaymentStatusLabel(status as CompanyPaymentStatus);
    switch (status) {
      case 'REMITTED': variant = 'success'; break;
      case 'PARTIAL_REMITTED': variant = 'warning'; break;
      case 'PENDING_REMITTANCE': variant = 'info'; break;
    }
  } else {
    if (['ACTIVE', 'SUCCESS', 'APPROVED', 'EARNED'].includes(status.toUpperCase())) variant = 'success';
    else if (['PENDING', 'PARTIAL', 'INACTIVE'].includes(status.toUpperCase())) variant = 'warning';
    else if (['EXPIRED', 'FAILED', 'REJECTED', 'OVERDUE', 'CANCELLED'].includes(status.toUpperCase())) variant = 'danger';
  }

  return <Badge variant={variant}>{label}</Badge>;
};

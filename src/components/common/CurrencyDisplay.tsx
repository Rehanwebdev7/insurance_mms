import React from 'react';
import { formatCurrency, formatCompactCurrency } from '../../utils/currency.utils';

export interface CurrencyDisplayProps {
  amount: number | undefined | null;
  compact?: boolean;
  className?: string;
  showSymbol?: boolean;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  compact = false,
  className,
  showSymbol = true,
}) => {
  const formatted = compact ? formatCompactCurrency(amount) : formatCurrency(amount, showSymbol);
  return <span className={className}>{formatted}</span>;
};

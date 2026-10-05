import React from 'react';
import { formatDate, formatDateTime, getDaysRemaining, isExpired, isExpiringSoon } from '../../utils/date.utils';

export interface DateDisplayProps {
  date: string | Date | undefined | null;
  showTime?: boolean;
  showDaysRemaining?: boolean;
  className?: string;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({
  date,
  showTime = false,
  showDaysRemaining = false,
  className,
}) => {
  if (!date) return <span className={className}>-</span>;

  const formatted = showTime ? formatDateTime(date) : formatDate(date);
  const dateStr = typeof date === 'string' ? date : date.toISOString();

  const days = getDaysRemaining(dateStr);
  const expired = isExpired(dateStr);
  const expiringSoon = isExpiringSoon(dateStr);

  return (
    <span className={className}>
      <span>{formatted}</span>
      {showDaysRemaining && (
        <span className={`ml-2 text-[11px] font-semibold px-1.5 py-0.5 rounded ${
          expired
            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
            : expiringSoon
            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}>
          {expired ? `Expired (${Math.abs(days)}d ago)` : `In ${days} days`}
        </span>
      )}
    </span>
  );
};

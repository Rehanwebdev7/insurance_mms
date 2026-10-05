import React from 'react';
import { Card } from '../ui/Card';
import { clsx } from 'clsx';

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  colorScheme?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'cyan';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  colorScheme = 'blue',
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
    purple: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
    rose: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
    cyan: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400',
  };

  return (
    <Card hoverable className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">{title}</p>
          <div className="text-2xl font-extrabold text-[var(--color-text)] mt-1.5">{value}</div>
          {subtitle && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold">
              <span className={trend.isPositive !== false ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                {trend.isPositive !== false ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-[var(--color-muted)] font-normal">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={clsx('p-3 rounded-xl shrink-0', colorClasses[colorScheme])}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

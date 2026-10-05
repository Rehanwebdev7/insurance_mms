import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable = false, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 shadow-xs transition-all',
        hoverable && 'hover:shadow-md hover:border-[var(--color-border-hover)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

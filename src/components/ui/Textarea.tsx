import React from 'react';
import { clsx } from 'clsx';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  required,
  className,
  id,
  rows = 3,
  ...props
}, ref) => {
  const areaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={areaId} className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        className={clsx(
          'w-full text-sm rounded-lg border bg-[var(--color-surface)] text-[var(--color-text)] transition-colors px-3.5 py-2',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
          'placeholder:text-[var(--color-muted)]',
          error ? 'border-red-500 focus:ring-red-500' : 'border-[var(--color-border)]',
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[var(--color-muted)]">{helperText}</p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';

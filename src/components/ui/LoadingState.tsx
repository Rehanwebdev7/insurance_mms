import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[200px]">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)] mb-3" />
      <p className="text-sm font-medium text-[var(--color-text-secondary)]">{message}</p>
    </div>
  );
};

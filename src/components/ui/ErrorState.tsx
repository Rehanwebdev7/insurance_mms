import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center border border-red-200 dark:border-red-900 rounded-2xl bg-red-50/50 dark:bg-red-950/20 my-4">
      <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 mb-3">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-red-900 dark:text-red-200">{title}</h3>
      <p className="text-xs text-red-700 dark:text-red-300 max-w-md mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  showToast: (title: string, message?: string, type?: ToastType) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message?: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, type, title, message };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = (title: string, message?: string) => showToast(title, message, 'success');
  const error = (title: string, message?: string) => showToast(title, message, 'error');
  const warning = (title: string, message?: string) => showToast(title, message, 'warning');
  const info = (title: string, message?: string) => showToast(title, message, 'info');

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      {createPortal(
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
          {toasts.map(toast => {
            const icons = {
              success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
              error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
              warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
              info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
            };

            const bgColors = {
              success: 'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-100',
              error: 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/80 text-red-900 dark:text-red-100',
              warning: 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-100',
              info: 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/80 text-blue-900 dark:text-blue-100',
            };

            return (
              <div
                key={toast.id}
                className={clsx(
                  'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300',
                  bgColors[toast.type]
                )}
              >
                {icons[toast.type]}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold leading-snug">{toast.title}</p>
                  {toast.message && (
                    <p className="text-xs opacity-85 mt-0.5 leading-relaxed">{toast.message}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-md opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

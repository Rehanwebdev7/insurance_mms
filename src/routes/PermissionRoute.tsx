import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { PermissionCode } from '../types/permission.types';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/route.config';

export interface PermissionRouteProps {
  permission: PermissionCode | PermissionCode[];
  children: React.ReactNode;
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({ permission, children }) => {
  const { can } = usePermissions();
  const navigate = useNavigate();

  const isAllowed = can(permission);

  if (!isAllowed) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-rose-200 dark:border-rose-900 rounded-3xl bg-rose-50/40 dark:bg-rose-950/20 my-8">
        <div className="p-4 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 mb-4 shadow-inner">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-extrabold text-rose-950 dark:text-rose-200">403 — Access Restricted</h2>
        <p className="text-xs text-rose-800 dark:text-rose-300 max-w-md mt-1.5 mb-6 leading-relaxed">
          Your active user role does not possess permission code <code className="px-1.5 py-0.5 bg-rose-200 dark:bg-rose-900 rounded font-mono font-bold">{Array.isArray(permission) ? permission.join(', ') : permission}</code> to view this operational module.
        </p>
        <Button variant="danger" size="md" onClick={() => navigate(ROUTES.DASHBOARD)}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};

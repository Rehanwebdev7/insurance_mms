import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { PermissionCode } from '../../types/permission.types';

export interface PermissionGateProps {
  permission: PermissionCode | PermissionCode[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  requireAll = false,
  children,
  fallback = null,
}) => {
  const { can, canAll } = usePermissions();

  const isAllowed = Array.isArray(permission)
    ? requireAll
      ? canAll(permission)
      : can(permission)
    : can(permission);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

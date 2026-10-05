import { useAuth } from './useAuth';
import { PermissionCode } from '../types/permission.types';
import { hasPermission, hasAllPermissions, getUserPermissions } from '../utils/permission.utils';

export function usePermissions() {
  const { user } = useAuth();

  const checkPermission = (permission: PermissionCode | PermissionCode[]) => {
    return hasPermission(user, permission);
  };

  const checkAllPermissions = (permissions: PermissionCode[]) => {
    return hasAllPermissions(user, permissions);
  };

  const permissions = getUserPermissions(user);
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return {
    permissions,
    isSuperAdmin,
    can: checkPermission,
    canAll: checkAllPermissions,
  };
}

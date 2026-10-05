import { User } from '../types/auth.types';
import { PermissionCode, RoleCode } from '../types/permission.types';
import { ROLE_DEFAULT_PERMISSIONS } from '../config/permission.config';

export function getRolePermissions(roleCode: RoleCode): PermissionCode[] {
  return ROLE_DEFAULT_PERMISSIONS[roleCode] || [];
}

export function getUserPermissions(user: User | null): PermissionCode[] {
  if (!user) return [];
  if (user.role === 'SUPER_ADMIN') {
    return ROLE_DEFAULT_PERMISSIONS.SUPER_ADMIN;
  }
  
  const rolePermissions = getRolePermissions(user.role);
  const customPermissions = user.customPermissions || [];
  
  // Merge role and custom permissions without duplicates
  return Array.from(new Set([...rolePermissions, ...customPermissions]));
}

export function hasPermission(user: User | null, permission: PermissionCode | PermissionCode[]): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;

  const permissions = getUserPermissions(user);

  if (Array.isArray(permission)) {
    return permission.some(p => permissions.includes(p));
  }
  return permissions.includes(permission);
}

export function hasAllPermissions(user: User | null, requiredPermissions: PermissionCode[]): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;

  const permissions = getUserPermissions(user);
  return requiredPermissions.every(p => permissions.includes(p));
}

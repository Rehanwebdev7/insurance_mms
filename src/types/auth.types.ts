import { RoleCode, PermissionCode } from './permission.types';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: RoleCode;
  roleName?: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE';
  customPermissions?: PermissionCode[];
  lastLogin?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

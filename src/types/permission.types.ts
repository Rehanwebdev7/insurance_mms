export type RoleCode = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'MANAGER' 
  | 'ACCOUNTANT' 
  | 'AGENT' 
  | 'VIEWER';

export type PermissionCode = 
  | 'dashboard.view'
  | 'customers.view'
  | 'customers.create'
  | 'customers.edit'
  | 'customers.delete'
  | 'policies.view'
  | 'policies.create'
  | 'policies.edit'
  | 'policies.delete'
  | 'payments.view'
  | 'payments.create'
  | 'payments.edit'
  | 'payments.delete'
  | 'collections.view'
  | 'renewals.view'
  | 'renewals.create'
  | 'companies.view'
  | 'companies.create'
  | 'companies.edit'
  | 'company_payables.view'
  | 'company_payables.create'
  | 'company_payables.edit'
  | 'commissions.view'
  | 'reports.view'
  | 'reports.export'
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'roles.view'
  | 'roles.create'
  | 'roles.edit'
  | 'settings.view'
  | 'settings.edit'
  | 'audit_logs.view'
  | 'discount.view'
  | 'discount.create'
  | 'discount.edit'
  | 'discount.approve';

export interface Role {
  id: string;
  code: RoleCode;
  name: string;
  description: string;
  permissions: PermissionCode[];
  isSystem: boolean;
  userCount?: number;
  updatedAt: string;
}

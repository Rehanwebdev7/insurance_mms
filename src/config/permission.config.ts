import { RoleCode, PermissionCode } from '../types/permission.types';

export const ALL_PERMISSIONS: { code: PermissionCode; label: string; module: string }[] = [
  // Dashboard
  { code: 'dashboard.view', label: 'View Dashboard', module: 'Dashboard' },

  // Customers
  { code: 'customers.view', label: 'View Customers', module: 'Customers' },
  { code: 'customers.create', label: 'Create Customer', module: 'Customers' },
  { code: 'customers.edit', label: 'Edit Customer', module: 'Customers' },
  { code: 'customers.delete', label: 'Delete Customer', module: 'Customers' },

  // Policies
  { code: 'policies.view', label: 'View Policies', module: 'Policies' },
  { code: 'policies.create', label: 'Create Policy', module: 'Policies' },
  { code: 'policies.edit', label: 'Edit Policy', module: 'Policies' },
  { code: 'policies.delete', label: 'Delete Policy', module: 'Policies' },

  // Payments
  { code: 'payments.view', label: 'View Payments', module: 'Payments' },
  { code: 'payments.create', label: 'Record Customer Payment', module: 'Payments' },
  { code: 'payments.edit', label: 'Edit Payment', module: 'Payments' },
  { code: 'payments.delete', label: 'Delete Payment', module: 'Payments' },
  { code: 'collections.view', label: 'View Pending Collections', module: 'Payments' },

  // Renewals
  { code: 'renewals.view', label: 'View Renewals', module: 'Renewals' },
  { code: 'renewals.create', label: 'Process Renewal', module: 'Renewals' },

  // Insurance Companies
  { code: 'companies.view', label: 'View Insurance Companies', module: 'Insurance Companies' },
  { code: 'companies.create', label: 'Add Insurance Company', module: 'Insurance Companies' },
  { code: 'companies.edit', label: 'Edit Insurance Company', module: 'Insurance Companies' },

  // Company Payables
  { code: 'company_payables.view', label: 'View Company Payables', module: 'Company Remittance' },
  { code: 'company_payables.create', label: 'Record Remittance', module: 'Company Remittance' },
  { code: 'company_payables.edit', label: 'Edit Remittance', module: 'Company Remittance' },

  // Commissions
  { code: 'commissions.view', label: 'View Commissions', module: 'Commissions' },

  // Reports
  { code: 'reports.view', label: 'View Reports', module: 'Reports' },
  { code: 'reports.export', label: 'Export Reports', module: 'Reports' },

  // Users
  { code: 'users.view', label: 'View Users', module: 'Administration' },
  { code: 'users.create', label: 'Create User', module: 'Administration' },
  { code: 'users.edit', label: 'Edit User', module: 'Administration' },
  { code: 'users.delete', label: 'Delete User', module: 'Administration' },

  // Roles
  { code: 'roles.view', label: 'View Roles', module: 'Administration' },
  { code: 'roles.create', label: 'Create Role', module: 'Administration' },
  { code: 'roles.edit', label: 'Edit Role', module: 'Administration' },

  // Settings & Audit
  { code: 'settings.view', label: 'View Settings', module: 'Settings' },
  { code: 'settings.edit', label: 'Modify Settings', module: 'Settings' },
  { code: 'audit_logs.view', label: 'View Audit Logs', module: 'Audit' },

  // Discount
  { code: 'discount.view', label: 'View Discounts', module: 'Discounts' },
  { code: 'discount.create', label: 'Apply Discount', module: 'Discounts' },
  { code: 'discount.edit', label: 'Edit Discount', module: 'Discounts' },
  { code: 'discount.approve', label: 'Approve Discount', module: 'Discounts' },
];

export const ROLE_DEFAULT_PERMISSIONS: Record<RoleCode, PermissionCode[]> = {
  SUPER_ADMIN: ALL_PERMISSIONS.map(p => p.code),
  
  ADMIN: ALL_PERMISSIONS
    .map(p => p.code)
    .filter(p => !['roles.create', 'roles.edit'].includes(p)),

  MANAGER: [
    'dashboard.view',
    'customers.view', 'customers.create', 'customers.edit',
    'policies.view', 'policies.create', 'policies.edit',
    'payments.view', 'payments.create',
    'collections.view',
    'renewals.view', 'renewals.create',
    'companies.view',
    'company_payables.view',
    'commissions.view',
    'reports.view', 'reports.export',
    'discount.view', 'discount.create', 'discount.approve',
  ],

  ACCOUNTANT: [
    'dashboard.view',
    'customers.view',
    'policies.view',
    'payments.view', 'payments.create', 'payments.edit',
    'collections.view',
    'company_payables.view', 'company_payables.create', 'company_payables.edit',
    'commissions.view',
    'reports.view', 'reports.export',
  ],

  AGENT: [
    'dashboard.view',
    'customers.view', 'customers.create', 'customers.edit',
    'policies.view', 'policies.create',
    'renewals.view', 'renewals.create',
    'discount.view', 'discount.create',
    'commissions.view',
  ],

  VIEWER: [
    'dashboard.view',
    'customers.view',
    'policies.view',
    'payments.view',
    'renewals.view',
    'companies.view',
    'reports.view',
  ],
};

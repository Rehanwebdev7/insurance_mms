import { PermissionCode } from '../types/permission.types';
import { ROUTES } from './route.config';

export interface NavItem {
  id: string;
  label: string;
  iconName: string;
  route: string;
  permission: PermissionCode;
  badgeKey?: 'expiringCount' | 'pendingPaymentsCount' | 'unreadNotificationsCount';
  children?: NavItem[];
}

export interface NavGroup {
  id: string;
  groupLabel: string;
  items: NavItem[];
}

export const NAVIGATION_CONFIG: NavGroup[] = [
  {
    id: 'main',
    groupLabel: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        iconName: 'LayoutDashboard',
        route: ROUTES.DASHBOARD,
        permission: 'dashboard.view',
      },
    ],
  },
  {
    id: 'business',
    groupLabel: 'Insurance Operations',
    items: [
      {
        id: 'customers',
        label: 'Customers',
        iconName: 'Users',
        route: ROUTES.CUSTOMERS,
        permission: 'customers.view',
      },
      {
        id: 'policies',
        label: 'Policies',
        iconName: 'ShieldCheck',
        route: ROUTES.POLICIES,
        permission: 'policies.view',
      },
      {
        id: 'renewals',
        label: 'Policy Renewals',
        iconName: 'RotateCw',
        route: ROUTES.RENEWALS,
        permission: 'renewals.view',
        badgeKey: 'expiringCount',
      },
    ],
  },
  {
    id: 'finance',
    groupLabel: 'Financial & Accounting',
    items: [
      {
        id: 'payments',
        label: 'Customer Payments',
        iconName: 'CreditCard',
        route: ROUTES.PAYMENTS,
        permission: 'payments.view',
      },
      {
        id: 'collections',
        label: 'Pending Collections',
        iconName: 'AlertCircle',
        route: ROUTES.COLLECTIONS,
        permission: 'collections.view',
        badgeKey: 'pendingPaymentsCount',
      },
      {
        id: 'company-payables',
        label: 'Company Payables',
        iconName: 'Building2',
        route: ROUTES.COMPANY_PAYABLES,
        permission: 'company_payables.view',
      },
      {
        id: 'commissions',
        label: 'Commission Earnings',
        iconName: 'Banknote',
        route: ROUTES.COMMISSIONS,
        permission: 'commissions.view',
      },
    ],
  },
  {
    id: 'partnerships',
    groupLabel: 'Partners',
    items: [
      {
        id: 'companies',
        label: 'Insurance Companies',
        iconName: 'Building',
        route: ROUTES.COMPANIES,
        permission: 'companies.view',
      },
      {
        id: 'reports',
        label: 'Reports & Analytics',
        iconName: 'BarChart3',
        route: ROUTES.REPORTS,
        permission: 'reports.view',
      },
    ],
  },
  {
    id: 'administration',
    groupLabel: 'Administration',
    items: [
      {
        id: 'users',
        label: 'User Management',
        iconName: 'UserCheck',
        route: ROUTES.USERS,
        permission: 'users.view',
      },
      {
        id: 'roles',
        label: 'Roles & Permissions',
        iconName: 'Lock',
        route: ROUTES.ROLES,
        permission: 'roles.view',
      },
      {
        id: 'audit-logs',
        label: 'Audit Trail',
        iconName: 'FileText',
        route: ROUTES.AUDIT_LOGS,
        permission: 'audit_logs.view',
      },
      {
        id: 'settings',
        label: 'System Settings',
        iconName: 'Settings',
        route: ROUTES.SETTINGS,
        permission: 'settings.view',
      },
    ],
  },
];

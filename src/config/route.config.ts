export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: '/customers/:id',
  CUSTOMER_NEW: '/customers/new',
  CUSTOMER_EDIT: '/customers/:id/edit',
  
  POLICIES: '/policies',
  POLICY_DETAIL: '/policies/:id',
  POLICY_NEW: '/policies/new',
  POLICY_EDIT: '/policies/:id/edit',
  
  PAYMENTS: '/payments',
  PAYMENT_DETAIL: '/payments/:id',
  
  COLLECTIONS: '/collections',
  RENEWALS: '/renewals',
  
  COMPANIES: '/insurance-companies',
  COMPANY_DETAIL: '/insurance-companies/:id',
  
  COMPANY_PAYABLES: '/company-payables',
  COMMISSIONS: '/commissions',
  REPORTS: '/reports',
  
  USERS: '/users',
  ROLES: '/roles',
  SETTINGS: '/settings',
  AUDIT_LOGS: '/audit-logs',
  NOTIFICATIONS: '/notifications',
  
  UNAUTHORIZED: '/403',
  NOT_FOUND: '*',
} as const;

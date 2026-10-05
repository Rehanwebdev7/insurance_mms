import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../config/route.config';
import { ProtectedRoute } from './ProtectedRoute';
import { PermissionRoute } from './PermissionRoute';
import { AppLayout } from '../components/layout/AppLayout';

// Module Pages
import { LoginPage } from '../modules/auth/LoginPage';
import { DashboardPage } from '../modules/dashboard/DashboardPage';

import { CustomersPage } from '../modules/customers/CustomersPage';
import { CustomerDetailPage } from '../modules/customers/CustomerDetailPage';

import { PoliciesPage } from '../modules/policies/PoliciesPage';
import { PolicyDetailPage } from '../modules/policies/PolicyDetailPage';

import { PaymentsPage } from '../modules/payments/PaymentsPage';
import { CollectionsPage } from '../modules/collections/CollectionsPage';
import { RenewalsPage } from '../modules/renewals/RenewalsPage';

import { CompaniesPage } from '../modules/insurance-companies/CompaniesPage';
import { CompanyDetailPage } from '../modules/insurance-companies/CompanyDetailPage';

import { CompanyPayablesPage } from '../modules/company-payables/CompanyPayablesPage';
import { CommissionsPage } from '../modules/commissions/CommissionsPage';
import { ReportsPage } from '../modules/reports/ReportsPage';

import { UsersPage } from '../modules/users/UsersPage';
import { RolesPage } from '../modules/roles/RolesPage';
import { AuditLogsPage } from '../modules/audit-logs/AuditLogsPage';
import { SettingsPage } from '../modules/settings/SettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* Protected SaaS Layout Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Dashboard */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <PermissionRoute permission="dashboard.view">
                <DashboardPage />
              </PermissionRoute>
            }
          />

          {/* Customers */}
          <Route
            path={ROUTES.CUSTOMERS}
            element={
              <PermissionRoute permission="customers.view">
                <CustomersPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.CUSTOMER_DETAIL}
            element={
              <PermissionRoute permission="customers.view">
                <CustomerDetailPage />
              </PermissionRoute>
            }
          />

          {/* Policies */}
          <Route
            path={ROUTES.POLICIES}
            element={
              <PermissionRoute permission="policies.view">
                <PoliciesPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.POLICY_DETAIL}
            element={
              <PermissionRoute permission="policies.view">
                <PolicyDetailPage />
              </PermissionRoute>
            }
          />

          {/* Finance & Payments */}
          <Route
            path={ROUTES.PAYMENTS}
            element={
              <PermissionRoute permission="payments.view">
                <PaymentsPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.COLLECTIONS}
            element={
              <PermissionRoute permission="collections.view">
                <CollectionsPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.RENEWALS}
            element={
              <PermissionRoute permission="renewals.view">
                <RenewalsPage />
              </PermissionRoute>
            }
          />

          {/* Insurance Companies & Payables */}
          <Route
            path={ROUTES.COMPANIES}
            element={
              <PermissionRoute permission="companies.view">
                <CompaniesPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.COMPANY_DETAIL}
            element={
              <PermissionRoute permission="companies.view">
                <CompanyDetailPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.COMPANY_PAYABLES}
            element={
              <PermissionRoute permission="company_payables.view">
                <CompanyPayablesPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.COMMISSIONS}
            element={
              <PermissionRoute permission="commissions.view">
                <CommissionsPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.REPORTS}
            element={
              <PermissionRoute permission="reports.view">
                <ReportsPage />
              </PermissionRoute>
            }
          />

          {/* Super Admin & Settings */}
          <Route
            path={ROUTES.USERS}
            element={
              <PermissionRoute permission="users.view">
                <UsersPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.ROLES}
            element={
              <PermissionRoute permission="roles.view">
                <RolesPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.AUDIT_LOGS}
            element={
              <PermissionRoute permission="audit_logs.view">
                <AuditLogsPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.SETTINGS}
            element={
              <PermissionRoute permission="settings.view">
                <SettingsPage />
              </PermissionRoute>
            }
          />

          {/* Fallbacks */}
          <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

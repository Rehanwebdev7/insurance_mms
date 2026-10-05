import { Customer } from '../../types/customer.types';
import { Policy } from '../../types/policy.types';
import { CustomerPayment, CompanyPayment } from '../../types/payment.types';
import { InsuranceCompany } from '../../types/company.types';
import { CommissionRecord } from '../../types/commission.types';
import { User } from '../../types/auth.types';
import { Role } from '../../types/permission.types';
import { ActivityLog, NotificationItem, SystemSettings } from '../../types/common.types';
import { APP_CONFIG } from '../../config/app.config';

import defaultCustomers from '../../data/customers.json';
import defaultPolicies from '../../data/policies.json';
import defaultPayments from '../../data/payments.json';
import defaultCompanies from '../../data/companies.json';
import defaultCompanyPayments from '../../data/companyPayments.json';
import defaultCommissions from '../../data/commissions.json';
import defaultUsers from '../../data/users.json';
import defaultRoles from '../../data/roles.json';
import defaultNotifications from '../../data/notifications.json';
import defaultActivities from '../../data/activities.json';

const KEYS = {
  CUSTOMERS: `${APP_CONFIG.STORAGE_PREFIX}customers`,
  POLICIES: `${APP_CONFIG.STORAGE_PREFIX}policies`,
  PAYMENTS: `${APP_CONFIG.STORAGE_PREFIX}payments`,
  COMPANIES: `${APP_CONFIG.STORAGE_PREFIX}companies`,
  COMPANY_PAYMENTS: `${APP_CONFIG.STORAGE_PREFIX}company_payments`,
  COMMISSIONS: `${APP_CONFIG.STORAGE_PREFIX}commissions`,
  USERS: `${APP_CONFIG.STORAGE_PREFIX}users`,
  ROLES: `${APP_CONFIG.STORAGE_PREFIX}roles`,
  NOTIFICATIONS: `${APP_CONFIG.STORAGE_PREFIX}notifications`,
  ACTIVITIES: `${APP_CONFIG.STORAGE_PREFIX}activities`,
  SETTINGS: `${APP_CONFIG.STORAGE_PREFIX}settings`,
  AUTH_USER: `${APP_CONFIG.STORAGE_PREFIX}auth_user`,
};

class StorageService {
  constructor() {
    this.initStorage();
  }

  public initStorage() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(KEYS.CUSTOMERS)) {
      localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(defaultCustomers));
    }
    if (!localStorage.getItem(KEYS.POLICIES)) {
      localStorage.setItem(KEYS.POLICIES, JSON.stringify(defaultPolicies));
    }
    if (!localStorage.getItem(KEYS.PAYMENTS)) {
      localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(defaultPayments));
    }
    if (!localStorage.getItem(KEYS.COMPANIES)) {
      localStorage.setItem(KEYS.COMPANIES, JSON.stringify(defaultCompanies));
    }
    if (!localStorage.getItem(KEYS.COMPANY_PAYMENTS)) {
      localStorage.setItem(KEYS.COMPANY_PAYMENTS, JSON.stringify(defaultCompanyPayments));
    }
    if (!localStorage.getItem(KEYS.COMMISSIONS)) {
      localStorage.setItem(KEYS.COMMISSIONS, JSON.stringify(defaultCommissions));
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem(KEYS.ROLES)) {
      localStorage.setItem(KEYS.ROLES, JSON.stringify(defaultRoles));
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(defaultNotifications));
    }
    if (!localStorage.getItem(KEYS.ACTIVITIES)) {
      localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(defaultActivities));
    }
    if (!localStorage.getItem(KEYS.SETTINGS)) {
      const initialSettings: SystemSettings = {
        agencyName: 'InsureFlow Agency Solutions',
        agencyEmail: 'admin@insureflow.demo',
        agencyPhone: '+91 1800 555 0199',
        agencyAddress: 'Financial District, Nanakramguda, Hyderabad 500032',
        primaryColor: '#2563eb',
        themeMode: 'light',
        currency: 'INR',
        dateFormat: 'DD MMM YYYY',
        pageSize: 10,
        enableAuditLogs: true,
        enableNotifications: true,
      };
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(initialSettings));
    }
  }

  // Generic getter/setter
  private getItem<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setItem<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Customers
  getCustomers(): Customer[] { return this.getItem<Customer>(KEYS.CUSTOMERS); }
  saveCustomers(customers: Customer[]): void { this.setItem(KEYS.CUSTOMERS, customers); }

  // Policies
  getPolicies(): Policy[] { return this.getItem<Policy>(KEYS.POLICIES); }
  savePolicies(policies: Policy[]): void { this.setItem(KEYS.POLICIES, policies); }

  // Customer Payments
  getPayments(): CustomerPayment[] { return this.getItem<CustomerPayment>(KEYS.PAYMENTS); }
  savePayments(payments: CustomerPayment[]): void { this.setItem(KEYS.PAYMENTS, payments); }

  // Companies
  getCompanies(): InsuranceCompany[] { return this.getItem<InsuranceCompany>(KEYS.COMPANIES); }
  saveCompanies(companies: InsuranceCompany[]): void { this.setItem(KEYS.COMPANIES, companies); }

  // Company Payments
  getCompanyPayments(): CompanyPayment[] { return this.getItem<CompanyPayment>(KEYS.COMPANY_PAYMENTS); }
  saveCompanyPayments(payments: CompanyPayment[]): void { this.setItem(KEYS.COMPANY_PAYMENTS, payments); }

  // Commissions
  getCommissions(): CommissionRecord[] { return this.getItem<CommissionRecord>(KEYS.COMMISSIONS); }
  saveCommissions(commissions: CommissionRecord[]): void { this.setItem(KEYS.COMMISSIONS, commissions); }

  // Users & Roles
  getUsers(): User[] { return this.getItem<User>(KEYS.USERS); }
  saveUsers(users: User[]): void { this.setItem(KEYS.USERS, users); }

  getRoles(): Role[] { return this.getItem<Role>(KEYS.ROLES); }
  saveRoles(roles: Role[]): void { this.setItem(KEYS.ROLES, roles); }

  // Notifications & Activities
  getNotifications(): NotificationItem[] { return this.getItem<NotificationItem>(KEYS.NOTIFICATIONS); }
  saveNotifications(notifications: NotificationItem[]): void { this.setItem(KEYS.NOTIFICATIONS, notifications); }

  getActivities(): ActivityLog[] { return this.getItem<ActivityLog>(KEYS.ACTIVITIES); }
  saveActivities(activities: ActivityLog[]): void { this.setItem(KEYS.ACTIVITIES, activities); }

  // System Settings
  getSettings(): SystemSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : ({} as SystemSettings);
    } catch {
      return {} as SystemSettings;
    }
  }
  saveSettings(settings: SystemSettings): void { this.setItem(KEYS.SETTINGS, settings); }

  // Auth User
  getAuthUser(): User | null {
    try {
      const data = localStorage.getItem(KEYS.AUTH_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
  saveAuthUser(user: User | null): void {
    if (user) {
      localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.AUTH_USER);
    }
  }

  // Audit Logger helper
  logActivity(log: Omit<ActivityLog, 'id' | 'timestamp'>): void {
    const logs = this.getActivities();
    const newLog: ActivityLog = {
      ...log,
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.saveActivities([newLog, ...logs]);
  }
}

export const storageService = new StorageService();

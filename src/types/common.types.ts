export type StatusType = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';

export interface PaginationParams {
  page: number;
  pageSize: number;
  total: number;
}

export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  total?: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  entityId?: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'RENEWAL' | 'PAYMENT_PENDING' | 'PAYMENT_RECEIVED' | 'COMPANY_PAYABLE' | 'POLICY_EXPIRY' | 'SYSTEM';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface SystemSettings {
  agencyName: string;
  agencyEmail: string;
  agencyPhone: string;
  agencyAddress: string;
  primaryColor: string;
  themeMode: 'light' | 'dark' | 'system';
  currency: string;
  dateFormat: string;
  pageSize: number;
  enableAuditLogs: boolean;
  enableNotifications: boolean;
}

import { InsuranceType } from '../types/policy.types';

export interface InsuranceTypeConfig {
  type: InsuranceType;
  label: string;
  description: string;
  defaultCommissionRate: number;
  iconName: string;
  badgeColor: string;
}

export const INSURANCE_TYPES_CONFIG: Record<InsuranceType, InsuranceTypeConfig> = {
  HEALTH: {
    type: 'HEALTH',
    label: 'Health & Medical',
    description: 'Individual and family health insurance coverage',
    defaultCommissionRate: 15,
    iconName: 'Activity',
    badgeColor: 'emerald',
  },
  MOTOR: {
    type: 'MOTOR',
    label: 'Motor & Vehicle',
    description: 'Car, two-wheeler, and commercial vehicle insurance',
    defaultCommissionRate: 10,
    iconName: 'Car',
    badgeColor: 'blue',
  },
  LIFE: {
    type: 'LIFE',
    label: 'Term & Life',
    description: 'Term life and investment linked life insurance',
    defaultCommissionRate: 20,
    iconName: 'Heart',
    badgeColor: 'purple',
  },
  PROPERTY: {
    type: 'PROPERTY',
    label: 'Property & Fire',
    description: 'Home, office, factory, and inventory protection',
    defaultCommissionRate: 12,
    iconName: 'Home',
    badgeColor: 'amber',
  },
  TRAVEL: {
    type: 'TRAVEL',
    label: 'Travel & Medical',
    description: 'Domestic and international travel insurance',
    defaultCommissionRate: 18,
    iconName: 'Plane',
    badgeColor: 'cyan',
  },
  COMMERCIAL: {
    type: 'COMMERCIAL',
    label: 'Commercial & Liability',
    description: 'Business liability, cyber, and marine cargo',
    defaultCommissionRate: 14,
    iconName: 'Briefcase',
    badgeColor: 'indigo',
  },
  CORP_GROUP: {
    type: 'CORP_GROUP',
    label: 'Corporate Group Health',
    description: 'Group Mediclaim policies for corporate employees',
    defaultCommissionRate: 8,
    iconName: 'Users',
    badgeColor: 'rose',
  },
};

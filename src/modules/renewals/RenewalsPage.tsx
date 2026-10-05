import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { DateDisplay } from '../../components/common/DateDisplay';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { PermissionGate } from '../../components/common/PermissionGate';
import { services } from '../../services/serviceFactory';
import { Policy } from '../../types/policy.types';
import { RotateCw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { getDaysRemaining } from '../../utils/date.utils';

export const RenewalsPage: React.FC = () => {
  const toast = useToast();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('30days');
  const [renewingId, setRenewingId] = useState<string | null>(null);

  const loadPolicies = async () => {
    setIsLoading(true);
    const data = await services.policy.getAll();
    setPolicies(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const handleRenew = async (policy: Policy) => {
    setRenewingId(policy.id);
    try {
      const renewed = await services.policy.renew(policy.id, {
        grossPremium: policy.grossPremium,
        discount: policy.discount,
        commissionRate: policy.commissionRate,
      });

      toast.success(
        'Policy Renewed Successfully',
        `Renewed policy '${policy.policyNumber}' into new policy '${renewed.policyNumber}'`
      );
      loadPolicies();
    } catch (err: any) {
      toast.error('Renewal Error', err.message || 'Failed to process renewal');
    } finally {
      setRenewingId(null);
    }
  };

  const filteredRenewals = React.useMemo(() => {
    return policies.filter(p => {
      const days = getDaysRemaining(p.expiryDate);
      if (activeTab === '7days') return days >= 0 && days <= 7;
      if (activeTab === '30days') return days >= 0 && days <= 30;
      if (activeTab === '60days') return days >= 0 && days <= 60;
      if (activeTab === 'expired') return days < 0;
      return true;
    });
  }, [policies, activeTab]);

  const columns: Column<Policy>[] = [
    {
      key: 'policyNumber',
      header: 'Policy No',
      render: (row) => <span className="font-mono font-bold text-[var(--color-primary)]">{row.policyNumber}</span>,
    },
    { key: 'customerName', header: 'Customer' },
    { key: 'insuranceCompanyName', header: 'Company' },
    { key: 'insuranceType', header: 'Type' },
    {
      key: 'expiryDate',
      header: 'Expiry Date',
      render: (row) => <DateDisplay date={row.expiryDate} showDaysRemaining />,
    },
    {
      key: 'netPremium',
      header: 'Current Premium',
      render: (row) => <CurrencyDisplay amount={row.netPremium} />,
    },
    {
      key: 'policyStatus',
      header: 'Status',
      render: (row) => <StatusBadge type="policy" status={row.policyStatus} />,
    },
    {
      key: 'actions',
      header: 'Renewal Workflow',
      align: 'right',
      render: (row) => (
        <PermissionGate permission="renewals.create">
          {row.policyStatus === 'RENEWED' ? (
            <span className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1">
              <CheckCircle2 className="w-4 h-4" /> Renewed
            </span>
          ) : (
            <Button
              variant="primary"
              size="sm"
              isLoading={renewingId === row.id}
              onClick={() => handleRenew(row)}
              icon={<RotateCw className="w-4 h-4" />}
            >
              Process Renewal
            </Button>
          )}
        </PermissionGate>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Policy Renewals Center"
        description="Monitor expiring insurance policies and issue policy renewals."
      />

      <Tabs
        tabs={[
          { id: '7days', label: 'Expiring in 7 Days', badge: policies.filter(p => { const d = getDaysRemaining(p.expiryDate); return d >= 0 && d <= 7; }).length },
          { id: '30days', label: 'Expiring in 30 Days', badge: policies.filter(p => { const d = getDaysRemaining(p.expiryDate); return d >= 0 && d <= 30; }).length },
          { id: '60days', label: 'Expiring in 60 Days', badge: policies.filter(p => { const d = getDaysRemaining(p.expiryDate); return d >= 0 && d <= 60; }).length },
          { id: 'expired', label: 'Expired Policies', badge: policies.filter(p => getDaysRemaining(p.expiryDate) < 0).length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />

      <DataTable
        columns={columns}
        data={filteredRenewals}
        isLoading={isLoading}
        searchPlaceholder="Filter renewals by customer, policy no, company..."
        exportFilename="policy_renewals_list"
      />
    </div>
  );
};

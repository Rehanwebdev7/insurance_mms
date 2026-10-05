import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { DateDisplay } from '../../components/common/DateDisplay';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { PolicyCreateModal } from './PolicyCreateModal';
import { PermissionGate } from '../../components/common/PermissionGate';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { services } from '../../services/serviceFactory';
import { Policy } from '../../types/policy.types';
import { ShieldCheck, Plus, Eye, Trash2, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ui/Toast';

export const PoliciesPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Policy | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPolicies = async () => {
    setIsLoading(true);
    const data = await services.policy.getAll();
    setPolicies(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await services.policy.delete(deleteTarget.id);
      toast.success('Policy Deleted', `Policy '${deleteTarget.policyNumber}' deleted.`);
      setDeleteTarget(null);
      loadPolicies();
    } catch (err: any) {
      toast.error('Error', err.message || 'Failed to delete policy');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered dataset according to activeTab
  const filteredPolicies = React.useMemo(() => {
    switch (activeTab) {
      case 'active':
        return policies.filter(p => p.policyStatus === 'ACTIVE');
      case 'expiring':
        return policies.filter(p => {
          const days = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
          return days >= 0 && days <= 30;
        });
      case 'expired':
        return policies.filter(p => p.policyStatus === 'EXPIRED');
      case 'pending_payment':
        return policies.filter(p => p.pendingAmount > 0);
      case 'paid':
        return policies.filter(p => p.paymentStatus === 'PAID');
      default:
        return policies;
    }
  }, [policies, activeTab]);

  const columns: Column<Policy>[] = [
    {
      key: 'policyNumber',
      header: 'Policy Number',
      sortable: true,
      render: (row) => <span className="font-mono font-bold text-[var(--color-primary)]">{row.policyNumber}</span>,
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-bold text-[var(--color-text)]">{row.customerName}</p>
          <p className="text-xs text-[var(--color-muted)]">{row.customerMobile}</p>
        </div>
      ),
    },
    { key: 'insuranceCompanyName', header: 'Insurance Company' },
    { key: 'insuranceType', header: 'Type' },
    {
      key: 'expiryDate',
      header: 'Expiry Date',
      render: (row) => <DateDisplay date={row.expiryDate} showDaysRemaining />,
    },
    {
      key: 'netPremium',
      header: 'Net Premium',
      render: (row) => <CurrencyDisplay amount={row.netPremium} />,
    },
    {
      key: 'pendingAmount',
      header: 'Customer Pending',
      render: (row) => (
        <CurrencyDisplay
          amount={row.pendingAmount}
          className={row.pendingAmount > 0 ? 'text-amber-600 font-bold' : 'text-slate-400'}
        />
      ),
    },
    {
      key: 'policyStatus',
      header: 'Policy Status',
      render: (row) => <StatusBadge type="policy" status={row.policyStatus} />,
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      render: (row) => <StatusBadge type="payment" status={row.paymentStatus} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/policies/${row.id}`)}
            icon={<Eye className="w-4 h-4 text-blue-600" />}
          />
          <PermissionGate permission="policies.delete">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget(row)}
              icon={<Trash2 className="w-4 h-4 text-red-500" />}
            />
          </PermissionGate>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insurance Policies"
        description="Comprehensive policy directory, payment status, and renewal tracking."
        actions={
          <PermissionGate permission="policies.create">
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Issue New Policy
            </Button>
          </PermissionGate>
        }
      />

      <Tabs
        tabs={[
          { id: 'all', label: 'All Policies', badge: policies.length },
          { id: 'active', label: 'Active Policies', badge: policies.filter(p => p.policyStatus === 'ACTIVE').length },
          { id: 'expiring', label: 'Expiring Soon (30d)', badge: policies.filter(p => { const d = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime())/(1000*3600*24)); return d>=0 && d<=30; }).length },
          { id: 'expired', label: 'Expired', badge: policies.filter(p => p.policyStatus === 'EXPIRED').length },
          { id: 'pending_payment', label: 'Pending Payment', badge: policies.filter(p => p.pendingAmount > 0).length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />

      <DataTable
        columns={columns}
        data={filteredPolicies}
        isLoading={isLoading}
        searchPlaceholder="Search policies by policy number, customer, company, type..."
        exportFilename="policies_list"
        onRowClick={(row) => navigate(`/policies/${row.id}`)}
      />

      <PolicyCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadPolicies()}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Insurance Policy"
        message={`Are you sure you want to delete policy '${deleteTarget?.policyNumber}'? This action cannot be undone.`}
        confirmText="Delete Policy"
        isLoading={isDeleting}
      />
    </div>
  );
};

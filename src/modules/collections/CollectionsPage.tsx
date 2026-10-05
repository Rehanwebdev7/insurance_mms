import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { DateDisplay } from '../../components/common/DateDisplay';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { PermissionGate } from '../../components/common/PermissionGate';
import { PaymentCreateModal } from '../payments/PaymentCreateModal';
import { services } from '../../services/serviceFactory';
import { Policy } from '../../types/policy.types';
import { AlertCircle, CreditCard, Phone, Mail } from 'lucide-react';

export const CollectionsPage: React.FC = () => {
  const [pendingPolicies, setPendingPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [payTargetPolicyId, setPayTargetPolicyId] = useState<string | undefined>(undefined);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  const loadPending = async () => {
    setIsLoading(true);
    const all = await services.policy.getAll();
    setPendingPolicies(all.filter(p => p.pendingAmount > 0));
    setIsLoading(false);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const totalOutstanding = pendingPolicies.reduce((acc, p) => acc + p.pendingAmount, 0);

  const handleOpenPay = (policyId: string) => {
    setPayTargetPolicyId(policyId);
    setIsPayModalOpen(true);
  };

  const columns: Column<Policy>[] = [
    {
      key: 'policyNumber',
      header: 'Policy No',
      render: (row) => <span className="font-mono font-bold text-[var(--color-primary)]">{row.policyNumber}</span>,
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (row) => (
        <div>
          <p className="font-bold text-[var(--color-text)]">{row.customerName}</p>
          <p className="text-xs text-[var(--color-muted)]">{row.customerMobile}</p>
        </div>
      ),
    },
    { key: 'insuranceCompanyName', header: 'Company' },
    {
      key: 'netPremium',
      header: 'Net Premium',
      render: (row) => <CurrencyDisplay amount={row.netPremium} />,
    },
    {
      key: 'paidAmount',
      header: 'Already Paid',
      render: (row) => <CurrencyDisplay amount={row.paidAmount} className="text-emerald-600" />,
    },
    {
      key: 'pendingAmount',
      header: 'Pending Balance',
      sortable: true,
      render: (row) => <CurrencyDisplay amount={row.pendingAmount} className="text-amber-600 font-extrabold text-base" />,
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      render: (row) => <StatusBadge type="payment" status={row.paymentStatus} />,
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (row) => (
        <PermissionGate permission="payments.create">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenPay(row.id)}
            icon={<CreditCard className="w-4 h-4" />}
          >
            Collect Payment
          </Button>
        </PermissionGate>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Customer Collections"
        description="Track and collect outstanding premium balances from customers."
      />

      <div className="p-5 bg-gradient-to-r from-amber-950 to-slate-900 border border-amber-900 rounded-2xl text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Total Customer Pending Balance ("Lena Hai")</p>
            <p className="text-2xl font-extrabold mt-0.5 text-amber-400"><CurrencyDisplay amount={totalOutstanding} /></p>
          </div>
        </div>
        <div className="text-right text-xs text-slate-300">
          Customers Overdue/Pending: <span className="font-bold text-white text-base ml-1">{pendingPolicies.length}</span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={pendingPolicies}
        isLoading={isLoading}
        searchPlaceholder="Filter pending collections by customer, policy no..."
        exportFilename="pending_collections"
      />

      {isPayModalOpen && (
        <PaymentCreateModal
          isOpen={isPayModalOpen}
          onClose={() => {
            setIsPayModalOpen(false);
            setPayTargetPolicyId(undefined);
          }}
          onSuccess={() => loadPending()}
          defaultPolicyId={payTargetPolicyId}
        />
      )}
    </div>
  );
};

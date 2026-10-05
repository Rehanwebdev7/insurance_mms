import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { DateDisplay } from '../../components/common/DateDisplay';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { PaymentCreateModal } from './PaymentCreateModal';
import { PermissionGate } from '../../components/common/PermissionGate';
import { services } from '../../services/serviceFactory';
import { CustomerPayment } from '../../types/payment.types';
import { CreditCard, Plus } from 'lucide-react';
import { printElement } from '../../utils/export.utils';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<CustomerPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadPayments = async () => {
    setIsLoading(true);
    const data = await services.payment.getCustomerPayments();
    setPayments(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const totalCollectedAmount = payments.reduce((acc, p) => acc + p.amount, 0);

  const columns: Column<CustomerPayment>[] = [
    {
      key: 'receiptNumber',
      header: 'Receipt No',
      sortable: true,
      render: (row) => <span className="font-mono font-bold text-[var(--color-primary)]">{row.receiptNumber}</span>,
    },
    {
      key: 'paymentDate',
      header: 'Payment Date',
      render: (row) => <DateDisplay date={row.paymentDate} showTime />,
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (row) => <span className="font-bold text-[var(--color-text)]">{row.customerName}</span>,
    },
    {
      key: 'policyNumber',
      header: 'Policy No',
      render: (row) => <span className="font-mono text-xs text-[var(--color-muted)]">{row.policyNumber}</span>,
    },
    {
      key: 'amount',
      header: 'Amount Paid',
      sortable: true,
      render: (row) => <CurrencyDisplay amount={row.amount} className="font-bold text-emerald-600 dark:text-emerald-400" />,
    },
    {
      key: 'paymentMethod',
      header: 'Method',
      render: (row) => <span className="font-semibold text-xs text-[var(--color-text-secondary)]">{row.paymentMethod}</span>,
    },
    {
      key: 'referenceNumber',
      header: 'Ref / UTR No',
      render: (row) => <span className="font-mono text-xs text-[var(--color-muted)]">{row.referenceNumber}</span>,
    },
    {
      key: 'recordedBy',
      header: 'Recorded By',
      render: (row) => <span className="text-xs text-[var(--color-muted)]">{row.recordedBy}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Payments"
        description="Official payment collection ledger and receipt log."
        actions={
          <PermissionGate permission="payments.create">
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Record Payment Receipt
            </Button>
          </PermissionGate>
        }
      />

      <div className="p-4 bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-900 rounded-2xl text-white flex items-center justify-between shadow-lg">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Total Collections Recorded</p>
          <p className="text-2xl font-extrabold mt-1 text-emerald-400"><CurrencyDisplay amount={totalCollectedAmount} /></p>
        </div>
        <div className="text-right text-xs text-slate-300">
          Total Receipts: <span className="font-bold text-white text-base ml-1">{payments.length}</span>
        </div>
      </div>

      <div id="printable-payments">
        <DataTable
          columns={columns}
          data={payments}
          isLoading={isLoading}
          searchPlaceholder="Search by receipt number, customer, policy, UTR reference..."
          exportFilename="customer_payments_receipts"
        />
      </div>

      <PaymentCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadPayments()}
      />
    </div>
  );
};

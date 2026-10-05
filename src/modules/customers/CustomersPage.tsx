import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CustomerCreateModal } from './CustomerCreateModal';
import { PermissionGate } from '../../components/common/PermissionGate';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { services } from '../../services/serviceFactory';
import { Customer } from '../../types/customer.types';
import { UserPlus, Eye, Trash2, Phone, Mail, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ui/Toast';

export const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCustomers = async () => {
    setIsLoading(true);
    const data = await services.customer.getAll();
    setCustomers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await services.customer.delete(deleteTarget.id);
      toast.success('Customer Deleted', `Customer '${deleteTarget.fullName}' removed.`);
      setDeleteTarget(null);
      loadCustomers();
    } catch (err: any) {
      toast.error('Error', err.message || 'Failed to delete customer');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Customer>[] = [
    {
      key: 'code',
      header: 'Customer ID',
      render: (row) => <span className="font-mono font-bold text-[var(--color-primary)]">{row.code}</span>,
    },
    {
      key: 'fullName',
      header: 'Customer Name',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-bold text-[var(--color-text)]">{row.fullName}</p>
          <p className="text-xs text-[var(--color-muted)]">{row.city}, {row.state}</p>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact Info',
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <p className="flex items-center gap-1 text-[var(--color-text-secondary)]">
            <Phone className="w-3 h-3 text-[var(--color-muted)]" /> {row.mobile}
          </p>
          <p className="flex items-center gap-1 text-[var(--color-muted)]">
            <Mail className="w-3 h-3 text-[var(--color-muted)]" /> {row.email}
          </p>
        </div>
      ),
    },
    {
      key: 'customerType',
      header: 'Type',
      render: (row) => (
        <Badge variant={row.customerType === 'CORPORATE' ? 'purple' : 'neutral'}>
          {row.customerType}
        </Badge>
      ),
    },
    {
      key: 'totalPolicies',
      header: 'Policies',
      render: (row) => <span className="font-semibold text-[var(--color-text)]">{row.totalPolicies || 0}</span>,
    },
    {
      key: 'totalPendingAmount',
      header: 'Pending Balance',
      render: (row) => (
        <CurrencyDisplay
          amount={row.totalPendingAmount}
          className={row.totalPendingAmount && row.totalPendingAmount > 0 ? 'text-amber-600 font-bold' : 'text-slate-400'}
        />
      ),
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
            onClick={() => navigate(`/customers/${row.id}`)}
            icon={<Eye className="w-4 h-4 text-blue-600" />}
          />
          <PermissionGate permission="customers.delete">
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
        title="Customer Directory"
        description="Manage corporate and individual insurance clients."
        actions={
          <PermissionGate permission="customers.create">
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              icon={<UserPlus className="w-4 h-4" />}
            >
              Add New Customer
            </Button>
          </PermissionGate>
        }
      />

      <DataTable
        columns={columns}
        data={customers}
        isLoading={isLoading}
        searchPlaceholder="Search customer by name, code, mobile, email..."
        exportFilename="customers_list"
        onRowClick={(row) => navigate(`/customers/${row.id}`)}
      />

      <CustomerCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadCustomers()}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Customer Account"
        message={`Are you sure you want to delete customer '${deleteTarget?.fullName}'? This action is permanent.`}
        confirmText="Delete Customer"
        isLoading={isDeleting}
      />
    </div>
  );
};

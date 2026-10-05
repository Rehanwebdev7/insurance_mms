import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable, Column } from '../../components/common/DataTable';
import { services } from '../../services/serviceFactory';
import { Customer } from '../../types/customer.types';
import { Policy } from '../../types/policy.types';
import { CustomerPayment } from '../../types/payment.types';
import { Phone, Mail, MapPin, CreditCard, ShieldCheck, ArrowLeft, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerPolicies, setCustomerPolicies] = useState<Policy[]>([]);
  const [customerPayments, setCustomerPayments] = useState<CustomerPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      if (!id) return;
      setIsLoading(true);
      const cust = await services.customer.getById(id);
      const allPolicies = await services.policy.getAll();
      const allPayments = await services.payment.getCustomerPayments();

      setCustomer(cust);
      setCustomerPolicies(allPolicies.filter(p => p.customerId === id));
      setCustomerPayments(allPayments.filter(p => p.customerId === id));
      setIsLoading(false);
    }
    loadDetail();
  }, [id]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading customer details...</div>;
  }

  if (!customer) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Customer Not Found</h2>
        <Button onClick={() => navigate('/customers')}>Back to Customer List</Button>
      </div>
    );
  }

  const totalPaid = customerPolicies.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalPending = customerPolicies.reduce((acc, p) => acc + p.pendingAmount, 0);

  const policyColumns: Column<Policy>[] = [
    {
      key: 'policyNumber',
      header: 'Policy No',
      render: (p) => <span className="font-bold text-[var(--color-primary)]">{p.policyNumber}</span>,
    },
    { key: 'insuranceCompanyName', header: 'Company' },
    { key: 'insuranceType', header: 'Type' },
    { key: 'netPremium', header: 'Net Premium', render: (p) => <CurrencyDisplay amount={p.netPremium} /> },
    { key: 'pendingAmount', header: 'Pending', render: (p) => <CurrencyDisplay amount={p.pendingAmount} className={p.pendingAmount > 0 ? 'text-amber-600 font-semibold' : 'text-slate-400'} /> },
    { key: 'policyStatus', header: 'Status', render: (p) => <StatusBadge type="policy" status={p.policyStatus} /> },
  ];

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/customers')}
        icon={<ArrowLeft className="w-4 h-4" />}
      >
        Back to Customers
      </Button>

      <PageHeader
        title={customer.fullName}
        description={`Customer Code: ${customer.code} • Onboarded: ${new Date(customer.createdAt).toLocaleDateString()}`}
        actions={
          <Badge variant={customer.customerType === 'CORPORATE' ? 'purple' : 'neutral'}>
            {customer.customerType}
          </Badge>
        }
      />

      {/* Customer Info Card & Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-muted)]">Client Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-[var(--color-text)]">
                <Phone className="w-4 h-4 text-[var(--color-primary)]" /> {customer.mobile}
              </p>
              <p className="flex items-center gap-2 text-[var(--color-text)]">
                <Mail className="w-4 h-4 text-[var(--color-primary)]" /> {customer.email}
              </p>
              <p className="flex items-start gap-2 text-[var(--color-text-secondary)]">
                <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                {customer.address}, {customer.city}, {customer.state} - {customer.pincode}
              </p>
            </div>
            <div className="space-y-2 border-l border-[var(--color-border)] pl-4">
              <p className="text-xs text-[var(--color-muted)]">PAN Card Number: <span className="font-bold text-[var(--color-text)]">{customer.panNumber || 'N/A'}</span></p>
              {customer.aadhaarNumber && <p className="text-xs text-[var(--color-muted)]">Aadhaar Number: <span className="font-bold text-[var(--color-text)]">{customer.aadhaarNumber}</span></p>}
              {customer.gstin && <p className="text-xs text-[var(--color-muted)]">GSTIN Registration: <span className="font-bold text-[var(--color-text)]">{customer.gstin}</span></p>}
              <p className="text-xs text-[var(--color-muted)]">Account Status: <span className="font-bold text-emerald-600">{customer.status}</span></p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-blue-950 text-white flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">Financial Ledger Summary</p>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-slate-300">Total Premium Paid</p>
                <p className="text-xl font-extrabold text-emerald-400"><CurrencyDisplay amount={totalPaid} /></p>
              </div>
              <div>
                <p className="text-xs text-slate-300">Total Pending Collection</p>
                <p className="text-xl font-extrabold text-amber-400"><CurrencyDisplay amount={totalPending} /></p>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Total Active Policies:</span>
            <span className="font-bold text-white text-base">{customerPolicies.length}</span>
          </div>
        </Card>
      </div>

      {/* Linked Policies Table */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" /> Linked Insurance Policies
        </h3>
        <DataTable
          columns={policyColumns}
          data={customerPolicies}
          searchable={false}
          exportable={false}
          onRowClick={(p) => navigate(`/policies/${p.id}`)}
          emptyTitle="No Policies Issued"
          emptyDescription="This customer does not have any active or historical insurance policies."
        />
      </div>
    </div>
  );
};

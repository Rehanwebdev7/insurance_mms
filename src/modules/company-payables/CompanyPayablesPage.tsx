import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { DateDisplay } from '../../components/common/DateDisplay';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { PermissionGate } from '../../components/common/PermissionGate';
import { CompanyRemittanceModal } from './CompanyRemittanceModal';
import { services } from '../../services/serviceFactory';
import { InsuranceCompany } from '../../types/company.types';
import { CompanyPayment } from '../../types/payment.types';
import { Building2, Plus, CreditCard, CheckCircle2 } from 'lucide-react';
import { Tabs } from '../../components/ui/Tabs';

export const CompanyPayablesPage: React.FC = () => {
  const [companies, setCompanies] = useState<InsuranceCompany[]>([]);
  const [remittances, setRemittances] = useState<CompanyPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('carriers');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const comps = await services.company.getAll();
    const rems = await services.payment.getCompanyPayments();
    setCompanies(comps);
    setRemittances(rems);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalPayableBalance = companies.reduce((acc, c) => acc + (c.totalCompanyBalance || 0), 0);
  const totalRemitted = companies.reduce((acc, c) => acc + (c.totalCompanyPaid || 0), 0);

  const carrierColumns: Column<InsuranceCompany>[] = [
    { key: 'name', header: 'Carrier Name', render: (c) => <span className="font-bold text-[var(--color-text)]">{c.name}</span> },
    { key: 'totalGrossPremium', header: 'Gross Business', render: (c) => <CurrencyDisplay amount={c.totalGrossPremium} /> },
    { key: 'totalCommissionEarned', header: 'Commission Deducted', render: (c) => <CurrencyDisplay amount={c.totalCommissionEarned} className="text-emerald-600 font-semibold" /> },
    { key: 'totalCompanyPayable', header: 'Net Payable', render: (c) => <CurrencyDisplay amount={c.totalCompanyPayable} className="text-purple-600 font-bold" /> },
    { key: 'totalCompanyPaid', header: 'Remitted Paid', render: (c) => <CurrencyDisplay amount={c.totalCompanyPaid} className="text-emerald-600" /> },
    { key: 'totalCompanyBalance', header: 'Outstanding Balance', render: (c) => <CurrencyDisplay amount={c.totalCompanyBalance} className="text-rose-600 font-extrabold" /> },
    {
      key: 'actions',
      header: 'Remittance',
      align: 'right',
      render: (c) => (
        <PermissionGate permission="company_payables.create">
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} icon={<CreditCard className="w-4 h-4" />}>
            Remit Payment
          </Button>
        </PermissionGate>
      ),
    },
  ];

  const remittanceColumns: Column<CompanyPayment>[] = [
    { key: 'remittanceNumber', header: 'Remittance No', render: (r) => <span className="font-mono font-bold text-[var(--color-primary)]">{r.remittanceNumber}</span> },
    { key: 'insuranceCompanyName', header: 'Company' },
    { key: 'paymentDate', header: 'Date', render: (r) => <DateDisplay date={r.paymentDate} showTime /> },
    { key: 'amount', header: 'Amount Remitted', render: (r) => <CurrencyDisplay amount={r.amount} className="font-bold text-emerald-600" /> },
    { key: 'paymentMethod', header: 'Method' },
    { key: 'referenceNumber', header: 'UTR / Ref No', render: (r) => <span className="font-mono text-xs">{r.referenceNumber}</span> },
    { key: 'recordedBy', header: 'Recorded By' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insurance Company Payables & Remittance"
        description="Track net premiums owed to insurance companies after commission deduction."
        actions={
          <PermissionGate permission="company_payables.create">
            <Button variant="primary" onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
              Record Remittance
            </Button>
          </PermissionGate>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-gradient-to-r from-purple-950 to-slate-900 border border-purple-900 rounded-2xl text-white shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">Total Outstanding Payable to Companies</p>
          <p className="text-2xl font-extrabold mt-1 text-purple-300"><CurrencyDisplay amount={totalPayableBalance} /></p>
        </div>

        <div className="p-5 bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-900 rounded-2xl text-white shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Total Remitted to Companies</p>
          <p className="text-2xl font-extrabold mt-1 text-emerald-400"><CurrencyDisplay amount={totalRemitted} /></p>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: 'carriers', label: 'Company Payables Ledger', badge: companies.length },
          { id: 'remittances', label: 'Remittance Receipts Log', badge: remittances.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />

      {activeTab === 'carriers' ? (
        <DataTable
          columns={carrierColumns}
          data={companies}
          isLoading={isLoading}
          searchPlaceholder="Search carrier payables..."
          exportFilename="company_payables_ledger"
        />
      ) : (
        <DataTable
          columns={remittanceColumns}
          data={remittances}
          isLoading={isLoading}
          searchPlaceholder="Search remittance receipts..."
          exportFilename="company_remittances_log"
        />
      )}

      <CompanyRemittanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
};

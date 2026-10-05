import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { DataTable, Column } from '../../components/common/DataTable';
import { services } from '../../services/serviceFactory';
import { Policy } from '../../types/policy.types';
import { CustomerPayment } from '../../types/payment.types';
import { BarChart3, Download, Printer, Filter } from 'lucide-react';
import { printElement } from '../../utils/export.utils';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<'collections' | 'pending' | 'policies' | 'renewals' | 'payables'>('collections');
  const [dateFilter, setDateFilter] = useState<'month' | 'quarter' | 'year' | 'all'>('all');

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [payments, setPayments] = useState<CustomerPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReportData() {
      setIsLoading(true);
      const pols = await services.policy.getAll();
      const pays = await services.payment.getCustomerPayments();
      setPolicies(pols);
      setPayments(pays);
      setIsLoading(false);
    }
    loadReportData();
  }, []);

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalPending = policies.reduce((acc, p) => acc + p.pendingAmount, 0);
  const totalNet = policies.reduce((acc, p) => acc + p.netPremium, 0);

  const policyColumns: Column<Policy>[] = [
    { key: 'policyNumber', header: 'Policy No', render: (p) => <span className="font-bold">{p.policyNumber}</span> },
    { key: 'customerName', header: 'Customer' },
    { key: 'insuranceCompanyName', header: 'Carrier' },
    { key: 'grossPremium', header: 'Gross Premium', render: (p) => <CurrencyDisplay amount={p.grossPremium} /> },
    { key: 'discount', header: 'Discount', render: (p) => <CurrencyDisplay amount={p.discount} className="text-amber-600" /> },
    { key: 'netPremium', header: 'Net Premium', render: (p) => <CurrencyDisplay amount={p.netPremium} className="font-bold" /> },
    { key: 'paidAmount', header: 'Collected', render: (p) => <CurrencyDisplay amount={p.paidAmount} className="text-emerald-600" /> },
    { key: 'pendingAmount', header: 'Pending', render: (p) => <CurrencyDisplay amount={p.pendingAmount} className="text-rose-600 font-bold" /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Reports & Analytics"
        description="Audit reports, collection forecasts, and compliance statements."
        actions={
          <Button
            variant="outline"
            onClick={() => printElement('report-print-container')}
            icon={<Printer className="w-4 h-4" />}
          >
            Print Report
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <Card className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[var(--color-primary)]" />
          <Select
            label="Report Type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            options={[
              { value: 'collections', label: '1. Premium Collections Ledger' },
              { value: 'pending', label: '2. Outstanding Pending Collections' },
              { value: 'policies', label: '3. Master Policy Register' },
              { value: 'renewals', label: '4. Renewal Forecast Statement' },
              { value: 'payables', label: '5. Company Payables & Remittance' },
            ]}
            className="w-64"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--color-muted)] font-semibold">Time Horizon:</span>
          <Select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            options={[
              { value: 'all', label: 'All Time' },
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Fiscal Year' },
            ]}
            className="w-36"
          />
        </div>
      </Card>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-[var(--color-muted)] uppercase font-semibold">Net Premium Volume</p>
          <p className="text-2xl font-extrabold text-[var(--color-text)] mt-1"><CurrencyDisplay amount={totalNet} /></p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--color-muted)] uppercase font-semibold">Total Collections</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1"><CurrencyDisplay amount={totalCollected} /></p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--color-muted)] uppercase font-semibold">Outstanding Pending</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1"><CurrencyDisplay amount={totalPending} /></p>
        </Card>
      </div>

      {/* Printable Report Output */}
      <div id="report-print-container">
        <DataTable
          columns={policyColumns}
          data={policies}
          isLoading={isLoading}
          searchPlaceholder="Search within report..."
          exportFilename={`report_${reportType}`}
        />
      </div>
    </div>
  );
};

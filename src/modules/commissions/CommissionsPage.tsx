import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { DateDisplay } from '../../components/common/DateDisplay';
import { Badge } from '../../components/ui/Badge';
import { services } from '../../services/serviceFactory';
import { storageService } from '../../services/storage/storage.service';
import { CommissionRecord } from '../../types/commission.types';
import { Banknote } from 'lucide-react';

export const CommissionsPage: React.FC = () => {
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCommissions() {
      setIsLoading(true);
      const data = storageService.getCommissions();
      setCommissions(data);
      setIsLoading(false);
    }
    loadCommissions();
  }, []);

  const totalEarned = commissions.filter(c => c.status === 'EARNED').reduce((acc, c) => acc + c.commissionAmount, 0);
  const totalPending = commissions.filter(c => c.status === 'PENDING').reduce((acc, c) => acc + c.commissionAmount, 0);

  const columns: Column<CommissionRecord>[] = [
    { key: 'policyNumber', header: 'Policy No', render: (c) => <span className="font-mono font-bold text-[var(--color-primary)]">{c.policyNumber}</span> },
    { key: 'customerName', header: 'Customer' },
    { key: 'insuranceCompanyName', header: 'Company' },
    { key: 'agentName', header: 'Agent' },
    { key: 'netPremium', header: 'Net Premium', render: (c) => <CurrencyDisplay amount={c.netPremium} /> },
    { key: 'commissionRate', header: 'Rate', render: (c) => <span className="font-bold text-xs">{c.commissionRate}%</span> },
    { key: 'commissionAmount', header: 'Commission Earned', render: (c) => <CurrencyDisplay amount={c.commissionAmount} className="font-extrabold text-emerald-600 dark:text-emerald-400" /> },
    {
      key: 'status',
      header: 'Status',
      render: (c) => (
        <Badge variant={c.status === 'EARNED' ? 'success' : 'warning'}>
          {c.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commission Earnings Ledger"
        description="Detailed commission breakdown earned across insurance lines and policies."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-900 rounded-2xl text-white shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Total Earned Commission ("Kitna Earn Hua")</p>
          <p className="text-2xl font-extrabold mt-1 text-emerald-400"><CurrencyDisplay amount={totalEarned} /></p>
        </div>

        <div className="p-5 bg-gradient-to-r from-amber-950 to-slate-900 border border-amber-900 rounded-2xl text-white shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Pending Unearned Commission</p>
          <p className="text-2xl font-extrabold mt-1 text-amber-400"><CurrencyDisplay amount={totalPending} /></p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={commissions}
        isLoading={isLoading}
        searchPlaceholder="Search commissions by policy, agent, company..."
        exportFilename="commission_earnings"
      />
    </div>
  );
};

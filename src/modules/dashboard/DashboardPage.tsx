import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { formatCurrency } from '../../utils/currency.utils';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable, Column } from '../../components/common/DataTable';
import { Card } from '../../components/ui/Card';
import { services } from '../../services/serviceFactory';
import { Policy } from '../../types/policy.types';
import { CustomerPayment } from '../../types/payment.types';
import { PermissionGate } from '../../components/common/PermissionGate';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Building2,
  Banknote,
  RotateCw,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [payments, setPayments] = useState<CustomerPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const polData = await services.policy.getAll();
      const payData = await services.payment.getCustomerPayments();
      setPolicies(polData);
      setPayments(payData);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Aggregated Financial Metrics
  const totalGrossPremium = policies.reduce((acc, p) => acc + p.grossPremium, 0);
  const totalDiscount = policies.reduce((acc, p) => acc + p.discount, 0);
  const totalNetPremium = policies.reduce((acc, p) => acc + p.netPremium, 0);
  const totalCollected = policies.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalPending = policies.reduce((acc, p) => acc + p.pendingAmount, 0);

  const totalCommissionEarned = policies.reduce((acc, p) => acc + p.commissionAmount, 0);
  const totalCompanyPayable = policies.reduce((acc, p) => acc + p.companyPayableAmount, 0);
  const totalCompanyPaid = policies.reduce((acc, p) => acc + p.companyPaidAmount, 0);
  const totalCompanyBalance = policies.reduce((acc, p) => acc + p.companyBalanceAmount, 0);

  const activePoliciesCount = policies.filter(p => p.policyStatus === 'ACTIVE').length;
  const expiringSoonCount = policies.filter(p => {
    const days = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return days >= 0 && days <= 30;
  }).length;

  // Chart data: Distribution by Insurance Type
  const typeDistribution = React.useMemo(() => {
    const map: Record<string, number> = {};
    policies.forEach(p => {
      map[p.insuranceType] = (map[p.insuranceType] || 0) + p.netPremium;
    });
    return Object.keys(map).map(k => ({ name: k, value: map[k] }));
  }, [policies]);

  const PIE_COLORS = ['#2563eb', '#059669', '#7c3aed', '#f59e0b', '#06b6d4', '#dc2626', '#e11d48'];

  // Table columns for Recent Policies
  const recentPolicyColumns: Column<Policy>[] = [
    {
      key: 'policyNumber',
      header: 'Policy No',
      render: (row) => <span className="font-bold text-[var(--color-primary)]">{row.policyNumber}</span>,
    },
    { key: 'customerName', header: 'Customer' },
    { key: 'insuranceCompanyName', header: 'Company' },
    {
      key: 'netPremium',
      header: 'Net Premium',
      render: (row) => <CurrencyDisplay amount={row.netPremium} />,
    },
    {
      key: 'pendingAmount',
      header: 'Pending',
      render: (row) => <CurrencyDisplay amount={row.pendingAmount} className={row.pendingAmount > 0 ? 'text-amber-600 font-semibold' : 'text-slate-400'} />,
    },
    {
      key: 'policyStatus',
      header: 'Status',
      render: (row) => <StatusBadge type="policy" status={row.policyStatus} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insurance Operations Dashboard"
        description="Real-time financial breakdown, customer collection status, and agency metrics."
      />

      {/* Row 1: Key Customer Side Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Net Premium"
          value={<CurrencyDisplay amount={totalNetPremium} compact />}
          subtitle={`Gross: ${totalGrossPremium ? (totalGrossPremium / 100000).toFixed(1) + 'L' : '0'}`}
          icon={<ShieldCheck className="w-5 h-5" />}
          colorScheme="blue"
        />
        <StatCard
          title="Total Collected"
          value={<CurrencyDisplay amount={totalCollected} compact />}
          subtitle="Customer payments received"
          icon={<TrendingUp className="w-5 h-5" />}
          colorScheme="emerald"
        />
        <StatCard
          title="Customer Pending"
          value={<CurrencyDisplay amount={totalPending} compact />}
          subtitle="Outstanding customer balance"
          icon={<AlertCircle className="w-5 h-5" />}
          colorScheme="amber"
        />
        <StatCard
          title="Active Policies"
          value={activePoliciesCount}
          subtitle={`${expiringSoonCount} expiring in 30 days`}
          icon={<RotateCw className="w-5 h-5" />}
          colorScheme="purple"
        />
      </div>

      {/* Row 2: Company & Commission Side Metrics */}
      <PermissionGate permission="company_payables.view">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Commission Earned"
            value={<CurrencyDisplay amount={totalCommissionEarned} compact />}
            subtitle="Agency gross revenue"
            icon={<Banknote className="w-5 h-5" />}
            colorScheme="cyan"
          />
          <StatCard
            title="Company Payable Balance"
            value={<CurrencyDisplay amount={totalCompanyBalance} compact />}
            subtitle={`Remitted: ${totalCompanyPaid ? (totalCompanyPaid / 100000).toFixed(1) + 'L' : '0'}`}
            icon={<Building2 className="w-5 h-5" />}
            colorScheme="rose"
          />
          <StatCard
            title="Total Discount Granted"
            value={<CurrencyDisplay amount={totalDiscount} compact />}
            subtitle="Approved customer savings"
            icon={<DollarSign className="w-5 h-5" />}
            colorScheme="blue"
          />
        </div>
      </PermissionGate>

      {/* Row 3: Financial Flow Visualizer */}
      <Card className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 shadow-xl">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-blue-300 mb-4">
          Financial Flow Architecture (Gross → Net → Remittance)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
            <p className="text-[11px] text-blue-200 font-semibold uppercase">Gross Premium</p>
            <p className="text-lg font-extrabold mt-1"><CurrencyDisplay amount={totalGrossPremium} compact /></p>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
            <p className="text-[11px] text-amber-200 font-semibold uppercase">- Total Discount</p>
            <p className="text-lg font-extrabold mt-1 text-amber-300"><CurrencyDisplay amount={totalDiscount} compact /></p>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-blue-400">
            <p className="text-[11px] text-blue-200 font-semibold uppercase">= Net Premium</p>
            <p className="text-lg font-extrabold mt-1 text-blue-300"><CurrencyDisplay amount={totalNetPremium} compact /></p>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
            <p className="text-[11px] text-emerald-200 font-semibold uppercase">- Commission</p>
            <p className="text-lg font-extrabold mt-1 text-emerald-300"><CurrencyDisplay amount={totalCommissionEarned} compact /></p>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
            <p className="text-[11px] text-purple-200 font-semibold uppercase">= Company Payable</p>
            <p className="text-lg font-extrabold mt-1 text-purple-300"><CurrencyDisplay amount={totalCompanyPayable} compact /></p>
          </div>
        </div>
      </Card>

      {/* Row 4: Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insurance Type Distribution Chart */}
        <Card className="lg:col-span-1">
          <h3 className="text-sm font-bold text-[var(--color-text)] mb-4">Net Premium by Insurance Type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => formatCurrency(Number(val))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Policies Table */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[var(--color-text)]">Recent Policies Issued</h3>
            <button
              onClick={() => navigate('/policies')}
              className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <DataTable
            columns={recentPolicyColumns}
            data={policies.slice(0, 5)}
            isLoading={isLoading}
            searchable={false}
            exportable={false}
            onRowClick={(p) => navigate(`/policies/${p.id}`)}
          />
        </div>
      </div>
    </div>
  );
};

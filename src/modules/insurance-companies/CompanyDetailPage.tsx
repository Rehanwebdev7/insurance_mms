import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable, Column } from '../../components/common/DataTable';
import { services } from '../../services/serviceFactory';
import { InsuranceCompany } from '../../types/company.types';
import { Policy } from '../../types/policy.types';
import { CompanyPayment } from '../../types/payment.types';
import { ArrowLeft, Building, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [company, setCompany] = useState<InsuranceCompany | null>(null);
  const [companyPolicies, setCompanyPolicies] = useState<Policy[]>([]);
  const [remittances, setRemittances] = useState<CompanyPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setIsLoading(true);
      const comp = await services.company.getById(id);
      const allPol = await services.policy.getAll();
      const allRem = await services.payment.getCompanyPayments();

      setCompany(comp);
      setCompanyPolicies(allPol.filter(p => p.insuranceCompanyId === id));
      setRemittances(allRem.filter(r => r.insuranceCompanyId === id));
      setIsLoading(false);
    }
    loadData();
  }, [id]);

  if (isLoading) return <div className="p-8 text-center">Loading carrier details...</div>;
  if (!company) return <div className="p-8 text-center">Insurance company not found.</div>;

  const policyColumns: Column<Policy>[] = [
    { key: 'policyNumber', header: 'Policy No', render: (p) => <span className="font-bold text-[var(--color-primary)]">{p.policyNumber}</span> },
    { key: 'customerName', header: 'Customer' },
    { key: 'insuranceType', header: 'Type' },
    { key: 'netPremium', header: 'Net Premium', render: (p) => <CurrencyDisplay amount={p.netPremium} /> },
    { key: 'commissionAmount', header: 'Commission', render: (p) => <CurrencyDisplay amount={p.commissionAmount} className="text-emerald-600 font-bold" /> },
    { key: 'companyPayableAmount', header: 'Company Payable', render: (p) => <CurrencyDisplay amount={p.companyPayableAmount} className="text-purple-600 font-bold" /> },
    { key: 'companyPaymentStatus', header: 'Remittance Status', render: (p) => <StatusBadge type="companyPayment" status={p.companyPaymentStatus} /> },
  ];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/insurance-companies')} icon={<ArrowLeft className="w-4 h-4" />}>
        Back to Companies
      </Button>

      <PageHeader
        title={company.name}
        description={`Carrier Code: ${company.code} • Default Commission Rate: ${company.defaultCommissionRate}%`}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-[var(--color-muted)] uppercase font-semibold">Total Policies Issued</p>
          <p className="text-xl font-extrabold mt-1">{companyPolicies.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--color-muted)] uppercase font-semibold">Gross Business Volume</p>
          <p className="text-xl font-extrabold mt-1 text-blue-600"><CurrencyDisplay amount={company.totalGrossPremium} compact /></p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--color-muted)] uppercase font-semibold">Commission Earned</p>
          <p className="text-xl font-extrabold mt-1 text-emerald-600"><CurrencyDisplay amount={company.totalCommissionEarned} compact /></p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--color-muted)] uppercase font-semibold">Outstanding Payable Balance</p>
          <p className="text-xl font-extrabold mt-1 text-rose-600"><CurrencyDisplay amount={company.totalCompanyBalance} compact /></p>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-bold">Policies Underwritten by {company.name}</h3>
        <DataTable
          columns={policyColumns}
          data={companyPolicies}
          searchable={false}
          exportable={false}
          onRowClick={(p) => navigate(`/policies/${p.id}`)}
        />
      </div>
    </div>
  );
};

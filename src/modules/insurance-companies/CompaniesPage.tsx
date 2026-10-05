import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { services } from '../../services/serviceFactory';
import { InsuranceCompany } from '../../types/company.types';
import { Building, Phone, Mail, Percent, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CompaniesPage: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<InsuranceCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCompanies() {
      setIsLoading(true);
      const data = await services.company.getAll();
      setCompanies(data);
      setIsLoading(false);
    }
    loadCompanies();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insurance Companies & Partners"
        description="Empanelled insurance carrier profiles, commission rates, and business volume."
      />

      {isLoading ? (
        <div className="p-8 text-center">Loading insurance carriers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((comp) => (
            <Card
              key={comp.id}
              hoverable
              className="flex flex-col justify-between space-y-4 cursor-pointer group"
              onClick={() => navigate(`/insurance-companies/${comp.id}`)}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={comp.logo}
                      alt={comp.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[var(--color-border)]"
                    />
                    <div>
                      <h3 className="text-sm font-extrabold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                        {comp.name}
                      </h3>
                      <p className="text-[11px] font-mono text-[var(--color-muted)]">{comp.code}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--color-border)] space-y-2 text-xs text-[var(--color-text-secondary)]">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[var(--color-muted)]" /> {comp.phone} ({comp.contactPerson})
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[var(--color-muted)]" /> {comp.email}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--color-border)] grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[var(--color-muted)] block text-[10px] uppercase font-semibold">Comm. Rate</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{comp.defaultCommissionRate}%</span>
                </div>
                <div>
                  <span className="text-[var(--color-muted)] block text-[10px] uppercase font-semibold">Gross Volume</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                    <CurrencyDisplay amount={comp.totalGrossPremium} compact />
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

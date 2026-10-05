import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, ShieldCheck, CreditCard, Building, ArrowRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setSearchOpen } from '../../store/ui/uiSlice';
import { useDebounce } from '../../hooks/useDebounce';
import { storageService } from '../../services/storage/storage.service';
import { Customer } from '../../types/customer.types';
import { Policy } from '../../types/policy.types';
import { CustomerPayment } from '../../types/payment.types';
import { InsuranceCompany } from '../../types/company.types';
import { formatCurrency } from '../../utils/currency.utils';

export const SearchCommand: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchOpen = useSelector((state: RootState) => state.ui.searchOpen);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 250);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [payments, setPayments] = useState<CustomerPayment[]>([]);
  const [companies, setCompanies] = useState<InsuranceCompany[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        dispatch(setSearchOpen(!searchOpen));
      }
      if (e.key === 'Escape' && searchOpen) {
        dispatch(setSearchOpen(false));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, searchOpen]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setCustomers([]);
      setPolicies([]);
      setPayments([]);
      setCompanies([]);
      return;
    }

    const term = debouncedQuery.toLowerCase();

    // Customers search
    const allCust = storageService.getCustomers();
    setCustomers(allCust.filter(c => c.fullName.toLowerCase().includes(term) || c.mobile.includes(term) || c.code.toLowerCase().includes(term)).slice(0, 4));

    // Policies search
    const allPol = storageService.getPolicies();
    setPolicies(allPol.filter(p => p.policyNumber.toLowerCase().includes(term) || p.customerName.toLowerCase().includes(term) || p.insuranceCompanyName.toLowerCase().includes(term)).slice(0, 4));

    // Payments search
    const allPay = storageService.getPayments();
    setPayments(allPay.filter(p => p.receiptNumber.toLowerCase().includes(term) || p.customerName.toLowerCase().includes(term) || p.policyNumber.toLowerCase().includes(term)).slice(0, 4));

    // Companies search
    const allComp = storageService.getCompanies();
    setCompanies(allComp.filter(c => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term)).slice(0, 4));

  }, [debouncedQuery]);

  if (!searchOpen) return null;

  const handleSelect = (url: string) => {
    dispatch(setSearchOpen(false));
    setQuery('');
    navigate(url);
  };

  const hasResults = customers.length > 0 || policies.length > 0 || payments.length > 0 || companies.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
          <Search className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search customers, policy numbers, receipts, companies... (Cmd + K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[var(--color-text)] focus:outline-none placeholder:text-[var(--color-muted)]"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => dispatch(setSearchOpen(false))}
            className="px-2 py-1 text-[11px] font-semibold bg-[var(--color-surface-hover)] text-[var(--color-muted)] rounded-md border"
          >
            ESC
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="text-center py-8 text-xs text-[var(--color-muted)]">
              Type to search across all insurance records...
            </div>
          ) : !hasResults ? (
            <div className="text-center py-8 text-xs text-[var(--color-muted)]">
              No matching records found for "{query}"
            </div>
          ) : (
            <>
              {/* Customers Group */}
              {customers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5" /> Customers
                  </div>
                  <div className="space-y-1">
                    {customers.map(c => (
                      <div
                        key={c.id}
                        onClick={() => handleSelect(`/customers/${c.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--color-surface-hover)] cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-text)]">{c.fullName}</p>
                          <p className="text-xs text-[var(--color-text-secondary)]">{c.code} • {c.mobile} • {c.city}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[var(--color-primary)] transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Policies Group */}
              {policies.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Policies
                  </div>
                  <div className="space-y-1">
                    {policies.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSelect(`/policies/${p.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--color-surface-hover)] cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-text)]">{p.policyNumber} — {p.customerName}</p>
                          <p className="text-xs text-[var(--color-text-secondary)]">{p.insuranceCompanyName} • {p.insuranceType} • Net: {formatCurrency(p.netPremium)}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[var(--color-primary)] transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payments Group */}
              {payments.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">
                    <CreditCard className="w-3.5 h-3.5" /> Customer Payments
                  </div>
                  <div className="space-y-1">
                    {payments.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSelect(`/payments`)}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--color-surface-hover)] cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-text)]">{p.receiptNumber} — {formatCurrency(p.amount)}</p>
                          <p className="text-xs text-[var(--color-text-secondary)]">{p.customerName} • {p.paymentMethod} • Ref: {p.referenceNumber}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[var(--color-primary)] transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Companies Group */}
              {companies.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">
                    <Building className="w-3.5 h-3.5" /> Insurance Companies
                  </div>
                  <div className="space-y-1">
                    {companies.map(c => (
                      <div
                        key={c.id}
                        onClick={() => handleSelect(`/insurance-companies/${c.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--color-surface-hover)] cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-text)]">{c.name}</p>
                          <p className="text-xs text-[var(--color-text-secondary)]">{c.code} • Contact: {c.contactPerson} • {c.phone}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[var(--color-primary)] transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

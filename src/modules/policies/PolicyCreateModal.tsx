import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Policy, InsuranceType } from '../../types/policy.types';
import { Customer } from '../../types/customer.types';
import { InsuranceCompany } from '../../types/company.types';
import { services } from '../../services/serviceFactory';
import { computePolicyFinancials } from '../../utils/calculation.utils';
import { validatePolicyForm } from '../../utils/validation.utils';
import { formatCurrency } from '../../utils/currency.utils';
import { useToast } from '../../components/ui/Toast';
import { INSURANCE_TYPES_CONFIG } from '../../config/insurance.config';

export interface PolicyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPolicy: Policy) => void;
}

export const PolicyCreateModal: React.FC<PolicyCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [companies, setCompanies] = useState<InsuranceCompany[]>([]);

  const [policyNumber, setPolicyNumber] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [insuranceCompanyId, setInsuranceCompanyId] = useState('');
  const [insuranceType, setInsuranceType] = useState<InsuranceType>('HEALTH');

  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  const [grossPremium, setGrossPremium] = useState<number>(30000);
  const [discount, setDiscount] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState('');
  const [commissionRate, setCommissionRate] = useState<number>(15);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadOptions() {
      const custs = await services.customer.getAll();
      const comps = await services.company.getAll();
      setCustomers(custs);
      setCompanies(comps);

      if (custs.length > 0) setCustomerId(custs[0].id);
      if (comps.length > 0) {
        setInsuranceCompanyId(comps[0].id);
        setCommissionRate(comps[0].defaultCommissionRate);
      }
      setPolicyNumber(`POL-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    }
    if (isOpen) loadOptions();
  }, [isOpen]);

  const handleCompanyChange = (companyId: string) => {
    setInsuranceCompanyId(companyId);
    const selected = companies.find(c => c.id === companyId);
    if (selected) {
      setCommissionRate(selected.defaultCommissionRate);
    }
  };

  // Real-time Business Calculations
  const financials = computePolicyFinancials({
    grossPremium,
    discount,
    paidAmount: 0,
    commissionRate,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validatePolicyForm({
      policyNumber,
      customerId,
      insuranceCompanyId,
      grossPremium,
      discount,
      startDate,
      expiryDate,
      commissionRate,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      const created = await services.policy.create({
        policyNumber,
        customerId,
        insuranceCompanyId,
        insuranceType,
        startDate: new Date(startDate).toISOString(),
        expiryDate: new Date(expiryDate).toISOString(),
        grossPremium,
        discount,
        discountReason,
        discountStatus: discount > 0 ? 'PENDING' : 'NONE',
        commissionRate,
      });

      toast.success('Policy Issued Successfully', `Policy ${created.policyNumber} registered.`);
      onSuccess(created);
      onClose();
    } catch (err: any) {
      toast.error('Error', err.message || 'Failed to issue policy');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue New Insurance Policy"
      description="Create policy record with real-time financial calculations."
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Policy Number"
            required
            value={policyNumber}
            onChange={(e) => setPolicyNumber(e.target.value)}
            error={errors.policyNumber}
          />

          <Select
            label="Customer"
            required
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            options={customers.map(c => ({ value: c.id, label: `${c.fullName} (${c.code})` }))}
            error={errors.customerId}
          />

          <Select
            label="Insurance Company"
            required
            value={insuranceCompanyId}
            onChange={(e) => handleCompanyChange(e.target.value)}
            options={companies.map(c => ({ value: c.id, label: c.name }))}
            error={errors.insuranceCompanyId}
          />

          <Select
            label="Insurance Type"
            value={insuranceType}
            onChange={(e) => setInsuranceType(e.target.value as InsuranceType)}
            options={Object.values(INSURANCE_TYPES_CONFIG).map(t => ({ value: t.type, label: t.label }))}
          />

          <Input
            label="Policy Start Date"
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            error={errors.startDate}
          />

          <Input
            label="Policy Expiry Date"
            type="date"
            required
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            error={errors.expiryDate}
          />
        </div>

        <div className="p-4 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-2xl space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Financial & Commission Calculations
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Gross Premium (₹)"
              type="number"
              required
              value={grossPremium}
              onChange={(e) => setGrossPremium(Number(e.target.value))}
              error={errors.grossPremium}
            />

            <Input
              label="Discount Granted (₹)"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              error={errors.discount}
            />

            <Input
              label="Commission Rate (%)"
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              error={errors.commissionRate}
            />

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                Net Premium Payable
              </label>
              <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400 py-2">
                {formatCurrency(financials.netPremium)}
              </div>
            </div>
          </div>

          {discount > 0 && (
            <Input
              label="Reason for Discount Request"
              value={discountReason}
              onChange={(e) => setDiscountReason(e.target.value)}
              placeholder="e.g. Corporate renewal incentive / Loyalty match"
            />
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2 text-xs border-t border-[var(--color-border)]">
            <div>
              <span className="text-[var(--color-muted)]">Calculated Commission:</span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{formatCurrency(financials.commissionAmount)}</p>
            </div>
            <div>
              <span className="text-[var(--color-muted)]">Company Payable Amount:</span>
              <p className="font-bold text-purple-600 dark:text-purple-400 text-sm">{formatCurrency(financials.companyPayableAmount)}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            Issue Policy
          </Button>
        </div>
      </form>
    </Modal>
  );
};

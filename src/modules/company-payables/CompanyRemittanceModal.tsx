import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { InsuranceCompany } from '../../types/company.types';
import { CompanyPayment, PaymentMethod } from '../../types/payment.types';
import { services } from '../../services/serviceFactory';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { formatCurrency } from '../../utils/currency.utils';
import { useToast } from '../../components/ui/Toast';

export interface CompanyRemittanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPayment: CompanyPayment) => void;
}

export const CompanyRemittanceModal: React.FC<CompanyRemittanceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [companies, setCompanies] = useState<InsuranceCompany[]>([]);
  const [companyId, setCompanyId] = useState('');

  const [amount, setAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('NET_BANKING');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadComps() {
      const comps = await services.company.getAll();
      setCompanies(comps);
      if (comps.length > 0) {
        setCompanyId(comps[0].id);
        setAmount(comps[0].totalCompanyBalance || 0);
      }
    }
    if (isOpen) loadComps();
  }, [isOpen]);

  const selectedCompany = companies.find(c => c.id === companyId);

  const handleCompanyChange = (id: string) => {
    setCompanyId(id);
    const comp = companies.find(c => c.id === id);
    if (comp) setAmount(comp.totalCompanyBalance || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCompany) return;

    if (amount <= 0) {
      toast.error('Invalid Amount', 'Remittance amount must be greater than ₹0.');
      return;
    }

    setIsLoading(true);
    try {
      const created = await services.payment.recordCompanyPayment({
        insuranceCompanyId: selectedCompany.id,
        insuranceCompanyName: selectedCompany.name,
        policyIds: [],
        amount,
        paymentDate: new Date(paymentDate).toISOString(),
        paymentMethod,
        referenceNumber: referenceNumber || `CMS-${Date.now()}`,
        notes,
        recordedBy: 'Accountant User',
      });

      toast.success('Remittance Recorded', `Remitted ₹${amount} to ${selectedCompany.name}`);
      onSuccess(created);
      onClose();
    } catch (err: any) {
      toast.error('Error', err.message || 'Failed to record remittance');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Company Remittance Clearance"
      description="Remit net premiums to empanelled insurance carrier."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Insurance Carrier"
          required
          value={companyId}
          onChange={(e) => handleCompanyChange(e.target.value)}
          options={companies.map(c => ({
            value: c.id,
            label: `${c.name} (Balance: ${formatCurrency(c.totalCompanyBalance)})`,
          }))}
        />

        {selectedCompany && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs flex justify-between">
            <span className="text-rose-900 dark:text-rose-200">Current Carrier Balance Due:</span>
            <span className="font-extrabold text-rose-600"><CurrencyDisplay amount={selectedCompany.totalCompanyBalance} /></span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Remittance Amount (₹)"
            type="number"
            required
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <Select
            label="Payment Method"
            required
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            options={[
              { value: 'NET_BANKING', label: 'Bank Transfer (RTGS / NEFT)' },
              { value: 'CHEQUE', label: 'Corporate Cheque' },
              { value: 'UPI', label: 'Direct Transfer' },
            ]}
          />

          <Input
            label="Transfer Date"
            type="date"
            required
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />

          <Input
            label="Bank UTR / Reference No"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="e.g. UTR / CMS Ref No"
          />
        </div>

        <Textarea label="Remittance Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            Clear Remittance
          </Button>
        </div>
      </form>
    </Modal>
  );
};

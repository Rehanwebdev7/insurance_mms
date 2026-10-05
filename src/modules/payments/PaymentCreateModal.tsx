import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { CustomerPayment, PaymentMethod } from '../../types/payment.types';
import { Policy } from '../../types/policy.types';
import { services } from '../../services/serviceFactory';
import { validatePaymentForm } from '../../utils/validation.utils';
import { formatCurrency } from '../../utils/currency.utils';
import { useToast } from '../../components/ui/Toast';

export interface PaymentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPay: CustomerPayment) => void;
  defaultPolicyId?: string;
}

export const PaymentCreateModal: React.FC<PaymentCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultPolicyId,
}) => {
  const toast = useToast();

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState(defaultPolicyId || '');

  const [amount, setAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadPolicies() {
      const all = await services.policy.getAll();
      // Filter policies that have pending balance
      const pendingPolicies = all.filter(p => p.pendingAmount > 0 || p.id === defaultPolicyId);
      setPolicies(pendingPolicies);

      if (pendingPolicies.length > 0 && !selectedPolicyId) {
        setSelectedPolicyId(pendingPolicies[0].id);
        setAmount(pendingPolicies[0].pendingAmount);
      }
    }
    if (isOpen) loadPolicies();
  }, [isOpen, defaultPolicyId]);

  const targetPolicy = policies.find(p => p.id === selectedPolicyId);

  const handlePolicyChange = (polId: string) => {
    setSelectedPolicyId(polId);
    const target = policies.find(p => p.id === polId);
    if (target) {
      setAmount(target.pendingAmount);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetPolicy) {
      toast.error('Error', 'Please select a policy with pending payment balance.');
      return;
    }

    const validation = validatePaymentForm({
      amount,
      pendingAmount: targetPolicy.pendingAmount,
      paymentDate,
      paymentMethod,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      const created = await services.payment.recordCustomerPayment({
        customerId: targetPolicy.customerId,
        customerName: targetPolicy.customerName,
        policyId: targetPolicy.id,
        policyNumber: targetPolicy.policyNumber,
        amount,
        paymentDate: new Date(paymentDate).toISOString(),
        paymentMethod,
        referenceNumber: referenceNumber || `REF-${Date.now()}`,
        status: 'SUCCESS',
        notes,
        recordedBy: 'Accountant User',
      });

      toast.success('Payment Recorded', `Receipt ${created.receiptNumber} generated for ₹${amount}.`);
      onSuccess(created);
      onClose();
    } catch (err: any) {
      toast.error('Error', err.message || 'Failed to record payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Customer Payment"
      description="Issue official payment receipt against policy pending balance."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Policy with Outstanding Balance"
          required
          value={selectedPolicyId}
          onChange={(e) => handlePolicyChange(e.target.value)}
          options={policies.map(p => ({
            value: p.id,
            label: `${p.policyNumber} — ${p.customerName} (Pending: ${formatCurrency(p.pendingAmount)})`,
          }))}
        />

        {targetPolicy && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-xs flex justify-between">
            <span className="text-amber-900 dark:text-amber-200">Current Outstanding Balance:</span>
            <span className="font-extrabold text-amber-600">{formatCurrency(targetPolicy.pendingAmount)}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Payment Amount (₹)"
            type="number"
            required
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            error={errors.amount}
          />

          <Select
            label="Payment Method"
            required
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            options={[
              { value: 'UPI', label: 'UPI / GooglePay / PhonePe' },
              { value: 'NET_BANKING', label: 'Net Banking (IMPS/NEFT)' },
              { value: 'CREDIT_CARD', label: 'Credit Card' },
              { value: 'DEBIT_CARD', label: 'Debit Card' },
              { value: 'CHEQUE', label: 'Bank Cheque' },
              { value: 'CASH', label: 'Cash' },
            ]}
          />

          <Input
            label="Payment Date"
            type="date"
            required
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            error={errors.paymentDate}
          />

          <Input
            label="Reference / Transaction No"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="e.g. UTR / Cheque / Bank Auth No"
          />
        </div>

        <Textarea
          label="Internal Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            Record Payment Receipt
          </Button>
        </div>
      </form>
    </Modal>
  );
};

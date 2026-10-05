import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CurrencyDisplay } from '../../components/common/CurrencyDisplay';
import { DateDisplay } from '../../components/common/DateDisplay';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PermissionGate } from '../../components/common/PermissionGate';
import { services } from '../../services/serviceFactory';
import { Policy } from '../../types/policy.types';
import { ArrowLeft, CheckCircle, XCircle, RotateCw, CreditCard, ShieldCheck } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export const PolicyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [policy, setPolicy] = useState<Policy | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPolicy = async () => {
    if (!id) return;
    setIsLoading(true);
    const p = await services.policy.getById(id);
    setPolicy(p);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPolicy();
  }, [id]);

  const handleDiscountApproval = async (approved: boolean) => {
    if (!policy) return;
    try {
      await services.policy.approveDiscount(policy.id, approved);
      toast.success(
        approved ? 'Discount Approved' : 'Discount Rejected',
        `Discount status updated for policy ${policy.policyNumber}`
      );
      loadPolicy();
    } catch (err: any) {
      toast.error('Error', err.message || 'Failed to update discount');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading policy details...</div>;
  }

  if (!policy) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Policy Not Found</h2>
        <Button onClick={() => navigate('/policies')}>Back to Policy List</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/policies')}
        icon={<ArrowLeft className="w-4 h-4" />}
      >
        Back to Policies
      </Button>

      <PageHeader
        title={`Policy ${policy.policyNumber}`}
        description={`Customer: ${policy.customerName} • Insurance Company: ${policy.insuranceCompanyName}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge type="policy" status={policy.policyStatus} />
            <StatusBadge type="payment" status={policy.paymentStatus} />
          </div>
        }
      />

      {/* Discount Approval Banner */}
      {policy.discountStatus === 'PENDING' && (
        <Card className="bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
              Discount Approval Required (₹{policy.discount})
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
              Reason: {policy.discountReason || 'Requested during policy issuance'}
            </p>
          </div>
          <PermissionGate permission="discount.approve">
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDiscountApproval(false)}
                icon={<XCircle className="w-4 h-4 text-red-500" />}
              >
                Reject
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => handleDiscountApproval(true)}
                icon={<CheckCircle className="w-4 h-4" />}
              >
                Approve Discount
              </Button>
            </div>
          </PermissionGate>
        </Card>
      )}

      {/* Policy Financial Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Customer Side */}
        <Card className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Customer Financial Summary
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-muted)]">Gross Premium:</span>
              <span className="font-bold"><CurrencyDisplay amount={policy.grossPremium} /></span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--color-border)] text-amber-600">
              <span>- Applied Discount:</span>
              <span className="font-bold"><CurrencyDisplay amount={policy.discount} /></span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--color-border)] text-sm font-extrabold text-[var(--color-text)]">
              <span>Net Premium:</span>
              <span><CurrencyDisplay amount={policy.netPremium} /></span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--color-border)] text-emerald-600">
              <span>Customer Paid:</span>
              <span className="font-bold"><CurrencyDisplay amount={policy.paidAmount} /></span>
            </div>
            <div className="flex justify-between py-1 text-sm font-bold text-amber-600">
              <span>Customer Pending:</span>
              <span><CurrencyDisplay amount={policy.pendingAmount} /></span>
            </div>
          </div>
        </Card>

        {/* Card 2: Company Side */}
        <Card className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Company Remittance Breakdown
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-muted)]">Net Premium:</span>
              <span className="font-bold"><CurrencyDisplay amount={policy.netPremium} /></span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--color-border)] text-emerald-600">
              <span>- Commission ({policy.commissionRate}%):</span>
              <span className="font-bold"><CurrencyDisplay amount={policy.commissionAmount} /></span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--color-border)] text-sm font-extrabold text-purple-700 dark:text-purple-300">
              <span>Company Payable:</span>
              <span><CurrencyDisplay amount={policy.companyPayableAmount} /></span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--color-border)] text-emerald-600">
              <span>Remitted to Company:</span>
              <span className="font-bold"><CurrencyDisplay amount={policy.companyPaidAmount} /></span>
            </div>
            <div className="flex justify-between py-1 text-sm font-bold text-rose-600">
              <span>Company Balance:</span>
              <span><CurrencyDisplay amount={policy.companyBalanceAmount} /></span>
            </div>
          </div>
        </Card>

        {/* Card 3: Validity & Agents */}
        <Card className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
            Policy Validity & Agent
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[var(--color-muted)] block">Start Date:</span>
              <span className="font-bold text-[var(--color-text)]"><DateDisplay date={policy.startDate} /></span>
            </div>
            <div>
              <span className="text-[var(--color-muted)] block">Expiry Date:</span>
              <span className="font-bold text-[var(--color-text)]"><DateDisplay date={policy.expiryDate} showDaysRemaining /></span>
            </div>
            <div>
              <span className="text-[var(--color-muted)] block">Assigned Agent:</span>
              <span className="font-bold text-[var(--color-text)]">{policy.agentName || 'System Admin'}</span>
            </div>
          </div>

          <div className="pt-2">
            <PermissionGate permission="renewals.create">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/renewals')}
                icon={<RotateCw className="w-4 h-4" />}
              >
                Process Policy Renewal
              </Button>
            </PermissionGate>
          </div>
        </Card>
      </div>
    </div>
  );
};

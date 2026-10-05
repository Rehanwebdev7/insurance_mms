import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Customer, CustomerType } from '../../types/customer.types';
import { services } from '../../services/serviceFactory';
import { useToast } from '../../components/ui/Toast';

export interface CustomerCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCust: Customer) => void;
}

export const CustomerCreateModal: React.FC<CustomerCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('INDIVIDUAL');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [gstin, setGstin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!email.trim()) newErrors.email = 'Email address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const created = await services.customer.create({
        fullName,
        mobile,
        email,
        customerType,
        address,
        city,
        state,
        pincode,
        panNumber,
        aadhaarNumber: customerType === 'INDIVIDUAL' ? aadhaarNumber : undefined,
        gstin: customerType === 'CORPORATE' ? gstin : undefined,
        status: 'ACTIVE',
      });

      toast.success('Customer Created', `Customer '${created.fullName}' onboarded successfully.`);
      onSuccess(created);
      onClose();
    } catch (err: any) {
      toast.error('Error', err.message || 'Failed to create customer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Customer Account"
      description="Enter customer details to register in the agency system."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name / Company Name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
          />

          <Select
            label="Customer Type"
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value as CustomerType)}
            options={[
              { value: 'INDIVIDUAL', label: 'Individual Person' },
              { value: 'CORPORATE', label: 'Corporate / Business entity' },
            ]}
          />

          <Input
            label="Mobile Number"
            required
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            error={errors.mobile}
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <Input
            label="PAN Number"
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
            placeholder="e.g. ABCDE1234F"
          />

          {customerType === 'INDIVIDUAL' ? (
            <Input
              label="Aadhaar Number"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              placeholder="12 digit Aadhaar"
            />
          ) : (
            <Input
              label="GSTIN Number"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              placeholder="e.g. 27AAAAA0000A1Z5"
            />
          )}
        </div>

        <Textarea
          label="Street Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input label="State" value={state} onChange={(e) => setState(e.target.value)} />
          <Input label="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            Create Customer
          </Button>
        </div>
      </form>
    </Modal>
  );
};

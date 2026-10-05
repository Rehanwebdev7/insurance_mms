import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { DateDisplay } from '../../components/common/DateDisplay';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PermissionGate } from '../../components/common/PermissionGate';
import { services } from '../../services/serviceFactory';
import { User } from '../../types/auth.types';
import { RoleCode } from '../../types/permission.types';
import { UserCheck, UserPlus, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export const UsersPage: React.FC = () => {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New User Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<RoleCode>('AGENT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    const data = await services.admin.getUsers();
    setUsers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    try {
      await services.admin.createUser({
        name,
        email,
        phone,
        role,
        roleName: role,
        status: 'ACTIVE',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120`,
      });
      toast.success('User Account Created', `Created account for ${name} (${role})`);
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      loadUsers();
    } catch (err: any) {
      toast.error('Error', err.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await services.admin.updateUser(user.id, { status: newStatus });
      toast.info('Status Updated', `User ${user.name} is now ${newStatus}`);
      loadUsers();
    } catch (err: any) {
      toast.error('Error', err.message);
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'User Account',
      render: (u) => (
        <div className="flex items-center gap-3">
          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border" />
          <div>
            <p className="font-bold text-[var(--color-text)]">{u.name}</p>
            <p className="text-xs text-[var(--color-muted)]">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (u) => <span className="text-xs">{u.phone}</span>,
    },
    {
      key: 'role',
      header: 'Assigned Role',
      render: (u) => <Badge variant="primary">{u.roleName || u.role}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (u) => (
        <Badge variant={u.status === 'ACTIVE' ? 'success' : 'neutral'}>
          {u.status}
        </Badge>
      ),
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      render: (u) => <DateDisplay date={u.lastLogin} showTime />,
    },
    {
      key: 'actions',
      header: 'Toggle Status',
      align: 'right',
      render: (u) => (
        <PermissionGate permission="users.edit">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(u)}
            icon={u.status === 'ACTIVE' ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
          >
            {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
          </Button>
        </PermissionGate>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Super Admin portal for managing system users, agents, and access status."
        actions={
          <PermissionGate permission="users.create">
            <Button variant="primary" onClick={() => setIsModalOpen(true)} icon={<UserPlus className="w-4 h-4" />}>
              Create New User
            </Button>
          </PermissionGate>
        }
      />

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        searchPlaceholder="Search users by name, email, role..."
        exportFilename="system_users"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create System User Account"
        description="Assign user credentials and role for module permissions."
        size="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input label="Full Name" required value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email Address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Mobile Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

          <Select
            label="System Role"
            value={role}
            onChange={(e) => setRole(e.target.value as RoleCode)}
            options={[
              { value: 'SUPER_ADMIN', label: 'Super Administrator' },
              { value: 'ADMIN', label: 'Agency Administrator' },
              { value: 'MANAGER', label: 'Branch Manager' },
              { value: 'ACCOUNTANT', label: 'Finance & Accountant' },
              { value: 'AGENT', label: 'Insurance Agent' },
              { value: 'VIEWER', label: 'Read-Only Auditor' },
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>Create User Account</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { services } from '../../services/serviceFactory';
import { Role, PermissionCode } from '../../types/permission.types';
import { ALL_PERMISSIONS } from '../../config/permission.config';
import { Lock, Check, Save } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export const RolesPage: React.FC = () => {
  const toast = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-2');
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadRoles = async () => {
    setIsLoading(true);
    const data = await services.admin.getRoles();
    setRoles(data);
    const active = data.find(r => r.id === selectedRoleId) || data[0];
    if (active) {
      setSelectedRoleId(active.id);
      setSelectedPermissions(active.permissions);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  const handleRoleSelect = (role: Role) => {
    setSelectedRoleId(role.id);
    setSelectedPermissions(role.permissions);
  };

  const togglePermission = (code: PermissionCode) => {
    if (selectedRole?.code === 'SUPER_ADMIN') {
      toast.info('Super Admin', 'Super Admin role retains all permissions permanently.');
      return;
    }
    if (selectedPermissions.includes(code)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== code));
    } else {
      setSelectedPermissions([...selectedPermissions, code]);
    }
  };

  const handleSaveMatrix = async () => {
    if (!selectedRole) return;
    setIsSaving(true);
    try {
      await services.admin.updateRolePermissions(selectedRole.id, selectedPermissions);
      toast.success('Permissions Saved', `Updated permissions matrix for role '${selectedRole.name}'`);
      loadRoles();
    } catch (err: any) {
      toast.error('Error', err.message || 'Failed to update permissions');
    } finally {
      setIsSaving(false);
    }
  };

  // Group all system permissions by Module name
  const moduleGroups = React.useMemo(() => {
    const groups: Record<string, { code: PermissionCode; label: string }[]> = {};
    ALL_PERMISSIONS.forEach(p => {
      if (!groups[p.module]) groups[p.module] = [];
      groups[p.module].push(p);
    });
    return groups;
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role & Granular Permission Matrix"
        description="Configure Role-Based Access Control (RBAC) permissions for system roles."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column: Roles List */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">System Roles</h3>
          {roles.map(role => {
            const isSelected = role.id === selectedRoleId;
            return (
              <Card
                key={role.id}
                hoverable
                onClick={() => handleRoleSelect(role)}
                className={`cursor-pointer transition-all ${
                  isSelected ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] bg-[var(--color-primary-light)]/20' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[var(--color-text)]">{role.name}</h4>
                  <Badge variant={isSelected ? 'primary' : 'neutral'}>
                    {role.permissions.length} perms
                  </Badge>
                </div>
                <p className="text-xs text-[var(--color-muted)] mt-1.5 line-clamp-2 leading-relaxed">{role.description}</p>
                <div className="mt-3 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
                  <span>Assigned Users:</span>
                  <span className="font-bold text-[var(--color-text)]">{role.userCount || 0}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right column: Interactive Permission Matrix Table */}
        <Card className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)]">
                Editing Permissions for: <span className="text-[var(--color-primary)]">{selectedRole?.name}</span>
              </h3>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">{selectedRole?.description}</p>
            </div>
            <Button
              variant="primary"
              onClick={handleSaveMatrix}
              isLoading={isSaving}
              icon={<Save className="w-4 h-4" />}
            >
              Save Permission Matrix
            </Button>
          </div>

          <div className="space-y-6">
            {Object.entries(moduleGroups).map(([moduleName, perms]) => (
              <div key={moduleName} className="border border-[var(--color-border)] rounded-xl overflow-hidden">
                <div className="bg-[var(--color-surface-hover)] px-4 py-2.5 border-b border-[var(--color-border)] flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text)]">{moduleName} Module</span>
                  <span className="text-[11px] text-[var(--color-muted)] font-medium">
                    {perms.filter(p => selectedPermissions.includes(p.code)).length} of {perms.length} granted
                  </span>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {perms.map(p => {
                    const isChecked = selectedPermissions.includes(p.code);
                    return (
                      <label
                        key={p.code}
                        className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-100'
                            : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-border-hover)]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(p.code)}
                          disabled={selectedRole?.code === 'SUPER_ADMIN'}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span>{p.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

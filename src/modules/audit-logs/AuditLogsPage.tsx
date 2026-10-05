import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { DateDisplay } from '../../components/common/DateDisplay';
import { Badge } from '../../components/ui/Badge';
import { storageService } from '../../services/storage/storage.service';
import { ActivityLog } from '../../types/common.types';
import { FileText, Shield } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      setIsLoading(true);
      const data = storageService.getActivities();
      setLogs(data);
      setIsLoading(false);
    }
    loadLogs();
  }, []);

  const columns: Column<ActivityLog>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      render: (a) => <DateDisplay date={a.timestamp} showTime />,
    },
    {
      key: 'userName',
      header: 'User Account',
      render: (a) => (
        <div>
          <p className="font-bold text-[var(--color-text)]">{a.userName}</p>
          <p className="text-[10px] text-[var(--color-muted)]">{a.userRole}</p>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action Executed',
      render: (a) => <Badge variant="primary">{a.action}</Badge>,
    },
    {
      key: 'module',
      header: 'Target Module',
      render: (a) => <span className="font-semibold text-xs">{a.module}</span>,
    },
    {
      key: 'description',
      header: 'Audit Description',
      render: (a) => <span className="text-xs text-[var(--color-text-secondary)]">{a.description}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs & Compliance Trail"
        description="Immutable record of user actions, financial recording, and permission changes."
      />

      <DataTable
        columns={columns}
        data={logs}
        isLoading={isLoading}
        searchPlaceholder="Search audit logs by action, user, module..."
        exportFilename="audit_logs_trail"
      />
    </div>
  );
};

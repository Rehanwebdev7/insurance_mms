import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Download } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Pagination } from '../ui/Pagination';
import { LoadingState } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';
import { exportToCSV } from '../../utils/export.utils';
import { clsx } from 'clsx';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  exportable?: boolean;
  exportFilename?: string;
  actions?: React.ReactNode;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchKeys,
  exportable = true,
  exportFilename = 'export_data',
  actions,
  onRowClick,
  emptyTitle,
  emptyDescription,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Search filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();

    return data.filter((row) => {
      if (searchKeys && searchKeys.length > 0) {
        return searchKeys.some((k) => String(row[k] || '').toLowerCase().includes(term));
      }
      return Object.values(row).some((val) => String(val || '').toLowerCase().includes(term));
    });
  }, [data, searchTerm, searchKeys]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortOrder === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filteredData, sortField, sortOrder]);

  // Pagination calculation
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, safeCurrentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortField === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else setSortField(null);
    } else {
      setSortField(key);
      setSortOrder('asc');
    }
  };

  const handleExport = () => {
    const csvHeaders = columns.map(c => ({ key: c.key, label: c.header }));
    exportToCSV(exportFilename, sortedData, csvHeaders);
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xs">
      {/* Top Toolbar */}
      {(searchable || exportable || actions) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]/30">
          {searchable ? (
            <div className="w-full sm:w-72">
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                icon={<Search className="w-4 h-4" />}
                className="py-1.5 text-xs"
              />
            </div>
          ) : <div />}

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {actions}
            {exportable && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                icon={<Download className="w-4 h-4" />}
              >
                Export CSV
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[var(--color-text)] border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]/50 uppercase tracking-wider font-semibold text-[var(--color-text-secondary)]">
              {columns.map((col) => {
                const alignClass = col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left';
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={clsx('py-3.5 px-4 select-none', alignClass, col.sortable && 'cursor-pointer hover:text-[var(--color-text)]')}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className={clsx('inline-flex items-center gap-1.5', alignClass)}>
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="shrink-0">
                          {sortField === col.key ? (
                            sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-[var(--color-primary)]" /> : <ChevronDown className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 opacity-30" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <LoadingState message="Fetching table records..." />
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={clsx(
                    'transition-colors hover:bg-[var(--color-surface-hover)]/70',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col) => {
                    const alignClass = col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left';
                    return (
                      <td key={col.key} className={clsx('py-3.5 px-4 font-normal text-sm', alignClass)}>
                        {col.render ? col.render(row, rowIdx) : (row[col.key] !== undefined ? String(row[col.key]) : '-')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && sortedData.length > 0 && (
        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  );
}

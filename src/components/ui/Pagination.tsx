import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { Select } from './Select';
import { APP_CONFIG } from '../../config/app.config';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
      <div className="flex items-center gap-3">
        <span>
          Showing <span className="font-bold text-[var(--color-text)]">{startItem}</span> to{' '}
          <span className="font-bold text-[var(--color-text)]">{endItem}</span> of{' '}
          <span className="font-bold text-[var(--color-text)]">{totalItems}</span> entries
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span>Per page:</span>
            <Select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              options={APP_CONFIG.PAGE_SIZE_OPTIONS.map((size) => ({
                value: size,
                label: String(size),
              }))}
              className="py-1 px-2 text-xs w-16"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          icon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        <span className="px-2 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next <ChevronRight className="w-4 h-4 ml-1 inline" />
        </Button>
      </div>
    </div>
  );
};

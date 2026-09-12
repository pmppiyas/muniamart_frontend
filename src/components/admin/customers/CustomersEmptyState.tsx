'use client';

import * as React from 'react';
import { Users, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomersEmptyStateProps {
  isFiltering: boolean;
  onClearFilters: () => void;
}

export function CustomersEmptyState({
  isFiltering,
  onClearFilters,
}: CustomersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-4">
        <Users className="h-7 w-7 opacity-70" />
      </div>

      <h3 className="text-base font-bold text-foreground">
        {isFiltering ? 'No matching customers found' : 'No registered customers yet'}
      </h3>

      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        {isFiltering
          ? 'No customer accounts match your search query or status filter. Try clearing your search.'
          : 'When users register and place orders on your store, they will appear here.'}
      </p>

      {isFiltering && (
        <div className="mt-5">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="h-8.5 rounded-xl px-3 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}

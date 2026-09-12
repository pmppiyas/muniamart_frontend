'use client';

import * as React from 'react';
import { CreditCard, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentsEmptyStateProps {
  isFiltering: boolean;
  onClearFilters: () => void;
}

export function PaymentsEmptyState({
  isFiltering,
  onClearFilters,
}: PaymentsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-4">
        <CreditCard className="h-7 w-7 opacity-70" />
      </div>

      <h3 className="text-base font-bold text-foreground">
        {isFiltering ? 'No matching payments found' : 'No payments recorded yet'}
      </h3>

      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        {isFiltering
          ? 'No transactions match your search query, gateway, or status filter. Try clearing your filters.'
          : 'When customers make payments online via Stripe or bKash, their transaction records will appear here.'}
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

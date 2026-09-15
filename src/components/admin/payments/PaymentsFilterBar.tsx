'use client';

import * as React from 'react';
import { Search, X, Filter, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaymentsFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const PROVIDER_OPTIONS = [
  { label: 'All Gateways', value: 'ALL' },
  { label: 'Stripe', value: 'STRIPE' },
  { label: 'bKash', value: 'BKASH' },
];

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Success', value: 'SUCCESS' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Failed', value: 'FAILED' },
];

export function PaymentsFilterBar({
  searchQuery,
  onSearchChange,
  selectedProvider,
  onProviderChange,
  selectedStatus,
  onStatusChange,
  onReset,
  hasActiveFilters,
}: PaymentsFilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-xs">
      <div className="relative flex-1 min-w-[260px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search by transaction ID, order ID, customer name or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 pl-9 pr-8 text-xs bg-background"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/50">
          <CreditCard className="h-3.5 w-3.5 text-muted-foreground ml-1.5 hidden sm:inline" />
          {PROVIDER_OPTIONS.map((opt) => {
            const isSelected = selectedProvider === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onProviderChange(opt.value)}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer',
                  isSelected
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/50">
          <Filter className="h-3.5 w-3.5 text-muted-foreground ml-1.5 hidden sm:inline" />
          {STATUS_OPTIONS.map((opt) => {
            const isSelected = selectedStatus === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onStatusChange(opt.value)}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer',
                  isSelected
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 text-xs text-muted-foreground hover:text-foreground gap-1 px-2.5"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

'use client';

import { Search, X, Filter, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminsFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const ROLE_OPTIONS = [
  { label: 'All Roles', value: 'ALL' },
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
  { label: 'Admin', value: 'ADMIN' },
];

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

export function AdminsFilterBar({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  onReset,
  hasActiveFilters,
}: AdminsFilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-xs">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search by administrator name or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 pl-9 pr-8 text-xs bg-background"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/50">
          <Shield className="h-3.5 w-3.5 text-muted-foreground ml-1 hidden sm:inline" />
          {ROLE_OPTIONS.map((opt) => {
            const isSelected = selectedRole === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onRoleChange(opt.value)}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer',
                  isSelected
                    ? 'bg-background text-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/50">
          <Filter className="h-3.5 w-3.5 text-muted-foreground ml-1 hidden sm:inline" />
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
                    ? 'bg-background text-foreground shadow-xs font-bold'
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

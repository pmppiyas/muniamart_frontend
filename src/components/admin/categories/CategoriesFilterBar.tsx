'use client';

import * as React from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CategoriesFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  hierarchyFilter: 'ALL' | 'ROOT_ONLY' | 'SUB_ONLY';
  onHierarchyFilterChange: (val: 'ALL' | 'ROOT_ONLY' | 'SUB_ONLY') => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function CategoriesFilterBar({
  searchQuery,
  onSearchChange,
  hierarchyFilter,
  onHierarchyFilterChange,
  onExpandAll,
  onCollapseAll,
  onReset,
  hasActiveFilters,
}: CategoriesFilterBarProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search categories by name, slug..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9.5 text-xs rounded-xl border-border/80 bg-background"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Level:
            </span>
            <select
              value={hierarchyFilter}
              onChange={(e) =>
                onHierarchyFilterChange(
                  e.target.value as 'ALL' | 'ROOT_ONLY' | 'SUB_ONLY'
                )
              }
              className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors focus:border-primary focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="ROOT_ONLY">Root Categories Only</option>
              <option value="SUB_ONLY">Subcategories Only</option>
            </select>
          </div>

          <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onExpandAll}
              className="h-7.5 px-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
              title="Expand All Categories"
            >
              <ChevronDown className="h-3 w-3 mr-1" />
              Expand
            </Button>
            <div className="h-4 w-px bg-border my-auto" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCollapseAll}
              className="h-7.5 px-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
              title="Collapse All Categories"
            >
              <ChevronRight className="h-3 w-3 mr-1" />
              Collapse
            </Button>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-9 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

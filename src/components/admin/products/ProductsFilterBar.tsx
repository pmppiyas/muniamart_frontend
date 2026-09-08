'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface CategoryOption {
  id: string;
  name: string;
}

interface ProductsFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: CategoryOption[];
  selectedStockStatus: string;
  onStockStatusChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function ProductsFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedStockStatus,
  onStockStatusChange,
  selectedStatus,
  onStatusChange,
  onReset,
  hasActiveFilters,
}: ProductsFilterBarProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, SKU, or category..."
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

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors focus:border-primary focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Stock:
            </span>
            <select
              value={selectedStockStatus}
              onChange={(e) => onStockStatusChange(e.target.value)}
              className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors focus:border-primary focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Stock</option>
              <option value="IN_STOCK">In Stock (&gt;5)</option>
              <option value="LOW_STOCK">Low Stock (1-5)</option>
              <option value="OUT_OF_STOCK">Out of Stock (0)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Status:
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors focus:border-primary focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Reset Filters */}
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

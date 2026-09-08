'use client';

import * as React from 'react';
import { Plus, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CategoriesHeaderProps {
  totalCount: number;
  isFetching: boolean;
  onRefresh: () => void;
  onExport: () => void;
  onAddCategory: () => void;
}

export function CategoriesHeader({
  totalCount,
  isFetching,
  onRefresh,
  onExport,
  onAddCategory,
}: CategoriesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-h-11 py-0.5">
      {/* Left: Heading + Total Count Badge + Subtitle */}
      <div className="space-y-0.5">
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Categories
          </h1>
          <Badge
            variant="secondary"
            className="font-mono text-[11px] h-6 px-2 font-semibold"
          >
            {totalCount} Total
          </Badge>
        </div>
        <p className="text-[11px] sm:text-xs text-muted-foreground">
          Manage hierarchical store catalog, parent categories and subcategories
        </p>
      </div>

      {/* Right: Action Buttons Group */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="h-8.5 rounded-xl px-2.5 text-xs font-semibold shadow-2xs cursor-pointer"
          title="Refresh Categories"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="h-8.5 rounded-xl px-2.5 text-xs font-semibold shadow-2xs cursor-pointer"
          title="Export to CSV"
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Export
        </Button>

        <Button
          size="sm"
          onClick={onAddCategory}
          className="h-8.5 rounded-xl px-3 text-xs font-bold shadow-sm cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Category
        </Button>
      </div>
    </div>
  );
}

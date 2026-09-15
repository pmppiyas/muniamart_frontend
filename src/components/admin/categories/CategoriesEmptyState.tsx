'use client';

import * as React from 'react';
import { Layers, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoriesEmptyStateProps {
  isFiltering: boolean;
  onClearFilters: () => void;
  onAddCategory: () => void;
}

export function CategoriesEmptyState({
  isFiltering,
  onClearFilters,
  onAddCategory,
}: CategoriesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-4">
        <Layers className="h-7 w-7 opacity-70" />
      </div>

      <h3 className="text-base font-bold text-foreground">
        {isFiltering ? 'No matching categories found' : 'No categories yet'}
      </h3>

      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        {isFiltering
          ? 'No categories match your search or level filter. Try resetting filters or using a different search term.'
          : 'Get started by creating your first root category or organize subcategories for your store catalog.'}
      </p>

      <div className="mt-5 flex items-center gap-2">
        {isFiltering ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="h-8.5 rounded-xl px-3 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Clear Filters
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={onAddCategory}
            className="h-8.5 rounded-xl px-3.5 text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Create Category
          </Button>
        )}
      </div>
    </div>
  );
}

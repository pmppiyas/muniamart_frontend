'use client';

import * as React from 'react';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductsEmptyStateProps {
  isFiltering: boolean;
  onClearFilters: () => void;
  onAddProduct: () => void;
}

export function ProductsEmptyState({
  isFiltering,
  onClearFilters,
  onAddProduct,
}: ProductsEmptyStateProps) {
  return (
    <div className="p-16 text-center space-y-4">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
        <Package className="h-7 w-7" />
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-base font-bold text-foreground">
          {isFiltering ? 'No matching products found' : 'No products in catalog yet'}
        </h3>
        <p className="text-xs text-muted-foreground">
          {isFiltering
            ? 'No products matched your search or active filter criteria. Try resetting filters.'
            : 'Get started by creating your first product in the store catalog.'}
        </p>
      </div>
      {isFiltering ? (
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Clear Filters
        </Button>
      ) : (
        <Button size="sm" onClick={onAddProduct}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add First Product
        </Button>
      )}
    </div>
  );
}

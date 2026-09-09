'use client';

import * as React from 'react';
import { PackageSearch, RotateCcw } from 'lucide-react';
import { Product, ViewMode } from '@/types/product';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  viewMode?: ViewMode;
  onResetFilters?: () => void;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  className?: string;
}

export function ProductGrid({
  products,
  viewMode = 'grid',
  onResetFilters,
  onAddToCart,
  onToggleWishlist,
  className,
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center min-h-[380px]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
          <PackageSearch className="h-8 w-8" />
        </div>

        <h3 className="text-lg font-bold text-foreground">No Products Found</h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          We couldn&apos;t find any items matching your selected filters. Try broadening your criteria or reset filters.
        </p>

        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className={cn('flex flex-col space-y-4', className)}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode="list"
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode="grid"
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
}

'use client';

import * as React from 'react';
import { RotateCcw, Filter, Check } from 'lucide-react';
import { Category } from '@/types/category';
import { ProductFilterState } from '@/types/product';
import { CategoryFilter } from './CategoryFilter';
import { PriceFilter } from './PriceFilter';
import { BrandFilter } from './BrandFilter';
import { RatingFilter } from './RatingFilter';
import { cn } from '@/lib/utils';

interface ProductFilterProps {
  categories: Category[];
  availableBrands: { name: string; count: number }[];
  filters: ProductFilterState;
  onFilterChange: (filters: ProductFilterState) => void;
  onResetFilters: () => void;
  className?: string;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export function ProductFilter({
  categories,
  availableBrands,
  filters,
  onFilterChange,
  onResetFilters,
  className,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}: ProductFilterProps) {
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 2000 ||
    filters.minRating > 0 ||
    filters.inStockOnly;

  const handleToggleCategory = (categorySlug: string) => {
    const nextCategories = filters.categories.includes(categorySlug)
      ? filters.categories.filter((c) => c !== categorySlug)
      : [...filters.categories, categorySlug];

    onFilterChange({ ...filters, categories: nextCategories });
  };

  const handleToggleBrand = (brandName: string) => {
    const nextBrands = filters.brands.includes(brandName)
      ? filters.brands.filter((b) => b !== brandName)
      : [...filters.brands, brandName];

    onFilterChange({ ...filters, brands: nextBrands });
  };

  const handlePriceChange = (priceRange: [number, number]) => {
    onFilterChange({ ...filters, priceRange });
  };

  const handleRatingChange = (minRating: number) => {
    onFilterChange({ ...filters, minRating });
  };

  const handleToggleInStock = () => {
    onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly });
  };

  return (
    <aside className={cn('flex flex-col', isMobileDrawer ? 'space-y-6' : 'h-full', className)}>
      {!isMobileDrawer && (
        <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-card shrink-0 select-none">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Filters</h2>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All</span>
            </button>
          )}
        </div>
      )}

      <div
        className={cn(
          'space-y-6',
          !isMobileDrawer && 'flex-1 overflow-y-auto overscroll-contain p-5 pr-3'
        )}
      >
        <CategoryFilter
          categories={categories}
          selectedCategories={filters.categories}
          onToggleCategory={handleToggleCategory}
        />

        <div className="border-t border-border" />

        <PriceFilter
          priceRange={filters.priceRange}
          onPriceChange={handlePriceChange}
        />

        <div className="border-t border-border" />

        {availableBrands.length > 0 && (
          <>
            <BrandFilter
              availableBrands={availableBrands}
              selectedBrands={filters.brands}
              onToggleBrand={handleToggleBrand}
            />
            <div className="border-t border-border" />
          </>
        )}

        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Availability
          </h3>
          <label className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium cursor-pointer hover:bg-muted transition-colors">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={handleToggleInStock}
              className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary/20 accent-blue-600"
            />
            <span className="text-foreground">In Stock Only</span>
          </label>
        </div>

        <div className="border-t border-border" />

        <RatingFilter
          minRating={filters.minRating}
          onRatingChange={handleRatingChange}
        />
      </div>

      {isMobileDrawer && onCloseMobileDrawer && (
        <div className="pt-4 sticky bottom-0 bg-background border-t border-border pb-2">
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-hover active:scale-98 transition-all cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      )}
    </aside>
  );
}

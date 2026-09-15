'use client';

import * as React from 'react';
import { LayoutGrid } from 'lucide-react';
import { Category } from '@/types/category';
import { Product } from '@/types/product';
import { SubCategoryCard } from './SubCategoryCard';
import { cn } from '@/lib/utils';

interface SubCategoryListProps {
  subcategories?: Category[];
  selectedSubcategory?: string | null;
  onSelectSubcategory: (slug: string | null) => void;
  categoryName: string;
  className?: string;
  products?: Product[];
}

export function SubCategoryList({
  subcategories = [],
  selectedSubcategory,
  onSelectSubcategory,
  categoryName,
  className,
  products = [],
}: SubCategoryListProps) {
  const subcategoryCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      if (p.subcategorySlug) {
        map.set(p.subcategorySlug, (map.get(p.subcategorySlug) || 0) + 1);
      }
    });
    return map;
  }, [products]);

  if (!subcategories || subcategories.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Popular Departments in {categoryName}
        </h2>

        {selectedSubcategory && (
          <button
            type="button"
            onClick={() => onSelectSubcategory(null)}
            className="text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            View All in {categoryName}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() => onSelectSubcategory(null)}
          className={cn(
            'group relative flex items-center gap-3 rounded-2xl border p-3 text-left transition-all cursor-pointer shadow-2xs',
            !selectedSubcategory
              ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm'
              : 'border-border bg-card hover:border-primary/50 hover:bg-muted/40 hover:-translate-y-0.5'
          )}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'text-xs font-bold truncate transition-colors',
                !selectedSubcategory ? 'text-primary' : 'text-foreground group-hover:text-primary'
              )}
            >
              All {categoryName}
            </h3>
            <p className="text-[11px] text-muted-foreground">{products.length} items</p>
          </div>
        </button>

        {subcategories.map((sub) => {
          const isSelected =
            !!selectedSubcategory &&
            (selectedSubcategory.toLowerCase() === sub.slug.toLowerCase() ||
              selectedSubcategory.toLowerCase() === sub.name.toLowerCase());

          return (
            <SubCategoryCard
              key={sub.id}
              subcategory={sub}
              itemCount={subcategoryCounts.get(sub.slug) || 0}
              isSelected={isSelected}
              onSelect={(slug) =>
                onSelectSubcategory(isSelected ? null : slug)
              }
            />
          );
        })}
      </div>
    </div>
  );
}

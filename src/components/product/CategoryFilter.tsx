'use client';

import * as React from 'react';
import { Category } from '@/types/category';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onToggleCategory: (categorySlug: string) => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onToggleCategory,
  className,
}: CategoryFilterProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
        Categories
      </h3>

      <div className="space-y-1.5 pt-1">
        {categories.map((cat) => {
          const isSelected = selectedCategories.includes(cat.slug);

          return (
            <label
              key={cat.id}
              className={cn(
                'flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors',
                isSelected
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-foreground/80 hover:bg-muted'
              )}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleCategory(cat.slug)}
                  className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary/20 accent-blue-600"
                />
                <span>{cat.name}</span>
              </div>

              {cat.itemCount ? (
                <span className="text-[10px] text-muted-foreground">
                  ({cat.itemCount})
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
    </div>
  );
}

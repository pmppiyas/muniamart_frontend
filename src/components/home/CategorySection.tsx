'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { Category } from '@/types/category';
import { CategoryCard } from './CategoryCard';

interface CategorySectionProps {
  categories?: Category[];
}

export function CategorySection({ categories = [] }: CategorySectionProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <Link
            href="/categories"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline shrink-0"
          >
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                <LayoutGrid className="h-3 w-3" />
                <span>Explore Departments</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

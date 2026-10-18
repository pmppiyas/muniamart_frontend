'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types/category';
import { useGetAllCategoriesQuery } from '@/services/api/categoryApi';
import { CategoryCard } from './CategoryCard';

interface CategorySectionProps {
  categories?: Category[];
}

export function CategorySection({ categories: initialCategories = [] }: CategorySectionProps) {
  // Live RTK query so changes in admin reflect immediately
  const { data: catRes } = useGetAllCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const categories = React.useMemo(() => {
    if (catRes?.data && Array.isArray(catRes.data) && catRes.data.length > 0) {
      return catRes.data as Category[];
    }
    return initialCategories;
  }, [catRes, initialCategories]);

  // JUST main root categories (no subcategories mixed in)
  const mainCategories = React.useMemo(() => {
    if (!categories || categories.length === 0) return [];
    return categories.filter((c) => !c.parentId);
  }, [categories]);

  if (mainCategories.length === 0) return null;

  return (
    <section className="py-7 sm:py-10 border-b border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-3.5 sm:pb-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="w-1.5 h-6 sm:h-7 bg-primary rounded-full shrink-0" />
            <h2 className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight text-foreground">
              Explore Departments
            </h2>
          </div>

          <Link
            href="/categories"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Flat main category icon display */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-x-3 sm:gap-x-6 gap-y-6 sm:gap-y-8">
          {mainCategories.map((item) => (
            <CategoryCard key={item.id} category={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

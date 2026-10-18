'use client';

import * as React from 'react';
import { Category } from '@/types/category';
import { useGetAllCategoriesQuery } from '@/services/api/categoryApi';
import { CategoryCard } from './CategoryCard';
import { SectionHeader } from '@/components/common/SectionHeader';

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
        <SectionHeader
          title="Explore Departments"
        />

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

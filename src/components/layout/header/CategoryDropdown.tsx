'use client';

import * as React from 'react';
import Link from 'next/link';
import { LayoutGrid, ChevronDown, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useGetAllCategoriesQuery } from '@/services/api/categoryApi';
import { CategoryItem } from './CategoryItem';
import { cn } from '@/lib/utils';

interface CategoryDropdownProps {
  className?: string;
}

export function CategoryDropdown({ className }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { data: categoriesRes } = useGetAllCategoriesQuery();
  const dbCategories = categoriesRes?.data;

  const categoriesList = React.useMemo(() => {
    if (Array.isArray(dbCategories) && dbCategories.length > 0) {
      return dbCategories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon || 'LayoutGrid',
        subcategories: (c.children || []).map((ch) => ch.name),
      }));
    }
    return siteConfig.categories;
  }, [dbCategories]);

  const [selectedCategorySlug, setSelectedCategorySlug] = React.useState<string | null>(null);
  const activeCategorySlug = selectedCategorySlug || categoriesList[0]?.slug || '';

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeCategory =
    categoriesList.find((c) => c.slug === activeCategorySlug) || categoriesList[0];

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex h-10 items-center gap-2.5 rounded-xl px-4 text-xs font-bold transition-all select-none shadow-xs active:scale-95 cursor-pointer',
          isOpen
            ? 'bg-primary text-primary-foreground shadow-primary/20'
            : 'bg-foreground text-background hover:opacity-90'
        )}
        aria-expanded={isOpen}
      >
        <LayoutGrid className="h-4 w-4" />
        <span>All Categories</span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform duration-200', {
            'rotate-180': isOpen,
          })}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 flex w-[680px] rounded-2xl border border-border bg-popover text-popover-foreground p-3 shadow-2xl animate-in fade-in-0 zoom-in-95">
          <div className="w-1/2 border-r border-border pr-3 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Department List
            </div>
            {categoriesList.map((cat) => (
              <div
                key={cat.id}
                onMouseEnter={() => setSelectedCategorySlug(cat.slug)}
              >
                <CategoryItem
                  category={cat}
                  isActive={activeCategorySlug === cat.slug}
                  onSelect={() => setIsOpen(false)}
                />
              </div>
            ))}
          </div>

          <div className="w-1/2 pl-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-border pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Featured in {activeCategory?.name}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-1.5">
                {activeCategory?.subcategories?.map((sub) => (
                  <Link
                    key={sub}
                    href={`/categories/${activeCategory.slug}?sub=${encodeURIComponent(sub)}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <span>{sub}</span>
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 hover:opacity-100 hover:translate-x-0 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-accent/60 p-3.5 border border-primary/20">
              <p className="text-xs font-bold text-foreground">Looking for custom deals?</p>
              <p className="text-[11px] text-muted-foreground">Save up to 40% on bulk department purchases.</p>
              <Link
                href={`/categories/${activeCategory?.slug}`}
                onClick={() => setIsOpen(false)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Browse All {activeCategory?.name}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

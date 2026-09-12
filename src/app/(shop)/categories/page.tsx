import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, LayoutGrid } from 'lucide-react';
import { getCategoriesFromDb } from '@/services/categoryService';
import { CategoryCard } from '@/components/home/CategoryCard';

export const metadata: Metadata = {
  title: 'All Categories | MUNIAMART',
  description: 'Explore all shopping departments and categories at MUNIAMART.',
};

export default async function AllCategoriesPage() {
  const categories = await getCategoriesFromDb();

  return (
    <div className="py-6 sm:py-8 lg:py-10 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
          <span className="font-bold text-foreground">Categories</span>
        </nav>

        <div className="border-b border-border pb-6 space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <LayoutGrid className="h-4 w-4" />
            <span>Explore MUNIAMART</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        <div className="pt-8 border-t border-border space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Department Hierarchy & Subcategories
            </h2>
            <p className="text-xs text-muted-foreground">
              Directly jump to specific sub-departments and specialized product
              categories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((dept) => (
              <div
                key={dept.id}
                className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={`/categories/${dept.slug}`}
                    className="group flex items-center gap-2.5 font-bold text-base text-foreground hover:text-primary transition-colors"
                  >
                    <span>{dept.name}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {dept.itemCount ? `${dept.itemCount} items` : 'Explore'}
                  </span>
                </div>

                {dept.children && dept.children.length > 0 ? (
                  <div className="space-y-1.5 pt-1 border-t border-border/60">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Subcategories ({dept.children.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dept.children.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/categories/${dept.slug}?sub=${sub.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors text-foreground/85 border border-border/50"
                        >
                          <span>{sub.name}</span>
                          {sub.itemCount ? (
                            <span className="text-[10px] text-muted-foreground">
                              ({sub.itemCount})
                            </span>
                          ) : null}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic pt-1 border-t border-border/60">
                    Direct department items
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

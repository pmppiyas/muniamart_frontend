import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ChevronRight, LayoutGrid } from 'lucide-react';
import { getCategoriesFromDb } from '@/services/categoryService';
import { CategoryCard } from '@/components/home/CategoryCard';
import { getCategoryIconPath } from '@/lib/categoryIcons';

export const metadata: Metadata = {
  title: 'Categories | MUNIAMART',
  description: 'Explore all shopping departments and main categories at MUNIAMART.',
};

export default async function AllCategoriesPage() {
  const dbCategories = await getCategoriesFromDb();

  // ONLY main root categories
  const mainCategories = dbCategories.filter((c) => !c.parentId);

  return (
    <div className="py-6 sm:py-8 lg:py-10 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
          <span className="font-bold text-foreground">Categories</span>
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3 border-b border-border/60 pb-3.5 sm:pb-4">
          <span className="w-1.5 h-6 sm:h-7 bg-primary rounded-full shrink-0" />
          <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight text-foreground">
            Explore Departments
          </h1>
        </div>

        {/* JUST Main icon categories in flat display */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-x-3 sm:gap-x-6 gap-y-6 sm:gap-y-8 pt-4">
          {mainCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Department Subcategory Direct Navigation */}
        {mainCategories.some((c) => c.children && c.children.length > 0) && (
          <div className="pt-8 border-t border-border/40 space-y-6">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              Subcategories by Department
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mainCategories.map((dept) => {
                const iconPath =
                  dept.imageUrl ||
                  getCategoryIconPath(dept.slug, dept.icon) ||
                  getCategoryIconPath(dept.name, dept.icon);

                return (
                  <div
                    key={dept.id}
                    className="p-4 rounded-xl border border-border/50 bg-card/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/categories/${dept.slug}`}
                        className="group flex items-center gap-2.5 font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors cursor-pointer"
                      >
                        {iconPath ? (
                          <div className="relative h-6 w-6 shrink-0">
                            <Image
                              src={iconPath}
                              alt={dept.name}
                              width={24}
                              height={24}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        ) : null}
                        <span>{dept.name}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                      </Link>

                      <Link
                        href={`/categories/${dept.slug}`}
                        className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                      >
                        View all
                      </Link>
                    </div>

                    {dept.children && dept.children.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/30">
                        {dept.children.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/categories/${dept.slug}?sub=${sub.slug}`}
                            className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors text-foreground cursor-pointer"
                          >
                            <span>{sub.name}</span>
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

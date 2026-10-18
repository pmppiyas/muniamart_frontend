'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Home, PackageX } from 'lucide-react';
import { Category } from '@/types/category';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/product/ProductCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { cn } from '@/lib/utils';

interface CategoryPageContentProps {
  category: Category;
  categoryProducts: Product[];
}

function findMatchingSubcategory(
  children: Category[] | undefined,
  subQuery: string | null | undefined
): Category | undefined {
  if (!children || !subQuery) return undefined;
  const decoded = decodeURIComponent(subQuery).trim().toLowerCase();
  return children.find((c) => {
    return (
      c.slug.toLowerCase() === decoded ||
      c.name.toLowerCase() === decoded ||
      c.slug.toLowerCase() === decoded.replace(/\s+/g, '-') ||
      c.id.toLowerCase() === decoded
    );
  });
}

function isProductInSubcategory(product: Product, subcategory: Category): boolean {
  if (product.categoryId === subcategory.id) return true;
  if (product.subcategoryId === subcategory.id) return true;
  if (product.subcategorySlug?.toLowerCase() === subcategory.slug.toLowerCase()) return true;
  if (product.category?.id === subcategory.id) return true;
  if (product.category?.slug?.toLowerCase() === subcategory.slug.toLowerCase()) return true;
  if (product.category?.name?.toLowerCase() === subcategory.name.toLowerCase()) return true;

  // Check child subcategories if subcategory has children (Level 3)
  if (subcategory.children && subcategory.children.length > 0) {
    return subcategory.children.some((child) => isProductInSubcategory(product, child));
  }
  return false;
}

export function CategoryPageContent({
  category,
  categoryProducts,
}: CategoryPageContentProps) {
  const searchParams = useSearchParams();
  const subQuery = searchParams.get('sub');

  const activeSubcategory = React.useMemo(() => {
    return findMatchingSubcategory(category.children, subQuery);
  }, [category.children, subQuery]);

  const hasSubcategories = Boolean(category.children && category.children.length > 0);

  // Force page to start from top on navigation
  React.useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch {
      window.scrollTo(0, 0);
    }

    const frameId = requestAnimationFrame(() => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } catch {
        window.scrollTo(0, 0);
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [category.slug, subQuery]);

  // Products matching active subcategory
  const activeSubcategoryProducts = React.useMemo(() => {
    if (!activeSubcategory) return [];
    return categoryProducts.filter((p) => isProductInSubcategory(p, activeSubcategory));
  }, [activeSubcategory, categoryProducts]);

  // Uncategorized products that don't match any child subcategory
  const uncategorizedProducts = React.useMemo(() => {
    if (!hasSubcategories) return [];
    return categoryProducts.filter((p) => {
      return !category.children!.some((sub) => isProductInSubcategory(p, sub));
    });
  }, [category.children, categoryProducts, hasSubcategories]);

  return (
    <div>
      {/* Compact Breadcrumb Navigation with Symmetric Vertical Spacing */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap py-4 sm:py-5"
      >
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
        <Link
          href={`/categories/${category.slug}`}
          className={cn(
            'hover:text-primary transition-colors capitalize font-medium cursor-pointer',
            !activeSubcategory ? 'text-primary font-bold' : 'text-muted-foreground'
          )}
        >
          {category.name}
        </Link>
        {activeSubcategory && (
          <>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <span className="font-bold text-primary capitalize">
              {activeSubcategory.name}
            </span>
          </>
        )}
      </nav>

      {/* Main Content Area */}
      {activeSubcategory ? (
        /* 1. Single Selected Subcategory View */
        <section className="space-y-4">
          <SectionHeader
            title={activeSubcategory.name}
            viewAllHref={`/categories/${category.slug}`}
            viewAllText={`All ${category.name}`}
          />
          {activeSubcategoryProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {activeSubcategoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border/70 bg-card/40">
              <PackageX className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-semibold text-foreground">
                No products found in {activeSubcategory.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                We are restocking our inventory. Check back soon or explore other departments.
              </p>
              <Link
                href={`/categories/${category.slug}`}
                className="mt-4 text-xs font-bold text-primary hover:underline"
              >
                Browse All {category.name}
              </Link>
            </div>
          )}
        </section>
      ) : hasSubcategories ? (
        /* 2. Subcategory Divided Layout (Homepage Style) */
        <div className="space-y-8 sm:space-y-12">
          {category.children!.map((sub) => {
            const subProducts = categoryProducts.filter((p) =>
              isProductInSubcategory(p, sub)
            );

            return (
              <section key={sub.id} className="space-y-4">
                <SectionHeader
                  title={sub.name}
                  viewAllHref={`/categories/${category.slug}?sub=${sub.slug}`}
                />
                {subProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {subProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-border/60 bg-card/30 text-xs text-muted-foreground">
                    <span>Products arriving soon for {sub.name}</span>
                    <Link
                      href={`/categories/${category.slug}?sub=${sub.slug}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      View Department
                    </Link>
                  </div>
                )}
              </section>
            );
          })}

          {/* Any products directly in parent without a subcategory */}
          {uncategorizedProducts.length > 0 && (
            <section className="space-y-4">
              <SectionHeader title={`More in ${category.name}`} />
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {uncategorizedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* 3. Flat Product Grid for Categories without Subcategories */
        <section className="space-y-4">
          <SectionHeader title={category.name} />
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border/70 bg-card/40">
              <PackageX className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-semibold text-foreground">
                No products found in {category.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                We are restocking our inventory. Check back soon!
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

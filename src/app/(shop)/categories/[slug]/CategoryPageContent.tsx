'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Category } from '@/types/category';
import { Product } from '@/types/product';
import { CategoryHero } from '@/components/category/CategoryHero';
import { SubCategoryList } from '@/components/category/SubCategoryList';
import { CategoryProducts } from '@/components/category/CategoryProducts';
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

export function CategoryPageContent({
  category,
  categoryProducts,
}: CategoryPageContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const subQuery = searchParams.get('sub');

  const activeSubcategory = React.useMemo(() => {
    return findMatchingSubcategory(category.children, subQuery);
  }, [category.children, subQuery]);

  const selectedSubcategorySlug = activeSubcategory?.slug || null;

  const subcategoryFilteredCount = React.useMemo(() => {
    if (!activeSubcategory) return categoryProducts.length;
    return categoryProducts.filter((p) => {
      const pSlug = p.subcategorySlug?.toLowerCase();
      const targetSlug = activeSubcategory.slug.toLowerCase();
      return (
        pSlug === targetSlug ||
        p.subcategoryId === activeSubcategory.id ||
        pSlug === activeSubcategory.name.toLowerCase().replace(/\s+/g, '-')
      );
    }).length;
  }, [activeSubcategory, categoryProducts]);

  const handleSelectSubcategory = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      const targetSub = category.children?.find(
        (c) =>
          c.slug.toLowerCase() === slug.toLowerCase() ||
          c.name.toLowerCase() === slug.toLowerCase()
      );
      params.set('sub', targetSub?.slug || slug);
    } else {
      params.delete('sub');
    }
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap"
      >
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-primary transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
        <Link
          href="/categories"
          className="hover:text-primary transition-colors"
        >
          Categories
        </Link>
        <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
        <Link
          href={`/categories/${category.slug}`}
          className={cn(
            'hover:text-primary transition-colors capitalize font-medium',
            !activeSubcategory ? 'text-primary font-bold' : 'text-muted-foreground'
          )}
          onClick={() => handleSelectSubcategory(null)}
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

      <CategoryHero
        category={category}
        totalProducts={subcategoryFilteredCount}
        activeSubcategory={activeSubcategory}
      />

      {category.children && category.children.length > 0 && (
        <SubCategoryList
          subcategories={category.children}
          products={categoryProducts}
          selectedSubcategory={selectedSubcategorySlug}
          onSelectSubcategory={handleSelectSubcategory}
          categoryName={category.name}
        />
      )}

      <CategoryProducts
        category={category}
        initialProducts={categoryProducts}
        selectedSubcategory={selectedSubcategorySlug}
        onSelectSubcategory={handleSelectSubcategory}
      />
    </div>
  );
}

'use client';

import * as React from 'react';
import { SlidersHorizontal, RotateCcw, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, ProductFilterState, ViewMode } from '@/types/product';
import { Category } from '@/types/category';
import { ProductToolbar } from '@/components/product/ProductToolbar';
import { ProductGrid } from '@/components/product/ProductGrid';
import { PriceFilter } from '@/components/product/PriceFilter';
import { BrandFilter } from '@/components/product/BrandFilter';
import { RatingFilter } from '@/components/product/RatingFilter';
import { cn } from '@/lib/utils';

interface CategoryProductsProps {
  category: Category;
  initialProducts: Product[];
  selectedSubcategory?: string | null;
  onSelectSubcategory?: (slug: string | null) => void;
  className?: string;
}

const ITEMS_PER_PAGE = 30;

export function CategoryProducts({
  category,
  initialProducts = [],
  selectedSubcategory,
  onSelectSubcategory,
  className,
}: CategoryProductsProps) {
  const [filters, setFilters] = React.useState<ProductFilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 2000],
    minRating: 0,
    inStockOnly: false,
    sortBy: 'featured',
  });

  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

  const availableBrands = React.useMemo(() => {
    const brandMap = new Map<string, number>();
    initialProducts.forEach((p) => {
      if (p.brand) {
        brandMap.set(p.brand, (brandMap.get(p.brand) || 0) + 1);
      }
    });

    return Array.from(brandMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [initialProducts]);

  const subcategoryCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    initialProducts.forEach((p) => {
      if (p.subcategorySlug) {
        map.set(p.subcategorySlug, (map.get(p.subcategorySlug) || 0) + 1);
      }
    });
    return map;
  }, [initialProducts]);

  const filteredProducts = React.useMemo(() => {
    let result = [...initialProducts];

    if (selectedSubcategory) {
      const activeChild = category.children?.find(
        (c) =>
          c.slug.toLowerCase() === selectedSubcategory.toLowerCase() ||
          c.name.toLowerCase() === selectedSubcategory.toLowerCase() ||
          c.id.toLowerCase() === selectedSubcategory.toLowerCase()
      );

      result = result.filter((p) => {
        if (!p.subcategorySlug && !p.subcategoryId) return false;
        const pSlug = p.subcategorySlug?.toLowerCase();
        const targetSlug = selectedSubcategory.toLowerCase();
        return (
          pSlug === targetSlug ||
          p.subcategoryId === selectedSubcategory ||
          (activeChild && (
            pSlug === activeChild.slug.toLowerCase() ||
            pSlug === activeChild.name.toLowerCase().replace(/\s+/g, '-') ||
            p.subcategoryId === activeChild.id
          ))
        );
      });
    }

    if (filters.brands.length > 0) {
      result = result.filter((p) => p.brand && filters.brands.includes(p.brand));
    }

    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.minRating > 0) {
      result = result.filter((p) => (p.rating || 0) >= filters.minRating);
    }

    if (filters.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [initialProducts, selectedSubcategory, filters]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 2000],
      minRating: 0,
      inStockOnly: false,
      sortBy: 'featured',
    });
    if (onSelectSubcategory) onSelectSubcategory(null);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: ProductFilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 2000 ||
    filters.minRating > 0 ||
    filters.inStockOnly ||
    !!selectedSubcategory;

  const handleToggleBrand = (brandName: string) => {
    const nextBrands = filters.brands.includes(brandName)
      ? filters.brands.filter((b) => b !== brandName)
      : [...filters.brands, brandName];

    handleFilterChange({ ...filters, brands: nextBrands });
  };

  const renderFilterSidebar = (isMobile = false) => (
    <aside className={cn('flex flex-col', isMobile ? 'space-y-6' : 'h-full')}>
      {!isMobile && (
        <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-card shrink-0 select-none">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Filter {category.name}</h2>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All</span>
            </button>
          )}
        </div>
      )}

      <div
        className={cn(
          'space-y-6',
          !isMobile && 'flex-1 overflow-y-auto overscroll-contain p-5 pr-3'
        )}
      >
        {category.children && category.children.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Subcategories
            </h3>
          <div className="space-y-1 pt-1">
            <button
              type="button"
              onClick={() => onSelectSubcategory && onSelectSubcategory(null)}
              className={cn(
                'flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors',
                !selectedSubcategory
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-foreground/80 hover:bg-muted'
              )}
            >
              <span>All in {category.name}</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                ({initialProducts.length})
              </span>
            </button>
            {category.children.map((sub) => {
              const isSelected =
                !!selectedSubcategory &&
                (selectedSubcategory.toLowerCase() === sub.slug.toLowerCase() ||
                  selectedSubcategory.toLowerCase() === sub.name.toLowerCase());
              const count = subcategoryCounts.get(sub.slug) || 0;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() =>
                    onSelectSubcategory &&
                    onSelectSubcategory(isSelected ? null : sub.slug)
                  }
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors',
                    isSelected
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-foreground/80 hover:bg-muted'
                  )}
                >
                  <span>{sub.name}</span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
          <div className="border-t border-border pt-2" />
        </div>
      )}

      <PriceFilter
        priceRange={filters.priceRange}
        onPriceChange={(priceRange) => handleFilterChange({ ...filters, priceRange })}
      />

      <div className="border-t border-border" />

      {availableBrands.length > 0 && (
        <>
          <BrandFilter
            availableBrands={availableBrands}
            selectedBrands={filters.brands}
            onToggleBrand={handleToggleBrand}
          />
          <div className="border-t border-border" />
        </>
      )}

      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Availability
        </h3>
        <label className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium cursor-pointer hover:bg-muted transition-colors">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={() =>
              handleFilterChange({ ...filters, inStockOnly: !filters.inStockOnly })
            }
            className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary/20 accent-blue-600"
          />
          <span className="text-foreground">In Stock Only</span>
        </label>
      </div>

      <div className="border-t border-border" />

      <RatingFilter
        minRating={filters.minRating}
        onRatingChange={(minRating) => handleFilterChange({ ...filters, minRating })}
      />
      </div>

      {isMobile && (
        <div className="pt-4 sticky bottom-0 bg-background border-t border-border pb-2">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(false)}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-hover active:scale-98 transition-all cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      )}
    </aside>
  );

  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="hidden lg:flex lg:flex-col lg:col-span-3 rounded-2xl border border-border bg-card shadow-2xs sticky top-[176px] h-[calc(100vh-196px)] max-h-[calc(100vh-196px)] overflow-hidden">
          {renderFilterSidebar(false)}
        </div>

        <div className="lg:col-span-9 space-y-5">
          <ProductToolbar
            totalCount={initialProducts.length}
            filteredCount={filteredProducts.length}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
          />

          <ProductGrid
            products={paginatedProducts}
            viewMode={viewMode}
            onResetFilters={handleResetFilters}
          />

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6 mt-8">
              <p className="text-xs text-muted-foreground">
                Page <span className="font-bold text-foreground">{currentPage}</span> of{' '}
                <span className="font-bold text-foreground">{totalPages}</span>
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                  className="flex h-9 items-center gap-1 rounded-xl border border-border bg-card px-3 text-xs font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = pageNum === currentPage;

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'border border-border bg-card text-foreground hover:bg-muted'
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                  className="flex h-9 items-center gap-1 rounded-xl border border-border bg-card px-3 text-xs font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="relative z-50 ml-auto flex h-full w-full max-w-xs flex-col bg-background text-foreground shadow-2xl p-5 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h2 className="text-base font-bold text-foreground">Filter {category.name}</h2>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {renderFilterSidebar(true)}
          </div>
        </div>
      )}
    </div>
  );
}

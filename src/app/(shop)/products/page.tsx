'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronRight, Home, X, ChevronLeft } from 'lucide-react';
import mockData from '@/data/mockData.json';
import { Product, ProductFilterState, ProductSortOption, ViewMode } from '@/types/product';
import { Category } from '@/types/category';
import { ProductFilter } from '@/components/product/ProductFilter';
import { ProductToolbar } from '@/components/product/ProductToolbar';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useGetAllProductsQuery } from '@/services/api/productApi';
import { useGetAllCategoriesQuery } from '@/services/api/categoryApi';
import { cn } from '@/lib/utils';

const INITIAL_FILTERS: ProductFilterState = {
  categories: [],
  brands: [],
  priceRange: [0, 2000],
  minRating: 0,
  inStockOnly: false,
  sortBy: 'featured',
};

const ITEMS_PER_PAGE = 30;

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: dbProductsRes, isLoading: isProductsLoading } = useGetAllProductsQuery();
  const { data: dbCategoriesRes } = useGetAllCategoriesQuery();

  const allProducts = React.useMemo(() => {
    if (dbProductsRes?.data && Array.isArray(dbProductsRes.data) && dbProductsRes.data.length > 0) {
      const mockMap = new Map((mockData.products as any[]).map((p) => [p.id, p]));
      return dbProductsRes.data.map((dbP: any) => {
        const mock = mockMap.get(dbP.id) || mockMap.get(dbP.sku) || {};
        const priceNum = typeof dbP.price === 'string' ? parseFloat(dbP.price) : Number(dbP.price || 0);
        return {
          ...mock,
          id: dbP.id,
          sku: dbP.sku,
          name: dbP.name,
          description: dbP.description ?? mock.description ?? null,
          photoUrl: dbP.photoUrl || mock.photoUrl || null,
          images: dbP.photoUrl
            ? [dbP.photoUrl, ...(mock.images || []).filter((img: string) => img !== dbP.photoUrl)]
            : mock.images || [],
          price: priceNum,
          stock: Number(dbP.stock ?? mock.stock ?? 0),
          status: dbP.status || 'ACTIVE',
          categoryId: dbP.categoryId,
          category: dbP.category || mock.category,
          subcategoryId: dbP.subcategoryId || mock.subcategoryId,
          subcategorySlug: dbP.subcategorySlug || mock.subcategorySlug,
          brand: mock.brand || dbP.brand || 'Muniamart',
          rating: mock.rating ?? 4.8,
          reviewsCount: mock.reviewsCount ?? 120,
          isFeatured: mock.isFeatured ?? true,
          isNew: mock.isNew ?? false,
          isBestSeller: mock.isBestSeller ?? false,
          discountPercent: mock.discountPercent,
          originalPrice: mock.originalPrice,
          createdAt: dbP.createdAt || mock.createdAt || new Date().toISOString(),
          updatedAt: dbP.updatedAt || mock.updatedAt || new Date().toISOString(),
        } as Product;
      });
    }
    return mockData.products as unknown as Product[];
  }, [dbProductsRes]);

  const allCategories = React.useMemo(() => {
    if (dbCategoriesRes?.data && Array.isArray(dbCategoriesRes.data) && dbCategoriesRes.data.length > 0) {
      const mockCatMap = new Map((mockData.categories as any[]).map((c) => [c.id, c]));
      return dbCategoriesRes.data.map((dbC: any) => {
        const mock = mockCatMap.get(dbC.id) || mockData.categories.find((c) => c.slug === dbC.slug);
        return {
          ...dbC,
          icon: dbC.icon || mock?.icon || 'LayoutGrid',
          imageUrl: dbC.imageUrl || mock?.imageUrl,
          description: dbC.description || mock?.description,
          subcategories: (dbC.children || []).map((ch: any) => ch.name),
        } as unknown as Category;
      });
    }
    return mockData.categories as Category[];
  }, [dbCategoriesRes]);

  const availableBrands = React.useMemo(() => {
    const brandMap = new Map<string, number>();
    allProducts.forEach((p) => {
      if (p.brand) {
        brandMap.set(p.brand, (brandMap.get(p.brand) || 0) + 1);
      }
    });

    return Array.from(brandMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [allProducts]);

  const categoriesWithRealCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    allProducts.forEach((p) => {
      if (p.categoryId) {
        counts.set(p.categoryId, (counts.get(p.categoryId) || 0) + 1);
      }
      if (p.category?.slug) {
        counts.set(p.category.slug, (counts.get(p.category.slug) || 0) + 1);
      }
    });

    return allCategories.map((c) => ({
      ...c,
      itemCount: counts.get(c.id) || counts.get(c.slug) || 0,
    }));
  }, [allCategories, allProducts]);

  const isDealPage = searchParams.get('deal') === 'true';
  const sortParam = searchParams.get('sort');
  const isNewestPage = sortParam === 'newest';

  const [filters, setFilters] = React.useState<ProductFilterState>(() => {
    const categoryParam = searchParams.get('category');
    const qParam = searchParams.get('q');
    const sort = searchParams.get('sort') as ProductSortOption | null;

    return {
      ...INITIAL_FILTERS,
      categories: categoryParam ? [categoryParam] : [],
      search: qParam || '',
      sortBy: sort || 'featured',
    };
  });

  React.useEffect(() => {
    const categoryParam = searchParams.get('category');
    const qParam = searchParams.get('q');
    const sort = searchParams.get('sort') as ProductSortOption | null;

    setFilters({
      ...INITIAL_FILTERS,
      categories: categoryParam ? [categoryParam] : [],
      search: qParam || '',
      sortBy: sort || 'featured',
    });
    setCurrentPage(1);
  }, [searchParams]);

  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

  const filteredProducts = React.useMemo(() => {
    let result = [...allProducts];

    if (isDealPage) {
      result = result.filter(
        (p) =>
          (p.discountPercent !== undefined && p.discountPercent > 0) ||
          (p.originalPrice !== undefined && p.originalPrice > p.price)
      );
    }

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter(
        (p) =>
          filters.categories.includes(p.categoryId) ||
          (p.category?.slug && filters.categories.includes(p.category.slug))
      );
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
  }, [allProducts, filters]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
    router.replace('/products');
  };

  const handleFilterChange = (newFilters: ProductFilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

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
          <Link
            href="/products"
            className={cn(
              'hover:text-primary transition-colors font-medium',
              !isDealPage && !isNewestPage && filters.categories.length === 0
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground'
            )}
          >
            Shop
          </Link>
          {isDealPage && (
            <>
              <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
              <span className="text-primary font-bold">
                Deals &amp; Offers
              </span>
            </>
          )}
          {isNewestPage && !isDealPage && (
            <>
              <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
              <span className="text-primary font-bold">
                New Arrivals
              </span>
            </>
          )}
          {filters.categories.length === 1 && (
            <>
              <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
              <span className="capitalize text-primary font-bold">
                {allCategories.find((c) => c.slug === filters.categories[0])?.name ||
                  filters.categories[0]}
              </span>
            </>
          )}
        </nav>

        <div className="border-b border-border pb-5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
            {isDealPage
              ? 'Hot Deals & Special Offers'
              : isNewestPage
              ? 'New Arrivals'
              : 'All Products'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {isDealPage
              ? 'Grab limited-time discounts and exclusive promotional offers on premium items.'
              : isNewestPage
              ? 'Explore our freshest arrivals, latest releases, and newest product launches.'
              : 'Browse our complete catalog of verified electronics, fashion, and home lifestyle essentials.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="hidden lg:flex lg:flex-col lg:col-span-3 rounded-2xl border border-border bg-card shadow-2xs sticky top-[176px] h-[calc(100vh-196px)] max-h-[calc(100vh-196px)] overflow-hidden">
            <ProductFilter
              categories={categoriesWithRealCounts}
              availableBrands={availableBrands}
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </div>

          <div className="lg:col-span-9 space-y-5">
            <ProductToolbar
              totalCount={allProducts.length}
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
      </div>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="relative z-50 ml-auto flex h-full w-full max-w-xs flex-col bg-background text-foreground shadow-2xl p-5 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h2 className="text-base font-bold text-foreground">Filter Products</h2>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ProductFilter
              categories={categoriesWithRealCounts}
              availableBrands={availableBrands}
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              isMobileDrawer
              onCloseMobileDrawer={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ProductsPageInner() {
  const searchParams = useSearchParams();
  return <ProductsContent key={searchParams.toString()} />;
}

export default function ProductsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductsPageInner />
    </React.Suspense>
  );
}

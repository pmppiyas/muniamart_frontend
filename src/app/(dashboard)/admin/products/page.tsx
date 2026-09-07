'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  ProductsHeader,
  ProductsFilterBar,
  ProductsTable,
  ProductViewModal,
  ProductEditModal,
  ProductDeleteDialog,
  ProductCreateModal,
} from '@/components/admin/products';
import { useGetAllProductsQuery } from '@/services/api/productApi';
import { useGetAllCategoriesQuery } from '@/services/api/categoryApi';
import { Product } from '@/types/product';

export default function AdminProductsPage() {
  // 1. Pagination & Filter States
  const [page, setPage] = React.useState(1);
  const limit = 30; // 30 items per page as requested

  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('ALL');
  const [selectedStockStatus, setSelectedStockStatus] = React.useState('ALL');
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setPage(1);
  };

  const handleStockStatusChange = (val: string) => {
    setSelectedStockStatus(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedCategory('ALL');
    setSelectedStockStatus('ALL');
    setSelectedStatus('ALL');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedCategory !== 'ALL' ||
    selectedStockStatus !== 'ALL' ||
    selectedStatus !== 'ALL'
  );

  const {
    data: productsData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetAllProductsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    categoryId: selectedCategory !== 'ALL' ? selectedCategory : undefined,
    status: selectedStatus,
    stockStatus:
      selectedStockStatus !== 'ALL' ? selectedStockStatus : undefined,
  });

  const { data: categoriesData } = useGetAllCategoriesQuery();
  const categories = categoriesData?.data || [];

  const products = (productsData?.data as Product[]) || [];
  const meta = productsData?.meta;

  const [selectedProductForView, setSelectedProductForView] =
    React.useState<Product | null>(null);
  const [selectedProductForEdit, setSelectedProductForEdit] =
    React.useState<Product | null>(null);
  const [selectedProductForDelete, setSelectedProductForDelete] =
    React.useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const handleExportCSV = () => {
    if (products.length === 0) {
      toast.info('No products available to export');
      return;
    }

    const headers = [
      'ID',
      'Name',
      'SKU',
      'Category',
      'Price',
      'Stock',
      'Status',
    ];
    const rows = products.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      `"${p.category?.name || 'Uncategorized'}"`,
      p.price,
      p.stock,
      p.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `products_p${page}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${products.length} products to CSV`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Reusable Header with Action Buttons */}
      <ProductsHeader
        totalCount={meta?.total ?? products.length}
        isFetching={isFetching}
        onRefresh={() => refetch()}
        onExport={handleExportCSV}
        onAddProduct={() => setIsCreateModalOpen(true)}
      />

      {/* Backend Filter and Search Bar */}
      <ProductsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        selectedStockStatus={selectedStockStatus}
        onStockStatusChange={handleStockStatusChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        onReset={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Products Table with Server Pagination & Meta */}
      <ProductsTable
        products={products}
        meta={meta}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={() => refetch()}
        isFiltering={hasActiveFilters}
        onClearFilters={handleClearFilters}
        onAddProduct={() => setIsCreateModalOpen(true)}
        onView={setSelectedProductForView}
        onEdit={setSelectedProductForEdit}
        onDelete={setSelectedProductForDelete}
        onPageChange={setPage}
      />

      {/* Modals & Dialogs */}
      <ProductViewModal
        product={selectedProductForView}
        isOpen={!!selectedProductForView}
        onClose={() => setSelectedProductForView(null)}
        onEdit={(prod) => {
          setSelectedProductForView(null);
          setSelectedProductForEdit(prod);
        }}
      />

      <ProductEditModal
        product={selectedProductForEdit}
        isOpen={!!selectedProductForEdit}
        onClose={() => setSelectedProductForEdit(null)}
      />

      <ProductDeleteDialog
        product={selectedProductForDelete}
        isOpen={!!selectedProductForDelete}
        onClose={() => setSelectedProductForDelete(null)}
      />

      <ProductCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

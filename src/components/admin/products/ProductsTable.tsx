'use client';

import * as React from 'react';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ProductTableRow } from './ProductTableRow';
import { ProductsTableSkeleton } from './ProductsTableSkeleton';
import { ProductsEmptyState } from './ProductsEmptyState';
import { Product } from '@/types/product';
import { ApiMeta } from '@/features/auth/authTypes';

interface ProductsTableProps {
  products: Product[];
  meta?: ApiMeta;
  isLoading: boolean;
  isFetching?: boolean;
  error?: any;
  onRetry: () => void;
  isFiltering: boolean;
  onClearFilters: () => void;
  onAddProduct: () => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onPageChange: (newPage: number) => void;
}

export function ProductsTable({
  products,
  meta,
  isLoading,
  isFetching,
  error,
  onRetry,
  isFiltering,
  onClearFilters,
  onAddProduct,
  onView,
  onEdit,
  onDelete,
  onPageChange,
}: ProductsTableProps) {
  const currentPage = meta?.page || 1;
  const limit = meta?.limit || 30;
  const total = meta?.total ?? products.length;
  const totalPage = meta?.totalPage || Math.max(1, Math.ceil(total / limit));

  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-2xs overflow-hidden">
      {isLoading ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[300px]">Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <ProductsTableSkeleton rows={5} />
          </TableBody>
        </Table>
      ) : error ? (
        <div className="p-12 text-center space-y-3">
          <AlertCircle className="h-8 w-8 mx-auto text-destructive opacity-80" />
          <p className="text-sm font-medium text-destructive">Failed to load products from server</p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      ) : products.length === 0 ? (
        <ProductsEmptyState
          isFiltering={isFiltering}
          onClearFilters={onClearFilters}
          onAddProduct={onAddProduct}
        />
      ) : (
        <>
          <div className="relative">
            {isFetching && (
              <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px] z-10 flex items-center justify-center transition-opacity" />
            )}
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[300px]">Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <ProductTableRow
                    key={product.id}
                    product={product}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination & Meta Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <div>
              Showing <strong className="text-foreground">{startItem}</strong> to{' '}
              <strong className="text-foreground">{endItem}</strong> of{' '}
              <strong className="text-foreground">{total}</strong> products (Limit {limit}/page)
            </div>

            {/* Pagination Controls */}
            {totalPage > 1 && (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || isFetching}
                  className="h-8 px-2.5 text-xs rounded-lg cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  Previous
                </Button>

                <div className="px-2 font-medium text-foreground text-xs">
                  Page {currentPage} of {totalPage}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPage || isFetching}
                  className="h-8 px-2.5 text-xs rounded-lg cursor-pointer"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

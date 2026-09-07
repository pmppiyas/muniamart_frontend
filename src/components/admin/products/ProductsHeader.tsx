'use client';

import * as React from 'react';
import { Plus, RefreshCw, Download } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductsHeaderProps {
  totalCount: number;
  isFetching: boolean;
  onRefresh: () => void;
  onExport: () => void;
  onAddProduct: () => void;
}

export function ProductsHeader({
  totalCount,
  isFetching,
  onRefresh,
  onExport,
  onAddProduct,
}: ProductsHeaderProps) {
  return (
    <AdminPageHeader
      title="Products"
      badge={
        <Badge variant="secondary" className="font-mono text-xs">
          {totalCount} Total
        </Badge>
      }
      description="Manage your product catalog, prices, categories, and inventory stock."
      breadcrumbs={[{ label: 'Products' }]}
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="rounded-xl text-xs font-semibold shadow-2xs cursor-pointer"
            title="Refresh Products"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="rounded-xl text-xs font-semibold shadow-2xs cursor-pointer"
            title="Export to CSV"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>

          <Button
            size="sm"
            onClick={onAddProduct}
            className="rounded-xl text-xs font-bold shadow-sm cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Product
          </Button>
        </>
      }
    />
  );
}

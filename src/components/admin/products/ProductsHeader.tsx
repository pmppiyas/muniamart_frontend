'use client';

import * as React from 'react';
import {
  Package,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  RefreshCw,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatsGroup, AdminStatItem } from '@/components/admin/AdminStatsGroup';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductsHeaderProps {
  totalCount: number;
  products?: Product[];
  isFetching: boolean;
  onRefresh: () => void;
  onExport: () => void;
  onAddProduct: () => void;
}

export function ProductsHeader({
  totalCount,
  products = [],
  isFetching,
  onRefresh,
  onExport,
  onAddProduct,
}: ProductsHeaderProps) {
  const activeCount = products.filter((p) => p.status === 'ACTIVE').length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const stats: AdminStatItem[] = [
    {
      title: 'Total Products',
      value: totalCount,
      icon: Package,
      color: 'primary',
      badge: 'Catalog',
    },
    {
      title: 'Active Products',
      value: activeCount,
      icon: CheckCircle2,
      color: 'emerald',
      badge: 'In Store',
    },
    {
      title: 'Low Stock Items',
      value: lowStockCount,
      icon: AlertCircle,
      color: 'amber',
      badge: 'Stock <= 5',
    },
    {
      title: 'Out of Stock',
      value: outOfStockCount,
      icon: XCircle,
      color: 'rose',
      badge: 'Needs Restock',
    },
  ];

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Products"
        description="Manage and organize your store catalog, pricing and stock inventory."
        breadcrumbs={[{ label: 'Products' }]}
        badge={
          <Badge
            variant="outline"
            className="bg-primary/5 text-primary border-primary/20 text-xs px-2.5 py-0.5"
          >
            {totalCount} Total
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching}
              className="h-9 gap-2 text-xs"
            >
              <RefreshCw
                className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="h-9 gap-2 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onAddProduct}
              className="h-9 gap-2 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Product
            </Button>
          </div>
        }
      />

      <AdminStatsGroup stats={stats} />
    </div>
  );
}

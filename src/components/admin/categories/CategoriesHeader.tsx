'use client';

import * as React from 'react';
import {
  Layers,
  FolderTree,
  Tag,
  Sparkles,
  Plus,
  RefreshCw,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatsGroup, AdminStatItem } from '@/components/admin/AdminStatsGroup';
import { Category } from '@/types/category';
import { cn } from '@/lib/utils';

interface CategoriesHeaderProps {
  totalCount: number;
  categories?: Category[];
  isFetching: boolean;
  onRefresh: () => void;
  onExport: () => void;
  onAddCategory: () => void;
}

export function CategoriesHeader({
  totalCount,
  categories = [],
  isFetching,
  onRefresh,
  onExport,
  onAddCategory,
}: CategoriesHeaderProps) {
  const rootCount = categories.filter((c) => !c.parentId).length;
  const subCount = categories.filter((c) => Boolean(c.parentId)).length;
  const withProductsCount = categories.reduce(
    (acc, c) => acc + (c._count?.products || 0),
    0
  );

  const stats: AdminStatItem[] = [
    {
      title: 'Total Categories',
      value: totalCount,
      icon: Layers,
      color: 'primary',
      badge: 'All Groups',
    },
    {
      title: 'Parent Categories',
      value: rootCount,
      icon: FolderTree,
      color: 'emerald',
      badge: 'Main Level',
    },
    {
      title: 'Subcategories',
      value: subCount,
      icon: Tag,
      color: 'blue',
      badge: 'Nested Level',
    },
    {
      title: 'Assigned Products',
      value: withProductsCount,
      icon: Sparkles,
      color: 'purple',
      badge: 'Total Items',
    },
  ];

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Categories"
        description="Manage hierarchical store catalog, parent categories and subcategories."
        breadcrumbs={[{ label: 'Categories' }]}
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
              onClick={onAddCategory}
              className="h-9 gap-2 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Category
            </Button>
          </div>
        }
      />

      {/* Shared Soft Colorful Metrics Row */}
      <AdminStatsGroup stats={stats} />
    </div>
  );
}

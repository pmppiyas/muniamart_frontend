'use client';

import * as React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  ShoppingBag,
  RefreshCw,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatsGroup, AdminStatItem } from '@/components/admin/AdminStatsGroup';
import { CustomerMetrics } from '@/types/customer';
import { cn } from '@/lib/utils';

interface CustomersHeaderProps {
  totalCount: number;
  metrics?: CustomerMetrics;
  isFetching: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

export function CustomersHeader({
  totalCount,
  metrics,
  isFetching,
  onRefresh,
  onExport,
}: CustomersHeaderProps) {
  const stats: AdminStatItem[] = [
    {
      title: 'Total Customers',
      value: metrics?.totalCustomers ?? totalCount,
      icon: Users,
      color: 'primary',
      badge: 'Registered',
    },
    {
      title: 'Active Accounts',
      value: metrics?.activeCount ?? 0,
      icon: UserCheck,
      color: 'emerald',
      badge: 'Active',
    },
    {
      title: 'Inactive / Blocked',
      value: (metrics?.inactiveCount ?? 0) + (metrics?.blockedCount ?? 0),
      icon: UserX,
      color: 'amber',
      badge: 'Restricted',
    },
    {
      title: 'Total Customer Orders',
      value: metrics?.totalOrdersCount ?? 0,
      icon: ShoppingBag,
      color: 'blue',
      badge: 'Lifetime',
    },
  ];

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Customers"
        description="View registered customers, their lifetime orders, and status-wise order breakdown."
        breadcrumbs={[{ label: 'Customers' }]}
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
              variant="default"
              size="sm"
              onClick={onExport}
              className="h-9 gap-2 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Shared Soft Colorful Metrics Row */}
      <AdminStatsGroup stats={stats} />
    </div>
  );
}

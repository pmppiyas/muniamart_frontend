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
  const cards = [
    {
      title: 'Total Customers',
      value: metrics?.totalCustomers ?? totalCount,
      icon: Users,
      color: 'text-primary bg-primary/10',
      badge: 'Registered',
    },
    {
      title: 'Active Accounts',
      value: metrics?.activeCount ?? 0,
      icon: UserCheck,
      color: 'text-emerald-500 bg-emerald-500/10',
      badge: 'Active',
    },
    {
      title: 'Inactive / Blocked',
      value: (metrics?.inactiveCount ?? 0) + (metrics?.blockedCount ?? 0),
      icon: UserX,
      color: 'text-amber-500 bg-amber-500/10',
      badge: 'Restricted',
    },
    {
      title: 'Total Customer Orders',
      value: metrics?.totalOrdersCount ?? 0,
      icon: ShoppingBag,
      color: 'text-blue-500 bg-blue-500/10',
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

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-border/80 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {card.title}
                </span>
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg',
                    card.color
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {card.value.toLocaleString()}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {card.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

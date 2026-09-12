'use client';

import * as React from 'react';
import {
  RefreshCw,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatsGroup, AdminStatItem } from '@/components/admin/AdminStatsGroup';
import { OrderMetrics } from '@/types/order';
import { cn } from '@/lib/utils';

interface OrdersHeaderProps {
  totalCount: number;
  metrics?: OrderMetrics;
  selectedStatus: string;
  onStatusSelect: (status: string) => void;
  isFetching: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

export function OrdersHeader({
  totalCount,
  metrics,
  selectedStatus,
  onStatusSelect,
  isFetching,
  onRefresh,
  onExport,
}: OrdersHeaderProps) {
  const stats: AdminStatItem[] = [
    {
      title: 'Total Orders',
      value: metrics?.total ?? totalCount,
      icon: ShoppingBag,
      color: 'primary',
      badge: 'Lifetime',
    },
    {
      title: 'Pending Orders',
      value: metrics?.pending ?? 0,
      icon: Clock,
      color: 'amber',
      badge: 'Needs Action',
    },
    {
      title: 'In Progress / Delivery',
      value: (metrics?.confirmed ?? 0) + (metrics?.inProgress ?? 0),
      icon: Truck,
      color: 'sky',
      badge: 'Active Flow',
    },
    {
      title: 'Delivered Orders',
      value: metrics?.delivered ?? 0,
      icon: CheckCircle2,
      color: 'emerald',
      badge: 'Completed',
    },
  ];

  const statusTabs = [
    {
      id: 'ALL',
      label: 'All Orders',
      count: metrics?.total ?? totalCount,
      color: 'hover:border-foreground/40',
      activeColor: 'bg-primary text-primary-foreground border-primary',
    },
    {
      id: 'PENDING',
      label: 'Pending',
      count: metrics?.pending ?? 0,
      icon: Clock,
      color:
        'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      activeColor: 'bg-amber-600 text-white border-amber-600',
    },
    {
      id: 'CONFIRMED',
      label: 'Confirmed',
      count: metrics?.confirmed ?? 0,
      icon: CheckCircle2,
      color:
        'text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
      activeColor: 'bg-emerald-600 text-white border-emerald-600',
    },
    {
      id: 'DELIVERY_IN_PROGRESS',
      label: 'Out for Delivery',
      count: metrics?.inProgress ?? 0,
      icon: Truck,
      color: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
      activeColor: 'bg-sky-600 text-white border-sky-600',
    },
    {
      id: 'DELIVERED',
      label: 'Delivered',
      count: metrics?.delivered ?? 0,
      icon: CheckCircle2,
      color:
        'text-green-700 dark:text-green-300 bg-green-500/15 border-green-500/30',
      activeColor: 'bg-green-600 text-white border-green-600',
    },
    {
      id: 'CANCELED',
      label: 'Canceled',
      count: metrics?.canceled ?? 0,
      icon: XCircle,
      color:
        'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
      activeColor: 'bg-rose-600 text-white border-rose-600',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Reusable AdminPageHeader with Breadcrumbs, Badge, and Action Buttons */}
      <AdminPageHeader
        title="Orders"
        description="Monitor incoming orders, track customer shipments, and manage fulfillment workflow."
        breadcrumbs={[{ label: 'Orders' }]}
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

      {/* Interactive Status Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {statusTabs.map((tab) => {
          const isActive = selectedStatus === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusSelect(tab.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer select-none',
                isActive
                  ? tab.activeColor
                  : cn(
                      'bg-card text-muted-foreground border-border/80 hover:text-foreground',
                      tab.color
                    )
              )}
            >
              {tab.icon && <tab.icon className="h-3.5 w-3.5 shrink-0" />}
              <span>{tab.label}</span>
              <span
                className={cn(
                  'rounded-md px-1.5 py-0.2 text-[10px] font-mono font-bold',
                  isActive
                    ? 'bg-white/25 text-white'
                    : 'bg-muted text-foreground'
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

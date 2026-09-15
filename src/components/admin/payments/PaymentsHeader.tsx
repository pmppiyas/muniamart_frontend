'use client';

import * as React from 'react';
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatsGroup, AdminStatItem } from '@/components/admin/AdminStatsGroup';
import { PaymentMetrics } from '@/types/payment';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';

interface PaymentsHeaderProps {
  totalCount: number;
  metrics?: PaymentMetrics;
  isFetching: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

export function PaymentsHeader({
  totalCount,
  metrics,
  isFetching,
  onRefresh,
  onExport,
}: PaymentsHeaderProps) {
  const { formatPrice } = useCurrency();

  const stats: AdminStatItem[] = [
    {
      title: 'Total Captured Revenue',
      value: formatPrice(metrics?.totalRevenue ?? 0),
      icon: DollarSign,
      color: 'emerald',
      badge: 'Net Revenue',
    },
    {
      title: 'Successful Payments',
      value: (metrics?.successfulCount ?? 0).toLocaleString(),
      icon: CheckCircle2,
      color: 'primary',
      badge: 'Settled',
    },
    {
      title: 'Pending Transactions',
      value: (metrics?.pendingCount ?? 0).toLocaleString(),
      icon: Clock,
      color: 'amber',
      badge: 'Processing',
    },
    {
      title: 'Failed / Disputed',
      value: (metrics?.failedCount ?? 0).toLocaleString(),
      icon: XCircle,
      color: 'rose',
      badge: 'Unsuccessful',
    },
  ];

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Payments"
        description="Monitor online payment transactions, provider gateways (Stripe & bKash), and settled revenue."
        breadcrumbs={[{ label: 'Payments' }]}
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

      <AdminStatsGroup stats={stats} />
    </div>
  );
}

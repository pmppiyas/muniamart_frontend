'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Plus,
  Calendar,
  RotateCw,
  AlertCircle,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser, selectIsSuperAdmin } from '@/features/auth/authSelectors';
import { useGetDashboardMetadataQuery } from '@/services/api/adminApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatsGroup, AdminStatItem } from '@/components/admin/AdminStatsGroup';
import {
  DashboardPieChart,
  DashboardRevenueChart,
  DashboardRecentOrders,
} from '@/components/admin/dashboard';
import { useCurrency } from '@/hooks/useCurrency';

export default function AdminDashboardPage() {
  const user = useAppSelector(selectCurrentUser);
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const { formatPrice } = useCurrency();

  const [dateRange] = React.useState('Last 30 Days');

  const {
    data: metadataResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetDashboardMetadataQuery();

  const metadata = metadataResponse?.data;
  const metrics = metadata?.metrics;
  const charts = metadata?.charts;
  const recentOrders = metadata?.recentOrders ?? [];

  const stats: AdminStatItem[] = [
    {
      title: 'Total Revenue',
      value: metrics ? formatPrice(metrics.totalRevenue) : '৳0',
      change: metrics?.revenueChange || '+0.0%',
      isPositive: true,
      subtext: 'vs previous period',
      icon: DollarSign,
      color: 'emerald',
    },
    {
      title: 'Total Orders',
      value: metrics ? metrics.totalOrders.toLocaleString() : '0',
      change: metrics?.ordersChange || '+0.0%',
      isPositive: true,
      subtext: 'all customer purchases',
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      title: 'Active Customers',
      value: metrics ? metrics.totalCustomers.toLocaleString() : '0',
      change: metrics?.customersChange || '+0.0%',
      isPositive: true,
      subtext: 'registered shoppers',
      icon: Users,
      color: 'purple',
    },
    {
      title: 'Active Inventory',
      value: metrics ? `${metrics.totalProducts} Items` : '0 Items',
      change: metrics?.lowStockCount ? `${metrics.lowStockCount} low` : 'Healthy',
      isPositive: !(metrics?.lowStockCount && metrics.lowStockCount > 0),
      subtext: `${metrics?.lowStockCount || 0} items low in stock`,
      icon: Package,
      color: 'amber',
    },
  ];

  const orderStatusPieData = React.useMemo(() => {
    if (!charts?.ordersByStatus) return [];
    return charts.ordersByStatus.map((item) => ({
      label: item.label,
      count: item.count,
      percentage: item.percentage,
      color: item.color,
      valueFormatted: `${item.count} orders`,
    }));
  }, [charts?.ordersByStatus]);

  const paymentGatewaysPieData = React.useMemo(() => {
    if (!charts?.paymentMethodsBreakdown) return [];
    return charts.paymentMethodsBreakdown.map((item) => ({
      label: item.name,
      count: item.count,
      percentage: item.percentage,
      color: item.color,
      valueFormatted: item.revenue > 0 ? formatPrice(item.revenue) : `${item.count} orders`,
    }));
  }, [charts?.paymentMethodsBreakdown, formatPrice]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      <AdminPageHeader
        title="Dashboard Overview"
        badge={
          <Badge variant="default" className="text-[11px] font-extrabold uppercase tracking-wide">
            {isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN'}
          </Badge>
        }
        description={
          <>
            Welcome back, <span className="font-semibold text-foreground">{user?.name || 'Admin'}</span>. Here is your store’s real-time performance.
          </>
        }
        actions={
          <>
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground shadow-2xs">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{dateRange}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
              className="rounded-xl text-xs font-semibold shadow-2xs"
            >
              <RotateCw
                className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? 'animate-spin text-primary' : ''}`}
              />
              Refresh
            </Button>

            <Button asChild size="sm" className="rounded-xl text-xs font-bold shadow-sm">
              <Link href="/admin/products">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Product
              </Link>
            </Button>
          </>
        }
      />

      {isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <h4 className="text-sm font-bold text-foreground">Failed to load dashboard metadata</h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Unable to connect to the analytics service. Please check your network or try refreshing.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl">
            Retry Loading
          </Button>
        </div>
      ) : (
        <>
          {/* Top 4 KPI Metrics */}
          <AdminStatsGroup stats={stats} />

          {/* Revenue Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12">
              <DashboardRevenueChart
                weeklySales={charts?.weeklySales ?? []}
                thisWeekRevenue={metrics?.thisWeekRevenue ?? 0}
                formatPrice={formatPrice}
              />
            </div>
          </div>

          {/* Two Interactive Pie / Donut Charts Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardPieChart
              title="Order Status Breakdown"
              description="Live distribution across fulfillment statuses"
              centerLabel="Orders"
              centerValue={metrics?.totalOrders ?? 0}
              data={orderStatusPieData}
            />

            <DashboardPieChart
              title="Payment Gateways"
              description="Real-time transaction & gateway share"
              centerLabel="Payments"
              centerValue={
                charts?.paymentMethodsBreakdown?.reduce((acc, curr) => acc + curr.count, 0) ?? 0
              }
              data={paymentGatewaysPieData}
            />
          </div>

          {/* Recent Orders Table */}
          <DashboardRecentOrders orders={recentOrders} formatPrice={formatPrice} />
        </>
      )}
    </div>
  );
}

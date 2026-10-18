'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  Eye,
} from 'lucide-react';
import { DashboardRecentOrderItem } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface DashboardRecentOrdersProps {
  orders: DashboardRecentOrderItem[];
  formatPrice: (amount: number) => string;
  className?: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PAID':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          Paid
        </span>
      );
    case 'CONFIRMED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          Confirmed
        </span>
      );
    case 'DELIVERY_IN_PROGRESS':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <Truck className="h-3 w-3" />
          In Transit
        </span>
      );
    case 'DELIVERED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
          <CheckCircle2 className="h-3 w-3" />
          Delivered
        </span>
      );
    case 'CANCELED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
          <AlertCircle className="h-3 w-3" />
          Canceled
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
          <Clock className="h-3 w-3" />
          Pending
        </span>
      );
  }
};

const formatTimeAgo = (dateStr: string) => {
  try {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return new Date(dateStr).toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Recent';
  }
};

export const DashboardRecentOrders: React.FC<DashboardRecentOrdersProps> = ({
  orders,
  formatPrice,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card shadow-xs overflow-hidden',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 border-b border-border gap-3">
        <div>
          <h3 className="text-base font-bold text-foreground">Recent Orders</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live customer purchases awaiting fulfillment
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl text-xs font-semibold self-start sm:self-auto"
        >
          <Link href="/admin/orders">
            View All Orders
            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/30 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-foreground">
                      {order.customer?.name || 'Customer'}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate max-w-[160px]">
                      {order.customer?.email || 'N/A'}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    {order.items} {order.items === 1 ? 'item' : 'items'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    {formatPrice(order.amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground">
                      <CreditCard className="h-3 w-3 text-muted-foreground" />
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {formatTimeAgo(order.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Link href="/admin/orders" title="View in orders list">
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-10 text-center text-xs text-muted-foreground"
                >
                  No recent orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

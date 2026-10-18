'use client';

import * as React from 'react';
import Link from 'next/link';
import { Package, Clock, ShoppingBag, ArrowRight, AlertCircle, RefreshCw, MapPin } from 'lucide-react';
import { useGetMyOrdersQuery } from '@/services/api/orderApi';
import { Order, OrderStatus } from '@/types/order';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  CONFIRMED: {
    label: 'Confirmed',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    border: 'border-emerald-500/30 dark:border-emerald-500/40',
    dot: 'bg-emerald-500',
  },
  PAID: {
    label: 'Paid',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  PENDING: {
    label: 'Pending',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    dot: 'bg-amber-500',
  },
  PROCESSING: {
    label: 'Processing',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    dot: 'bg-blue-500',
  },
  DELIVERY_IN_PROGRESS: {
    label: 'Out for Delivery',
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    dot: 'bg-sky-500',
  },
  SHIPPED: {
    label: 'Shipped',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    dot: 'bg-indigo-500',
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    border: 'border-emerald-500/30 dark:border-emerald-500/40',
    dot: 'bg-emerald-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    dot: 'bg-rose-500',
  },
  CANCELED: {
    label: 'Cancelled',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    dot: 'bg-rose-500',
  },
};

export function ProfileOrdersTab() {
  const { data: ordersResponse, isLoading, isError, refetch } = useGetMyOrdersQuery();
  const { formatPrice } = useCurrency();
  const rawOrders: Order[] = (ordersResponse?.data as unknown as Order[]) || [];

  const orders = React.useMemo(() => {
    return [...rawOrders].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;

      const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
      return numB - numA;
    });
  }, [rawOrders]);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
        <div className="h-6 w-48 bg-muted animate-pulse rounded-lg" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl border border-border bg-muted/40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-3">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-foreground">Failed to load order history</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          We could not retrieve your orders. Please check your internet connection and try again.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 text-center shadow-xs">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-4">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No orders yet</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          You haven&apos;t placed any orders yet. Discover our latest collections and exclusive deals today!
        </p>
        <Link
          href="/products"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition-colors"
        >
          <span>Start Shopping</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs">
      <div className="border-b border-border pb-4 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Order History</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track, review, and manage your past and active purchases.
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const rawStatus = (order.status || '').toUpperCase().trim();
          const status = STATUS_CONFIG[rawStatus] || {
            label: order.status || 'Pending',
            color: rawStatus === 'CONFIRMED' || rawStatus === 'CONFIRM'
              ? 'text-emerald-700 dark:text-emerald-300'
              : 'text-foreground',
            bg: rawStatus === 'CONFIRMED' || rawStatus === 'CONFIRM'
              ? 'bg-emerald-500/15 dark:bg-emerald-500/20'
              : 'bg-muted',
            border: rawStatus === 'CONFIRMED' || rawStatus === 'CONFIRM'
              ? 'border-emerald-500/30 dark:border-emerald-500/40'
              : 'border-border',
            dot: rawStatus === 'CONFIRMED' || rawStatus === 'CONFIRM'
              ? 'bg-emerald-500'
              : 'bg-muted-foreground',
          };

          const orderDate = order.createdAt
            ? new Date(order.createdAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : 'Recent';

          return (
            <div
              key={order.id}
              className="rounded-2xl border border-border bg-muted/20 p-4 sm:p-5 hover:border-primary/40 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-foreground">
                        {order.id.toUpperCase().startsWith('ORD-')
                          ? order.id.toUpperCase()
                          : `ORD-${order.id}`}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {orderDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize',
                      status.bg,
                      status.color,
                      status.border
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
                    {status.label}
                  </span>
                  <span className="text-sm font-black text-foreground">
                    {formatPrice(order.totalAmount || 0)}
                  </span>
                </div>
              </div>

              <div className="pt-3 space-y-2">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs text-foreground/80 py-1"
                  >
                    <div className="flex items-center gap-2 max-w-[70%]">
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold text-foreground">
                        {item.quantity}x
                      </span>
                      <span className="truncate font-medium text-foreground">
                        {item.product?.name || 'Product'}
                      </span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {formatPrice(item.subtotal || item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {order.address && (
                <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">
                      <strong className="text-foreground font-semibold">{order.address.fullName}</strong>
                      {' · '}
                      {order.address.streetAddress}
                      {order.address.apartment ? `, ${order.address.apartment}` : ''}
                      {', '}{order.address.city}, {order.address.state} - {order.address.postalCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {order.address.phone && (
                      <span className="font-mono text-foreground/80">{order.address.phone}</span>
                    )}
                    {order.address.paymentMethod && (
                      <span className="rounded-md bg-muted px-1.5 py-0.5 font-bold uppercase text-[9px] tracking-wider text-muted-foreground">
                        {order.address.paymentMethod}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CreditCard,
  Package,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order, OrderStatus } from '@/types/order';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';
import { OrdersTableSkeleton } from './OrdersTableSkeleton';
import { OrdersEmptyState } from './OrdersEmptyState';

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

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  page: number;
  totalPage: number;
  totalOrders: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onDeleteClick: (order: Order) => void;
  isFiltering: boolean;
  onClearFilters: () => void;
}

export function OrdersTable({
  orders,
  isLoading,
  page,
  totalPage,
  totalOrders,
  limit,
  onPageChange,
  onDeleteClick,
  isFiltering,
  onClearFilters,
}: OrdersTableProps) {
  const { formatPrice } = useCurrency();

  return (
    <div className="rounded-2xl border border-border/80 bg-card shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40 text-xs">
            <TableRow className="hover:bg-transparent border-border/80">
              <TableHead className="w-[140px] font-bold">Order ID</TableHead>
              <TableHead className="min-w-[200px] font-bold">Customer & Delivery</TableHead>
              <TableHead className="w-[100px] font-bold">Items</TableHead>
              <TableHead className="w-[110px] font-bold">Amount</TableHead>
              <TableHead className="w-[120px] font-bold">Payment</TableHead>
              <TableHead className="w-[140px] font-bold">Status</TableHead>
              <TableHead className="w-[110px] text-right font-bold pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-xs">
            {isLoading ? (
              <OrdersTableSkeleton rows={limit > 10 ? 8 : limit} />
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="p-0">
                  <OrdersEmptyState
                    isFiltering={isFiltering}
                    onClearFilters={onClearFilters}
                  />
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const orderNumber = order.id.toUpperCase().startsWith('ORD-')
                  ? order.id.toUpperCase()
                  : `ORD-${order.id}`;

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

                const customerName =
                  order.customer?.name ||
                  order.address?.fullName ||
                  'Customer';

                const customerContact =
                  order.customer?.email ||
                  order.address?.email ||
                  order.address?.phone ||
                  order.customer?.phone ||
                  '';

                const orderDate = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '';

                const orderTime = order.createdAt
                  ? new Date(order.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '';

                const firstItem = order.items?.[0];
                const itemsCount = order.items?.reduce((sum, it) => sum + it.quantity, 0) || order.items?.length || 0;

                const paymentMethod =
                  order.address?.paymentMethod?.toUpperCase() ||
                  order.payments?.[0]?.provider ||
                  'COD';

                const isPaid =
                  order.status === 'PAID' ||
                  order.payments?.some((p) => p.status === 'SUCCESS');

                return (
                  <TableRow
                    key={order.id}
                    className="hover:bg-muted/30 transition-colors border-border/70 group"
                  >
                    {/* Order ID & Date */}
                    <TableCell className="py-3 font-medium">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-black text-foreground hover:text-primary transition-colors block text-xs tracking-wider"
                      >
                        {orderNumber}
                      </Link>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {orderDate} {orderTime && `· ${orderTime}`}
                      </div>
                    </TableCell>

                    {/* Customer & Delivery Destination */}
                    <TableCell className="py-3">
                      <div className="flex items-start gap-2.5">
                        <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0 mt-0.5">
                          {customerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate" title={customerName}>
                            {customerName}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate" title={customerContact}>
                            {customerContact}
                          </p>
                          {order.address && (
                            <div
                              className="flex items-center gap-1 text-[10px] text-muted-foreground/90 mt-0.5 truncate"
                              title={`${order.address.city}${order.address.state ? `, ${order.address.state}` : ''}`}
                            >
                              <MapPin className="h-3 w-3 text-primary shrink-0" />
                              <span className="truncate">
                                {order.address.city}
                                {order.address.state ? `, ${order.address.state}` : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Items */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5">
                        {firstItem?.product?.photoUrl ? (
                          <div className="relative h-7 w-7 rounded-md overflow-hidden bg-muted/40 shrink-0 border border-border/60">
                            <Image
                              src={firstItem.product.photoUrl}
                              alt={firstItem.product.name || 'Product'}
                              fill
                              className="object-cover"
                              sizes="28px"
                            />
                          </div>
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted/50 text-muted-foreground shrink-0">
                            <Package className="h-3.5 w-3.5" />
                          </div>
                        )}
                        <span className="font-medium text-foreground whitespace-nowrap">
                          {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    </TableCell>

                    {/* Total Amount */}
                    <TableCell className="py-3 font-bold text-foreground">
                      {formatPrice(Number(order.totalAmount || 0))}
                    </TableCell>

                    {/* Payment Info */}
                    <TableCell className="py-3">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider text-muted-foreground">
                          <CreditCard className="h-3 w-3 text-primary" />
                          {paymentMethod}
                        </span>
                        <div>
                          <span
                            className={cn(
                              'inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase',
                              isPaid
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            )}
                          >
                            {isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Order Status Badge (Green for CONFIRMED) */}
                    <TableCell className="py-3">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize whitespace-nowrap shadow-2xs',
                          status.bg,
                          status.color,
                          status.border
                        )}
                      >
                        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', status.dot)} />
                        {status.label}
                      </span>
                    </TableCell>

                    {/* Action Buttons (FULL-PAGE NAVIGATION) */}
                    <TableCell className="py-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        {/* 1. VIEW BUTTON -> Navigates to FULL-PAGE /admin/orders/[id] */}
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-7.5 w-7.5 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                          title="View Order Details (Full Page)"
                        >
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>

                        {/* 2. EDIT BUTTON -> Navigates to FULL-PAGE /admin/orders/[id]/edit */}
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-7.5 w-7.5 p-0 text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 rounded-lg cursor-pointer"
                          title="Edit Order (Full Page)"
                        >
                          <Link href={`/admin/orders/${order.id}/edit`}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </Link>
                        </Button>

                        {/* 3. DELETE BUTTON */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteClick(order)}
                          className="h-7.5 w-7.5 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Bar */}
      {!isLoading && orders.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/80 px-4 py-3 bg-card text-xs text-muted-foreground">
          <div>
            Showing <strong className="text-foreground">{(page - 1) * limit + 1}</strong> to{' '}
            <strong className="text-foreground">{Math.min(page * limit, totalOrders)}</strong> of{' '}
            <strong className="text-foreground">{totalOrders}</strong> orders
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="h-8 rounded-lg px-2.5 text-xs font-semibold cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Previous
            </Button>

            <span className="px-2 font-medium text-foreground">
              Page {page} of {Math.max(1, totalPage)}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPage}
              className="h-8 rounded-lg px-2.5 text-xs font-semibold cursor-pointer"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

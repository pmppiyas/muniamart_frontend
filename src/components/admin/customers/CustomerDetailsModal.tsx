'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ExternalLink,
  DollarSign,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetSingleCustomerQuery } from '@/services/api/customerApi';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';

interface CustomerDetailsModalProps {
  customerId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenStatusDialog?: () => void;
}

const STATUS_BADGES: Record<
  string,
  { label: string; bg: string; color: string; border: string }
> = {
  ACTIVE: {
    label: 'Active',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/20',
  },
  INACTIVE: {
    label: 'Inactive',
    bg: 'bg-amber-500/10',
    color: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/20',
  },
  BLOCKED: {
    label: 'Blocked',
    bg: 'bg-rose-500/10',
    color: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/20',
  },
};

export function CustomerDetailsModal({
  customerId,
  isOpen,
  onClose,
  onOpenStatusDialog,
}: CustomerDetailsModalProps) {
  const { formatPrice } = useCurrency();
  const { data: response, isLoading } = useGetSingleCustomerQuery(
    customerId || '',
    {
      skip: !customerId || !isOpen,
    }
  );

  const customer = response?.data;

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customer Profile & Orders"
      description="Detailed customer overview, lifetime statistics, and status-wise order breakdown."
      maxWidth="3xl"
      footer={
        <div className="flex items-center justify-between w-full">
          {onOpenStatusDialog && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenStatusDialog}
              className="text-xs"
            >
              Change Account Status
            </Button>
          )}
          <Button variant="default" size="sm" onClick={onClose} className="text-xs ml-auto">
            Done
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <div className="p-8 text-center animate-pulse space-y-4">
          <div className="h-16 w-16 rounded-full bg-muted mx-auto" />
          <div className="h-4 w-40 bg-muted mx-auto rounded" />
          <div className="h-3 w-56 bg-muted mx-auto rounded" />
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="h-16 bg-muted rounded-xl" />
            <div className="h-16 bg-muted rounded-xl" />
            <div className="h-16 bg-muted rounded-xl" />
          </div>
        </div>
      ) : !customer ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Customer details not found.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/40 border border-border">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg border border-primary/20">
                {customer.photoUrl ? (
                  <img
                    src={customer.photoUrl}
                    alt={customer.name}
                    className="h-full w-full object-cover rounded-xl"
                  />
                ) : (
                  customer.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    {customer.name}
                  </h3>
                  {STATUS_BADGES[customer.status] && (
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] font-semibold px-2 py-0.2',
                        STATUS_BADGES[customer.status].bg,
                        STATUS_BADGES[customer.status].color,
                        STATUS_BADGES[customer.status].border
                      )}
                    >
                      {STATUS_BADGES[customer.status].label}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {customer.email}
                  </span>
                  {customer.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {customer.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Joined {new Date(customer.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-border/60">
              <span className="text-[11px] text-muted-foreground">Total Spent</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {formatPrice(customer.totalSpent)}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Status-Wise Order Breakdown
              </h4>
              <span className="text-xs font-semibold text-foreground">
                Total Orders: {customer.orderCount}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
              <div className="p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  <Clock className="h-3 w-3" />
                  Pending
                </div>
                <div className="text-lg font-bold text-foreground mt-1">
                  {customer.statusWiseOrderCount.PENDING}
                </div>
              </div>

              <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="h-3 w-3" />
                  Paid
                </div>
                <div className="text-lg font-bold text-foreground mt-1">
                  {customer.statusWiseOrderCount.PAID}
                </div>
              </div>

              <div className="p-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Confirmed
                </div>
                <div className="text-lg font-bold text-foreground mt-1">
                  {customer.statusWiseOrderCount.CONFIRMED}
                </div>
              </div>

              <div className="p-2.5 rounded-xl border border-sky-500/20 bg-sky-500/5 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-sky-600 dark:text-sky-400">
                  <Truck className="h-3 w-3" />
                  In Delivery
                </div>
                <div className="text-lg font-bold text-foreground mt-1">
                  {customer.statusWiseOrderCount.DELIVERY_IN_PROGRESS}
                </div>
              </div>

              <div className="p-2.5 rounded-xl border border-emerald-600/20 bg-emerald-600/5 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  Delivered
                </div>
                <div className="text-lg font-bold text-foreground mt-1">
                  {customer.statusWiseOrderCount.DELIVERED}
                </div>
              </div>

              <div className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                  <XCircle className="h-3 w-3" />
                  Canceled
                </div>
                <div className="text-lg font-bold text-foreground mt-1">
                  {customer.statusWiseOrderCount.CANCELED}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recent Orders
              </h4>
              <span className="text-[11px] text-muted-foreground">
                Showing last {customer.orders?.length || 0} orders
              </span>
            </div>

            {customer.orders && customer.orders.length > 0 ? (
              <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
                {customer.orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">
                            ORD-{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-muted text-muted-foreground uppercase">
                            {order.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} items
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className="text-xs font-bold text-foreground">
                        {formatPrice(Number(order.totalAmount))}
                      </span>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                      >
                        View
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-border bg-muted/20 text-center text-xs text-muted-foreground">
                This customer has not placed any orders yet.
              </div>
            )}
          </div>

          {customer.addresses && customer.addresses.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                Saved Delivery Addresses
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {customer.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-3 rounded-xl border border-border bg-card text-xs space-y-1"
                  >
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      {addr.fullName} ({addr.phone})
                    </div>
                    <p className="text-muted-foreground pl-5">
                      {addr.streetAddress}
                      {addr.apartment ? `, ${addr.apartment}` : ''}
                      <br />
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

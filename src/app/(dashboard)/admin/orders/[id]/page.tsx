'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Edit2,
  Printer,
  Package,
  MapPin,
  CreditCard,
  User,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetOrderByIdQuery, useUpdateOrderMutation } from '@/services/api/orderApi';
import { useCurrency } from '@/hooks/useCurrency';
import { OrderStatus } from '@/types/order';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; dot: string; step: number }
> = {
  PENDING: {
    label: 'Pending',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-500/15 dark:bg-amber-500/20',
    border: 'border-amber-500/30 dark:border-amber-500/40',
    dot: 'bg-amber-500',
    step: 1,
  },
  PAID: {
    label: 'Paid',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    border: 'border-emerald-500/30 dark:border-emerald-500/40',
    dot: 'bg-emerald-500',
    step: 1,
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    border: 'border-emerald-500/30 dark:border-emerald-500/40',
    dot: 'bg-emerald-500',
    step: 2,
  },
  DELIVERY_IN_PROGRESS: {
    label: 'Out for Delivery',
    color: 'text-sky-700 dark:text-sky-300',
    bg: 'bg-sky-500/15 dark:bg-sky-500/20',
    border: 'border-sky-500/30 dark:border-sky-500/40',
    dot: 'bg-sky-500',
    step: 3,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    border: 'border-emerald-500/30 dark:border-emerald-500/40',
    dot: 'bg-emerald-500',
    step: 4,
  },
  CANCELED: {
    label: 'Cancelled',
    color: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-500/15 dark:bg-rose-500/20',
    border: 'border-rose-500/30 dark:border-rose-500/40',
    dot: 'bg-rose-500',
    step: -1,
  },
};

const TRACKING_STEPS = [
  { step: 1, label: 'Order Placed', desc: 'Received & pending' },
  { step: 2, label: 'Confirmed', desc: 'Verified by store' },
  { step: 3, label: 'Out for Delivery', desc: 'Handed to courier' },
  { step: 4, label: 'Delivered', desc: 'Package received' },
];

export default function AdminOrderViewPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const { formatPrice } = useCurrency();

  const { data: orderResponse, isLoading, isError, refetch } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  });

  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const order = orderResponse?.data;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-8 w-48 bg-muted rounded-xl" />
        <div className="h-32 bg-muted/60 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-muted/40 rounded-3xl" />
          <div className="h-96 bg-muted/40 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-3xl border border-border">
        <div className="h-14 w-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Order Not Found</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          The requested order ID could not be located in the database.
        </p>
        <Button asChild className="mt-5 rounded-xl text-xs font-semibold" size="sm">
          <Link href="/admin/orders">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back to Orders
          </Link>
        </Button>
      </div>
    );
  }

  const orderNumber = order.id.toUpperCase().startsWith('ORD-')
    ? order.id.toUpperCase()
    : `ORD-${order.id}`;

  const rawStatus = (order.status || '').toUpperCase().trim();
  const statusInfo = STATUS_CONFIG[rawStatus] || {
    label: order.status,
    color: rawStatus === 'CONFIRMED' ? 'text-emerald-700 dark:text-emerald-300' : 'text-foreground',
    bg: rawStatus === 'CONFIRMED' ? 'bg-emerald-500/15 dark:bg-emerald-500/20' : 'bg-muted',
    border: rawStatus === 'CONFIRMED' ? 'border-emerald-500/30 dark:border-emerald-500/40' : 'border-border',
    dot: rawStatus === 'CONFIRMED' ? 'bg-emerald-500' : 'bg-muted-foreground',
    step: 1,
  };

  const currentStep = statusInfo.step;
  const isCanceled = rawStatus === 'CANCELED' || rawStatus === 'CANCELLED';

  const customerName = order.customer?.name || order.address?.fullName || 'Guest Customer';
  const customerEmail = order.customer?.email || order.address?.email;
  const customerPhone = order.customer?.phone || order.address?.phone;

  const handleQuickStatusUpdate = async (newStatus: OrderStatus) => {
    try {
      await updateOrder({ id: order.id, status: newStatus }).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update order status');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8.5 rounded-xl px-2.5 text-xs font-semibold shadow-2xs cursor-pointer"
          >
            <Link href="/admin/orders">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Orders
            </Link>
          </Button>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
                {orderNumber}
              </h1>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize shadow-2xs',
                  statusInfo.bg,
                  statusInfo.color,
                  statusInfo.border
                )}
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', statusInfo.dot)} />
                {statusInfo.label}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Clock className="h-3 w-3" />
              Placed on{' '}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Recent'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="h-8.5 rounded-xl px-3 text-xs font-semibold shadow-2xs cursor-pointer"
            title="Print Invoice"
          >
            <Printer className="h-3.5 w-3.5 mr-1.5" />
            Print Invoice
          </Button>

          <Button
            asChild
            size="sm"
            className="h-8.5 rounded-xl px-3 text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Link href={`/admin/orders/${order.id}/edit`}>
              <Edit2 className="h-3.5 w-3.5 mr-1.5" />
              Edit Order
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Fulfillment & Tracking Progress
            </h2>
          </div>
          {isCanceled ? (
            <Badge variant="destructive" className="text-[10px] font-bold">
              ORDER CANCELED
            </Badge>
          ) : (
            <span className="text-xs font-semibold text-primary">
              Step {Math.max(1, currentStep)} of 4
            </span>
          )}
        </div>

        {!isCanceled ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            {TRACKING_STEPS.map((stepItem, idx) => {
              const isCompleted = currentStep >= stepItem.step;
              const isCurrent = currentStep === stepItem.step;

              return (
                <div
                  key={stepItem.step}
                  className={cn(
                    'relative rounded-2xl border p-3.5 transition-all',
                    isCurrent
                      ? 'border-primary bg-primary/5 shadow-xs'
                      : isCompleted
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-border/60 bg-muted/20 opacity-60'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold',
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : stepItem.step}
                    </div>
                    <span className="font-bold text-xs text-foreground">
                      {stepItem.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pl-8">
                    {stepItem.desc}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-600 dark:text-rose-400">
            <XCircle className="h-5 w-5 shrink-0" />
            <div className="text-xs">
              <strong className="font-bold block">This order was canceled.</strong>
              No further fulfillment steps will be processed for this shipment.
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-2xs">
            <div className="px-5 py-4 border-b border-border/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Purchased Items ({order.items?.length || 0})
                </h3>
              </div>
            </div>

            <div className="divide-y divide-border/60">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.product?.images?.[0] ? (
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-muted/50 border border-border/70 shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name || 'Product'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground shrink-0 border border-border/70">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">
                        {item.product?.name || 'Product'}
                      </p>
                      {item.product?.sku && (
                        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                          SKU: {item.product.sku}
                        </p>
                      )}
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Unit Price: {formatPrice(Number(item.price))}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto text-xs border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-muted-foreground block">Quantity</span>
                      <span className="font-bold text-foreground text-xs font-mono">
                        {item.quantity} pcs
                      </span>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <span className="text-[10px] text-muted-foreground block">Total</span>
                      <span className="font-black text-foreground text-sm">
                        {formatPrice(Number(item.subtotal || item.price * item.quantity))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-muted/25 p-5 border-t border-border/80 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Items Subtotal:</span>
                <span className="font-medium text-foreground">
                  {formatPrice(Number(order.totalAmount || 0))}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Shipping:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  Free Delivery
                </span>
              </div>
              <div className="border-t border-border/60 pt-2 flex justify-between items-center text-sm font-black text-foreground">
                <span>Grand Total:</span>
                <span className="text-base text-primary">
                  {formatPrice(Number(order.totalAmount || 0))}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <CreditCard className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Payment Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block">Payment Method</span>
                <span className="font-bold text-foreground uppercase mt-0.5 block">
                  {order.address?.paymentMethod || order.payments?.[0]?.provider || 'Cash on Delivery'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-muted-foreground block">Payment Status</span>
                <span
                  className={cn(
                    'inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-0.5',
                    order.status === 'PAID' || order.payments?.some((p) => p.status === 'SUCCESS')
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  )}
                >
                  {order.status === 'PAID' || order.payments?.some((p) => p.status === 'SUCCESS')
                    ? 'Payment Settled'
                    : 'Payment Pending'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-muted-foreground block">Transaction ID</span>
                <span className="font-mono text-foreground mt-0.5 block truncate">
                  {order.payments?.[0]?.transactionId || 'N/A (Cash on Delivery)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Customer Profile
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-sm shrink-0">
                {customerName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{customerName}</p>
                <p className="text-[11px] text-muted-foreground truncate">{customerEmail || 'No email'}</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border/50 text-xs">
              {customerPhone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-foreground font-mono">{customerPhone}</span>
                </div>
              )}
              {customerEmail && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-foreground truncate">{customerEmail}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Delivery Address
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                {order.address?.deliveryMethod || 'Standard'}
              </Badge>
            </div>

            {order.address ? (
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Recipient</span>
                  <span className="font-bold text-foreground text-xs">
                    {order.address.fullName}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground block">Address</span>
                  <p className="text-foreground font-medium leading-relaxed">
                    {order.address.streetAddress}
                    {order.address.apartment && `, ${order.address.apartment}`}
                  </p>
                  <p className="text-muted-foreground">
                    {order.address.city}, {order.address.state} - {order.address.postalCode}
                  </p>
                </div>

                {order.address.phone && (
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Contact Number</span>
                    <span className="font-mono text-foreground">{order.address.phone}</span>
                  </div>
                )}

                {order.address.deliveryNotes && (
                  <div className="rounded-xl bg-muted/40 p-2.5 border border-border/60">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                      Delivery Note
                    </span>
                    <p className="text-[11px] text-foreground italic mt-0.5">
                      &ldquo;{order.address.deliveryNotes}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground italic py-3 text-center">
                No shipping address linked to this order.
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Quick Status Action
              </h3>
            </div>

            <div className="space-y-2">
              <Button
                size="sm"
                onClick={() => handleQuickStatusUpdate('CONFIRMED')}
                disabled={isUpdating || rawStatus === 'CONFIRMED'}
                className="w-full justify-start h-9 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                Mark as Confirmed
              </Button>

              <Button
                size="sm"
                onClick={() => handleQuickStatusUpdate('DELIVERY_IN_PROGRESS')}
                disabled={isUpdating || rawStatus === 'DELIVERY_IN_PROGRESS'}
                className="w-full justify-start h-9 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
              >
                <Truck className="h-3.5 w-3.5 mr-2" />
                Mark as Out for Delivery
              </Button>

              <Button
                size="sm"
                onClick={() => handleQuickStatusUpdate('DELIVERED')}
                disabled={isUpdating || rawStatus === 'DELIVERED'}
                className="w-full justify-start h-9 rounded-xl text-xs font-bold bg-green-700 hover:bg-green-800 text-white cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                Mark as Delivered
              </Button>

              {rawStatus !== 'CANCELED' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickStatusUpdate('CANCELED')}
                  disabled={isUpdating}
                  className="w-full justify-start h-9 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <XCircle className="h-3.5 w-3.5 mr-2" />
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

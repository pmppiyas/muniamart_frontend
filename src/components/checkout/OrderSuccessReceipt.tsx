'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Package,
  MapPin,
  CreditCard,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { OrderConfirmationData } from '@/features/checkout/checkoutTypes';
import { useCurrency } from '@/hooks/useCurrency';

interface OrderSuccessReceiptProps {
  orderData: OrderConfirmationData;
}

export function OrderSuccessReceipt({ orderData }: OrderSuccessReceiptProps) {
  const { formatPrice } = useCurrency();

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8 px-4 sm:px-6">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/5">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Order Confirmed
        </span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Thank you for your order, {orderData.customerName}!
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          We&apos;ve received your order and our dispatch specialists are preparing your items for delivery.
        </p>
      </div>

      {/* Receipt Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        {/* Order Meta Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-xs text-muted-foreground">Order Reference Number</p>
            <p className="text-lg font-black text-foreground uppercase tracking-wider">
              {orderData.orderId.toUpperCase().startsWith('ORD-')
                ? orderData.orderId.toUpperCase()
                : `ORD-${orderData.orderId}`}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-muted-foreground">Order Date</p>
            <p className="text-sm font-bold text-foreground">
              {new Date(orderData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Shipping & Payment summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-border pb-6 text-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Delivery Address</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {orderData.streetAddress}
              <br />
              {orderData.city}, {orderData.state} - {orderData.postalCode}
              <br />
              Phone: {orderData.phone}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>Payment &amp; Delivery Method</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Payment:{' '}
              <span className="font-bold text-foreground capitalize">
                {orderData.paymentMethod === 'cod'
                  ? 'Cash on Delivery'
                  : orderData.paymentMethod === 'bkash'
                  ? 'bKash / Mobile Banking'
                  : 'Credit / Debit Card (Stripe)'}
              </span>
              <br />
              Shipping:{' '}
              <span className="font-bold text-foreground capitalize">
                {orderData.deliveryMethod} Delivery
              </span>
            </p>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground">Order Items</h3>
          <div className="divide-y divide-border/60">
            {orderData.items.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40">
                    {item.photoUrl ? (
                      <Image
                        src={item.photoUrl}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Package className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Amount Due */}
        <div className="flex items-baseline justify-between border-t border-border pt-4">
          <span className="text-sm font-bold text-foreground">Grand Total</span>
          <span className="text-2xl font-black text-foreground">
            {formatPrice(orderData.totalAmount)}
          </span>
        </div>
      </div>

      {/* Next Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/products"
          className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Link>

        <Link
          href="/profile"
          className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition-colors cursor-pointer"
        >
          <span>View My Account &amp; Orders</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

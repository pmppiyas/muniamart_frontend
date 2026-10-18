'use client';

import * as React from 'react';
import Image from 'next/image';
import { Package, ShieldCheck, Tag, X } from 'lucide-react';
import { CartItem, AppliedCoupon } from '@/types/cart';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { applyCoupon, removeCoupon } from '@/features/cart/cartSlice';
import { toast } from 'sonner';

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  grandTotal: number;
  coupon: AppliedCoupon | null;
  className?: string;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  discount,
  shippingFee,
  grandTotal,
  coupon,
  className,
}: CheckoutOrderSummaryProps) {
  const dispatch = useAppDispatch();
  const { formatPrice } = useCurrency();
  const [couponInput, setCouponInput] = React.useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME10' || code === 'SAVE20') {
      dispatch(applyCoupon({ code }));
      toast.success(`Coupon "${code}" applied successfully!`);
      setCouponInput('');
    } else {
      toast.error('Invalid coupon code. Try WELCOME10 or SAVE20');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    toast.info('Coupon removed');
  };

  return (
    <div
      className={cn(
        'rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-base font-bold text-foreground">Order Summary</h2>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
          {items.reduce((acc, i) => acc + i.quantity, 0)} items
        </span>
      </div>

      <div className="max-h-72 overflow-y-auto space-y-3 pr-1 divide-y divide-border/40">
        {items.map((item) => (
          <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40">
              {item.photoUrl ? (
                <Image
                  src={item.photoUrl}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <Package className="h-5 w-5" />
                </div>
              )}
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-xs">
                {item.quantity}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate" title={item.name}>
                {item.name}
              </p>
              {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                <p className="text-[10px] text-muted-foreground">
                  {Object.entries(item.selectedVariants)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(', ')}
                </p>
              )}
              <p className="text-xs font-bold text-foreground mt-0.5">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4">
        {coupon ? (
          <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400">
            <div className="flex items-center gap-1.5 font-bold">
              <Tag className="h-3.5 w-3.5" />
              <span>Coupon {coupon.code} Applied</span>
            </div>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="text-muted-foreground hover:text-destructive transition-colors p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Coupon code (e.g. WELCOME10)"
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary uppercase"
            />
            <button
              type="submit"
              className="rounded-xl bg-muted px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted/80 transition-colors"
            >
              Apply
            </button>
          </form>
        )}
      </div>

      <div className="space-y-2.5 border-t border-border pt-4 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Coupon Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-muted-foreground">
          <span>Delivery Fee</span>
          <span>
            {shippingFee === 0 ? (
              <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
            ) : (
              <span className="font-semibold text-foreground">{formatPrice(shippingFee)}</span>
            )}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>Sales Tax / VAT</span>
          <span className="font-medium text-foreground">Included</span>
        </div>

        <div className="flex items-baseline justify-between border-t border-border pt-3">
          <span className="text-sm font-bold text-foreground">Total Due</span>
          <span className="text-2xl font-black text-foreground">{formatPrice(grandTotal)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-1">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>Guaranteed 100% Safe & Secure Checkout</span>
      </div>
    </div>
  );
}

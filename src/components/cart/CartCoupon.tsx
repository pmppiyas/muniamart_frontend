'use client';

import * as React from 'react';
import { Tag, Check, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { applyCoupon, removeCoupon } from '@/features/cart/cartSlice';
import { selectCartCoupon } from '@/features/cart/cartSelectors';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CartCouponProps {
  className?: string;
}

export function CartCoupon({ className }: CartCouponProps) {
  const dispatch = useAppDispatch();
  const appliedCoupon = useAppSelector(selectCartCoupon);
  const [couponInput, setCouponInput] = React.useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      toast.error('Please enter a coupon code.');
      return;
    }

    if (code === 'WELCOME10' || code === 'SAVE20') {
      dispatch(applyCoupon({ code }));
      toast.success(`Coupon "${code}" applied successfully!`);
      setCouponInput('');
    } else {
      toast.error('Invalid coupon code. Try WELCOME10 or SAVE20.');
    }
  };

  const handleRemove = () => {
    dispatch(removeCoupon());
    toast.info('Coupon removed.');
  };

  return (
    <div className={cn('rounded-2xl border border-border bg-card p-4 shadow-2xs space-y-3', className)}>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
        <Tag className="h-4 w-4 text-primary" />
        <span>Promo &amp; Coupons</span>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-500" />
            <div>
              <span className="font-bold">{appliedCoupon.code}</span>
              <span className="text-[11px] ml-1 opacity-80">
                ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% OFF` : `$${appliedCoupon.discountValue} OFF`})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="rounded-lg p-1 text-muted-foreground hover:bg-emerald-500/20 hover:text-foreground cursor-pointer"
            title="Remove coupon"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex items-center gap-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Try WELCOME10 or SAVE20"
            className="h-10 flex-1 rounded-xl border border-border bg-background px-3 text-xs uppercase font-medium text-foreground placeholder:text-muted-foreground placeholder:normal-case focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            className="h-10 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
          >
            Apply
          </button>
        </form>
      )}
    </div>
  );
}

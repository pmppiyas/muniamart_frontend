'use client';

import * as React from 'react';
import Link from 'next/link';
import { Home, ChevronRight, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useMounted } from '@/hooks/useMounted';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { CartCoupon } from './CartCoupon';
import { EmptyCart } from './EmptyCart';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CartPageProps {
  className?: string;
}

export function CartPage({ className }: CartPageProps) {
  const mounted = useMounted();
  const { items, totalQuantity, clearAll } = useCart();

  const handleClearCart = async () => {
    await clearAll();
    toast.info('Your shopping cart has been cleared.');
  };

  if (!mounted) {
    return (
      <div className={cn('py-6 sm:py-8 lg:py-10 bg-background min-h-screen', className)}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <Link href="/products" className="hover:text-primary transition-colors">
              Shop
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <span className="font-bold text-foreground">Shopping Cart</span>
          </nav>

          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 p-12 text-center min-h-[380px] animate-pulse">
            <div className="h-12 w-12 rounded-2xl bg-muted" />
            <div className="mt-4 h-4 w-32 rounded-md bg-muted" />
            <div className="mt-2 h-3 w-48 rounded-md bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={cn('py-6 sm:py-8 lg:py-10 bg-background min-h-screen', className)}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <Link href="/products" className="hover:text-primary transition-colors">
              Shop
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <span className="font-bold text-foreground">Shopping Cart</span>
          </nav>

          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('py-6 sm:py-8 lg:py-10 bg-background min-h-screen', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
          <Link href="/products" className="hover:text-primary transition-colors">
            Shop
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
          <span className="font-bold text-foreground">Shopping Cart</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
                Shopping Cart
              </h1>
              <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Review your items, apply promotional vouchers, and proceed to checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearCart}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-3">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-[176px]">
            <CartCoupon />
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

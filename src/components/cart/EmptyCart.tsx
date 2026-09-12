'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyCartProps {
  className?: string;
}

export function EmptyCart({ className }: EmptyCartProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-10 sm:p-16 text-center shadow-xs min-h-[420px]',
        className
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-6 shadow-2xs">
        <ShoppingCart className="h-10 w-10" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
        Your Cart is Empty
      </h2>

      <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
        Looks like you haven&apos;t added any items to your shopping cart yet. Explore our verified catalog to find incredible tech, fashion, and home lifestyle deals.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/products"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-hover active:scale-95 transition-all"
        >
          <span>Start Shopping</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 pt-6 border-t border-border/80 w-full max-w-lg">
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-3 font-medium">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Or explore popular departments:</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { name: 'Electronics', href: '/categories/electronics' },
            { name: 'Fashion & Apparel', href: '/categories/fashion' },
            { name: 'Home & Living', href: '/categories/home-living' },
            { name: 'Sports & Fitness', href: '/categories/sports-fitness' },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

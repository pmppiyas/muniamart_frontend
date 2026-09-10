'use client';

import * as React from 'react';
import Link from 'next/link';
import { CartItem } from '@/types/cart';
import { cn } from '@/lib/utils';

interface CartItemInfoProps {
  item: CartItem;
  className?: string;
}

export function CartItemInfo({ item, className }: CartItemInfoProps) {
  const productHref = item.slug ? `/products/${item.slug}` : `/products/${item.productId}`;

  return (
    <div className={cn('space-y-1.5 flex-1 min-w-0', className)}>
      {/* Category & Brand */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {item.category && (
          <span className="font-semibold text-primary">{item.category}</span>
        )}
        {item.brand && (
          <>
            <span>•</span>
            <span>{item.brand}</span>
          </>
        )}
      </div>

      {/* Product Title */}
      <Link
        href={productHref}
        className="block text-sm sm:text-base font-bold text-foreground hover:underline transition-colors line-clamp-2 leading-snug"
      >
        {item.name}
      </Link>

      {/* Selected Variants */}
      {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {Object.entries(item.selectedVariants).map(([key, val]) => (
            <span
              key={key}
              className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              <span className="capitalize text-foreground font-semibold mr-1">
                {key}:
              </span>
              <span>{val}</span>
            </span>
          ))}
        </div>
      )}

      {/* SKU & Stock Info */}
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-0.5">
        <span>SKU: {item.sku}</span>
        <span>•</span>
        {item.stock <= 5 ? (
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            Only {item.stock} left in stock
          </span>
        ) : (
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            In Stock
          </span>
        )}
      </div>
    </div>
  );
}

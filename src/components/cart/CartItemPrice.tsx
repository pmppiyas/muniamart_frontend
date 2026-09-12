'use client';

import * as React from 'react';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';

interface CartItemPriceProps {
  price: number;
  quantity: number;
  originalPrice?: number;
  className?: string;
}

export function CartItemPrice({
  price,
  quantity,
  originalPrice,
  className,
}: CartItemPriceProps) {
  const { formatPrice } = useCurrency();
  const lineTotal = price * quantity;
  const originalLineTotal = originalPrice ? originalPrice * quantity : undefined;
  const hasDiscount = originalLineTotal && originalLineTotal > lineTotal;

  return (
    <div className={cn('flex flex-col sm:items-end text-left sm:text-right', className)}>
      <div className="flex items-baseline gap-2">
        <span className="text-base sm:text-lg font-black text-foreground">
          {formatPrice(lineTotal)}
        </span>
        {hasDiscount && (
          <span className="text-xs text-muted-foreground line-through font-medium">
            {formatPrice(originalLineTotal)}
          </span>
        )}
      </div>

      {quantity > 1 && (
        <span className="text-[11px] text-muted-foreground">
          {formatPrice(price)} each
        </span>
      )}
    </div>
  );
}

'use client';

import * as React from 'react';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';

interface ProductPriceProps {
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  showBadge?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProductPrice({
  price,
  originalPrice,
  discountPercent,
  showBadge = false,
  className,
  size = 'md',
}: ProductPriceProps) {
  const { formatPrice } = useCurrency();

  const sizeClasses = {
    sm: {
      current: 'text-sm font-bold',
      original: 'text-xs',
    },
    md: {
      current: 'text-sm sm:text-base font-extrabold',
      original: 'text-[11px] sm:text-xs',
    },
    lg: {
      current: 'text-xl sm:text-2xl font-black',
      original: 'text-sm sm:text-base',
    },
  };

  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <div className={cn('flex items-baseline flex-wrap gap-2', className)}>
      <span className={cn('text-foreground tracking-tight', sizeClasses[size].current)}>
        {formatPrice(price)}
      </span>

      {hasDiscount && (
        <span
          className={cn(
            'text-muted-foreground line-through font-medium',
            sizeClasses[size].original
          )}
        >
          {formatPrice(originalPrice)}
        </span>
      )}

      {showBadge && discountPercent && discountPercent > 0 && (
        <span className="rounded-md bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold text-destructive">
          Save {discountPercent}%
        </span>
      )}
    </div>
  );
}

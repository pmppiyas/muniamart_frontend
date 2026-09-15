'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useMounted } from '@/hooks/useMounted';
import {
  selectCartTotalQuantity,
} from '@/features/cart/cartSelectors';
import { cn } from '@/lib/utils';

interface CartButtonProps {
  className?: string;
  count?: number;
  total?: number;
  onClick?: () => void;
}

export function CartButton({
  className,
  count,
  onClick,
}: CartButtonProps) {
  const mounted = useMounted();
  const reduxCount = useAppSelector(selectCartTotalQuantity);

  const displayCount = !mounted ? 0 : (count !== undefined ? count : reduxCount);

  return (
    <Link
      href="/cart"
      onClick={onClick}
      className={cn(
        'group relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-xs transition-all hover:border-primary hover:text-primary active:scale-95 cursor-pointer',
        className
      )}
      aria-label={`Shopping cart with ${displayCount} items`}
    >
      <ShoppingCart className="h-4 w-4 transition-transform group-hover:scale-110" />
      {displayCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground shadow-xs">
          {displayCount > 99 ? '99+' : displayCount}
        </span>
      )}
    </Link>
  );
}

'use client';

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  quantity: number;
  maxStock: number;
  onQuantityChange: (qty: number) => void;
  disabled?: boolean;
  className?: string;
}

export function QuantitySelector({
  quantity,
  maxStock,
  onQuantityChange,
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const isOutOfStock = maxStock <= 0 || disabled;

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxStock) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      if (val < 1) onQuantityChange(1);
      else if (val > maxStock) onQuantityChange(maxStock);
      else onQuantityChange(val);
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-xl border border-border bg-card shadow-2xs',
        isOutOfStock && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <button
        type="button"
        disabled={quantity <= 1 || isOutOfStock}
        onClick={handleDecrement}
        aria-label="Decrease quantity"
        className="flex h-11 w-10 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <Minus className="h-4 w-4" />
      </button>

      <input
        type="text"
        inputMode="numeric"
        value={isOutOfStock ? 0 : quantity}
        onChange={handleInputChange}
        disabled={isOutOfStock}
        className="h-11 w-12 border-x border-border bg-transparent text-center font-bold text-sm text-foreground focus:outline-none"
      />

      <button
        type="button"
        disabled={quantity >= maxStock || isOutOfStock}
        onClick={handleIncrement}
        aria-label="Increase quantity"
        className="flex h-11 w-10 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

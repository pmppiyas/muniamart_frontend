'use client';

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CartQuantitySelectorProps {
  quantity: number;
  maxStock: number;
  onQuantityChange: (newQuantity: number) => void;
  className?: string;
}

export function CartQuantitySelector({
  quantity,
  maxStock,
  onQuantityChange,
  className,
}: CartQuantitySelectorProps) {
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
        className
      )}
    >
      <button
        type="button"
        disabled={quantity <= 1}
        onClick={handleDecrement}
        aria-label="Decrease quantity"
        className="flex h-9 w-8 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <input
        type="text"
        inputMode="numeric"
        value={quantity}
        onChange={handleInputChange}
        className="h-9 w-10 border-x border-border bg-transparent text-center font-bold text-xs text-foreground focus:outline-none"
      />

      <button
        type="button"
        disabled={quantity >= maxStock}
        onClick={handleIncrement}
        aria-label="Increase quantity"
        className="flex h-9 w-8 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

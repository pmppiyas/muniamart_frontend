'use client';

import * as React from 'react';
import { Truck, Zap } from 'lucide-react';
import { DeliveryMethod } from '@/features/checkout/checkoutTypes';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';

interface DeliveryOptionsProps {
  selectedMethod: DeliveryMethod;
  onSelect: (method: DeliveryMethod) => void;
  standardFee: number;
  expressFee: number;
}

export function DeliveryOptions({
  selectedMethod,
  onSelect,
  standardFee,
  expressFee,
}: DeliveryOptionsProps) {
  const { formatPrice } = useCurrency();

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-foreground">
        Shipping Method
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          onClick={() => onSelect('standard')}
          className={cn(
            'flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all',
            selectedMethod === 'standard'
              ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary'
              : 'border-border bg-card hover:border-border/80'
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl',
                selectedMethod === 'standard'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Standard Delivery</p>
              <p className="text-xs text-muted-foreground">3 - 5 Business Days</p>
            </div>
          </div>
          <div className="text-right font-bold text-sm">
            {standardFee === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400">FREE</span>
            ) : (
              <span>{formatPrice(standardFee)}</span>
            )}
          </div>
        </div>

        <div
          onClick={() => onSelect('express')}
          className={cn(
            'flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all',
            selectedMethod === 'express'
              ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary'
              : 'border-border bg-card hover:border-border/80'
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl',
                selectedMethod === 'express'
                  ? 'bg-amber-500 text-white'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Express Delivery</p>
              <p className="text-xs text-muted-foreground">Within 24 Hours</p>
            </div>
          </div>
          <div className="text-right font-bold text-sm">
            <span>{formatPrice(expressFee)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

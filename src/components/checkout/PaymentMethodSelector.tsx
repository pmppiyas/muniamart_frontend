'use client';

import * as React from 'react';
import { Banknote, CreditCard, Smartphone, CheckCircle2 } from 'lucide-react';
import { PaymentMethod } from '@/features/checkout/checkoutTypes';
import { cn } from '@/lib/utils';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({
  selectedMethod,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-foreground">
        Payment Method
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => onSelect('cod')}
          className={cn(
            'relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all',
            selectedMethod === 'cod'
              ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary'
              : 'border-border bg-card hover:border-border/80'
          )}
        >
          {selectedMethod === 'cod' && (
            <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-primary" />
          )}
          <div
            className={cn(
              'mb-2 flex h-10 w-10 items-center justify-center rounded-xl',
              selectedMethod === 'cod'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Banknote className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-foreground">Cash on Delivery</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Pay upon delivery</p>
        </div>

        <div
          onClick={() => onSelect('bkash')}
          className={cn(
            'relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all',
            selectedMethod === 'bkash'
              ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary'
              : 'border-border bg-card hover:border-border/80'
          )}
        >
          {selectedMethod === 'bkash' && (
            <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-primary" />
          )}
          <div
            className={cn(
              'mb-2 flex h-10 w-10 items-center justify-center rounded-xl',
              selectedMethod === 'bkash'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Smartphone className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-foreground">bKash</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Redirect to bKash</p>
        </div>

        <div
          onClick={() => onSelect('card')}
          className={cn(
            'relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all',
            selectedMethod === 'card'
              ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary'
              : 'border-border bg-card hover:border-border/80'
          )}
        >
          {selectedMethod === 'card' && (
            <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-primary" />
          )}
          <div
            className={cn(
              'mb-2 flex h-10 w-10 items-center justify-center rounded-xl',
              selectedMethod === 'card'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <CreditCard className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-foreground">Card Payment</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Visa, Mastercard (Stripe)</p>
        </div>
      </div>

      {selectedMethod === 'cod' && (
        <div className="rounded-2xl border border-border/80 bg-muted/30 p-3.5 text-xs text-muted-foreground flex items-center gap-2">
          <Banknote className="h-4 w-4 text-primary shrink-0" />
          <span>You can pay in cash when the delivery courier arrives at your doorstep.</span>
        </div>
      )}

      {selectedMethod === 'bkash' && (
        <div className="rounded-2xl border border-pink-500/30 bg-pink-500/5 p-3.5 text-xs text-muted-foreground flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-pink-600 shrink-0" />
          <span>After placing your order, you will be redirected to the bKash payment page to complete your payment securely.</span>
        </div>
      )}

      {selectedMethod === 'card' && (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-3.5 text-xs text-muted-foreground flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-blue-600 shrink-0" />
          <span>After placing your order, a secure Stripe payment form will appear for you to enter your card details.</span>
        </div>
      )}
    </div>
  );
}

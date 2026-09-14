'use client';

import * as React from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, AlertCircle, ArrowUpRight, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function PaymentSettingsTab() {
  const [stripeActive, setStripeActive] = React.useState(true);
  const [bkashActive, setBkashActive] = React.useState(true);
  const [codActive, setCodActive] = React.useState(true);

  const handleToggle = (provider: string, currentState: boolean, setter: (val: boolean) => void) => {
    setter(!currentState);
    toast.success(`${provider} gateway status updated!`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="border-b border-border pb-4">
          <h3 className="text-base font-bold text-foreground">Active Payment Gateways</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor and manage integrated payment processors for your customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* bKash Gateway */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-background/50 p-5 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 font-extrabold text-sm">
                  bK
                </div>
                <Badge className={bkashActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-muted text-muted-foreground'}>
                  {bkashActive ? '● Active' : '● Disabled'}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground">bKash Payment</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Tokenized Sandbox v1.2.0 with safe auto-redirect
                </p>
              </div>

              <div className="space-y-1.5 text-[11px] text-muted-foreground border-t border-border/60 pt-3">
                <div className="flex justify-between">
                  <span>Currency:</span>
                  <span className="font-semibold text-foreground">BDT (৳)</span>
                </div>
                <div className="flex justify-between">
                  <span>Mode:</span>
                  <span className="font-semibold text-foreground">Sandbox Tokenized</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto Redirect:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Enabled</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggle('bKash', bkashActive, setBkashActive)}
              className="w-full rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
            >
              {bkashActive ? 'Disable bKash' : 'Enable bKash'}
            </button>
          </div>

          {/* Stripe Gateway */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-background/50 p-5 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-sm">
                  <CreditCard className="h-5 w-5" />
                </div>
                <Badge className={stripeActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-muted text-muted-foreground'}>
                  {stripeActive ? '● Active' : '● Disabled'}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground">Stripe Hosted Checkout</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Official Hosted Checkout with BDT card support
                </p>
              </div>

              <div className="space-y-1.5 text-[11px] text-muted-foreground border-t border-border/60 pt-3">
                <div className="flex justify-between">
                  <span>Currency:</span>
                  <span className="font-semibold text-foreground">BDT (৳) Native</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-semibold text-foreground">Hosted Checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>3D Secure:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Supported</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggle('Stripe', stripeActive, setStripeActive)}
              className="w-full rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
            >
              {stripeActive ? 'Disable Stripe' : 'Enable Stripe'}
            </button>
          </div>

          {/* Cash on Delivery */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-background/50 p-5 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <Badge className={codActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-muted text-muted-foreground'}>
                  {codActive ? '● Active' : '● Disabled'}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground">Cash on Delivery (COD)</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Direct payment upon physical product delivery
                </p>
              </div>

              <div className="space-y-1.5 text-[11px] text-muted-foreground border-t border-border/60 pt-3">
                <div className="flex justify-between">
                  <span>Additional Fee:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">0 BDT (Free)</span>
                </div>
                <div className="flex justify-between">
                  <span>Verification:</span>
                  <span className="font-semibold text-foreground">Automated Order</span>
                </div>
                <div className="flex justify-between">
                  <span>Availability:</span>
                  <span className="font-semibold text-foreground">Nationwide</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggle('Cash on Delivery', codActive, setCodActive)}
              className="w-full rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
            >
              {codActive ? 'Disable COD' : 'Enable COD'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

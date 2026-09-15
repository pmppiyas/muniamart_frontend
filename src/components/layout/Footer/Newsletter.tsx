'use client';

import * as React from 'react';
import { Mail, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface NewsletterProps {
  className?: string;
}

export function Newsletter({ className }: NewsletterProps) {
  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      toast.success('Thank you for subscribing! Check your inbox for your 10% discount code.');
    }, 600);
  };

  return (
    <div
      className={cn(
        'rounded-3xl bg-zinc-50 dark:bg-zinc-900/80 p-6 sm:p-8 lg:p-10 shadow-xs border border-zinc-100 dark:border-zinc-800/60',
        className
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Mail className="h-3.5 w-3.5" />
            <span>MUNIAMART VIP CLUB</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Get $10 Off Your First Order
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Subscribe to our weekly newsletter to receive member-only flash discounts, trending arrivals, and seasonal coupons.
          </p>
        </div>

        <div className="lg:col-span-5">
          {isSubscribed ? (
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-200 animate-in fade-in zoom-in-95">
              <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">Subscription Confirmed!</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Use coupon code{' '}
                  <span className="font-mono font-bold bg-white dark:bg-zinc-800 text-foreground px-1.5 py-0.5 rounded shadow-2xs border border-emerald-500/30">
                    WELCOME10
                  </span>{' '}
                  at checkout.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="h-12 w-full rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground shadow-2xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-hover active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <span>{isLoading ? 'Joining...' : 'Subscribe'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Zero spam guarantee. You can unsubscribe anytime with 1-click.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

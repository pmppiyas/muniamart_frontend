'use client';

import * as React from 'react';
import {
  ShieldCheck,
  Zap,
  Lock,
  Headphones,
  RotateCcw,
  Leaf,
} from 'lucide-react';

const VALUES = [
  {
    icon: ShieldCheck,
    title: '100% Genuine Authenticity',
    description:
      'We never deal with replicas or unauthorized imports. Every product is sourced directly from brand-certified channels.',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: Zap,
    title: 'Lightning Express Fulfillment',
    description:
      'Modern automated order sorting ensures your package is prepared, packed, and dispatched within hours of placing your order.',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: Lock,
    title: 'Bank-Grade Security',
    description:
      'End-to-end 256-bit encryption for payments via bKash, Cards, and Cash on Delivery. Your personal data is never compromised.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: Headphones,
    title: '24/7 Human Customer Care',
    description:
      'Our dedicated support team is on standby around the clock via hotline, email, and live messaging to resolve any inquiry.',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
  },
  {
    icon: RotateCcw,
    title: 'Hassle-Free 7-Day Returns',
    description:
      'Not completely satisfied with your order? Request a hassle-free return or replacement within 7 days with zero stress.',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
  },
  {
    icon: Leaf,
    title: 'Sustainable Practices',
    description:
      'We use recyclable packaging and optimize delivery routes to minimize carbon emissions across our nationwide logistics network.',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
];

export function AboutValues() {
  return (
    <section className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
          What Drives Us
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
          Core Values Behind Every Delivery
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          From careful quality checks to prompt doorstep delivery, our core principles guide everything we do.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {VALUES.map((val) => {
          const Icon = val.icon;
          return (
            <div
              key={val.title}
              className="group rounded-3xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 space-y-3"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${val.bg} ${val.color} border ${val.border} transition-transform group-hover:scale-110`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="text-base font-bold text-foreground">
                {val.title}
              </h3>

              <p className="text-xs text-foreground/75 leading-relaxed">
                {val.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

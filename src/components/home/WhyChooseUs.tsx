'use client';

import * as React from 'react';
import { BadgeCheck, Truck, Lock, RefreshCw } from 'lucide-react';
import { TrustFeature } from '@/types/product';

interface WhyChooseUsProps {
  features?: TrustFeature[];
}

const TRUST_STATS = [
  {
    icon: BadgeCheck,
    value: '100% Genuine',
    label: 'Official Brand Warranty',
  },
  {
    icon: Truck,
    value: 'All 64 Districts',
    label: 'Fast Nationwide Delivery',
  },
  {
    icon: Lock,
    value: 'Inspect & Pay',
    label: 'Cash on Delivery Available',
  },
  {
    icon: RefreshCw,
    value: '7 Days Return',
    label: 'Easy Replacement Policy',
  },
];

export function WhyChooseUs({ features }: WhyChooseUsProps) {
  return (
    <section className="py-7 sm:py-9 border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-2.5 sm:gap-3 border-b border-border/60 pb-3.5 sm:pb-4 mb-5 sm:mb-6">
          <span className="w-1.5 h-6 sm:h-7 bg-primary rounded-full shrink-0" />
          <h2 className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight text-foreground">
            Why Shop with MUNIAMART?
          </h2>
        </div>

        {/* 4 Compact Trust Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {TRUST_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/60 bg-card/60 shadow-2xs hover:border-primary/40 transition-colors"
              >
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

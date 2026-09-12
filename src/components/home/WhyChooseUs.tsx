'use client';

import * as React from 'react';
import {
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  Award,
  Sparkles,
  LucideIcon,
} from 'lucide-react';
import { TrustFeature } from '@/types/product';

const iconMap: Record<string, LucideIcon> = {
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  Award,
};

interface WhyChooseUsProps {
  features?: TrustFeature[];
}

export function WhyChooseUs({ features = [] }: WhyChooseUsProps) {
  if (!features || features.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-6 sm:py-8 bg-gradient-to-b from-primary/[0.03] via-background to-muted/20 border-y border-border/80">
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-36 w-3/4 max-w-2xl bg-gradient-to-r from-primary/10 via-blue-500/10 to-indigo-500/10 blur-3xl opacity-60" />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-6 space-y-1 sm:space-y-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary/15 via-blue-500/10 to-primary/5 border border-primary/20 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary shadow-2xs">
            <Sparkles className="h-3 w-3" />
            <span>Our Commitment</span>
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-foreground">
            Why Shop with{' '}
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
              MUNIAMART
            </span>
            ?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto line-clamp-1 sm:line-clamp-none">
            We provide a frictionless, customer-first shopping experience backed by security, speed, and real human support.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 max-w-5xl mx-auto">
          {features.map((feature) => {
            const IconComponent = (feature.icon && iconMap[feature.icon]) || ShieldCheck;

            return (
              <div
                key={feature.id}
                className="relative flex flex-col items-center justify-center text-center aspect-square rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-accent/25 p-3.5 sm:p-4 shadow-2xs"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 via-blue-500/10 to-indigo-500/15 text-primary border border-primary/20 shadow-2xs mb-2 sm:mb-2.5">
                  <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-foreground leading-tight mb-1 sm:mb-1.5">
                  {feature.title}
                </h3>

                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-[200px]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import * as React from 'react';
import { Sparkles, Users, PackageCheck, MapPin, ThumbsUp } from 'lucide-react';

const STATS = [
  {
    icon: Users,
    value: '50,000+',
    label: 'Happy Shoppers',
    description: 'Trusted by customers across Bangladesh',
  },
  {
    icon: PackageCheck,
    value: '15,000+',
    label: 'Verified Products',
    description: '100% authentic & quality inspected',
  },
  {
    icon: MapPin,
    value: '64 Districts',
    label: 'Nationwide Reach',
    description: 'Fast express home delivery',
  },
  {
    icon: ThumbsUp,
    value: '99.4%',
    label: 'Satisfaction Rate',
    description: 'Based on verified customer reviews',
  },
];

export function AboutHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-card via-card to-muted/30 p-6 sm:p-10 lg:p-14 shadow-xs">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-bold text-primary tracking-wide uppercase">
          <Sparkles className="h-3.5 w-3.5" />
          <span>About MUNIAMART</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
          Redefining Modern Online Shopping in{' '}
          <span className="text-primary">Bangladesh & Beyond</span>
        </h1>

        <p className="text-sm sm:text-base text-foreground/75 leading-relaxed max-w-2xl mx-auto">
          We&apos;re on a mission to connect millions of households with 100% authentic
          electronics, trending fashion, and everyday essentials—backed by lightning-fast
          delivery and customer care that genuinely listens.
        </p>
      </div>

      <div className="relative z-10 mt-10 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group rounded-2xl border border-border bg-card/80 backdrop-blur-xs p-4 sm:p-5 text-center transition-all hover:border-primary/40 hover:shadow-xs"
            >
              <div className="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110 mb-3">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-foreground mt-0.5">
                {stat.label}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 hidden sm:block">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

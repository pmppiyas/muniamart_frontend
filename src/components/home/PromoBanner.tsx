'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, ArrowRight, Clock } from 'lucide-react';
import { PromoBanner as PromoBannerType } from '@/types/product';

interface PromoBannerProps {
  banner?: PromoBannerType;
}

export function PromoBanner({ banner }: PromoBannerProps) {
  const [timeLeft, setTimeLeft] = React.useState({
    hours: 18,
    minutes: 45,
    seconds: 30,
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!banner) return null;

  return (
    <section className="py-8 sm:py-12 bg-background">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-4 sm:p-10 lg:p-12 shadow-sm group">
          {/* Background Image Container with High Visibility & Crisp Contrast */}
          <div className="absolute inset-0 z-0">
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              sizes="100vw"
              className="object-cover object-right opacity-90 sm:opacity-95 dark:opacity-85 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/60 via-40% to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent sm:hidden" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <Flame className="h-3.5 w-3.5 fill-current animate-pulse" />
                {banner.badge}
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                {banner.discountText}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-tight">
              {banner.title}
            </h2>

            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed max-w-xl">
              {banner.subtitle}
            </p>

            {/* Countdown timer */}
            <div className="pt-2 flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>Ends In:</span>
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: 'H', val: timeLeft.hours },
                  { label: 'M', val: timeLeft.minutes },
                  { label: 'S', val: timeLeft.seconds },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="flex items-center gap-0.5 rounded-lg border border-border bg-background/90 px-2 py-1 shadow-2xs"
                  >
                    <span className="font-mono text-xs font-bold text-foreground">
                      {String(unit.val).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3">
              <Link
                href={banner.buttonLink}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs sm:text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-hover active:scale-95 transition-all"
              >
                <span>{banner.buttonText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

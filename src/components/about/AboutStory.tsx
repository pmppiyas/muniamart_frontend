'use client';

import * as React from 'react';
import Image from 'next/image';
import { CheckCircle2, ShieldCheck, Truck, Clock } from 'lucide-react';

const HIGHLIGHTS = [
  'Direct partnerships with authorized global & local brands',
  'Rigorous multi-point quality check before every dispatch',
  'Transparent pricing with zero hidden surcharges or surprise fees',
  'Hassle-free 7-day return policy and prompt refund guarantees',
  'Comprehensive 24/7 customer support via phone, email, and live chat',
];

export function AboutStory() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-10 lg:p-12 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <span>Our Journey &amp; Mission</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-[1.2]">
            Born from a Simple Promise:{' '}
            <span className="text-primary">No Counterfeits, No Excuses, No Delays</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-foreground/80 leading-relaxed">
            <p>
              For years, online shopping in Bangladesh was fraught with unpredictability.
              Shoppers faced fake replicas, delayed orders, and unhelpful support channels.
              We created <strong>MUNIAMART</strong> to set a new gold standard in digital commerce.
            </p>
            <p>
              By eliminating middlemen and connecting directly with authorized manufacturers,
              we ensure that every single item that lands on your doorstep is 100% genuine,
              carefully packaged, and backed by our unconditional satisfaction guarantee.
            </p>
          </div>

          <div className="pt-2 space-y-2.5">
            {HIGHLIGHTS.map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/85">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-border shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop"
              alt="MuniaMart Warehouse and Order Fulfillment"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-black/60 backdrop-blur-md p-3.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">ISO-Standard Hub</p>
                  <p className="text-[10px] text-white/80">Dhaka Central Fulfillment</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                <Clock className="h-3 w-3" />
                <span>Same-Day Pack</span>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-2.5 rounded-2xl border border-border bg-card p-3 shadow-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Truck className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-foreground">Express Delivery</p>
              <p className="text-[10px] text-muted-foreground">Within 24–48 Hours</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

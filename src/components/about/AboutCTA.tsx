'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, PhoneCall } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function AboutCTA() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-tr from-primary to-blue-600 p-8 sm:p-12 text-primary-foreground shadow-lg">
      <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

      <div className="relative z-10 max-w-2xl space-y-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-xs">
          <ShoppingBag className="h-3.5 w-3.5" />
          Ready to Experience Modern Shopping?
        </span>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
          Join Over 50,000 Happy Shoppers Across Bangladesh
        </h2>

        <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
          Explore our hand-curated selection of gadgets, fashion collections, and home essentials.
          Enjoy secure payments, genuine brand warranties, and swift doorstep delivery.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link
            href="/products"
            className="inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-xs sm:text-sm font-bold text-primary shadow-sm hover:bg-zinc-100 active:scale-95 transition-all"
          >
            <span>Explore All Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-xs px-5 text-xs sm:text-sm font-bold text-white hover:bg-white/20 transition-all"
          >
            <PhoneCall className="h-4 w-4" />
            <span>Call Support: {siteConfig.contact.phone}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

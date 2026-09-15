'use client';

import * as React from 'react';
import Link from 'next/link';
import { Phone, Truck, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { CurrencySwitcher } from '@/components/common/CurrencySwitcher';

export function TopNavbar() {
  return (
    <div className="border-b border-border/60 bg-zinc-900 text-zinc-100 dark:bg-black dark:border-zinc-800 text-[11px]">
      <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-medium text-zinc-300">
            <Truck className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden sm:inline">
              Free Express Delivery on orders over ৳500
            </span>
            <span className="sm:hidden">Free Delivery &gt; ৳500</span>
          </span>
          <span className="hidden md:inline text-zinc-600">|</span>
          <Link
            href="/products?sale=true"
            className="hidden md:inline font-bold text-amber-400 hover:text-amber-300 hover:underline transition-colors"
          >
            Flash Sale Now Live
          </Link>
        </div>

        <div className="flex items-center gap-4 text-zinc-300">
          <Link
            href="/profile"
            className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Track Order</span>
          </Link>

          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="hidden sm:flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone className="h-3 w-3 text-blue-400" />
            <span>{siteConfig.contact.phone}</span>
          </a>

          <CurrencySwitcher variant="topbar" />
        </div>
      </div>
    </div>
  );
}

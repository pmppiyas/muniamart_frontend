'use client';

import * as React from 'react';
import { Truck } from 'lucide-react';
import { CurrencySwitcher } from '@/components/common/CurrencySwitcher';

export function TopNavbar() {
  return (
    <div className="border-b border-border/40 bg-zinc-950 text-zinc-300 text-[11px]">
      <div className="mx-auto flex h-7 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 font-medium text-zinc-300">
          <Truck className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">
            Free Express Delivery on orders over ৳500
          </span>
          <span className="sm:hidden">Free Delivery &gt; ৳500</span>
        </div>

        <div className="flex items-center gap-3">
          <CurrencySwitcher variant="topbar" />
        </div>
      </div>
    </div>
  );
}

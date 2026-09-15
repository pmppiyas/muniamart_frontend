'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  variant?: 'default' | 'dark';
}

export function Logo({ className, showTagline = false, variant = 'default' }: LogoProps) {
  const isDark = variant === 'dark';

  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center gap-2.5 transition-transform active:scale-95',
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30 transition-all group-hover:bg-primary/90 group-hover:shadow-primary/40">
        <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight">
          <span className={cn('text-xl font-black', isDark ? 'text-white' : 'text-foreground')}>
            MUNIA
          </span>
          <span className="ml-1 rounded-md bg-primary px-1.5 py-0.5 text-xs font-extrabold tracking-wider text-primary-foreground">
            MART
          </span>
        </div>
        {showTagline && (
          <span className={cn('text-[10px] font-medium tracking-wide', isDark ? 'text-zinc-400' : 'text-muted-foreground')}>
            PREMIUM SHOPPING
          </span>
        )}
      </div>
    </Link>
  );
}

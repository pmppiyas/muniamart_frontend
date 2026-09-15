'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Headphones } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { CategoryDropdown } from './CategoryDropdown';
import { cn } from '@/lib/utils';

function CategoryNavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isItemActive = (href: string) => {
    if (href.includes('?')) {
      const [itemPath, itemQuery] = href.split('?');
      if (pathname !== itemPath) return false;
      const targetParams = new URLSearchParams(itemQuery);
      for (const [key, value] of targetParams.entries()) {
        if (searchParams.get(key) !== value) {
          return false;
        }
      }
      return true;
    }

    if (href === '/products') {
      if (pathname !== '/products') return false;

      const isDeals = searchParams.get('deal') === 'true';
      const isNewest = searchParams.get('sort') === 'newest';
      return !isDeals && !isNewest;
    }

    if (href === '/') {
      return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="flex items-center gap-1 lg:gap-2">
      {siteConfig.navItems.map((item) => {
        const isActive = isItemActive(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors select-none',
              isActive
                ? 'text-primary bg-primary/10'
                : 'text-foreground/80 hover:text-primary hover:bg-muted'
            )}
          >
            <span>{item.label}</span>
            {item.badge && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[9px] font-extrabold uppercase',
                  item.badge === 'Hot'
                    ? 'bg-destructive text-destructive-foreground shadow-xs'
                    : 'bg-success text-success-foreground shadow-xs'
                )}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function CategoryNavLinksFallback() {
  return (
    <nav className="flex items-center gap-1 lg:gap-2">
      {siteConfig.navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-foreground/80 hover:text-primary hover:bg-muted transition-colors select-none"
        >
          <span>{item.label}</span>
          {item.badge && (
            <span
              className={cn(
                'rounded-full px-1.5 py-0.2 text-[9px] font-extrabold uppercase',
                item.badge === 'Hot'
                  ? 'bg-destructive text-destructive-foreground shadow-xs'
                  : 'bg-success text-success-foreground shadow-xs'
              )}
            >
              {item.badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}

export function CategoryNavbar() {
  return (
    <div className="hidden md:block bg-background">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <CategoryDropdown />

          <React.Suspense fallback={<CategoryNavLinksFallback />}>
            <CategoryNavLinks />
          </React.Suspense>
        </div>

        <div className="hidden xl:flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Headphones className="h-4 w-4 text-primary" />
          <span>Support 24/7:</span>
          <span className="font-bold text-foreground">
            {siteConfig.contact.phone}
          </span>
        </div>
      </div>
    </div>
  );
}

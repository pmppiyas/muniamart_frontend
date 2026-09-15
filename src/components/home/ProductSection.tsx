'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: 'primary' | 'warning' | 'success' | 'destructive';
  viewAllHref?: string;
  products?: Product[];
  children?: React.ReactNode;
  className?: string;
}

export function ProductSection({
  title,
  subtitle,
  badge,
  badgeVariant = 'primary',
  viewAllHref,
  products = [],
  children,
  className,
}: ProductSectionProps) {
  const badgeClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <section className={cn('py-8 sm:py-12', className)}>
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4 mb-6">
          <div className="space-y-1">
            {badge && (
              <span
                className={cn(
                  'inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                  badgeClasses[badgeVariant]
                )}
              >
                {badge}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>

          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {children ? (
          children
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

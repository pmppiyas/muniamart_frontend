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
  viewAllHref,
  products = [],
  children,
  className,
}: ProductSectionProps) {
  return (
    <section className={cn('py-7 sm:py-10', className)}>
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-3.5 sm:pb-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="w-1.5 h-6 sm:h-7 bg-primary rounded-full shrink-0" />
            <h2 className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight text-foreground">
              {title}
            </h2>
          </div>

          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors shrink-0"
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

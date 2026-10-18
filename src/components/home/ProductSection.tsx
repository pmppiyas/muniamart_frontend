'use client';

import * as React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { SectionHeader } from '@/components/common/SectionHeader';
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
        <SectionHeader
          title={title}
          viewAllHref={viewAllHref}
        />

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

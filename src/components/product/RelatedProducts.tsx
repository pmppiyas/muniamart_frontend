'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: string;
  allProducts: Product[];
  className?: string;
}

export function RelatedProducts({
  currentProductId,
  categoryId,
  allProducts,
  className,
}: RelatedProductsProps) {
  const related = React.useMemo(() => {
    return allProducts
      .filter((p) => p.id !== currentProductId && (!categoryId || p.categoryId === categoryId))
      .slice(0, 4);
  }, [allProducts, currentProductId, categoryId]);

  if (related.length === 0) return null;

  return (
    <section className={cn('py-8 sm:py-12 border-t border-border', className)}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          Related Products
        </h2>

        <Link
          href="/products"
          className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline"
        >
          <span>View Catalog</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

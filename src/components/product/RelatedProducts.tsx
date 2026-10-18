'use client';

import * as React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { SectionHeader } from '@/components/common/SectionHeader';
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
      <SectionHeader
        title="Related Products"
        viewAllHref="/products"
        viewAllText="View Catalog"
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

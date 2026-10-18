'use client';

import * as React from 'react';
import { Product } from '@/types/product';
import { ProductSection } from './ProductSection';

interface BestSellingProps {
  products?: Product[];
}

export function BestSelling({ products = [] }: BestSellingProps) {
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 5);
  const displayProducts = bestSellers.length > 0 ? bestSellers : products.slice(0, 5);

  return (
    <ProductSection
      title="Best Selling Products"
      viewAllHref="/products?sort=bestseller"
      products={displayProducts}
    />
  );
}

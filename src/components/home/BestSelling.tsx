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
      badge="CUSTOMER FAVORITES"
      badgeVariant="warning"
      title="Best Selling Products"
      subtitle="The most loved and top-reviewed items across our departments, trusted by thousands of happy shoppers."
      viewAllHref="/products?sort=bestseller"
      products={displayProducts}
    />
  );
}

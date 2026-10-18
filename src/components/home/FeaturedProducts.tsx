'use client';

import * as React from 'react';
import { Product } from '@/types/product';
import { ProductSection } from './ProductSection';

interface FeaturedProductsProps {
  products?: Product[];
}

export function FeaturedProducts({ products = [] }: FeaturedProductsProps) {
  const featured = products.filter((p) => p.isFeatured).slice(0, 5);
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 5);

  return (
    <ProductSection
      title="Featured Products"
      viewAllHref="/products?featured=true"
      products={displayProducts}
    />
  );
}

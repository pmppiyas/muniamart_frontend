'use client';

import * as React from 'react';
import { Product } from '@/types/product';
import { ProductSection } from './ProductSection';

interface NewArrivalsProps {
  products?: Product[];
}

export function NewArrivals({ products = [] }: NewArrivalsProps) {
  const newProducts = products.filter((p) => p.isNew).slice(0, 5);
  const displayProducts = newProducts.length > 0 ? newProducts : products.slice(0, 5);

  return (
    <ProductSection
      badge="JUST DROPPED"
      badgeVariant="primary"
      title="New Arrivals"
      subtitle="Stay ahead with the freshest seasonal releases, innovative designs, and cutting-edge tech gear."
      viewAllHref="/products?sort=newest"
      products={displayProducts}
    />
  );
}

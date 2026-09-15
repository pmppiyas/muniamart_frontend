'use client';

import * as React from 'react';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductSpecificationsProps {
  product: Product;
  className?: string;
}

export function ProductSpecifications({
  product,
  className,
}: ProductSpecificationsProps) {
  const specs: Record<string, string> = {
    SKU: product.sku,
    Brand: product.brand || 'MUNIAMART Certified',
    Category: product.category?.name || 'General Merchandise',
    'Availability Status': product.stock > 0 ? 'In Stock' : 'Out of Stock',
    'Current Stock': `${product.stock} units`,
    ...(product.specifications || {}),
  };

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-bold text-foreground">
        Technical Specifications
      </h3>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xs">
        <table className="w-full text-left text-xs">
          <tbody>
            {Object.entries(specs).map(([key, value], idx) => (
              <tr
                key={key}
                className={cn(
                  'border-b border-border/60 transition-colors last:border-b-0',
                  idx % 2 === 0 ? 'bg-card' : 'bg-muted/30'
                )}
              >
                <td className="w-1/3 py-3 px-4 font-bold text-muted-foreground">
                  {key}
                </td>
                <td className="py-3 px-4 font-medium text-foreground">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

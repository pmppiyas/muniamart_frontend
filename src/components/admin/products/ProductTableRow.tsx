'use client';

import * as React from 'react';
import Image from 'next/image';
import { Package, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ProductRowActions } from './ProductRowActions';
import { Product } from '@/types/product';
import { useCurrency } from '@/hooks/useCurrency';

interface ProductTableRowProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTableRow({
  product,
  onView,
  onEdit,
  onDelete,
}: ProductTableRowProps) {
  const { formatPrice } = useCurrency();

  const renderStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
          <XCircle className="h-3.5 w-3.5" />
          Out of Stock
        </span>
      );
    }
    if (stock <= 5) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
          <AlertCircle className="h-3.5 w-3.5" />
          Low ({stock} left)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {stock} in stock
      </span>
    );
  };

  return (
    <TableRow className="group">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/30">
            {product.photoUrl ? (
              <Image
                src={product.photoUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Package className="h-5 w-5 opacity-40" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p
              className="font-bold text-sm text-foreground truncate max-w-[220px] sm:max-w-[280px] hover:text-primary transition-colors cursor-pointer"
              onClick={() => onView(product)}
              title={product.name}
            >
              {product.name}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">
              SKU: {product.sku}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        {product.category?.name ? (
          <Badge variant="outline" className="text-xs font-medium">
            {product.category.name}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground italic">Uncategorized</span>
        )}
      </TableCell>

      <TableCell>
        <span className="font-bold text-sm text-foreground">
          {formatPrice(product.price)}
        </span>
      </TableCell>

      <TableCell>
        {renderStockBadge(product.stock)}
      </TableCell>

      <TableCell>
        <Badge
          variant={product.status === 'ACTIVE' ? 'default' : 'secondary'}
          className="text-[10px] font-bold"
        >
          {product.status === 'ACTIVE' ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>

      <TableCell className="text-right">
        <ProductRowActions
          product={product}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}

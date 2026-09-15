'use client';

import * as React from 'react';
import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';

interface ProductActionsProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  variant?: 'card' | 'list';
  className?: string;
}

export function ProductActions({
  product,
  onAddToCart,
  variant = 'card',
  className,
}: ProductActionsProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      await addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        price: product.price,
        originalPrice: product.originalPrice,
        photoUrl: product.photoUrl,
        category: product.category?.name,
        brand: product.brand,
        stock: product.stock,
        quantity: 1,
      });

      toast.success(`Added "${product.name}" to cart!`, {
        description: `Price: ${formatPrice(product.price)}`,
      });
    }
  };

  if (variant === 'list') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-xs transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <button
        type="button"
        disabled={isOutOfStock}
        onClick={handleAddToCart}
        className="flex h-8 sm:h-9 w-full items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-primary px-2 sm:px-3 text-[11px] sm:text-xs font-bold text-primary-foreground shadow-xs transition-all hover:bg-primary-hover active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <ShoppingBag className="h-3.5 w-3.5" />
        <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
      </button>
    </div>
  );
}

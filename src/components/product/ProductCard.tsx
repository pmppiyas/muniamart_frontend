'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Package } from 'lucide-react';
import { Product, ViewMode } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import { useCurrency } from '@/hooks/useCurrency';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  viewMode?: ViewMode;
  className?: string;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({
  product,
  viewMode = 'grid',
  className,
  onAddToCart,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  const isOutOfStock = product.stock <= 0;
  const hasDiscount = Boolean(
    product.originalPrice && product.originalPrice > product.price
  );
  const savings = hasDiscount
    ? (product.originalPrice as number) - product.price
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

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

      toast.success(`Added "${product.name}" to cart!`);
    }
  };

  const productHref = `/products/${product.slug || product.id}`;

  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          'group relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-5 rounded-2xl sm:rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-card p-2.5 sm:p-3.5 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md',
          className
        )}
      >
        <Link
          href={productHref}
          className="relative h-44 w-full sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-2xl bg-muted/20 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          title={product.name}
        >
          {product.photoUrl ? (
            <Image
              src={product.photoUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 150px"
              className="object-cover object-center"
            />
          ) : (
            <Package className="h-10 w-10 text-muted-foreground" />
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-2xs">
              <span className="rounded-lg bg-zinc-900 px-3 py-1 text-xs font-bold text-white shadow-xs">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        <div className="flex flex-1 flex-col justify-between space-y-2">
          <div>
            <Link
              href={productHref}
              className="block text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2"
              title={product.name}
            >
              {product.name}
            </Link>

            {product.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-lg font-black text-foreground">
              {formatPrice(product.price)}
            </div>
            {hasDiscount && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground line-through font-medium">
                  {formatPrice(product.originalPrice!)}
                </span>
                <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {formatPrice(savings)} OFF
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-6 gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Link
              href={productHref}
              className="h-10 px-5 flex items-center justify-center rounded-full border border-border/80 bg-background text-xs font-bold text-foreground transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-98 cursor-pointer"
            >
              Shop Now
            </Link>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="h-10 w-10 flex items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200/90 dark:border-zinc-800/80 bg-card p-2 sm:p-2.5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-border/80',
        className
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/15 flex items-center justify-center">
        <Link
          href={productHref}
          className="block h-full w-full relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          title={product.name}
        >
          {product.photoUrl ? (
            <Image
              src={product.photoUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Package className="h-10 w-10" />
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-2xs">
              <span className="rounded-lg bg-zinc-900 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                Out of Stock
              </span>
            </div>
          )}
        </Link>
      </div>

      <div className="mt-2 flex flex-1 flex-col justify-between px-0.5">
        <div>
          <Link
            href={productHref}
            className="block font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>

          <div className="mt-1 space-y-0.5">
            <div className="text-sm sm:text-base font-bold text-foreground tracking-tight">
              {formatPrice(product.price)}
            </div>

            {hasDiscount ? (
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[11px] sm:text-xs text-muted-foreground line-through font-medium">
                  {formatPrice(product.originalPrice!)}
                </span>
                <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.2 text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {formatPrice(savings)} OFF
                </span>
              </div>
            ) : product.discountPercent && product.discountPercent > 0 ? (
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.2 text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {product.discountPercent}% OFF
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5">
          <Link
            href={productHref}
            className="flex-1 h-8.5 sm:h-9 flex items-center justify-center rounded-full border border-border/80 bg-background text-xs font-bold text-foreground transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground hover:!bg-primary-hover hover:!border-primary hover:!text-primary-foreground active:scale-98 cursor-pointer shadow-2xs"
          >
            Shop Now
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={`Add ${product.name} to cart`}
            className="h-8.5 w-8.5 sm:h-9 sm:w-9 shrink-0 flex items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
          >
            <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

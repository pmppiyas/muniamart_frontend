'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RefreshCw,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types/product';
import { ProductPrice } from './ProductPrice';
import { ProductRating } from './ProductRating';
import { ProductVariants } from './ProductVariants';
import { QuantitySelector } from './QuantitySelector';
import { useCart } from '@/hooks/useCart';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';

interface ProductInfoProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number, variants: Record<string, string>) => void;
  onBuyNow?: (product: Product, quantity: number, variants: Record<string, string>) => void;
  className?: string;
}

export function ProductInfo({
  product,
  onAddToCart,
  onBuyNow,
  className,
}: ProductInfoProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [quantity, setQuantity] = React.useState(1);
  const [selectedVariants, setSelectedVariants] = React.useState<Record<string, string>>({});

  const isOutOfStock = product.stock <= 0;

  const handleSelectVariant = (type: string, variantId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [type]: variantId,
    }));
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    if (onAddToCart) {
      onAddToCart(product, quantity, selectedVariants);
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
        quantity,
        selectedVariants,
      });
      toast.success(`Added ${quantity} item(s) to your cart!`, {
        description: `${product.name} - ${formatPrice(product.price * quantity)}`,
      });
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    if (onBuyNow) {
      onBuyNow(product, quantity, selectedVariants);
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
        quantity,
        selectedVariants,
      });
      toast.success('Proceeding to checkout...', {
        description: `${quantity}x ${product.name}`,
      });
      router.push('/cart');
    }
  };

  const scrollToReviews = (e: React.MouseEvent) => {
    e.preventDefault();
    const reviewsEl = document.getElementById('product-reviews');
    if (reviewsEl) {
      reviewsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={cn('flex flex-col space-y-6', className)}>
      {/* Category, Brand, SKU */}
      <div className="space-y-1.5 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {product.category && (
            <Link
              href={`/categories/${product.category.slug}`}
              className="font-bold text-primary hover:underline"
            >
              {product.category.name}
            </Link>
          )}
          {product.brand && (
            <>
              <span>•</span>
              <span className="font-semibold text-foreground">{product.brand}</span>
            </>
          )}
          <span>•</span>
          <span>SKU: {product.sku}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-tight">
          {product.name}
        </h1>

        {/* Rating and Reviews Anchor */}
        <div className="flex items-center gap-3 pt-1">
          <ProductRating
            rating={product.rating}
            reviewsCount={product.reviewsCount}
            size="md"
          />
          {product.reviewsCount ? (
            <button
              type="button"
              onClick={scrollToReviews}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Read {product.reviewsCount} reviews
            </button>
          ) : null}
        </div>
      </div>

      {/* Pricing & Stock Status */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-5">
        <div>
          <ProductPrice
            price={product.price}
            originalPrice={product.originalPrice}
            discountPercent={product.discountPercent}
            size="lg"
            showBadge
          />
          <p className="mt-1 text-xs text-muted-foreground">
            All taxes and duties included. Free standard delivery available.
          </p>
        </div>

        {/* Stock Status Badge */}
        <div>
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 border border-destructive/20 px-3 py-1 text-xs font-bold text-destructive">
              Out of Stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              Only {product.stock} items left in stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Check className="h-3.5 w-3.5" />
              <span>In Stock ({product.stock} units)</span>
            </span>
          )}
        </div>
      </div>

      {/* Short Description & Bullet Highlights */}
      <div className="space-y-3">
        {product.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        )}

        {product.features && product.features.length > 0 && (
          <ul className="space-y-1.5 pt-1">
            {product.features.slice(0, 4).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-foreground/90">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Product Variants (Color, Size, etc.) */}
      {product.variants && product.variants.length > 0 && (
        <div className="border-t border-border pt-4">
          <ProductVariants
            variants={product.variants}
            selectedVariants={selectedVariants}
            onSelectVariant={handleSelectVariant}
          />
        </div>
      )}

      {/* Quantity & CTA Buttons */}
      <div className="space-y-4 border-t border-border pt-5">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Quantity:
          </span>
          <QuantitySelector
            quantity={quantity}
            maxStock={product.stock}
            onQuantityChange={setQuantity}
            disabled={isOutOfStock}
          />
        </div>

        {/* Action Buttons: Add to Cart, Buy Now */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
          {/* Add to Cart */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="flex-1 flex h-12 min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-hover active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>

          {/* Buy Now */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
            className="flex-1 flex h-12 min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 text-sm font-bold text-white shadow-sm hover:bg-amber-600 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <Zap className="h-4 w-4 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* Assurance / Trust Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-border bg-muted/20 p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Truck className="h-4 w-4" />
          </div>
          <div className="text-[11px]">
            <p className="font-bold text-foreground">Free Delivery</p>
            <p className="text-muted-foreground">On orders over $50</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="text-[11px]">
            <p className="font-bold text-foreground">100% Genuine</p>
            <p className="text-muted-foreground">Certified authentic</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <RefreshCw className="h-4 w-4" />
          </div>
          <div className="text-[11px]">
            <p className="font-bold text-foreground">30 Days Return</p>
            <p className="text-muted-foreground">Hassle-free guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
}

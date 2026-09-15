import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductDetailTabs } from './ProductDetailTabs';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import {
  getProductByIdOrSlugFromDb,
  getProductsFromDb,
} from '@/services/productService';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductByIdOrSlugFromDb(slug);

  if (!product) {
    return {
      title: 'Product Not Found | MUNIAMART',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.name} | MUNIAMART`,
    description: product.description || `Shop ${product.name} at MUNIAMART with fast free shipping and guaranteed authenticity.`,
    openGraph: {
      title: `${product.name} | MUNIAMART`,
      description: product.description || `Shop ${product.name} at MUNIAMART.`,
      images: product.photoUrl ? [{ url: product.photoUrl }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProductByIdOrSlugFromDb(slug),
    getProductsFromDb(),
  ]);

  if (!product) {
    notFound();
  }
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.photoUrl
      ? [product.photoUrl]
      : [];

  return (
    <div className="py-6 sm:py-8 lg:py-10 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
          <Link
            href="/products"
            className="hover:text-primary transition-colors"
          >
            Shop
          </Link>
          {product.category && (
            <>
              <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
              <Link
                href={`/categories/${product.category.slug}`}
                className="hover:text-primary transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
          <span className="font-bold text-foreground line-clamp-1 max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-6 lg:sticky lg:top-[176px]">
            <ProductGallery
              images={galleryImages}
              productName={product.name}
              discountPercent={product.discountPercent}
              isNew={product.isNew}
              isBestSeller={product.isBestSeller}
              isOutOfStock={product.stock <= 0}
            />
          </div>

          <div className="lg:col-span-6">
            <ProductInfo product={product} />
          </div>
        </div>

        <ProductDetailTabs product={product} />

        <RelatedProducts
          currentProductId={product.id}
          categoryId={product.categoryId}
          allProducts={allProducts}
        />
      </div>
    </div>
  );
}

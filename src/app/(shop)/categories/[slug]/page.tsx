import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { getCategoryBySlugFromDb } from '@/services/categoryService';
import { getProductsFromDb } from '@/services/productService';
import { Product } from '@/types/product';
import { CategoryPageContent } from './CategoryPageContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlugFromDb(slug);

  if (!category) {
    return {
      title: 'Category Not Found | MUNIAMART',
      description: 'The requested department could not be found.',
    };
  }

  return {
    title: `${category.name} | Shop Online at MUNIAMART`,
    description:
      category.description ||
      `Explore high quality ${category.name} with fast delivery and guaranteed authenticity at MUNIAMART.`,
    openGraph: {
      title: `${category.name} | MUNIAMART`,
      description: category.description || undefined,
      images: category.imageUrl ? [{ url: category.imageUrl }] : [],
    },
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlugFromDb(slug);

  if (!category) {
    notFound();
  }

  const allProducts = await getProductsFromDb();
  const categoryProducts = allProducts.filter(
    (p) =>
      p.categoryId === category.id ||
      p.category?.slug?.toLowerCase() === category.slug.toLowerCase()
  );

  return (
    <div className="py-6 sm:py-8 lg:py-10 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <React.Suspense fallback={<div className="min-h-[400px] animate-pulse rounded-3xl bg-muted/40" />}>
          <CategoryPageContent
            category={category}
            categoryProducts={categoryProducts}
          />
        </React.Suspense>
      </div>
    </div>
  );
}

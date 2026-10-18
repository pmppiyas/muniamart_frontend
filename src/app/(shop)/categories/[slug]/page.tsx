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

  // Recursively collect all descendant category IDs and slugs
  const allDescendantCategoryIds = new Set<string>([category.id]);
  const allDescendantCategorySlugs = new Set<string>([category.slug.toLowerCase()]);

  const queue = [...(category.children || [])];
  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) continue;
    allDescendantCategoryIds.add(item.id);
    if (item.slug) allDescendantCategorySlugs.add(item.slug.toLowerCase());
    if (item.children && item.children.length > 0) {
      queue.push(...item.children);
    }
  }

  const categoryProducts = allProducts.filter((p) => {
    if (allDescendantCategoryIds.has(p.categoryId)) return true;
    if (p.subcategoryId && allDescendantCategoryIds.has(p.subcategoryId)) return true;
    if (p.subcategorySlug && allDescendantCategorySlugs.has(p.subcategorySlug.toLowerCase())) return true;
    if (p.category) {
      if (allDescendantCategoryIds.has(p.category.id)) return true;
      if (p.category.slug && allDescendantCategorySlugs.has(p.category.slug.toLowerCase())) return true;
      if (p.category.parentId && allDescendantCategoryIds.has(p.category.parentId)) return true;
    }
    return false;
  });

  return (
    <div className="pb-10 sm:pb-12 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
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

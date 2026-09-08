'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ExternalLink,
  Folder,
  Layers,
  ShoppingBag,
  Calendar,
  Pencil,
  CornerDownRight,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/types/category';

interface CategoryViewModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (category: Category) => void;
}

export function CategoryViewModal({
  category,
  isOpen,
  onClose,
  onEdit,
}: CategoryViewModalProps) {
  if (!category) return null;

  const isRoot = !category.parentId;
  const productCount =
    category._count?.products ??
    category.itemCount ??
    0;

  const children = category.children || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Category Details"
      description={`Catalog department and hierarchy information for ${category.name}`}
      maxWidth="lg"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onEdit(category)}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Edit Category
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Header Preview Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-border bg-muted/20 p-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40 flex items-center justify-center">
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : isRoot ? (
              <Folder className="h-8 w-8 text-primary/80" />
            ) : (
              <Layers className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-foreground truncate">
                {category.name}
              </h2>
              {isRoot ? (
                <Badge
                  variant="default"
                  className="text-[10px] font-bold h-5 px-2 bg-primary/15 text-primary border-primary/25"
                >
                  Root Department
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="text-[10px] font-semibold h-5 px-2"
                >
                  Subcategory
                </Badge>
              )}
            </div>

            <p className="font-mono text-xs text-muted-foreground">
              Slug: /{category.slug}
            </p>

            {category.description && (
              <p className="text-xs text-muted-foreground pt-1 line-clamp-2">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Hierarchy & Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-3 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5 text-primary" />
              Products
            </span>
            <p className="text-base font-bold text-foreground">{productCount}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-3 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              Subcategories
            </span>
            <p className="text-base font-bold text-foreground">{children.length}</p>
          </div>

          <div className="col-span-2 sm:col-span-1 rounded-xl border border-border bg-card p-3 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Created
            </span>
            <p className="text-xs font-medium text-foreground">
              {category.createdAt
                ? new Date(category.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '—'}
            </p>
          </div>
        </div>

        {/* Nested Subcategories List */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Nested Subcategories ({children.length})
          </h3>

          {children.length === 0 ? (
            <p className="text-xs text-muted-foreground italic py-2">
              No subcategories nested under this department yet.
            </p>
          ) : (
            <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CornerDownRight className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">
                        {child.name}
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        /{child.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {child._count?.products ?? child.itemCount ?? 0} Products
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Public Catalog Link */}
        <div className="pt-1 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
          <span>Customer shop view:</span>
          <Link
            href={`/categories/${category.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            <span>View in storefront</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </Modal>
  );
}

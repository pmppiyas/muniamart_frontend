'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Package, Tag, Calendar, Layers, CheckCircle2, XCircle } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { useCurrency } from '@/hooks/useCurrency';

interface ProductViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (product: Product) => void;
}

export function ProductViewModal({
  product,
  isOpen,
  onClose,
  onEdit,
}: ProductViewModalProps) {
  const { formatPrice } = useCurrency();

  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Product Details"
      description={`Viewing details and inventory for SKU: ${product.sku}`}
      maxWidth="2xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          {product.slug && (
            <Button asChild variant="outline" size="sm">
              <Link
                href={`/products/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                View in Store
              </Link>
            </Button>
          )}
          {onEdit && (
            <Button
              size="sm"
              onClick={() => {
                onClose();
                onEdit(product);
              }}
            >
              Edit Product
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="relative h-44 w-44 sm:h-48 sm:w-48 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/30">
            {product.photoUrl ? (
              <Image
                src={product.photoUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 200px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Package className="h-10 w-10 opacity-40" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={product.status === 'ACTIVE' ? 'default' : 'secondary'}
                  className="text-[11px]"
                >
                  {product.status === 'ACTIVE' ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <XCircle className="h-3 w-3 text-muted-foreground" /> Inactive
                    </span>
                  )}
                </Badge>
                {product.category && (
                  <Badge variant="outline" className="text-[11px]">
                    <Layers className="h-3 w-3 mr-1" />
                    {product.category.name}
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-bold text-foreground mt-2">
                {product.name}
              </h3>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                SKU: <span className="font-semibold text-foreground">{product.sku}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-border/80 bg-background/50 p-3">
                <span className="text-[11px] font-medium text-muted-foreground">Price</span>
                <p className="text-lg font-black text-foreground">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div className="rounded-xl border border-border/80 bg-background/50 p-3">
                <span className="text-[11px] font-medium text-muted-foreground">Stock Available</span>
                <p className="text-lg font-black text-foreground">
                  {product.stock}{' '}
                  <span className="text-xs font-normal text-muted-foreground">units</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="space-y-1.5 rounded-xl border border-border/60 bg-muted/20 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Description
            </h4>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-lg border border-border/60 p-3">
            <span className="text-muted-foreground text-[11px] block">Created At</span>
            <span className="font-medium text-foreground">
              {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <span className="text-muted-foreground text-[11px] block">Last Updated</span>
            <span className="font-medium text-foreground">
              {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="rounded-lg border border-border/60 p-3 col-span-2 sm:col-span-1">
            <span className="text-muted-foreground text-[11px] block">Category ID</span>
            <span className="font-mono text-[11px] text-foreground truncate block" title={product.categoryId}>
              {product.categoryId || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

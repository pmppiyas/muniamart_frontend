'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  discountPercent?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isOutOfStock?: boolean;
  className?: string;
}

export function ProductGallery({
  images = [],
  productName,
  discountPercent,
  isNew,
  isBestSeller,
  isOutOfStock = false,
  className,
}: ProductGalleryProps) {
  const displayImages = images.length > 0 ? images : ['/placeholder.jpg'];
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % displayImages.length);
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-card shadow-xs">
        <Image
          src={displayImages[selectedIndex]}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2 pointer-events-none">
          {discountPercent && discountPercent > 0 ? (
            <span className="rounded-lg bg-destructive px-2.5 py-1 text-xs font-black uppercase tracking-wider text-destructive-foreground shadow-sm">
              -{discountPercent}% OFF
            </span>
          ) : null}

          {isNew && (
            <span className="rounded-lg bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
              New Arrival
            </span>
          )}

          {isBestSeller && !isNew && (
            <span className="rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
              Best Seller
            </span>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-2xs">
            <span className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-bold text-white shadow-md">
              Out of Stock
            </span>
          </div>
        )}

        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-xs text-foreground shadow-md transition-all hover:bg-background hover:scale-110 active:scale-95 cursor-pointer opacity-80 group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-xs text-foreground shadow-md transition-all hover:bg-background hover:scale-110 active:scale-95 cursor-pointer opacity-80 group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {displayImages.map((imgUrl, index) => {
            const isSelected = selectedIndex === index;

            return (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  'relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-card transition-all cursor-pointer shadow-2xs',
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 scale-102'
                    : 'border-border hover:border-primary/50 opacity-70 hover:opacity-100'
                )}
              >
                <Image
                  src={imgUrl}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

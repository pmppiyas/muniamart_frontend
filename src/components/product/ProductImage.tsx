'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  discountPercent?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isOutOfStock?: boolean;
  className?: string;
  sizes?: string;
}

export function ProductImage({
  src,
  alt,
  discountPercent,
  isNew,
  isBestSeller,
  isOutOfStock = false,
  className,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
}: ProductImageProps) {
  return (
    <div
      className={cn(
        'relative aspect-square w-full overflow-hidden rounded-xl bg-muted/40',
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover object-center"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
          No Image Available
        </div>
      )}

      <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent && discountPercent > 0 ? (
          <span className="rounded-md bg-destructive px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-destructive-foreground shadow-xs">
            -{discountPercent}%
          </span>
        ) : null}

        {isNew && (
          <span className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-xs">
            New
          </span>
        )}

        {isBestSeller && !isNew && (
          <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
            Hot
          </span>
        )}
      </div>

      {isOutOfStock && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-2xs">
          <span className="rounded-lg bg-zinc-900 px-3 py-1 text-xs font-bold text-white shadow-xs">
            Out of Stock
          </span>
        </div>
      )}
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CartItemImageProps {
  src?: string | null;
  alt: string;
  href?: string;
  className?: string;
}

export function CartItemImage({
  src,
  alt,
  href,
  className,
}: CartItemImageProps) {
  const content = (
    <div
      className={cn(
        'relative aspect-square h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted/30',
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 96px, 112px"
          className="object-cover object-center transition-transform duration-300 hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <Package className="h-6 w-6" />
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

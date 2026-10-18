'use client';

import * as React from 'react';
import { ViewMode } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductSkeletonProps {
  count?: number;
  viewMode?: ViewMode;
  className?: string;
}

export function ProductSkeleton({
  count = 8,
  viewMode = 'grid',
  className,
}: ProductSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <div className={cn('flex flex-col space-y-4 animate-pulse', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 rounded-2xl border border-border bg-card p-4"
          >
            <div className="h-44 w-full sm:h-36 sm:w-36 rounded-xl bg-muted shrink-0" />
            <div className="flex-1 space-y-3 w-full">
              <div className="h-3 w-24 rounded-md bg-muted" />
              <div className="h-5 w-3/4 rounded-md bg-muted" />
              <div className="h-3 w-full rounded-md bg-muted" />
              <div className="h-4 w-32 rounded-md bg-muted" />
            </div>
            <div className="h-10 w-32 rounded-xl bg-muted shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 animate-pulse',
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-2xl border border-border bg-card p-3 space-y-3"
        >
          <div className="aspect-square w-full rounded-xl bg-muted" />

          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center">
              <div className="h-3 w-16 rounded-md bg-muted" />
              <div className="h-3 w-10 rounded-md bg-muted" />
            </div>
            <div className="h-4 w-full rounded-md bg-muted" />
            <div className="h-4 w-3/4 rounded-md bg-muted" />
          </div>

          <div className="pt-2 space-y-2">
            <div className="h-5 w-20 rounded-md bg-muted" />
            <div className="h-9 w-full rounded-xl bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

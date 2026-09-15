'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface CartSkeletonProps {
  className?: string;
}

export function CartSkeleton({ className }: CartSkeletonProps) {
  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse', className)}>
      <div className="lg:col-span-8 space-y-4">
        <div className="flex justify-between items-center pb-2">
          <div className="h-6 w-36 rounded-xl bg-muted" />
          <div className="h-6 w-20 rounded-xl bg-muted" />
        </div>

        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="h-24 w-24 rounded-2xl bg-muted shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-20 rounded-md bg-muted" />
                <div className="h-4 w-48 rounded-md bg-muted" />
                <div className="h-3 w-32 rounded-md bg-muted" />
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
              <div className="h-9 w-24 rounded-xl bg-muted" />
              <div className="h-6 w-20 rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-4 space-y-4">
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
          <div className="h-5 w-32 rounded-md bg-muted" />
          <div className="h-10 w-full rounded-2xl bg-muted" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full rounded-md bg-muted" />
            <div className="h-4 w-full rounded-md bg-muted" />
            <div className="h-4 w-full rounded-md bg-muted" />
          </div>
          <div className="h-8 w-full rounded-xl bg-muted pt-2" />
          <div className="h-12 w-full rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
}

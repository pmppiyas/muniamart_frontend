'use client';

import * as React from 'react';

export function PaymentsTableSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 animate-pulse">
          <div className="space-y-1.5">
            <div className="h-4 w-32 rounded-md bg-muted" />
            <div className="h-3 w-24 rounded-md bg-muted" />
          </div>
          <div className="hidden sm:block space-y-1.5">
            <div className="h-4 w-28 rounded-md bg-muted" />
            <div className="h-3 w-36 rounded-md bg-muted" />
          </div>
          <div className="h-6 w-16 rounded-full bg-muted" />
          <div className="h-5 w-20 rounded-md bg-muted" />
          <div className="h-6 w-16 rounded-full bg-muted" />
          <div className="hidden md:block h-4 w-24 rounded-md bg-muted" />
          <div className="h-8 w-8 rounded-lg bg-muted" />
        </div>
      ))}
    </div>
  );
}

'use client';

import * as React from 'react';

export function CustomersTableSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted shrink-0" />
            <div className="space-y-1.5">
              <div className="h-4 w-32 rounded-md bg-muted" />
              <div className="h-3 w-40 rounded-md bg-muted" />
              <div className="h-3 w-28 rounded-md bg-muted" />
            </div>
          </div>
          <div className="h-6 w-16 rounded-full bg-muted" />
          <div className="h-6 w-12 rounded-full bg-muted" />
          <div className="hidden md:flex gap-1.5">
            <div className="h-5 w-12 rounded-md bg-muted" />
            <div className="h-5 w-12 rounded-md bg-muted" />
            <div className="h-5 w-12 rounded-md bg-muted" />
          </div>
          <div className="hidden lg:block h-4 w-20 rounded-md bg-muted" />
          <div className="h-8 w-16 rounded-lg bg-muted" />
        </div>
      ))}
    </div>
  );
}

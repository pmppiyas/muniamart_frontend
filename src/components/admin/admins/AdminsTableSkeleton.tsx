'use client';

import * as React from 'react';

export function AdminsTableSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
      <div className="p-4 border-b border-border space-y-3 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 rounded-lg bg-muted" />
          <div className="h-8 w-24 rounded-lg bg-muted" />
        </div>
      </div>

      <div className="divide-y divide-border/60">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 gap-4 animate-pulse">
            <div className="flex items-center gap-3 min-w-[200px]">
              <div className="h-10 w-10 rounded-xl bg-muted shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-28 rounded-md bg-muted" />
                <div className="h-3 w-40 rounded-md bg-muted" />
              </div>
            </div>

            <div className="h-6 w-24 rounded-full bg-muted" />
            <div className="h-6 w-20 rounded-full bg-muted" />
            <div className="flex gap-1.5 flex-1 max-w-xs">
              <div className="h-5 w-16 rounded-md bg-muted" />
              <div className="h-5 w-16 rounded-md bg-muted" />
              <div className="h-5 w-16 rounded-md bg-muted" />
            </div>
            <div className="h-4 w-20 rounded-md bg-muted" />
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-lg bg-muted" />
              <div className="h-8 w-8 rounded-lg bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

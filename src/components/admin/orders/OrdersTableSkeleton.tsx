'use client';

import * as React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

interface OrdersTableSkeletonProps {
  rows?: number;
}

export function OrdersTableSkeleton({ rows = 6 }: OrdersTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index} className="animate-pulse">
          <TableCell className="py-3.5">
            <div className="space-y-1.5">
              <div className="h-4 w-24 rounded-md bg-muted/70" />
              <div className="h-3 w-16 rounded-md bg-muted/40" />
            </div>
          </TableCell>

          <TableCell className="py-3.5">
            <div className="flex items-start gap-2.5">
              <div className="h-8 w-8 rounded-full bg-muted/60 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1 max-w-[150px]">
                <div className="h-3.5 w-28 rounded-md bg-muted/70" />
                <div className="h-2.5 w-20 rounded-md bg-muted/40" />
                <div className="h-2.5 w-16 rounded-md bg-muted/35" />
              </div>
            </div>
          </TableCell>

          <TableCell className="py-3.5">
            <div className="h-4 w-12 rounded-md bg-muted/60" />
          </TableCell>

          <TableCell className="py-3.5">
            <div className="h-4 w-16 rounded-md bg-muted/70" />
          </TableCell>

          <TableCell className="py-3.5">
            <div className="h-5 w-18 rounded-md bg-muted/50" />
          </TableCell>

          <TableCell className="py-3.5">
            <div className="h-6 w-24 rounded-full bg-muted/60" />
          </TableCell>

          <TableCell className="py-3.5 text-right">
            <div className="flex items-center justify-end gap-1.5">
              <div className="h-8 w-8 rounded-lg bg-muted/60" />
              <div className="h-8 w-8 rounded-lg bg-muted/60" />
              <div className="h-8 w-8 rounded-lg bg-muted/60" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

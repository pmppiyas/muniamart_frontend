'use client';

import * as React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

interface CategoriesTableSkeletonProps {
  rows?: number;
}

export function CategoriesTableSkeleton({ rows = 6 }: CategoriesTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index} className="animate-pulse">
          {/* Category column */}
          <TableCell className="py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-muted/60 shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-[200px]">
                <div className="h-4 w-3/4 rounded-md bg-muted/70" />
                <div className="h-3 w-1/2 rounded-md bg-muted/40" />
              </div>
            </div>
          </TableCell>

          {/* Level column */}
          <TableCell className="py-3">
            <div className="h-5 w-20 rounded-md bg-muted/60" />
          </TableCell>

          {/* Subcategories count */}
          <TableCell className="py-3">
            <div className="h-5 w-24 rounded-md bg-muted/50" />
          </TableCell>

          {/* Products count */}
          <TableCell className="py-3">
            <div className="h-4 w-12 rounded-md bg-muted/60" />
          </TableCell>

          {/* Created date */}
          <TableCell className="py-3">
            <div className="h-3.5 w-20 rounded-md bg-muted/40" />
          </TableCell>

          {/* Actions */}
          <TableCell className="py-3 text-right">
            <div className="h-8 w-8 rounded-lg bg-muted/50 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

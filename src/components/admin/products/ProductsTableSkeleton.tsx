'use client';

import * as React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

export function ProductsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <TableRow key={idx} className="animate-pulse">
          <TableCell>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-muted/70 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-36 rounded-sm bg-muted/70" />
                <div className="h-3 w-20 rounded-sm bg-muted/50" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="h-5 w-20 rounded-full bg-muted/60" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-16 rounded-sm bg-muted/70" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-24 rounded-sm bg-muted/60" />
          </TableCell>
          <TableCell>
            <div className="h-5 w-14 rounded-full bg-muted/60" />
          </TableCell>
          <TableCell className="text-right">
            <div className="h-8 w-8 rounded-lg bg-muted/50 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

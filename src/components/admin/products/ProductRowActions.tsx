'use client';

import * as React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';

interface ProductRowActionsProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductRowActions({
  product,
  onView,
  onEdit,
  onDelete,
}: ProductRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onView(product)}
        title="View Details"
        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer transition-colors"
      >
        <Eye className="h-4 w-4" />
        <span className="sr-only">View Details</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(product)}
        title="Update / Edit"
        className="h-8 w-8 text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 rounded-lg cursor-pointer transition-colors"
      >
        <Pencil className="h-3.5 w-3.5" />
        <span className="sr-only">Update / Edit</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(product)}
        title="Delete"
        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}

'use client';

import * as React from 'react';
import { MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
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
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
        <MoreVertical className="h-4 w-4" />
        <span className="sr-only">Actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onView(product)}>
          <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(product)}>
          <Pencil className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          Update / Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onClick={() => onDelete(product)}>
          <Trash2 className="h-3.5 w-3.5 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

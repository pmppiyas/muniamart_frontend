'use client';

import * as React from 'react';
import { MoreVertical, Eye, Pencil, Trash2, FolderPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Category } from '@/types/category';

interface CategoryRowActionsProps {
  category: Category;
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAddSubcategory: (parentCategory: Category) => void;
}

export function CategoryRowActions({
  category,
  onView,
  onEdit,
  onDelete,
  onAddSubcategory,
}: CategoryRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
        <MoreVertical className="h-4 w-4" />
        <span className="sr-only">Actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
        <DropdownMenuItem onClick={() => onView(category)} className="cursor-pointer">
          <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          View Details
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAddSubcategory(category)} className="cursor-pointer">
          <FolderPlus className="h-3.5 w-3.5 mr-2 text-primary" />
          Add Subcategory
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onEdit(category)} className="cursor-pointer">
          <Pencil className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          Edit Category
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem destructive onClick={() => onDelete(category)} className="cursor-pointer">
          <Trash2 className="h-3.5 w-3.5 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

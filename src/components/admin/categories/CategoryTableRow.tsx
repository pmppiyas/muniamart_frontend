'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  CornerDownRight,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CategoryRowActions } from './CategoryRowActions';
import { Category } from '@/types/category';

export interface FlattenedCategoryItem {
  category: Category;
  level: number;
  parentName?: string | null;
  hasChildren: boolean;
  isExpanded: boolean;
}

interface CategoryTableRowProps {
  item: FlattenedCategoryItem;
  onToggleExpand: (categoryId: string) => void;
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAddSubcategory: (parentCategory: Category) => void;
}

export function CategoryTableRow({
  item,
  onToggleExpand,
  onView,
  onEdit,
  onDelete,
  onAddSubcategory,
}: CategoryTableRowProps) {
  const { category, level, parentName, hasChildren, isExpanded } = item;
  const isRoot = level === 0;

  const productCount =
    category._count?.products ??
    category.itemCount ??
    0;

  const childrenCount =
    category.children?.length ??
    category._count?.children ??
    0;

  return (
    <TableRow
      className={`group transition-colors ${
        isRoot
          ? 'bg-card hover:bg-muted/40 font-medium'
          : 'bg-muted/15 hover:bg-muted/35'
      }`}
    >
      <TableCell className="py-2.5">
        <div
          className="flex items-center gap-2"
          style={{ paddingLeft: `${level * 24}px` }}
        >
          {!isRoot && (
            <CornerDownRight className="h-4 w-4 text-muted-foreground/60 shrink-0 -ml-1" />
          )}

          {hasChildren ? (
            <button
              type="button"
              onClick={() => onToggleExpand(category.id)}
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
              title={isExpanded ? 'Collapse subcategories' : 'Expand subcategories'}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-6 shrink-0" />
          )}

          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40 flex items-center justify-center">
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-cover"
                sizes="36px"
              />
            ) : hasChildren && isExpanded ? (
              <FolderOpen className="h-4 w-4 text-primary" />
            ) : isRoot ? (
              <Folder className="h-4 w-4 text-primary/80" />
            ) : (
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`truncate max-w-[220px] sm:max-w-[300px] cursor-pointer hover:text-primary transition-colors ${
                  isRoot
                    ? 'font-bold text-sm text-foreground'
                    : 'font-semibold text-xs text-foreground/90'
                }`}
                onClick={() => onView(category)}
                title={category.name}
              >
                {category.name}
              </span>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground truncate max-w-[200px]">
              /{category.slug}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell className="py-2.5">
        {isRoot ? (
          <Badge
            variant="default"
            className="text-[10px] font-bold h-5 px-2 bg-primary/15 text-primary hover:bg-primary/20 border-primary/25"
          >
            Root Category
          </Badge>
        ) : (
          <div className="flex items-center gap-1">
            <Badge
              variant="secondary"
              className="text-[10px] font-semibold h-5 px-2"
            >
              Subcategory
            </Badge>
            {parentName && (
              <span className="text-[11px] text-muted-foreground truncate max-w-[120px]">
                of <strong className="text-foreground">{parentName}</strong>
              </span>
            )}
          </div>
        )}
      </TableCell>

      <TableCell className="py-2.5">
        {childrenCount > 0 ? (
          <Badge
            variant="outline"
            className="text-xs font-semibold h-5.5 px-2 border-border"
          >
            {childrenCount} {childrenCount === 1 ? 'Subcategory' : 'Subcategories'}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground/60">—</span>
        )}
      </TableCell>

      <TableCell className="py-2.5">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{productCount}</span>
        </div>
      </TableCell>

      <TableCell className="py-2.5 text-xs text-muted-foreground font-mono">
        {category.createdAt
          ? new Date(category.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '—'}
      </TableCell>

      <TableCell className="py-2.5 text-right">
        <CategoryRowActions
          category={category}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddSubcategory={onAddSubcategory}
        />
      </TableCell>
    </TableRow>
  );
}

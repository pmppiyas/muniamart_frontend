'use client';

import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  CategoryTableRow,
  FlattenedCategoryItem,
} from './CategoryTableRow';
import { CategoriesTableSkeleton } from './CategoriesTableSkeleton';
import { CategoriesEmptyState } from './CategoriesEmptyState';
import { Category } from '@/types/category';

interface CategoriesTableProps {
  categories: Category[];
  isLoading: boolean;
  isFetching?: boolean;
  error?: any;
  onRetry: () => void;
  searchQuery: string;
  hierarchyFilter: 'ALL' | 'ROOT_ONLY' | 'SUB_ONLY';
  expandedIds: Set<string>;
  onToggleExpand: (categoryId: string) => void;
  onClearFilters: () => void;
  onAddCategory: () => void;
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAddSubcategory: (parentCategory: Category) => void;
}

export function CategoriesTable({
  categories,
  isLoading,
  isFetching,
  error,
  onRetry,
  searchQuery,
  hierarchyFilter,
  expandedIds,
  onToggleExpand,
  onClearFilters,
  onAddCategory,
  onView,
  onEdit,
  onDelete,
  onAddSubcategory,
}: CategoriesTableProps) {
  const flattenedItems = React.useMemo(() => {
    const items: FlattenedCategoryItem[] = [];
    const query = searchQuery.trim().toLowerCase();

    function matchesSearch(cat: Category): boolean {
      if (!query) return true;
      const matchName = cat.name.toLowerCase().includes(query);
      const matchSlug = cat.slug.toLowerCase().includes(query);
      const matchDesc = cat.description?.toLowerCase().includes(query) ?? false;
      const matchChildren =
        cat.children?.some((child) => matchesSearch(child)) ?? false;
      return matchName || matchSlug || matchDesc || matchChildren;
    }

    function traverse(
      cats: Category[],
      level: number = 0,
      parentName?: string
    ) {
      for (const cat of cats) {
        if (!matchesSearch(cat)) continue;

        const hasChildren = Boolean(cat.children && cat.children.length > 0);
        const isExpanded = query
          ? true
          : expandedIds.has(cat.id);

        if (hierarchyFilter === 'ALL') {
          items.push({
            category: cat,
            level,
            parentName,
            hasChildren,
            isExpanded,
          });

          if (hasChildren && isExpanded) {
            traverse(cat.children!, level + 1, cat.name);
          }
        } else if (hierarchyFilter === 'ROOT_ONLY') {
          if (level === 0) {
            items.push({
              category: cat,
              level: 0,
              parentName: undefined,
              hasChildren,
              isExpanded: false,
            });
          }
        } else if (hierarchyFilter === 'SUB_ONLY') {
          if (level > 0) {
            items.push({
              category: cat,
              level: 1,
              parentName,
              hasChildren,
              isExpanded: false,
            });
          }
          if (hasChildren) {
            traverse(cat.children!, level + 1, cat.name);
          }
        }
      }
    }

    traverse(categories, 0);
    return items;
  }, [categories, searchQuery, hierarchyFilter, expandedIds]);

  const stats = React.useMemo(() => {
    let roots = 0;
    let subs = 0;

    function countNodes(cats: Category[]) {
      for (const c of cats) {
        if (!c.parentId) roots++;
        else subs++;
        if (c.children && c.children.length > 0) {
          countNodes(c.children);
        }
      }
    }
    countNodes(categories);

    return { total: roots + subs, roots, subs };
  }, [categories]);

  const isFiltering = Boolean(
    searchQuery || hierarchyFilter !== 'ALL'
  );

  return (
    <div className="rounded-2xl border border-border bg-card shadow-2xs overflow-hidden">
      {isLoading ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[320px] sm:w-[380px]">Category</TableHead>
              <TableHead>Hierarchy Level</TableHead>
              <TableHead>Subcategories</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <CategoriesTableSkeleton rows={6} />
          </TableBody>
        </Table>
      ) : error ? (
        <div className="p-12 text-center space-y-3">
          <AlertCircle className="h-8 w-8 mx-auto text-destructive opacity-80" />
          <p className="text-sm font-medium text-destructive">
            Failed to load categories from server
          </p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      ) : flattenedItems.length === 0 ? (
        <CategoriesEmptyState
          isFiltering={isFiltering}
          onClearFilters={onClearFilters}
          onAddCategory={onAddCategory}
        />
      ) : (
        <>
          <div className="relative overflow-x-auto">
            {isFetching && (
              <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px] z-10 flex items-center justify-center transition-opacity" />
            )}
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[320px] sm:w-[380px]">Category</TableHead>
                  <TableHead>Hierarchy Level</TableHead>
                  <TableHead>Subcategories</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flattenedItems.map((item) => (
                  <CategoryTableRow
                    key={item.category.id}
                    item={item}
                    onToggleExpand={onToggleExpand}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddSubcategory={onAddSubcategory}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <div>
              Showing <strong className="text-foreground">{flattenedItems.length}</strong> of{' '}
              <strong className="text-foreground">{stats.total}</strong> total categories
              {' '}(<strong className="text-foreground">{stats.roots}</strong> root,{' '}
              <strong className="text-foreground">{stats.subs}</strong> subcategories)
            </div>

            <div className="text-[11px] text-muted-foreground/80">
              Tree hierarchy organized by parent departments
            </div>
          </div>
        </>
      )}
    </div>
  );
}

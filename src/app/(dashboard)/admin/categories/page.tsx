'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  CategoriesHeader,
  CategoriesFilterBar,
  CategoriesTable,
  CategoryCreateModal,
  CategoryEditModal,
  CategoryViewModal,
  CategoryDeleteDialog,
} from '@/components/admin/categories';
import { useGetAllCategoriesQuery } from '@/services/api/categoryApi';
import { Category } from '@/types/category';

export default function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [hierarchyFilter, setHierarchyFilter] = React.useState<
    'ALL' | 'ROOT_ONLY' | 'SUB_ONLY'
  >('ALL');

  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());

  const {
    data: categoriesData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetAllCategoriesQuery();

  const categories = (categoriesData?.data as unknown as Category[]) || [];

  React.useEffect(() => {
    if (categories.length > 0 && expandedIds.size === 0) {
      const initialExpanded = new Set<string>();
      categories.forEach((cat) => {
        if (cat.children && cat.children.length > 0) {
          initialExpanded.add(cat.id);
        }
      });
      setExpandedIds(initialExpanded);
    }
  }, [categories]);

  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [createDefaultParentId, setCreateDefaultParentId] = React.useState<
    string | null
  >(null);
  const [selectedCategoryForView, setSelectedCategoryForView] =
    React.useState<Category | null>(null);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] =
    React.useState<Category | null>(null);
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] =
    React.useState<Category | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    const allIds = new Set<string>();
    function collect(cats: Category[]) {
      for (const c of cats) {
        allIds.add(c.id);
        if (c.children && c.children.length > 0) {
          collect(c.children);
        }
      }
    }
    collect(categories);
    setExpandedIds(allIds);
    toast.info('Expanded all category branches');
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
    toast.info('Collapsed all category branches');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setHierarchyFilter('ALL');
  };

  const hasActiveFilters = Boolean(searchQuery || hierarchyFilter !== 'ALL');

  const handleAddCategory = () => {
    setCreateDefaultParentId(null);
    setIsCreateModalOpen(true);
  };

  const handleAddSubcategory = (parent: Category) => {
    setCreateDefaultParentId(parent.id);
    setIsCreateModalOpen(true);
  };

  const handleExportCSV = () => {
    if (categories.length === 0) {
      toast.info('No categories available to export');
      return;
    }

    const rows: string[][] = [];
    const headers = [
      'ID',
      'Name',
      'Slug',
      'Level',
      'Parent Name',
      'Subcategories Count',
      'Products Count',
    ];

    function collectRows(cats: Category[], parentName = 'Root') {
      for (const c of cats) {
        const isRoot = !c.parentId;
        const subCount = c.children?.length ?? c._count?.children ?? 0;
        const prodCount = c._count?.products ?? c.itemCount ?? 0;

        rows.push([
          c.id,
          `"${c.name.replace(/"/g, '""')}"`,
          c.slug,
          isRoot ? 'Root' : 'Subcategory',
          `"${parentName.replace(/"/g, '""')}"`,
          String(subCount),
          String(prodCount),
        ]);

        if (c.children && c.children.length > 0) {
          collectRows(c.children, c.name);
        }
      }
    }

    collectRows(categories);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `categories_hierarchy_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${rows.length} categories to CSV`);
  };

  const totalCount = React.useMemo(() => {
    let count = 0;
    function walk(cats: Category[]) {
      for (const c of cats) {
        count++;
        if (c.children && c.children.length > 0) walk(c.children);
      }
    }
    walk(categories);
    return count;
  }, [categories]);

  return (
    <div className="space-y-3.5 pb-12">
      {/* Header with Title, Count, Metrics Cards, and Actions */}
      <CategoriesHeader
        totalCount={totalCount}
        categories={categories}
        isFetching={isFetching}
        onRefresh={() => refetch()}
        onExport={handleExportCSV}
        onAddCategory={handleAddCategory}
      />

      {/* Filter and Search Bar */}
      <CategoriesFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        hierarchyFilter={hierarchyFilter}
        onHierarchyFilterChange={setHierarchyFilter}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Categories Tree Table */}
      <CategoriesTable
        categories={categories}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={() => refetch()}
        searchQuery={searchQuery}
        hierarchyFilter={hierarchyFilter}
        expandedIds={expandedIds}
        onToggleExpand={handleToggleExpand}
        onClearFilters={handleResetFilters}
        onAddCategory={handleAddCategory}
        onView={setSelectedCategoryForView}
        onEdit={setSelectedCategoryForEdit}
        onDelete={setSelectedCategoryForDelete}
        onAddSubcategory={handleAddSubcategory}
      />

      {/* Modals & Dialogs */}
      <CategoryCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        categories={categories}
        defaultParentId={createDefaultParentId}
      />

      <CategoryEditModal
        category={selectedCategoryForEdit}
        isOpen={!!selectedCategoryForEdit}
        onClose={() => setSelectedCategoryForEdit(null)}
        categories={categories}
      />

      <CategoryViewModal
        category={selectedCategoryForView}
        isOpen={!!selectedCategoryForView}
        onClose={() => setSelectedCategoryForView(null)}
        onEdit={(cat) => {
          setSelectedCategoryForView(null);
          setSelectedCategoryForEdit(cat);
        }}
      />

      <CategoryDeleteDialog
        category={selectedCategoryForDelete}
        isOpen={!!selectedCategoryForDelete}
        onClose={() => setSelectedCategoryForDelete(null)}
      />
    </div>
  );
}

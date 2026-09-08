'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useDeleteCategoryMutation } from '@/services/api/categoryApi';
import { Category } from '@/types/category';

interface CategoryDeleteDialogProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryDeleteDialog({
  category,
  isOpen,
  onClose,
}: CategoryDeleteDialogProps) {
  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();

  if (!category) return null;

  const productCount =
    category._count?.products ??
    category.itemCount ??
    0;

  const subcategoryCount =
    category.children?.length ??
    category._count?.children ??
    0;

  const handleDelete = async () => {
    try {
      await deleteCategory(category.id).unwrap();
      toast.success(`Category "${category.name}" deleted successfully`);
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Category"
      description={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
      maxWidth="md"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                Deleting...
              </>
            ) : (
              'Delete Category'
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {(subcategoryCount > 0 || productCount > 0) && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Important Warning</span>
            </div>
            {subcategoryCount > 0 && (
              <p>
                • This department has <strong>{subcategoryCount}</strong> child subcategory(ies).
                Deleting it will unnest them into top-level root categories.
              </p>
            )}
            {productCount > 0 && (
              <p>
                • There are <strong>{productCount}</strong> product(s) linked to this category.
              </p>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Confirming will remove the category from catalog navigation and database records.
        </p>
      </div>
    </Modal>
  );
}

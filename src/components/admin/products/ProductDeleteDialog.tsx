'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { useDeleteProductMutation } from '@/services/api/productApi';

interface ProductDeleteDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDeleteDialog({
  product,
  isOpen,
  onClose,
}: ProductDeleteDialogProps) {
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  if (!product) return null;

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id).unwrap();
      toast.success(`Product "${product.name}" deleted successfully`);
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Delete Product
        </div>
      }
      description="This action cannot be undone. Please confirm your decision."
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
              'Yes, Delete Product'
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-3 py-2">
        <p className="text-sm text-foreground">
          Are you sure you want to permanently delete{' '}
          <span className="font-bold text-foreground">"{product.name}"</span>?
        </p>

        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive space-y-1">
          <p className="font-semibold">Warning:</p>
          <p>
            SKU: <span className="font-mono font-bold">{product.sku}</span> will be removed from your catalog and will no longer be available for customer checkout.
          </p>
        </div>
      </div>
    </Modal>
  );
}

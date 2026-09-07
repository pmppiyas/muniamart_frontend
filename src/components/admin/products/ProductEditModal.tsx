'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/types/product';
import { useUpdateProductMutation } from '@/services/api/productApi';
import { useGetAllCategoriesQuery } from '@/services/api/categoryApi';

interface ProductEditModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductEditModal({
  product,
  isOpen,
  onClose,
}: ProductEditModalProps) {
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const categories = categoriesData?.data || [];

  const [formData, setFormData] = React.useState({
    name: '',
    price: '',
    stock: '',
    categoryId: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    photoUrl: '',
    description: '',
  });

  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        categoryId: product.categoryId || '',
        status: (product.status as 'ACTIVE' | 'INACTIVE') || 'ACTIVE',
        photoUrl: product.photoUrl || '',
        description: product.description || '',
      });
    }
  }, [product]);

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = parseFloat(formData.price);
    const stockNum = parseInt(formData.stock, 10);

    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid positive price');
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      toast.error('Please enter a valid stock quantity (0 or greater)');
      return;
    }

    try {
      await updateProduct({
        id: product.id,
        data: {
          name: formData.name.trim(),
          price: priceNum,
          stock: stockNum,
          categoryId: formData.categoryId || undefined,
          status: formData.status,
          photoUrl: formData.photoUrl.trim() || undefined,
          description: formData.description.trim() || undefined,
        },
      }).unwrap();

      toast.success(`"${formData.name}" updated successfully!`);
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update product');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Product"
      description={`Editing product: ${product.name} (${product.sku})`}
      maxWidth="xl"
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
            type="submit"
            form="edit-product-form"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </>
      }
    >
      <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Product Name <span className="text-destructive">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Premium Wireless Headphones"
            required
          />
        </div>

        {/* Pricing & Stock Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Price <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Stock Quantity <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Category & Status Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-2xs transition-[color,box-shadow] focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:outline-hidden"
            >
              <option value="" disabled className="bg-popover text-popover-foreground">
                Select category...
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-popover text-popover-foreground">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'ACTIVE' | 'INACTIVE',
                })
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-2xs transition-[color,box-shadow] focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:outline-hidden"
            >
              <option value="ACTIVE" className="bg-popover text-popover-foreground">Active (Visible)</option>
              <option value="INACTIVE" className="bg-popover text-popover-foreground">Inactive (Hidden)</option>
            </select>
          </div>
        </div>

        {/* Photo URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Image URL
          </label>
          <Input
            value={formData.photoUrl}
            onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            placeholder="Enter product description and highlights..."
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-2xs transition-[color,box-shadow] focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:outline-hidden"
          />
        </div>
      </form>
    </Modal>
  );
}

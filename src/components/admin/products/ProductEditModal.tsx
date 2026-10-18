'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Loader2, UploadCloud, X, Image as ImageIcon } from 'lucide-react';
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

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

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
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [product]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('price', String(priceNum));
      data.append('stock', String(stockNum));
      if (formData.categoryId) {
        data.append('categoryId', formData.categoryId);
      }
      data.append('status', formData.status);
      if (formData.description.trim()) {
        data.append('description', formData.description.trim());
      }

      if (selectedFile) {
        data.append('photo', selectedFile);
      } else if (formData.photoUrl.trim()) {
        data.append('photoUrl', formData.photoUrl.trim());
      }

      await updateProduct({
        id: product.id,
        data,
      }).unwrap();

      toast.success(`"${formData.name}" updated successfully!`);
      handleRemoveFile();
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

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Product Image (Cloudinary Upload)
          </label>

          <div className="space-y-2">
            {previewUrl || formData.photoUrl ? (
              <div className="relative group w-full h-36 rounded-lg border border-border bg-muted/30 overflow-hidden flex items-center justify-center">
                <img
                  src={previewUrl || formData.photoUrl}
                  alt="Product Preview"
                  className="w-full h-full object-contain p-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveFile();
                    setFormData({ ...formData, photoUrl: '' });
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground text-foreground/80 shadow-xs backdrop-blur-xs transition-colors cursor-pointer"
                  title="Remove Image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 rounded-lg cursor-pointer transition-colors px-4 text-center"
              >
                <div className="p-2 rounded-full bg-primary/10 text-primary mb-1">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-foreground">
                  Click to replace/upload image
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  PNG, JPG, WEBP up to 5MB (Uploaded to Cloudinary)
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {!previewUrl && (
              <div className="relative flex items-center gap-2 pt-1">
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">Or Image URL:</span>
                <Input
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="h-8 text-xs"
                />
              </div>
            )}
          </div>
        </div>

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

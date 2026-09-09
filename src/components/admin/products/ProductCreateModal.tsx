'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Loader2, Wand2, UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateProductMutation } from '@/services/api/productApi';
import { useGetAllCategoriesQuery } from '@/services/api/categoryApi';

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProductCreateModal({
  isOpen,
  onClose,
}: ProductCreateModalProps) {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const categories = categoriesData?.data || [];

  const [formData, setFormData] = React.useState({
    name: '',
    sku: '',
    price: '',
    stock: '10',
    categoryId: '',
    photoUrl: '',
    description: '',
  });

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

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

  const handleGenerateSku = () => {
    const prefix = formData.name
      ? formData.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'PRD')
      : 'PRD';
    const rand = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, sku: `${prefix}-${rand}` }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = parseFloat(formData.price);
    const stockNum = parseInt(formData.stock, 10);

    if (!formData.categoryId) {
      toast.error('Please select a category for the product');
      return;
    }
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
      data.append('sku', formData.sku.trim());
      data.append('price', String(priceNum));
      data.append('stock', String(stockNum));
      data.append('categoryId', formData.categoryId);
      if (formData.description.trim()) {
        data.append('description', formData.description.trim());
      }

      if (selectedFile) {
        data.append('photo', selectedFile);
      } else if (formData.photoUrl.trim()) {
        data.append('photoUrl', formData.photoUrl.trim());
      }

      await createProduct(data).unwrap();

      toast.success(`Product "${formData.name}" created successfully!`);
      setFormData({
        name: '',
        sku: '',
        price: '',
        stock: '10',
        categoryId: '',
        photoUrl: '',
        description: '',
      });
      handleRemoveFile();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create product');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Product"
      description="Fill in the details below to add a product to your catalog."
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
            form="create-product-form"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                Creating...
              </>
            ) : (
              'Create Product'
            )}
          </Button>
        </>
      }
    >
      <form id="create-product-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Product Name <span className="text-destructive">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Wireless Noise Canceling Headphones"
            required
          />
        </div>

        {/* SKU Row */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              SKU (Stock Keeping Unit) <span className="text-destructive">*</span>
            </label>
            <button
              type="button"
              onClick={handleGenerateSku}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline cursor-pointer"
            >
              <Wand2 className="h-3 w-3" /> Auto-generate
            </button>
          </div>
          <Input
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
            placeholder="e.g. WNH-8201"
            required
          />
        </div>

        {/* Pricing & Stock Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Price (BDT) <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="e.g. 3500"
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
              placeholder="e.g. 25"
              required
            />
          </div>
        </div>

        {/* Category Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Category <span className="text-destructive">*</span>
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-2xs transition-[color,box-shadow] focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:outline-hidden"
            required
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

        {/* Product Image (Upload to Cloudinary or URL) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Product Image (Cloudinary Upload)
          </label>
          
          <div className="space-y-2">
            {previewUrl ? (
              <div className="relative group w-full h-36 rounded-lg border border-border bg-muted/30 overflow-hidden flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Product Preview"
                  className="w-full h-full object-contain p-2"
                />
                <button
                  type="button"
                  onClick={handleRemoveFile}
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
                  Click or drag image to upload
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
                  placeholder="https://images.unsplash.com/..."
                  className="h-8 text-xs"
                />
              </div>
            )}
          </div>
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
            placeholder="Detailed features, specs, and selling points..."
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-2xs transition-[color,box-shadow] focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:outline-hidden"
          />
        </div>
      </form>
    </Modal>
  );
}

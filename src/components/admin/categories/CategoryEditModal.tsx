'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Loader2, UploadCloud, X, FolderTree } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateCategoryMutation } from '@/services/api/categoryApi';
import { Category } from '@/types/category';

interface CategoryEditModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

export function CategoryEditModal({
  category,
  isOpen,
  onClose,
  categories,
}: CategoryEditModalProps) {
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  const [formData, setFormData] = React.useState({
    name: '',
    parentId: '',
    description: '',
    imageUrl: '',
    icon: '',
  });

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (category && isOpen) {
      setFormData({
        name: category.name || '',
        parentId: category.parentId || '',
        description: category.description || '',
        imageUrl: category.imageUrl || '',
        icon: category.icon || '',
      });
      setSelectedFile(null);
      setPreviewUrl(category.imageUrl || null);
    }
  }, [category, isOpen]);

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
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const eligibleParentOptions = React.useMemo(() => {
    if (!category) return [];

    const descendantIds = new Set<string>([category.id]);
    function collectDescendants(c: Category) {
      if (c.children) {
        for (const ch of c.children) {
          descendantIds.add(ch.id);
          collectDescendants(ch);
        }
      }
    }
    collectDescendants(category);

    const list: { id: string; name: string; level: number }[] = [];
    function traverse(cats: Category[], level = 0) {
      for (const c of cats) {
        if (!descendantIds.has(c.id)) {
          list.push({ id: c.id, name: c.name, level });
          if (c.children && c.children.length > 0) {
            traverse(c.children, level + 1);
          }
        }
      }
    }
    traverse(categories);
    return list;
  }, [categories, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    if (!formData.name.trim()) {
      toast.error('Please provide a category name');
      return;
    }

    try {
      if (selectedFile) {
        const data = new FormData();
        data.append('name', formData.name.trim());
        data.append('parentId', formData.parentId || '');
        data.append('description', formData.description.trim());
        data.append('icon', formData.icon.trim());
        data.append('image', selectedFile);

        await updateCategory({
          id: category.id,
          data,
        }).unwrap();
      } else {
        await updateCategory({
          id: category.id,
          data: {
            name: formData.name.trim(),
            parentId: formData.parentId || null,
            description: formData.description.trim() || null,
            imageUrl: formData.imageUrl.trim() || null,
            icon: formData.icon.trim() || null,
          },
        }).unwrap();
      }

      toast.success(`Category "${formData.name.trim()}" updated successfully!`);
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update category');
    }
  };

  if (!category) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Category: ${category.name}`}
      description="Update department details, hierarchical nesting, and catalog presentation."
      maxWidth="lg"
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
            form="edit-category-form"
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
      <form
        id="edit-category-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Category Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Category Name <span className="text-destructive">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Category Name"
            required
          />
        </div>

        {/* Parent Category Hierarchy Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <FolderTree className="h-3.5 w-3.5 text-primary" />
            <span>Parent Department (Hierarchy)</span>
          </label>
          <select
            value={formData.parentId}
            onChange={(e) =>
              setFormData({ ...formData, parentId: e.target.value })
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-2xs transition-[color,box-shadow] focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:outline-hidden cursor-pointer"
          >
            <option
              value=""
              className="bg-popover text-popover-foreground font-semibold"
            >
              Main Category (Root Department)
            </option>
            {eligibleParentOptions.map((opt) => (
              <option
                key={opt.id}
                value={opt.id}
                className="bg-popover text-popover-foreground"
              >
                {`${'— '.repeat(opt.level)}${opt.name}`}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-muted-foreground">
            Change parent to move this category in the hierarchy tree, or keep
            &quot;Main Category&quot; for top-level.
          </p>
        </div>

        {/* Icon Key / Emoji */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Icon Key / Emoji (Optional)
          </label>
          <Input
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="e.g. ShoppingBasket, Shirt, Smartphone, 🍎"
          />
        </div>

        {/* Category Image Upload */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Category Banner / Photo (Cloudinary Upload)
          </label>

          <div className="space-y-2">
            {previewUrl ? (
              <div className="relative group w-full h-32 rounded-xl border border-border bg-muted/30 overflow-hidden flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
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
                className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 rounded-xl cursor-pointer transition-colors px-4 text-center"
              >
                <div className="p-1.5 rounded-full bg-primary/10 text-primary mb-1">
                  <UploadCloud className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium text-foreground">
                  Click or drag image to replace
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
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={2}
            placeholder="Brief description for SEO and catalog presentation..."
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-2xs transition-[color,box-shadow] focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:outline-hidden"
          />
        </div>
      </form>
    </Modal>
  );
}

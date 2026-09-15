export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
  createdAt?: string;
  updatedAt?: string;

  icon?: string | null;
  itemCount?: number;
  imageUrl?: string | null;
  _count?: {
    products?: number;
    children?: number;
  };
}

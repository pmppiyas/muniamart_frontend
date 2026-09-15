import { Product } from '@/types/product';
import mockData from '@/data/mockData.json';
import { env } from '@/config/env';

/**
 * Normalizes a database product record into the full frontend Product interface,
 * merging live database fields (price, stock, name, category, status) with
 * any rich catalog assets (gallery, specifications, reviews, brand).
 */
function normalizeProduct(dbProduct: any, mockMap: Map<string, any>): Product {
  const mock = mockMap.get(dbProduct.id) || mockMap.get(dbProduct.sku) || {};

  const priceNum = typeof dbProduct.price === 'string' ? parseFloat(dbProduct.price) : Number(dbProduct.price || 0);

  return {
    ...mock,
    id: dbProduct.id,
    sku: dbProduct.sku,
    name: dbProduct.name,
    description: dbProduct.description ?? mock.description ?? null,
    photoUrl: dbProduct.photoUrl || mock.photoUrl || null,
    images: dbProduct.photoUrl
      ? [dbProduct.photoUrl, ...(mock.images || []).filter((img: string) => img !== dbProduct.photoUrl)]
      : mock.images || [],
    price: priceNum,
    stock: Number(dbProduct.stock ?? mock.stock ?? 0),
    status: dbProduct.status || 'ACTIVE',
    categoryId: dbProduct.categoryId,
    category: dbProduct.category
      ? {
          id: dbProduct.category.id,
          name: dbProduct.category.name,
          slug: dbProduct.category.slug,
          parentId: dbProduct.category.parentId || null,
          itemCount: dbProduct.category.itemCount || 0,
        }
      : mock.category,
    subcategoryId: dbProduct.subcategoryId || mock.subcategoryId,
    subcategorySlug: dbProduct.subcategorySlug || mock.subcategorySlug,
    createdAt: dbProduct.createdAt || mock.createdAt || new Date().toISOString(),
    updatedAt: dbProduct.updatedAt || mock.updatedAt || new Date().toISOString(),
    brand: mock.brand || dbProduct.brand || 'Muniamart',
    rating: mock.rating ?? 4.8,
    reviewsCount: mock.reviewsCount ?? 120,
    isFeatured: mock.isFeatured ?? true,
    isNew: mock.isNew ?? false,
    isBestSeller: mock.isBestSeller ?? false,
    discountPercent: mock.discountPercent,
    originalPrice: mock.originalPrice,
    features: mock.features || [],
    specifications: mock.specifications || {},
    variants: mock.variants || [],
    reviews: mock.reviews || [],
  };
}

/**
 * Fetch all products from live database API.
 * Gracefully falls back to mock catalog if database API is unreachable.
 */
export async function getProductsFromDb(): Promise<Product[]> {
  const mockMap = new Map((mockData.products as any[]).map((p) => [p.id, p]));

  try {
    const res = await fetch(`${env.API_BASE_URL}/product`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((dbProduct: any) => normalizeProduct(dbProduct, mockMap));
    }
  } catch (error) {
    console.warn('Live product API unreachable, serving cached catalog:', error);
  }

  return (mockData.products as unknown as Product[]);
}

/**
 * Fetch a single product by id or slug from live database API.
 */
export async function getProductByIdOrSlugFromDb(idOrSlug: string): Promise<Product | undefined> {
  const allProducts = await getProductsFromDb();
  const normalized = decodeURIComponent(idOrSlug).toLowerCase();

  return allProducts.find(
    (p) =>
      p.id.toLowerCase() === normalized ||
      p.slug?.toLowerCase() === normalized ||
      p.sku?.toLowerCase() === normalized ||
      p.name.toLowerCase().replace(/\s+/g, '-') === normalized
  );
}

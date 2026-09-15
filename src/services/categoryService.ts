import { Category } from '@/types/category';
import mockData from '@/data/mockData.json';
import { env } from '@/config/env';

function getRealCatalogCounts() {
  const catCountMap = new Map<string, number>();
  const subCountMap = new Map<string, number>();

  mockData.products.forEach((p) => {
    if (p.categoryId) {
      catCountMap.set(p.categoryId, (catCountMap.get(p.categoryId) || 0) + 1);
    }
    if (p.category?.slug) {
      catCountMap.set(p.category.slug, (catCountMap.get(p.category.slug) || 0) + 1);
    }
    if (p.subcategorySlug) {
      subCountMap.set(p.subcategorySlug, (subCountMap.get(p.subcategorySlug) || 0) + 1);
    }
  });

  return { catCountMap, subCountMap };
}

/**
 * Fetch all categories and subcategories from backend database API.
 * Gracefully falls back to mock data if the API server is unavailable.
 */
export async function getCategoriesFromDb(): Promise<Category[]> {
  const { catCountMap, subCountMap } = getRealCatalogCounts();

  try {
    const baseUrl = env.API_BASE_URL;
    const res = await fetch(`${baseUrl}/category`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      const mockCategoryMap = new Map(mockData.categories.map((c) => [c.id, c]));

      return json.data.map((dbCat: Category) => {
        const mockMatch = mockCategoryMap.get(dbCat.id) || mockData.categories.find(c => c.slug === dbCat.slug);
        const realCount =
          catCountMap.get(dbCat.id) ||
          catCountMap.get(dbCat.slug) ||
          dbCat._count?.products ||
          0;

        return {
          ...dbCat,
          imageUrl: dbCat.imageUrl || mockMatch?.imageUrl,
          icon: dbCat.icon || mockMatch?.icon,
          description: dbCat.description || mockMatch?.description,
          itemCount: realCount,
          children: (dbCat.children || []).map((child) => {
            const mockChild = mockMatch?.children?.find((c) => c.slug === child.slug);
            const realSubCount =
              subCountMap.get(child.slug) ||
              child._count?.products ||
              0;

            return {
              ...child,
              imageUrl: child.imageUrl || mockChild?.imageUrl,
              icon: child.icon || mockChild?.icon,
              itemCount: realSubCount,
            };
          }),
        };
      });
    }
  } catch (error) {
    console.warn('Backend category API unavailable, falling back to catalog cache:', error);
  }

  return mockData.categories.map((c) => ({
    ...c,
    itemCount: catCountMap.get(c.id) || catCountMap.get(c.slug) || 0,
    children: (c.children || []).map((ch) => ({
      ...ch,
      itemCount: subCountMap.get(ch.slug) || 0,
    })),
  })) as Category[];
}

/**
 * Fetch a single category by slug or id from database API.
 */
export async function getCategoryBySlugFromDb(slugOrId: string): Promise<Category | undefined> {
  const allCategories = await getCategoriesFromDb();
  const normalized = decodeURIComponent(slugOrId).toLowerCase();

  return allCategories.find(
    (c) =>
      c.slug.toLowerCase() === normalized ||
      c.id.toLowerCase() === normalized
  );
}

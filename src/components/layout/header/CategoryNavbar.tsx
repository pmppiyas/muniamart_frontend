'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useGetAllCategoriesQuery } from '@/services/api/categoryApi';
import { cn } from '@/lib/utils';

interface NavThirdLevelItem {
  id: string;
  name: string;
  slug: string;
}

interface NavSubcategory {
  id: string;
  name: string;
  slug: string;
  items?: NavThirdLevelItem[];
}

interface NavCategory {
  id: string;
  name: string;
  slug: string;
  subcategories: NavSubcategory[];
}

const DEFAULT_SUB_ITEMS: Record<string, string[]> = {
  // Electronics & Gadgets
  smartphones: [
    'iPhone',
    'Samsung Galaxy',
    'Xiaomi & Redmi',
    'Google Pixel',
    'OnePlus',
    'Cases & Covers',
    'Screen Protectors',
  ],
  'laptops-computers': [
    'MacBook Air',
    'MacBook Pro',
    'Gaming Laptops',
    'Ultrabooks',
    'Desktop PC & iMac',
    'Monitors',
    'Keyboards & Mice',
  ],
  'smart-watches': [
    'Apple Watch',
    'Galaxy Watch',
    'Amazfit',
    'Fitness Trackers',
    'Watch Straps',
    'Watch Chargers',
  ],
  'audio-headphones': [
    'AirPods & EarPods',
    'Wireless Earbuds',
    'Over-Ear Headphones',
    'Bluetooth Speakers',
    'Soundbars',
  ],
  cameras: [
    'DSLR Cameras',
    'Mirrorless Cameras',
    'Action Cameras',
    'Drones & Gimbals',
    'Camera Lenses',
  ],
  accessories: [
    'Apple Adapters',
    'Power Banks',
    'Fast Cables',
    'USB Hubs & Docks',
    'Car Chargers',
  ],

  // Specific tech models (matching screenshot)
  macbook: [
    'MacBook Air',
    'MacBook Pro',
    'MacBook Cover',
    'Screen Protector',
    'Magic Mouse',
    'Power Adapters',
  ],
  'mac-mini': ['Mac mini M2', 'Mac mini M4', 'Mini Docks', 'Mounts'],
  imac: ['iMac 24-inch', 'Magic Keyboard', 'Magic Trackpad'],
  iphone: [
    'iPhone 16 Pro Max',
    'iPhone 16 Pro',
    'iPhone 16',
    'iPhone 15 Series',
    'MagSafe Chargers',
  ],
  ipad: [
    'iPad Pro M4',
    'iPad Air M2',
    'iPad 10th Gen',
    'Apple Pencil',
    'Magic Keyboard',
  ],
  airpods: [
    'AirPods Pro 2',
    'AirPods 4',
    'AirPods Max',
    'Silicone Cases',
  ],

  // Fashion & Apparel
  'mens-wear': [
    'T-Shirts & Polos',
    'Casual & Formal Shirts',
    'Jeans & Chinos',
    'Panjabis & Pajamas',
    'Jackets & Hoodies',
  ],
  'womens-wear': [
    'Dresses & Gowns',
    'Kurtis & Salwar Sets',
    'Traditional Sarees',
    'Tops & Blouses',
    'Winter Shawls',
  ],
  footwear: [
    'Sneakers & Running Shoes',
    'Formal Leather Shoes',
    'Casual Loafers',
    'Sandals & Slides',
    'Boots',
  ],
  accessories_fashion: [
    'Leather Belts & Wallets',
    'Backpacks & Handbags',
    'Sunglasses',
    'Caps & Hats',
  ],
  watches: [
    'Luxury Chronographs',
    'Casual Leather Watches',
    'Minimalist Watches',
    'Smart Bands',
  ],

  // Home & Living
  'kitchen-appliances': [
    'Blenders & Grinders',
    'Air Fryers',
    'Microwave Ovens',
    'Electric Kettles',
    'Coffee Makers',
  ],
  'home-decor': [
    'Wall Art & Paintings',
    'Table & Floor Lamps',
    'Vases & Planters',
    'Wall Clocks',
    'Scented Candles',
  ],
  bedding: [
    'Cotton Bed Sheets',
    'Comforters & Quilts',
    'Memory Foam Pillows',
    'Bath Towels',
    'Curtains',
  ],
  furniture: [
    'Ergonomic Chairs',
    'Study & Office Desks',
    'Coffee Tables',
    'Bookshelves',
    'Recliners',
  ],
  lighting: [
    'Smart Ceiling Lights',
    'Desk Lamps',
    'Ambient LED Strips',
    'Outdoor Garden Lights',
  ],

  // Beauty & Personal Care
  skincare: [
    'Facial Cleansers',
    'Moisturizers & Creams',
    'Sunscreen SPF 50+',
    'Vitamin C Serums',
    'Sheet Masks',
  ],
  haircare: [
    'Shampoos & Conditioners',
    'Hair Oils & Serums',
    'Hair Dryers & Stylers',
    'Hair Masks',
  ],
  fragrances: [
    'Eau de Parfum (EDP)',
    'Eau de Toilette (EDT)',
    'Body Mists & Sprays',
    'Attar & Oudh',
  ],
  'personal-hygiene': [
    'Electric Toothbrushes',
    'Beard Trimmers & Shavers',
    'Body Washes',
    'Face Massagers',
  ],
  makeup: [
    'Lipsticks & Glosses',
    'Foundations & BB Creams',
    'Eyeliners & Mascaras',
    'Makeup Brushes',
  ],

  // Sports & Fitness
  'sports-fitness': [
    'Dumbbells & Weights',
    'Resistance Bands',
    'Yoga Mats',
    'Protein Shakers',
  ],
  'gym-equipment': [
    'Treadmills',
    'Exercise Bikes',
    'Adjustable Benches',
    'Kettlebells',
  ],
  sportswear: [
    'Dry-Fit T-Shirts',
    'Running Shorts',
    'Gym Tights',
    'Tracksuits',
  ],
  'outdoor-gear': [
    'Camping Tents',
    'Hiking Backpacks',
    'Sleeping Bags',
    'Hydration Packs',
  ],
  cycling: [
    'Mountain Bicycles',
    'Road Bikes',
    'Cycling Helmets',
    'Bike Locks & Lights',
  ],

  // Daily Groceries
  groceries: [
    'Premium Rice',
    'Edible Cooking Oils',
    'Flour & Atta',
    'Spices & Masalas',
    'Lentils & Pulses',
  ],
  'organic-foods': [
    'Organic Honey',
    'Chia Seeds & Quinoa',
    'Dry Fruits & Nuts',
    'Herbal Teas',
  ],
  beverages: [
    'Green & Black Tea',
    'Roasted Coffee Beans',
    'Fruit Juices',
    'Energy Drinks',
  ],
  snacks: [
    'Premium Biscuits',
    'Dark Chocolates',
    'Potato Chips & Crisps',
    'Popcorn & Wafers',
  ],
  'pantry-staples': [
    'Pasta & Noodles',
    'Sauces & Ketchup',
    'Canned Foods',
    'Jams & Spreads',
  ],
};

function getSubItems(
  catSlug: string,
  subSlug: string,
  subName: string,
  dbChildren?: any[]
): NavThirdLevelItem[] {
  if (Array.isArray(dbChildren) && dbChildren.length > 0) {
    return dbChildren.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }));
  }

  const normalized = subSlug.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const matchedKey = Object.keys(DEFAULT_SUB_ITEMS).find(
    (k) =>
      normalized === k ||
      normalized.includes(k) ||
      k.includes(normalized) ||
      subName.toLowerCase().includes(k.replace(/-/g, ' '))
  );

  if (matchedKey && DEFAULT_SUB_ITEMS[matchedKey]) {
    return DEFAULT_SUB_ITEMS[matchedKey].map((name) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    }));
  }

  return [];
}

function CategoryNavList() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSub = searchParams.get('sub')?.toLowerCase();
  const currentItem = searchParams.get('item')?.toLowerCase();

  const { data: categoriesRes } = useGetAllCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const dbCategories = categoriesRes?.data;

  const categories: NavCategory[] = React.useMemo(() => {
    if (Array.isArray(dbCategories) && dbCategories.length > 0) {
      const parents = dbCategories.filter((c) => !c.parentId);
      if (parents.length > 0) {
        return parents.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          subcategories: (c.children || []).map((ch) => ({
            id: ch.id,
            name: ch.name,
            slug: ch.slug,
            items: getSubItems(c.slug, ch.slug, ch.name, (ch as any).children),
          })),
        }));
      }
    }

    return siteConfig.categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      subcategories: (c.subcategories || []).map((s) => ({
        id: s.toLowerCase().replace(/\s+/g, '-'),
        name: s,
        slug: s.toLowerCase().replace(/\s+/g, '-'),
        items: getSubItems(c.slug, s.toLowerCase().replace(/\s+/g, '-'), s),
      })),
    }));
  }, [dbCategories]);

  const maxDirectItems = 7;
  const directCategories =
    categories.length > maxDirectItems ? categories.slice(0, 6) : categories;
  const moreCategories =
    categories.length > maxDirectItems ? categories.slice(6) : [];

  const isCategoryActive = (slug: string) => {
    return (
      pathname === `/categories/${slug}` ||
      pathname.startsWith(`/categories/${slug}/`)
    );
  };

  const isSubActive = (catSlug: string, subSlug: string, subName: string) => {
    if (!isCategoryActive(catSlug)) return false;
    if (!currentSub) return false;
    return (
      currentSub === subSlug.toLowerCase() ||
      currentSub === subName.toLowerCase() ||
      currentSub === encodeURIComponent(subSlug).toLowerCase()
    );
  };

  const isItemActive = (itemSlug: string, itemName: string) => {
    if (!currentItem) return false;
    return (
      currentItem === itemSlug.toLowerCase() ||
      currentItem === itemName.toLowerCase() ||
      currentItem === encodeURIComponent(itemSlug).toLowerCase()
    );
  };

  return (
    <nav className="flex items-center gap-1 sm:gap-2 py-0.5">
      {directCategories.map((cat, catIndex) => {
        const isActive = isCategoryActive(cat.slug);
        const hasSubs = cat.subcategories.length > 0;
        const isNearRight = catIndex >= directCategories.length - 2;

        return (
          <div key={cat.id || cat.slug} className="relative group/cat">
            <Link
              href={`/categories/${cat.slug}`}
              className={cn(
                'group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors select-none whitespace-nowrap',
                isActive
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-foreground/80 hover:text-primary hover:bg-muted/70 group-hover/cat:text-primary'
              )}
            >
              <span>{cat.name}</span>
              {hasSubs && (
                <ChevronDown className="h-3 w-3 text-muted-foreground/70 transition-transform duration-200 group-hover/cat:rotate-180 group-hover/cat:text-primary" />
              )}
            </Link>

            {hasSubs && (
              <div
                className={cn(
                  'absolute top-full pt-2 z-40 opacity-0 pointer-events-none group-hover/cat:opacity-100 group-hover/cat:pointer-events-auto group-focus-within/cat:opacity-100 group-focus-within/cat:pointer-events-auto transition-all duration-150',
                  isNearRight ? 'right-0' : 'left-0'
                )}
              >
                <div className="w-56 min-w-[210px] rounded-2xl border border-border/70 bg-popover text-popover-foreground p-2 shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150">
                  <div className="space-y-0.5">
                    {cat.subcategories.map((sub) => {
                      const isSubSelected = isSubActive(
                        cat.slug,
                        sub.slug,
                        sub.name
                      );
                      const subItems = sub.items || [];
                      const hasSubItems = subItems.length > 0;

                      return (
                        <div key={sub.id || sub.slug} className="relative group/sub">
                          <Link
                            href={`/categories/${cat.slug}?sub=${encodeURIComponent(sub.slug || sub.name)}`}
                            className={cn(
                              'flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer select-none',
                              isSubSelected
                                ? 'bg-primary text-primary-foreground font-bold'
                                : 'text-foreground/85 hover:bg-primary hover:text-primary-foreground group-hover/sub:bg-primary group-hover/sub:text-primary-foreground'
                            )}
                          >
                            <span className="truncate">{sub.name}</span>
                            {hasSubItems && (
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover/sub:text-primary-foreground transition-colors shrink-0 ml-1.5" />
                            )}
                          </Link>

                          {hasSubItems && (
                            <div
                              className={cn(
                                'absolute top-0 z-50 opacity-0 pointer-events-none group-hover/sub:opacity-100 group-hover/sub:pointer-events-auto transition-all duration-150',
                                isNearRight
                                  ? 'right-full pr-1.5'
                                  : 'left-full pl-1.5'
                              )}
                            >
                              <div className="w-56 min-w-[200px] rounded-2xl border border-border/70 bg-popover text-popover-foreground p-2 shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150">
                                <div className="space-y-0.5 max-h-72 overflow-y-auto">
                                  {subItems.map((item) => {
                                    const isItemSelected = isItemActive(
                                      item.slug,
                                      item.name
                                    );
                                    return (
                                      <Link
                                        key={item.id || item.slug}
                                        href={`/categories/${cat.slug}?sub=${encodeURIComponent(sub.slug || sub.name)}&item=${encodeURIComponent(item.slug || item.name)}`}
                                        className={cn(
                                          'flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all cursor-pointer',
                                          isItemSelected
                                            ? 'bg-primary text-primary-foreground font-bold'
                                            : 'text-foreground/85 hover:bg-primary hover:text-primary-foreground'
                                        )}
                                      >
                                        <span className="truncate">{item.name}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {moreCategories.length > 0 && (
        <div className="relative group/more">
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-foreground/80 hover:text-primary hover:bg-muted/70 transition-colors cursor-pointer select-none group-hover/more:text-primary"
          >
            <span>More</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform duration-200 group-hover/more:rotate-180 group-hover/more:text-primary" />
          </button>

          <div className="absolute right-0 top-full pt-2 z-40 opacity-0 pointer-events-none group-hover/more:opacity-100 group-hover/more:pointer-events-auto transition-all duration-150">
            <div className="w-56 rounded-2xl border border-border/70 bg-popover text-popover-foreground p-2 shadow-2xl backdrop-blur-md">
              <div className="space-y-0.5">
                {moreCategories.map((cat) => (
                  <Link
                    key={cat.id || cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <span>{cat.name}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function CategoryNavFallback() {
  return (
    <nav className="flex items-center gap-1 sm:gap-2 py-0.5">
      {siteConfig.categories.slice(0, 6).map((c) => (
        <Link
          key={c.id}
          href={`/categories/${c.slug}`}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
        >
          {c.name}
        </Link>
      ))}
    </nav>
  );
}

export function CategoryNavbar() {
  return (
    <div className="hidden md:block border-y border-border/50 bg-background/50 relative z-30">
      <div className="mx-auto flex h-11 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <React.Suspense fallback={<CategoryNavFallback />}>
          <CategoryNavList />
        </React.Suspense>
      </div>
    </div>
  );
}

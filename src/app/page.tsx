import mockData from '@/data/mockData.json';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { PromoBanner } from '@/components/home/PromoBanner';
import { NewArrivals } from '@/components/home/NewArrivals';
import { BestSelling } from '@/components/home/BestSelling';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { getCategoriesFromDb } from '@/services/categoryService';
import { getProductsFromDb } from '@/services/productService';
import {
  Product,
  HeroSlide,
  PromoBanner as PromoBannerType,
  TrustFeature,
} from '@/types/product';

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategoriesFromDb(),
    getProductsFromDb(),
  ]);
  const heroSlides = mockData.heroSlides as HeroSlide[];
  const promoBanner = mockData.promoBanner as PromoBannerType;
  const whyChooseUs = mockData.whyChooseUs as TrustFeature[];

  return (
    <div className="flex flex-col flex-1 bg-background">
      <HeroSection slides={heroSlides} />

      <CategorySection categories={categories} />

      <FeaturedProducts products={products} />

      <PromoBanner banner={promoBanner} />

      <NewArrivals products={products} />

      <BestSelling products={products} />

      <WhyChooseUs features={whyChooseUs} />
    </div>
  );
}

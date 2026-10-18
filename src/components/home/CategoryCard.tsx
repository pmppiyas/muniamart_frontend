'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Camera,
  Zap,
  ShoppingBasket,
  LucideIcon,
} from 'lucide-react';
import { Category } from '@/types/category';
import { getCategoryIconPath } from '@/lib/categoryIcons';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Camera,
  Zap,
  ShoppingBasket,
};

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const iconPath =
    category.imageUrl ||
    getCategoryIconPath(category.slug, category.icon) ||
    getCategoryIconPath(category.name, category.icon);

  const IconComponent =
    (category.icon && iconMap[category.icon]) || Laptop || ShoppingBasket;

  const targetHref = category.href || `/categories/${category.slug}`;

  return (
    <Link
      href={targetHref}
      scroll={true}
      className={cn(
        'group flex flex-col items-center justify-start text-center p-2 sm:p-2.5 cursor-pointer select-none',
        className
      )}
    >
      <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center shrink-0 mb-2 sm:mb-2.5">
        {iconPath ? (
          <Image
            src={iconPath}
            alt={category.name}
            width={56}
            height={56}
            className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
          />
        ) : (
          <IconComponent className="h-9 w-9 sm:h-11 sm:w-11 text-foreground/80" />
        )}
      </div>

      <span className="text-sm sm:text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors text-center line-clamp-2 leading-snug">
        {category.name}
      </span>
    </Link>
  );
}

'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Smartphone,
  Laptop,
  Camera,
  Headphones,
  Shirt,
  Footprints,
  Briefcase,
  Glasses,
  Coffee,
  CupSoda,
  Lamp,
  Layers,
  LucideIcon,
} from 'lucide-react';
import { Category } from '@/types/category';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Laptop,
  Camera,
  Headphones,
  Shirt,
  Footprints,
  Briefcase,
  Glasses,
  Coffee,
  CupSoda,
  Lamp,
};

interface SubCategoryCardProps {
  subcategory: Category;
  isSelected?: boolean;
  onSelect?: (slug: string) => void;
  className?: string;
  itemCount?: number;
}

export function SubCategoryCard({
  subcategory,
  isSelected = false,
  onSelect,
  className,
  itemCount,
}: SubCategoryCardProps) {
  const displayCount = itemCount !== undefined ? itemCount : subcategory.itemCount;
  const IconComponent = (subcategory.icon && iconMap[subcategory.icon]) || Layers;

  const handleClick = () => {
    if (onSelect) {
      onSelect(subcategory.slug);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'group relative flex items-center gap-3 rounded-2xl border p-3 text-left transition-all cursor-pointer shadow-2xs',
        isSelected
          ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm'
          : 'border-border bg-card hover:border-primary/50 hover:bg-muted/40 hover:-translate-y-0.5',
        className
      )}
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted/60 flex items-center justify-center">
        {subcategory.imageUrl ? (
          <Image
            src={subcategory.imageUrl}
            alt={subcategory.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <IconComponent className="h-5 w-5 text-primary" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            'text-xs font-bold truncate transition-colors',
            isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'
          )}
        >
          {subcategory.name}
        </h3>
        {displayCount !== undefined ? (
          <p className="text-[11px] text-muted-foreground">
            {displayCount} items
          </p>
        ) : null}
      </div>
    </button>
  );
}

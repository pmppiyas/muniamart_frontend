'use client';

import * as React from 'react';
import { ArrowDownUp, ChevronDown } from 'lucide-react';
import { ProductSortOption } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductSortProps {
  currentSort: ProductSortOption;
  onSortChange: (sort: ProductSortOption) => void;
  className?: string;
}

const SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
];

export function ProductSort({
  currentSort,
  onSortChange,
  className,
}: ProductSortProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel =
    SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || 'Sort By';

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-2xs hover:border-primary hover:text-primary transition-all cursor-pointer"
        aria-expanded={isOpen}
      >
        <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="hidden sm:inline text-muted-foreground font-normal">Sort by:</span>
        <span className="font-bold">{currentLabel}</span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform duration-200', {
            'rotate-180': isOpen,
          })}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-30 mt-1.5 w-48 rounded-xl border border-border bg-popover text-popover-foreground p-1 shadow-lg animate-in fade-in-0 zoom-in-95">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onSortChange(opt.value);
                setIsOpen(false);
              }}
              className={cn(
                'flex w-full items-center px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors cursor-pointer',
                currentSort === opt.value
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

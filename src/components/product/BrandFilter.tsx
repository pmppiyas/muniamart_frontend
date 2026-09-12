'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandFilterProps {
  availableBrands: { name: string; count: number }[];
  selectedBrands: string[];
  onToggleBrand: (brandName: string) => void;
  className?: string;
}

export function BrandFilter({
  availableBrands,
  selectedBrands,
  onToggleBrand,
  className,
}: BrandFilterProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredBrands = availableBrands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn('space-y-2.5', className)}>
      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
        Brands
      </h3>

      {availableBrands.length > 5 && (
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search brands..."
            className="h-8 w-full rounded-lg border border-border bg-card pl-8 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      )}

      <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
        {filteredBrands.map((brand) => {
          const isSelected = selectedBrands.includes(brand.name);

          return (
            <label
              key={brand.name}
              className={cn(
                'flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors',
                isSelected
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-foreground/80 hover:bg-muted'
              )}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleBrand(brand.name)}
                  className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary/20 accent-blue-600"
                />
                <span>{brand.name}</span>
              </div>

              <span className="text-[10px] text-muted-foreground">
                ({brand.count})
              </span>
            </label>
          );
        })}

        {filteredBrands.length === 0 && (
          <p className="py-2 text-center text-xs text-muted-foreground">
            No brands found
          </p>
        )}
      </div>
    </div>
  );
}

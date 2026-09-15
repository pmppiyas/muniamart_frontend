'use client';

import * as React from 'react';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';

interface PriceFilterProps {
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  maxLimit?: number;
  className?: string;
}

export function PriceFilter({
  priceRange,
  onPriceChange,
  maxLimit = 2000,
  className,
}: PriceFilterProps) {
  const { formatPrice, currency } = useCurrency();

  const presetRanges: { label: string; range: [number, number] }[] = React.useMemo(() => {
    return [
      { label: 'All Prices', range: [0, maxLimit] },
      { label: `Under ${formatPrice(50)}`, range: [0, 50] },
      { label: `${formatPrice(50)} to ${formatPrice(150)}`, range: [50, 150] },
      { label: `${formatPrice(150)} to ${formatPrice(500)}`, range: [150, 500] },
      { label: `Over ${formatPrice(500)}`, range: [500, maxLimit] },
    ];
  }, [formatPrice, maxLimit]);

  const handleApplyInputs = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const minVal = parseFloat(formData.get('min') as string) || 0;
    const maxVal = parseFloat(formData.get('max') as string) || maxLimit;
    const min = Math.max(0, minVal);
    const max = Math.max(min, maxVal);
    onPriceChange([min, max]);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Price Range
        </h3>
        <span className="text-[11px] font-semibold text-primary">
          {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {presetRanges.map((preset) => {
          const isActive =
            priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1];

          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onPriceChange(preset.range)}
              className={cn(
                'rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer',
                isActive
                  ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                  : 'bg-muted text-foreground/80 hover:bg-muted/80'
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleApplyInputs} className="flex items-center gap-2 pt-1">
        <div className="flex-1">
          <input
            type="number"
            name="min"
            placeholder="Min"
            defaultValue={priceRange[0]}
            min={0}
            max={maxLimit}
            className="w-full rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <span className="text-muted-foreground text-xs">-</span>
        <div className="flex-1">
          <input
            type="number"
            name="max"
            placeholder="Max"
            defaultValue={priceRange[1]}
            min={0}
            max={maxLimit}
            className="w-full rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-2xs hover:bg-primary-hover transition-colors cursor-pointer"
        >
          Go
        </button>
      </form>
    </div>
  );
}

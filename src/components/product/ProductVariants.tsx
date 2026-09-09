'use client';

import * as React from 'react';
import { ProductVariant } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductVariantsProps {
  variants?: ProductVariant[];
  selectedVariants: Record<string, string>;
  onSelectVariant: (type: string, variantId: string) => void;
  className?: string;
}

export function ProductVariants({
  variants = [],
  selectedVariants,
  onSelectVariant,
  className,
}: ProductVariantsProps) {
  const groupedVariants = React.useMemo(() => {
    const groups: Record<string, ProductVariant[]> = {};
    variants.forEach((variant) => {
      if (!groups[variant.type]) {
        groups[variant.type] = [];
      }
      groups[variant.type].push(variant);
    });
    return groups;
  }, [variants]);

  if (!variants || variants.length === 0) return null;

  return (
    <div className={cn('space-y-4', className)}>
      {Object.entries(groupedVariants).map(([type, items]) => {
        const selectedId = selectedVariants[type] || items[0]?.id;
        const selectedItem = items.find((i) => i.id === selectedId);

        return (
          <div key={type} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-foreground">
                {type}:
              </span>
              {selectedItem && (
                <span className="font-medium text-muted-foreground">
                  {selectedItem.name}
                </span>
              )}
            </div>

            {/* Color Swatches */}
            {type === 'color' ? (
              <div className="flex flex-wrap items-center gap-2.5">
                {items.map((item) => {
                  const isSelected = selectedId === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectVariant(type, item.id)}
                      title={item.name}
                      aria-label={`Select ${item.name}`}
                      className={cn(
                        'relative flex h-8 w-8 items-center justify-center rounded-full transition-all cursor-pointer shadow-2xs',
                        isSelected
                          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110'
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      )}
                    >
                      <span
                        className="h-full w-full rounded-full border border-black/15 dark:border-white/20"
                        style={{ backgroundColor: item.value }}
                      />
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Size / Storage / Style Pills */
              <div className="flex flex-wrap items-center gap-2">
                {items.map((item) => {
                  const isSelected = selectedId === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectVariant(type, item.id)}
                      className={cn(
                        'rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                          : 'border-border bg-card text-foreground hover:bg-muted'
                      )}
                    >
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

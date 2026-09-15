'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingFilterProps {
  minRating: number;
  onRatingChange: (rating: number) => void;
  className?: string;
}

const RATING_OPTIONS = [
  { rating: 4.5, label: '4.5 & Up' },
  { rating: 4.0, label: '4.0 & Up' },
  { rating: 3.5, label: '3.5 & Up' },
  { rating: 3.0, label: '3.0 & Up' },
  { rating: 0, label: 'All Ratings' },
];

export function RatingFilter({
  minRating,
  onRatingChange,
  className,
}: RatingFilterProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
        Customer Rating
      </h3>

      <div className="space-y-1 pt-1">
        {RATING_OPTIONS.map((opt) => {
          const isSelected = minRating === opt.rating;

          return (
            <button
              key={opt.rating}
              type="button"
              onClick={() => onRatingChange(opt.rating)}
              className={cn(
                'flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer',
                isSelected
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-foreground/80 hover:bg-muted'
              )}
            >
              <div className="flex items-center gap-1.5">
                {opt.rating > 0 ? (
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn('h-3.5 w-3.5', {
                          'fill-amber-400 text-amber-400': i < Math.floor(opt.rating),
                          'text-muted-foreground/30': i >= Math.floor(opt.rating),
                        })}
                      />
                    ))}
                  </div>
                ) : (
                  <span>★ Any</span>
                )}
                <span>{opt.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

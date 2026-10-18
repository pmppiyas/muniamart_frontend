'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductRatingProps {
  rating?: number;
  reviewsCount?: number;
  showReviews?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function ProductRating({
  rating = 5.0,
  reviewsCount,
  showReviews = true,
  className,
  size = 'sm',
}: ProductRatingProps) {
  if (!rating || rating <= 0) return null;

  const starSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center text-amber-500">
        <Star className={cn(starSizes[size], 'fill-amber-400 text-amber-400 shrink-0')} />
      </div>

      <span className={cn('font-bold text-foreground', textSizes[size])}>
        {rating.toFixed(1)}
      </span>

      {showReviews && reviewsCount !== undefined && (
        <span className={cn('text-muted-foreground font-normal', textSizes[size])}>
          ({reviewsCount})
        </span>
      )}
    </div>
  );
}

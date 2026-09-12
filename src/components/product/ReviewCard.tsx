'use client';

import * as React from 'react';
import Image from 'next/image';
import { Star, CheckCircle2, User } from 'lucide-react';
import { ProductReview } from '@/types/product';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  review: ProductReview;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col space-y-3 rounded-2xl border border-border bg-card p-5 shadow-2xs transition-all hover:border-primary/40',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {review.avatar ? (
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border bg-muted">
              <Image
                src={review.avatar}
                alt={review.author}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
              <User className="h-5 w-5" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-foreground">
                {review.author}
              </span>
              {review.verifiedPurchase && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Verified Purchase</span>
                </span>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">{review.date}</span>
          </div>
        </div>

        <div className="flex items-center text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn('h-3.5 w-3.5', {
                'fill-amber-400 text-amber-400': i < review.rating,
                'text-muted-foreground/30': i >= review.rating,
              })}
            />
          ))}
        </div>
      </div>

      <div className="space-y-1">
        {review.title && (
          <h4 className="text-xs font-bold text-foreground">{review.title}</h4>
        )}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {review.comment}
        </p>
      </div>
    </div>
  );
}

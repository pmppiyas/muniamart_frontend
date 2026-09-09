'use client';

import * as React from 'react';
import { Star, MessageSquarePlus, MessageSquare } from 'lucide-react';
import { ProductReview } from '@/types/product';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { cn } from '@/lib/utils';

interface ProductReviewsProps {
  productId: string;
  reviews?: ProductReview[];
  rating?: number;
  reviewsCount?: number;
  className?: string;
}

export function ProductReviews({
  productId,
  reviews = [],
  rating = 5.0,
  reviewsCount = 0,
  className,
}: ProductReviewsProps) {
  const [reviewList, setReviewList] = React.useState<ProductReview[]>(reviews);
  const [showReviewForm, setShowReviewForm] = React.useState(false);

  const totalReviews = reviewList.length > 0 ? reviewList.length : reviewsCount;

  const ratingDistribution = React.useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (reviewList.length > 0) {
      reviewList.forEach((r) => {
        const star = Math.min(5, Math.max(1, Math.round(r.rating)));
        counts[star] = (counts[star] || 0) + 1;
      });
    } else {
      counts[5] = Math.round(totalReviews * 0.7);
      counts[4] = Math.round(totalReviews * 0.2);
      counts[3] = Math.round(totalReviews * 0.07);
      counts[2] = Math.round(totalReviews * 0.02);
      counts[1] = Math.round(totalReviews * 0.01);
    }
    return counts;
  }, [reviewList, totalReviews]);

  const handleAddReview = (newReview: ProductReview) => {
    setReviewList((prev) => [newReview, ...prev]);
    setShowReviewForm(false);
  };

  return (
    <div id="product-reviews" className={cn('space-y-8', className)}>
      {/* Header & Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        {/* Left: Overall Score (4 cols) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-2 md:border-r border-border md:pr-8">
          <span className="text-5xl sm:text-6xl font-black tracking-tight text-foreground">
            {rating.toFixed(1)}
          </span>
          <div className="flex items-center text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn('h-5 w-5', {
                  'fill-amber-400 text-amber-400': i < Math.floor(rating),
                  'text-muted-foreground/30': i >= Math.floor(rating),
                })}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Based on {totalReviews} verified ratings
          </p>

          <button
            type="button"
            onClick={() => setShowReviewForm((prev) => !prev)}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span>{showReviewForm ? 'Close Form' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Right: Star breakdown progress bars (8 cols) */}
        <div className="md:col-span-8 space-y-2.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingDistribution[stars] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 w-14 font-semibold text-foreground shrink-0">
                  <span>{stars}</span>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                </div>

                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-10 text-right text-muted-foreground font-medium text-[11px]">
                  {Math.round(percentage)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form (if open) */}
      {showReviewForm && (
        <ReviewForm
          productId={productId}
          onAddReview={handleAddReview}
          onClose={() => setShowReviewForm(false)}
        />
      )}

      {/* Review Cards List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span>Customer Reviews ({reviewList.length})</span>
        </h3>

        {reviewList.length > 0 ? (
          <div className="space-y-3">
            {reviewList.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
            No detailed reviews written yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
}

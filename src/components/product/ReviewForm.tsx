'use client';

import * as React from 'react';
import { Star, Send } from 'lucide-react';
import { toast } from 'sonner';
import { ProductReview } from '@/types/product';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  productId: string;
  onAddReview: (newReview: ProductReview) => void;
  onClose?: () => void;
  className?: string;
}

export function ReviewForm({
  productId,
  onAddReview,
  onClose,
  className,
}: ReviewFormProps) {
  const [rating, setRating] = React.useState(5);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [author, setAuthor] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) {
      toast.error('Please enter your name and review comment');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newReview: ProductReview = {
        id: `rev-${productId}-${Date.now()}`,
        author: author.trim(),
        rating,
        date: new Date().toISOString().split('T')[0],
        title: title.trim() || undefined,
        comment: comment.trim(),
        verifiedPurchase: true,
      };

      onAddReview(newReview);
      setIsSubmitting(false);
      toast.success('Thank you! Your review has been published.');
      if (onClose) onClose();
    }, 500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4',
        className
      )}
    >
      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground">Write a Review</h3>
        <p className="text-xs text-muted-foreground">
          Share your authentic thoughts and experience with other shoppers.
        </p>
      </div>

      <div className="space-y-1.5 pt-1">
        <span className="text-xs font-bold uppercase tracking-wider text-foreground">
          Overall Rating:
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            const isFilled =
              hoverRating > 0 ? hoverRating >= starValue : rating >= starValue;

            return (
              <button
                key={starValue}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`Rate ${starValue} stars`}
                className="p-1 text-amber-500 hover:scale-115 transition-transform cursor-pointer"
              >
                <Star
                  className={cn('h-6 w-6', {
                    'fill-amber-400 text-amber-400': isFilled,
                    'text-muted-foreground/30': !isFilled,
                  })}
                />
              </button>
            );
          })}
          <span className="ml-2 text-xs font-bold text-foreground">
            {rating} of 5 Stars
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">Your Name *</label>
        <input
          type="text"
          required
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="e.g. Alex Morgan"
          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">
          Review Headline
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Incredible audio clarity & build quality!"
          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">
          Detailed Review *
        </label>
        <textarea
          required
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you like or dislike? How does it perform?"
          className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary-hover active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
          <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

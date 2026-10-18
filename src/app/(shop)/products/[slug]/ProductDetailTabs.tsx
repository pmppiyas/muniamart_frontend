'use client';

import * as React from 'react';
import { FileText, Settings, Truck, Star, RefreshCw, Clock } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductDescription } from '@/components/product/ProductDescription';
import { ProductSpecifications } from '@/components/product/ProductSpecifications';
import { ProductReviews } from '@/components/product/ProductReviews';
import { cn } from '@/lib/utils';

interface ProductDetailTabsProps {
  product: Product;
  className?: string;
}

type TabType = 'description' | 'specifications' | 'shipping' | 'reviews';

export function ProductDetailTabs({ product, className }: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('description');
  const reviewCount = product.reviews?.length || product.reviewsCount || 0;

  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'description',
      label: 'Description',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: 'specifications',
      label: 'Specifications',
      icon: <Settings className="h-4 w-4" />,
    },
    {
      id: 'shipping',
      label: 'Shipping & Returns',
      icon: <Truck className="h-4 w-4" />,
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: <Star className="h-4 w-4" />,
      badge: reviewCount,
    },
  ];

  return (
    <div className={cn('border-t border-border pt-8', className)}>
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-px">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'group flex items-center gap-2 border-b-2 px-5 py-3.5 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
              )}
            >
              <span className={cn('transition-colors', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-6 sm:pt-8">
        {activeTab === 'description' && (
          <div className="animate-in fade-in duration-200">
            <ProductDescription product={product} />
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="animate-in fade-in duration-200 max-w-3xl">
            <ProductSpecifications product={product} />
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="animate-in fade-in duration-200 max-w-4xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-2xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Truck className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-foreground">Standard Delivery</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  2 - 4 business days. Free delivery on orders exceeding $50. Tracked with live delivery courier updates.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-2xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Clock className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-foreground">Express Priority</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Next business day delivery available at checkout for orders confirmed before 2:00 PM EST.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-2xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-foreground">30 Days Easy Returns</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Not happy with your item? Return it in its original packaging within 30 days for a prompt refund or swap.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <h4 className="text-sm font-bold text-foreground">Packaging &amp; Handling</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All fragile items are padded with eco-friendly biodegradable air cushions and tamper-evident sealing tapes. In the unlikely event of transit damage, our 24/7 support line provides immediate complimentary replacements.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="animate-in fade-in duration-200">
            <ProductReviews
              productId={product.id}
              reviews={product.reviews}
              rating={product.rating}
              reviewsCount={product.reviewsCount}
            />
          </div>
        )}
      </div>
    </div>
  );
}

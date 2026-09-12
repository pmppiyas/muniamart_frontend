'use client';

import * as React from 'react';
import { CheckCircle2, Award, Sparkles } from 'lucide-react';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductDescriptionProps {
  product: Product;
  className?: string;
}

export function ProductDescription({ product, className }: ProductDescriptionProps) {
  return (
    <div className={cn('space-y-8', className)}>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Product Overview</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.description ||
            'Engineered for maximum reliability, comfort, and uncompromising performance. Built with sustainable, high-grade components designed to exceed everyday standards.'}
        </p>
      </div>

      {product.features && product.features.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Key Highlights &amp; Features
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-2xs"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-foreground/90 leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-card to-card p-6 space-y-3">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <Award className="h-5 w-5" />
          <span>Manufacturer Quality Guarantee</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Every {product.name} undergoes rigorous multi-point quality control testing prior to packaging. We work directly with verified authorized suppliers to ensure you receive 100% genuine factory sealed products with full manufacturer warranty coverage.
        </p>
      </div>
    </div>
  );
}

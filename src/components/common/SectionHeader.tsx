'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  /** The main section heading text */
  title: string;
  /** Semantic heading tag level, defaults to 'h2' */
  as?: 'h1' | 'h2' | 'h3';
  /** Optional link destination for 'View All' */
  viewAllHref?: string;
  /** Optional custom text for the view all link (defaults to 'View All') */
  viewAllText?: string;
  /** Optional custom action node on the right (e.g., custom button or filter) */
  action?: React.ReactNode;
  /** Optional extra CSS classes for the header container */
  className?: string;
  /** Optional children rendered on the right side if action is not provided */
  children?: React.ReactNode;
}

export function SectionHeader({
  title,
  as: HeadingTag = 'h2',
  viewAllHref,
  viewAllText = 'View All',
  action,
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 border-b border-border/60 pb-3.5 sm:pb-4 mb-6 sm:mb-8',
        className
      )}
    >
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <span className="w-1.5 h-6 sm:h-7 bg-primary rounded-full shrink-0" />
        <HeadingTag className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight text-foreground truncate">
          {title}
        </HeadingTag>
      </div>

      {action ? (
        action
      ) : viewAllHref ? (
        <Link
          href={viewAllHref}
          className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors shrink-0"
        >
          <span>{viewAllText}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : children ? (
        children
      ) : null}
    </div>
  );
}

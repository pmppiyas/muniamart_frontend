import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AdminPageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  compact?: boolean;
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  badge,
  actions,
  children,
  compact = false,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        compact ? 'space-y-2' : 'space-y-3 sm:space-y-4',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3',
          compact && 'min-h-11'
        )}
      >
        <div className={cn(compact ? 'space-y-0.5' : 'space-y-1')}>
          <div className="flex flex-wrap items-center gap-2">
            <h1
              className={cn(
                'font-bold tracking-tight text-foreground',
                compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
              )}
            >
              {title}
            </h1>
            {badge && <div className="flex items-center">{badge}</div>}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {children && <div>{children}</div>}
    </div>
  );
}

export const DashboardPageHeader = AdminPageHeader;

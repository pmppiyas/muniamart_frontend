import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
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
  breadcrumbs,
  actions,
  children,
  compact = false,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn(compact ? 'space-y-2' : 'space-y-3 sm:space-y-4', className)}>
      {/* Optional Breadcrumb Navigation */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link
            href="/admin/dashboard"
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold text-foreground truncate max-w-[200px]">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Main Header Row: Title & Actions */}
      <div className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3',
        compact && 'min-h-[44px]'
      )}>
        {/* Left Side: Title, Badge, Description */}
        <div className={cn(compact ? 'space-y-0.5' : 'space-y-1')}>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className={cn(
              'font-bold tracking-tight text-foreground',
              compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
            )}>
              {title}
            </h1>
            {badge && (
              <div className="flex items-center">
                {badge}
              </div>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Right Side: Action Buttons */}
        {actions && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Optional Children (Filter bars, search bars, extra controls) */}
      {children && <div>{children}</div>}
    </div>
  );
}

export const DashboardPageHeader = AdminPageHeader;

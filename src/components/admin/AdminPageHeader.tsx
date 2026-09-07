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
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  badge,
  breadcrumbs,
  actions,
  children,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Side: Title, Badge, Description */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {title}
            </h1>
            {badge && (
              <div className="flex items-center">
                {badge}
              </div>
            )}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Right Side: Action Buttons */}
        {actions && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Optional Children (Filter bars, search bars, extra controls) */}
      {children && <div className="pt-1">{children}</div>}
    </div>
  );
}

// Re-export as DashboardPageHeader for semantic convenience
export const DashboardPageHeader = AdminPageHeader;

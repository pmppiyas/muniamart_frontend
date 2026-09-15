'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type StatColorTheme =
  | 'primary'
  | 'blue'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'sky'
  | 'purple'
  | 'indigo';

export interface AdminStatItem {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  color?: StatColorTheme;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
}

export interface AdminStatsGroupProps {
  stats: AdminStatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const COLOR_VARIANTS: Record<
  StatColorTheme,
  {
    bg: string;
    border: string;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeColor: string;
  }
> = {
  primary: {
    bg: 'bg-gradient-to-br from-primary/[0.08] via-card to-primary/[0.02]',
    border: 'border-primary/20 hover:border-primary/40',
    iconBg: 'bg-primary/15 border-primary/20',
    iconColor: 'text-primary',
    badgeBg: 'bg-primary/10 border-primary/20',
    badgeColor: 'text-primary',
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-500/[0.08] via-card to-blue-500/[0.02]',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    iconBg: 'bg-blue-500/15 border-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-500/10 border-blue-500/20',
    badgeColor: 'text-blue-700 dark:text-blue-300',
  },
  emerald: {
    bg: 'bg-gradient-to-br from-emerald-500/[0.08] via-card to-emerald-500/[0.02]',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    iconBg: 'bg-emerald-500/15 border-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
    badgeColor: 'text-emerald-700 dark:text-emerald-300',
  },
  amber: {
    bg: 'bg-gradient-to-br from-amber-500/[0.08] via-card to-amber-500/[0.02]',
    border: 'border-amber-500/20 hover:border-amber-500/40',
    iconBg: 'bg-amber-500/15 border-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-500/10 border-amber-500/20',
    badgeColor: 'text-amber-700 dark:text-amber-300',
  },
  rose: {
    bg: 'bg-gradient-to-br from-rose-500/[0.08] via-card to-rose-500/[0.02]',
    border: 'border-rose-500/20 hover:border-rose-500/40',
    iconBg: 'bg-rose-500/15 border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-500/10 border-rose-500/20',
    badgeColor: 'text-rose-700 dark:text-rose-300',
  },
  sky: {
    bg: 'bg-gradient-to-br from-sky-500/[0.08] via-card to-sky-500/[0.02]',
    border: 'border-sky-500/20 hover:border-sky-500/40',
    iconBg: 'bg-sky-500/15 border-sky-500/20',
    iconColor: 'text-sky-600 dark:text-sky-400',
    badgeBg: 'bg-sky-500/10 border-sky-500/20',
    badgeColor: 'text-sky-700 dark:text-sky-300',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-500/[0.08] via-card to-purple-500/[0.02]',
    border: 'border-purple-500/20 hover:border-purple-500/40',
    iconBg: 'bg-purple-500/15 border-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-500/10 border-purple-500/20',
    badgeColor: 'text-purple-700 dark:text-purple-300',
  },
  indigo: {
    bg: 'bg-gradient-to-br from-indigo-500/[0.08] via-card to-indigo-500/[0.02]',
    border: 'border-indigo-500/20 hover:border-indigo-500/40',
    iconBg: 'bg-indigo-500/15 border-indigo-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badgeBg: 'bg-indigo-500/10 border-indigo-500/20',
    badgeColor: 'text-indigo-700 dark:text-indigo-300',
  },
};

export function AdminStatCard({ stat }: { stat: AdminStatItem }) {
  const theme = COLOR_VARIANTS[stat.color || 'primary'];
  const Icon = stat.icon;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 hover:shadow-sm shadow-2xs group',
        theme.bg,
        theme.border
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-muted-foreground truncate">
          {stat.title}
        </span>
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105',
            theme.iconBg,
            theme.iconColor
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-2xl font-black tracking-tight text-foreground">
          {typeof stat.value === 'number'
            ? stat.value.toLocaleString()
            : stat.value}
        </span>
        {stat.badge && (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-bold border',
              theme.badgeBg,
              theme.badgeColor
            )}
          >
            {stat.badge}
          </span>
        )}
      </div>

      {(stat.change || stat.subtext) && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {stat.change && (
            <span
              className={cn(
                'font-bold',
                stat.isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              )}
            >
              {stat.change}
            </span>
          )}
          {stat.subtext && <span>{stat.subtext}</span>}
        </div>
      )}
    </div>
  );
}

export function AdminStatsGroup({
  stats,
  columns = 4,
  className,
}: AdminStatsGroupProps) {
  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-3 sm:gap-4', colClasses[columns], className)}>
      {stats.map((stat, idx) => (
        <AdminStatCard key={idx} stat={stat} />
      ))}
    </div>
  );
}

'use client';

import * as React from 'react';
import { WeeklySalesItem } from '@/types/dashboard';
import { cn } from '@/lib/utils';

export interface DashboardRevenueChartProps {
  weeklySales: WeeklySalesItem[];
  thisWeekRevenue: number;
  formatPrice: (amount: number) => string;
  className?: string;
}

export const DashboardRevenueChart: React.FC<DashboardRevenueChartProps> = ({
  weeklySales,
  thisWeekRevenue,
  formatPrice,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs',
        className
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-foreground">Revenue Analytics</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Weekly gross revenue performance across all payment channels
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground">This Week</span>
          <p className="text-lg font-black text-foreground">
            {formatPrice(thisWeekRevenue)}
          </p>
        </div>
      </div>

      <div className="h-48 sm:h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
        {weeklySales && weeklySales.length > 0 ? (
          weeklySales.map((item) => (
            <div
              key={item.day}
              className="flex-1 flex flex-col items-center gap-2 group"
            >
              <div className="w-full flex justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded shadow-2xs -translate-y-1 whitespace-nowrap">
                  {formatPrice(item.amount)}
                </span>
              </div>
              <div className="w-full max-w-[48px] bg-muted/40 rounded-xl overflow-hidden h-36 flex items-end">
                <div
                  style={{ height: item.height || '15%' }}
                  className="w-full bg-primary group-hover:bg-primary-hover rounded-xl transition-all duration-300"
                />
              </div>
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                {item.day}
              </span>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
            No revenue recorded for the current cycle
          </div>
        )}
      </div>
    </div>
  );
};

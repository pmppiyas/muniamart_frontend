'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PieChartItem {
  label: string;
  count: number;
  percentage: number;
  color: string;
  valueFormatted?: string;
}

export interface DashboardPieChartProps {
  title: string;
  description?: string;
  data: PieChartItem[];
  centerLabel?: string;
  centerValue?: string | number;
  className?: string;
}

export const DashboardPieChart: React.FC<DashboardPieChartProps> = ({
  title,
  description,
  data,
  centerLabel = 'Total',
  centerValue,
  className,
}) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const total = React.useMemo(() => {
    return data.reduce((sum, item) => sum + (item.count || 0), 0);
  }, [data]);

  const displayCenterValue = centerValue !== undefined ? centerValue : total;

  // Calculate SVG stroke segments (Radius = 40, Circumference = 2 * PI * 40 ≈ 251.327)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  // Filter out items with 0 count for chart drawing
  const activeItems = data.filter((d) => d.count > 0);
  const chartTotal = activeItems.reduce((acc, curr) => acc + curr.count, 0);

  // Compute strokeDasharray and strokeDashoffset for each active slice
  let accumulatedOffset = 0;
  const segments = activeItems.map((item, idx) => {
    const slicePct = chartTotal > 0 ? item.count / chartTotal : 0;
    const strokeDash = slicePct * circumference;
    const dashArray = `${strokeDash} ${circumference - strokeDash}`;
    const offset = -accumulatedOffset;
    accumulatedOffset += strokeDash;

    return {
      ...item,
      originalIndex: data.findIndex((d) => d.label === item.label),
      strokeDasharray: dashArray,
      strokeDashoffset: offset,
    };
  });

  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between',
        className
      )}
    >
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>

        {total === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No data recorded yet
          </div>
        ) : (
          <div className="mt-5 flex flex-col sm:flex-row items-center gap-6 justify-center">
            {/* SVG Donut Chart */}
            <div className="relative h-44 w-44 shrink-0 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full -rotate-90 transform transition-all duration-300"
              >
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-muted/40"
                  strokeWidth="12"
                  fill="transparent"
                />

                {/* Slices */}
                {segments.map((slice) => {
                  const isHovered = hoveredIndex === slice.originalIndex;
                  return (
                    <circle
                      key={slice.label}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={isHovered ? 14 : 12}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      strokeLinecap="butt"
                      className="transition-all duration-200 cursor-pointer"
                      style={{
                        opacity:
                          hoveredIndex !== null && !isHovered ? 0.45 : 1,
                      }}
                      onMouseEnter={() => setHoveredIndex(slice.originalIndex)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  );
                })}
              </svg>

              {/* Center Metrics */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                {hoveredIndex !== null && data[hoveredIndex] ? (
                  <>
                    <span className="text-lg font-black text-foreground">
                      {data[hoveredIndex].percentage}%
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground truncate max-w-[90px] px-1">
                      {data[hoveredIndex].label}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-xl font-black text-foreground">
                      {displayCenterValue}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      {centerLabel}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Legend List */}
            <div className="flex-1 w-full space-y-2.5">
              {data.map((item, idx) => {
                const isHovered = hoveredIndex === idx;
                return (
                  <div
                    key={item.label}
                    className={cn(
                      'flex items-center justify-between text-xs rounded-lg px-2.5 py-1.5 transition-all cursor-pointer border border-transparent',
                      isHovered
                        ? 'bg-muted/60 border-border/80 scale-[1.02]'
                        : 'hover:bg-muted/40'
                    )}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span
                        className={cn(
                          'truncate font-medium transition-colors',
                          isHovered ? 'text-foreground font-bold' : 'text-muted-foreground'
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-muted-foreground">
                        {item.valueFormatted || `${item.count}`}
                      </span>
                      <span className="text-xs font-bold text-foreground min-w-[32px] text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

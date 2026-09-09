'use client';

import * as React from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { Currency, CURRENCIES } from '@/config/currency';
import { cn } from '@/lib/utils';

interface CurrencySwitcherProps {
  variant?: 'header' | 'topbar' | 'mobile';
  className?: string;
}

export function CurrencySwitcher({
  variant = 'header',
  className,
}: CurrencySwitcherProps) {
  const { currency, setCurrency, config } = useCurrency();
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currenciesList: Currency[] = ['BDT', 'USD', 'EUR'];

  if (variant === 'topbar') {
    return (
      <div className={cn('relative', className)} ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-1"
          aria-label="Change currency"
        >
          <Globe className="h-3 w-3 text-zinc-400" />
          <span className="font-semibold text-zinc-200">
            {config.symbol} {config.code}
          </span>
          <ChevronDown className={cn('h-3 w-3 text-zinc-400 transition-transform duration-200', isOpen && 'rotate-180')} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full z-50 mt-1.5 w-44 rounded-xl border border-border bg-popover p-1 text-xs text-popover-foreground shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 mb-1">
              Select Currency
            </div>
            {currenciesList.map((curr) => {
              const item = CURRENCIES[curr];
              const isSelected = currency === curr;
              return (
                <button
                  key={curr}
                  type="button"
                  onClick={() => {
                    setCurrency(curr);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'hover:bg-muted text-foreground'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.flag}</span>
                    <div>
                      <div className="font-bold text-xs leading-none">
                        {item.symbol} {item.code}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {item.name}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={cn('space-y-1.5', className)}>
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Select Currency
        </label>
        <div className="grid grid-cols-3 gap-2">
          {currenciesList.map((curr) => {
            const item = CURRENCIES[curr];
            const isSelected = currency === curr;
            return (
              <button
                key={curr}
                type="button"
                onClick={() => setCurrency(curr)}
                className={cn(
                  'flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all cursor-pointer',
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary'
                    : 'border-border bg-card text-foreground hover:bg-muted'
                )}
              >
                <span className="text-base mb-0.5">{item.flag}</span>
                <span className="text-xs font-bold">
                  {item.symbol} {item.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex h-9 sm:h-10 items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 sm:px-3 text-foreground shadow-xs transition-all hover:border-primary hover:text-primary active:scale-95 cursor-pointer"
        aria-label="Select currency"
      >
        <span className="text-sm">{config.flag}</span>
        <span className="text-xs font-bold tracking-tight">
          {config.symbol} {config.code}
        </span>
        <ChevronDown
          className={cn(
            'h-3 w-3 text-muted-foreground transition-transform duration-200 group-hover:text-primary',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-border bg-popover p-1.5 text-xs text-popover-foreground shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-border/60 mb-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Currency
            </div>
            <div className="text-[11px] text-foreground font-semibold mt-0.5">
              Base DB: BDT (৳)
            </div>
          </div>

          <div className="space-y-1">
            {currenciesList.map((curr) => {
              const item = CURRENCIES[curr];
              const isSelected = currency === curr;
              return (
                <button
                  key={curr}
                  type="button"
                  onClick={() => {
                    setCurrency(curr);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'hover:bg-muted text-foreground'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xs">
                          {item.symbol} {item.code}
                        </span>
                        {curr === 'BDT' && (
                          <span className="rounded bg-muted px-1 text-[9px] font-bold text-muted-foreground">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {curr === 'USD'
                          ? '1 USD = ৳120'
                          : curr === 'EUR'
                          ? '1 EUR = ৳130'
                          : 'As stored in DB'}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

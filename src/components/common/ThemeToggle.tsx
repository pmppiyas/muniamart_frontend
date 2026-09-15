'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className={cn(
          'h-10 w-10 rounded-xl border border-border bg-card',
          className
        )}
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'group flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-xs transition-all hover:border-primary hover:text-primary active:scale-95 cursor-pointer',
        className
      )}
      aria-label="Toggle theme between Light and Dark mode"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform group-hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-zinc-600 transition-transform group-hover:-rotate-12" />
      )}
    </button>
  );
}

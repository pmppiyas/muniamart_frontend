'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  autoFocus?: boolean;
  onSearchSubmit?: () => void;
}

export function SearchBar({ className, autoFocus = false, onSearchSubmit }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const params = new URLSearchParams();
    params.set('q', query.trim());

    router.push(`/products?${params.toString()}`);
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        'relative flex w-full items-center rounded-xl border border-border/80 bg-muted/40 transition-all focus-within:border-primary focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20',
        className
      )}
    >
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products, brands..."
        autoFocus={autoFocus}
        className="h-10 sm:h-10.5 w-full bg-transparent pl-10 pr-9 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />

      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </form>
  );
}

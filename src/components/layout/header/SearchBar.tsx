'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ChevronDown } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  autoFocus?: boolean;
  onSearchSubmit?: () => void;
}

export function SearchBar({ className, autoFocus = false, onSearchSubmit }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const params = new URLSearchParams();
    params.set('q', query.trim());
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }

    router.push(`/products?${params.toString()}`);
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  const selectedCategoryLabel =
    selectedCategory === 'all'
      ? 'All Categories'
      : siteConfig.categories.find((c) => c.slug === selectedCategory)?.name || 'Categories';

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        'relative flex w-full items-center rounded-xl border border-border bg-card shadow-xs transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
        className
      )}
    >
      <div className="relative hidden border-r border-border sm:block" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsCategoryOpen((prev) => !prev)}
          className="flex h-11 items-center gap-1.5 px-3.5 text-xs font-semibold text-foreground hover:text-primary transition-colors"
        >
          <span className="max-w-[110px] truncate">{selectedCategoryLabel}</span>
          <ChevronDown
            className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform duration-200', {
              'rotate-180': isCategoryOpen,
            })}
          />
        </button>

        {isCategoryOpen && (
          <div className="absolute left-0 top-full z-50 mt-1.5 w-52 rounded-xl border border-border bg-popover p-1.5 shadow-lg animate-in fade-in-0 zoom-in-95">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setIsCategoryOpen(false);
              }}
              className={cn(
                'flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium text-left transition-colors',
                selectedCategory === 'all'
                  ? 'bg-accent text-accent-foreground font-semibold'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              All Categories
            </button>
            <div className="my-1 border-t border-border" />
            {siteConfig.categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setIsCategoryOpen(false);
                }}
                className={cn(
                  'flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium text-left transition-colors',
                  selectedCategory === cat.slug
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative flex flex-1 items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, brands..."
          autoFocus={autoFocus}
          className="h-10 sm:h-11 w-full bg-transparent px-3 sm:px-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="mr-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <button
        type="submit"
        aria-label="Search"
        className="mr-1.5 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover active:scale-95 cursor-pointer"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">Search</span>
      </button>
    </form>
  );
}

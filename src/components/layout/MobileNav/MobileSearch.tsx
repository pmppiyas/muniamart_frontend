'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, History } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearch({ isOpen, onClose }: MobileSearchProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    router.push(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
    onClose();
  };

  const trendingKeywords = ['Wireless Earbuds', 'Smart Watch', 'Leather Wallet', 'Gaming Mouse', 'Hoodie'];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background text-foreground animate-in fade-in-0 slide-in-from-top-4 duration-200">
      <div className="flex items-center gap-2 border-b border-border p-3">
        <div className="relative flex flex-1 items-center rounded-xl border border-border bg-muted/50 focus-within:border-primary focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="ml-3 h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Search products, brands, categories..."
            className="h-11 w-full bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mr-2 rounded-full p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span>Trending Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => handleSearch(kw)}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            <History className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Popular Categories</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {siteConfig.categories.slice(0, 6).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  router.push(`/categories/${cat.slug}`);
                  onClose();
                }}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-left hover:border-primary/40 hover:bg-accent/40 transition-colors cursor-pointer"
              >
                <span className="text-xs font-bold text-foreground">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

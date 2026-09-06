'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Mail, ChevronRight, LogIn } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useGetAllCategoriesQuery } from '@/services/api/categoryApi';
import { Logo } from './Logo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  className?: string;
}

export function MobileMenu({ className }: MobileMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'categories' | 'menu'>(
    'categories'
  );
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(
    null
  );

  // Fetch live categories from database
  const { data: categoriesRes } = useGetAllCategoriesQuery();
  const dbCategories = categoriesRes?.data;

  const categoriesList = React.useMemo(() => {
    if (Array.isArray(dbCategories) && dbCategories.length > 0) {
      return dbCategories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon || 'LayoutGrid',
        subcategories: (c.children || []).map((ch) => ch.name),
      }));
    }
    return siteConfig.categories;
  }, [dbCategories]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleCategory = (slug: string) => {
    setExpandedCategory((prev) => (prev === slug ? null : slug));
  };

  return (
    <div className={className}>
      {/* Menu Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-xs hover:border-primary hover:text-primary active:scale-95 transition-all cursor-pointer"
        aria-label="Open navigation menu"
      >
        <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-over Drawer (From Right) */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-background text-foreground shadow-2xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer Header: Logo + ThemeToggle */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <Logo showTagline />
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border bg-muted/30">
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={cn(
              'flex-1 py-3 text-xs font-bold transition-colors cursor-pointer border-b-2',
              activeTab === 'categories'
                ? 'border-primary text-primary bg-background'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            Categories
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={cn(
              'flex-1 py-3 text-xs font-bold transition-colors cursor-pointer border-b-2',
              activeTab === 'menu'
                ? 'border-primary text-primary bg-background'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            Navigation
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {activeTab === 'categories' ? (
            <div className="space-y-1">
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
              >
                <span>All Products</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              {categoriesList.map((cat) => (
                <div key={cat.slug} className="rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors">
                    <Link
                      href={`/categories/${cat.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex-1"
                    >
                      {cat.name}
                    </Link>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.slug)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 transition-transform duration-200',
                            expandedCategory === cat.slug && 'rotate-90'
                          )}
                        />
                      </button>
                    )}
                  </div>
                  {expandedCategory === cat.slug &&
                    cat.subcategories &&
                    cat.subcategories.length > 0 && (
                      <div className="bg-muted/30 px-4 py-2 space-y-1.5 border-l-2 border-primary ml-4">
                        {cat.subcategories.map((sub: string) => (
                          <Link
                            key={sub}
                            href={`/categories/${cat.slug}?sub=${encodeURIComponent(sub)}`}
                            onClick={() => setIsOpen(false)}
                            className="block text-xs text-muted-foreground hover:text-primary py-1"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1 text-xs font-semibold">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3 py-2.5 hover:bg-muted transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3 py-2.5 hover:bg-muted transition-colors"
              >
                Shop Catalog
              </Link>
              <Link
                href="/categories"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3 py-2.5 hover:bg-muted transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3 py-2.5 hover:bg-muted transition-colors"
              >
                Shopping Cart
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3 py-2.5 hover:bg-muted transition-colors"
              >
                My Wishlist
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3 py-2.5 hover:bg-muted transition-colors"
              >
                My Account
              </Link>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3 py-2.5 hover:bg-muted transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3 py-2.5 hover:bg-muted transition-colors"
              >
                Contact & Support
              </Link>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-border p-4 space-y-2 bg-muted/10 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3.5 w-3.5 text-primary" />
            <span>{siteConfig.contact.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-3.5 w-3.5 text-primary" />
            <span>{siteConfig.contact.email}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

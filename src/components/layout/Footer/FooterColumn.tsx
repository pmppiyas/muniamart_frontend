'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FooterLink {
  label: string;
  href: string;
  badge?: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
  className?: string;
}

export function FooterColumn({ title, links, className }: FooterColumnProps) {
  return (
    <div className={cn('space-y-3.5', className)}>
      <h4 className="text-xs font-black uppercase tracking-wider text-white">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="rounded-full bg-primary/20 text-blue-300 px-1.5 py-0.2 text-[9px] font-bold">
                  {link.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

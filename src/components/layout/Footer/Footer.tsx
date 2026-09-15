'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Logo } from '../header/Logo';
import { Newsletter } from './Newsletter';
import { FooterColumn } from './FooterColumn';
import { SocialLinks } from './SocialLinks';

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const categoryLinks = siteConfig.categories.map((c) => ({
    label: c.name,
    href: `/categories/${c.slug}`,
  }));

  return (
    <>
      <section className="bg-white dark:bg-zinc-950 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>

      <footer className="bg-black text-zinc-400">
        <div className="mx-auto max-w-7xl px-3 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4 space-y-4">
            <Logo showTagline variant="dark" />
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              {siteConfig.description}
            </p>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{siteConfig.contact.address}</span>
              </div>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span className="font-semibold">
                  {siteConfig.contact.phone}
                </span>
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </a>
            </div>

            <div className="pt-2">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Follow Us
              </span>
              <SocialLinks />
            </div>
          </div>

          <div className="lg:col-span-2">
            <FooterColumn title="Shop" links={siteConfig.footerLinks.shop} />
          </div>

          <div className="lg:col-span-3">
            <FooterColumn
              title="Categories"
              links={categoryLinks.slice(0, 6)}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <FooterColumn
              title="Customer Care"
              links={siteConfig.footerLinks.customerService}
            />

            <div className="rounded-xl bg-zinc-900/60 p-3.5">
              <span className="block text-[11px] font-bold text-zinc-200">
                Guaranteed Safe Checkout
              </span>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                We accept major international and local mobile payment options
                with end-to-end encryption.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-zinc-400 text-center sm:text-left">
            © {new Date().getFullYear()}{' '}
            <span className="font-bold text-white">MUNIAMART</span>. All
            rights reserved. Built for modern high-performance shopping.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-[10px] font-black text-blue-400 shadow-2xs">
              VISA
            </span>
            <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-[10px] font-black text-rose-400 shadow-2xs">
              MASTERCARD
            </span>
            <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-[10px] font-black text-purple-400 shadow-2xs">
              STRIPE
            </span>
            <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-[10px] font-black text-pink-400 shadow-2xs">
              bKash
            </span>
            <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400 shadow-2xs">
              SSL SECURE
            </span>
          </div>
        </div>
      </div>
      </footer>
    </>
  );
}

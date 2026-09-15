import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactFAQ } from '@/components/contact/ContactFAQ';
import { ContactLocation } from '@/components/contact/ContactLocation';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Need help? Contact MUNIAMART customer support via 24/7 hotline, WhatsApp, email, or visit our central fulfillment center in Dhaka, Bangladesh.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
          <span className="font-bold text-foreground">Contact Us</span>
        </nav>

        <ContactHero />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-span-5">
            <ContactFAQ />
          </div>
        </div>

        <ContactLocation />
      </div>
    </div>
  );
}

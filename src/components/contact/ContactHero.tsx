'use client';

import * as React from 'react';
import { Phone, Mail, MessageCircle, MapPin, Headphones, Clock } from 'lucide-react';
import { siteConfig } from '@/config/site';

const CHANNELS = [
  {
    icon: Phone,
    title: 'Customer Hotline',
    detail: siteConfig.contact.phone,
    description: 'Toll-free 24/7 dedicated support',
    actionText: 'Call Now',
    href: `tel:${siteConfig.contact.phone}`,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: Mail,
    title: 'Email Inquiries',
    detail: siteConfig.contact.email,
    description: 'Average response under 2 hours',
    actionText: 'Send Email',
    href: `mailto:${siteConfig.contact.email}`,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Chat',
    detail: siteConfig.contact.phone,
    description: 'Instant order tracking & live chat',
    actionText: 'Start Chat',
    href: `https://wa.me/${siteConfig.contact.phone.replace(/[^0-9]/g, '')}`,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    icon: MapPin,
    title: 'Headquarters',
    detail: 'Innovation Tower, Dhaka',
    description: 'Mon – Sat: 9:00 AM – 8:00 PM',
    actionText: 'View Location',
    href: '#location',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
];

export function ContactHero() {
  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-card via-card to-muted/30 p-6 sm:p-10 lg:p-12 text-center shadow-xs">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-bold text-primary tracking-wide uppercase">
            <Headphones className="h-3.5 w-3.5" />
            <span>24/7 Dedicated Assistance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
            We&apos;re Here to Help You{' '}
            <span className="text-primary">Around the Clock</span>
          </h1>

          <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed">
            Have a question about an order, shipment, warranty, or return? Reach out through any channel below or submit an inquiry—our support specialists are always ready to assist.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Average response: Under 15 mins</span>
            </span>
            <span className="hidden sm:inline text-border">•</span>
            <span className="flex items-center gap-1.5">
              <Headphones className="h-3.5 w-3.5 text-primary" />
              <span>Bangla &amp; English Support</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CHANNELS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.title}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.bg} ${item.color} border ${item.border} transition-transform group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                  <p className="text-xs font-black text-primary mt-1 truncate">{item.detail}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary">
                <span>{item.actionText}</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

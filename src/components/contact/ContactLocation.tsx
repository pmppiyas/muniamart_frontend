'use client';

import * as React from 'react';
import { MapPin, Navigation, Clock, Building2, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function ContactLocation() {
  return (
    <section id="location" className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
            <Building2 className="h-3.5 w-3.5" />
            <span>Corporate Headquarters</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            Visit Our Office &amp; Fulfillment Center
          </h2>
          <p className="text-xs text-muted-foreground">
            {siteConfig.contact.address}
          </p>
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            siteConfig.contact.address
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-2 text-xs font-bold text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Navigation className="h-3.5 w-3.5 text-primary" />
          <span>Get Directions</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Physical Address</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {siteConfig.contact.address}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span>Visiting Hours</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Mon – Sat:</span>
                <span className="font-semibold text-foreground">9:00 AM – 8:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Online 24/7 Hotline
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-[11px] text-muted-foreground">
              Visitors are welcome for product inspection, warranty drop-off, and corporate meetings.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 relative aspect-16/9 sm:aspect-21/9 lg:aspect-16/8 w-full overflow-hidden rounded-2xl border border-border bg-muted">
          <iframe
            title="MuniaMart Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902442430138!2d90.3912183!3d23.7508581!2m3!1f0!2f0!3f0!3m2!1i1024!2i786!4f13.1!3m3!1m2!1s0x3755b8bd55555555%3A0x123456789abcdef!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1650000000000!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale contrast-125 dark:invert dark:hue-rotate-180 transition-all opacity-90 hover:opacity-100"
          />
        </div>
      </div>
    </section>
  );
}

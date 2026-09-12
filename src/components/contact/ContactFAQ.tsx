'use client';

import * as React from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, MessageCircle, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    question: 'How can I track the status of my order?',
    answer:
      'You can check real-time order status directly in your Account Hub under My Orders. Additionally, you will receive an SMS and email notification with courier tracking details as soon as your package is dispatched.',
    link: { label: 'Track in Profile', href: '/profile?tab=orders' },
  },
  {
    question: 'What is your return & replacement policy?',
    answer:
      'We offer an unconditional 7-day hassle-free return and exchange guarantee. If your item is damaged, defective, or different from what you ordered, submit a return request from your account or contact our support team.',
    link: { label: 'View Return Details', href: '/returns' },
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We support Cash on Delivery (COD) across all 64 districts in Bangladesh, as well as bKash, Nagad, Visa, Mastercard, and American Express with 256-bit bank-grade encryption.',
  },
  {
    question: 'How fast is nationwide delivery?',
    answer:
      'Deliveries within Dhaka metropolitan area typically arrive within 24–48 hours. For all other districts across Bangladesh, standard express shipping takes 2–3 business days.',
  },
];

export function ContactFAQ() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
        <div className="border-b border-border pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Instant Answers</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Find immediate answers to our most common shopping inquiries.
          </p>
        </div>

        <div className="space-y-2.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-border/80 bg-muted/20 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="flex w-full items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="pr-3">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                      isOpen && 'rotate-180 text-primary'
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-foreground/75 leading-relaxed border-t border-border/50 bg-background/50 space-y-2 animate-in fade-in-50">
                    <p>{faq.answer}</p>
                    {faq.link && (
                      <Link
                        href={faq.link.href}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1"
                      >
                        <span>{faq.link.label}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
            <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span>Need an Immediate Answer?</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Connect directly with an agent on WhatsApp for instant assistance.
          </p>
        </div>

        <a
          href={`https://wa.me/${siteConfig.contact.phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-xs font-bold text-white shadow-xs hover:bg-green-700 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

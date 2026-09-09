'use client';

import * as React from 'react';
import { Send, Loader2, CheckCircle2, User, Mail, Phone, MessageSquare, Tag, FileText } from 'lucide-react';
import { toast } from 'sonner';

const SUBJECTS = [
  'Order Status & Tracking',
  'Return & Refund Request',
  'Product & Warranty Inquiry',
  'Payment or Checkout Issue',
  'Corporate & Wholesale Orders',
  'Feedback or Other Inquiries',
];

export function ContactForm() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [subject, setSubject] = React.useState(SUBJECTS[0]);
  const [orderNumber, setOrderNumber] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const isOrderRelated =
    subject.includes('Order') || subject.includes('Return') || subject.includes('Payment');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success('Message sent! Our support team will get back to you within 2 hours.');

    setName('');
    setEmail('');
    setPhone('');
    setSubject(SUBJECTS[0]);
    setOrderNumber('');
    setMessage('');
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
      <div className="border-b border-border pb-4 mb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Send Us an Inquiry</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
          How Can We Help You Today?
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Fill out the form below and our representative will reach out to you directly.
        </p>
      </div>

      {isSubmitted ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center space-y-4 animate-in fade-in zoom-in-95">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">Thank You for Reaching Out!</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Your message has been assigned a priority ticket. You will receive an email confirmation shortly with tracking details.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <span>Send Another Inquiry</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                <span>Full Name *</span>
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tanvir Ahmed"
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>Email Address *</span>
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone Number */}
            <div className="space-y-1.5">
              <label htmlFor="contact-phone" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary" />
                <span>Phone Number</span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1700-000000"
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Inquiry Subject */}
            <div className="space-y-1.5">
              <label htmlFor="contact-subject" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span>Inquiry Category *</span>
              </label>
              <select
                id="contact-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none transition-colors cursor-pointer"
              >
                {SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Order Number */}
          {isOrderRelated && (
            <div className="space-y-1.5 animate-in fade-in">
              <label htmlFor="contact-order" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span>Order Number (Optional)</span>
              </label>
              <input
                id="contact-order"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. #ORD-849201"
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* Detailed Message */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-foreground">
              <span>Your Message *</span>
              <span className="text-[11px] font-normal text-muted-foreground">{message.length}/500 chars</span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your question or issue in detail..."
              className="w-full rounded-xl border border-border bg-background p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 sm:h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-8 text-xs sm:text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-hover active:scale-98 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

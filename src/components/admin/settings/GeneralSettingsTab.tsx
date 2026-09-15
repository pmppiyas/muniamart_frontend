'use client';

import * as React from 'react';
import { Store, Mail, Phone, MapPin, Coins, CheckCircle2, Save } from 'lucide-react';
import { toast } from 'sonner';

export function GeneralSettingsTab() {
  const [storeName, setStoreName] = React.useState('MUNIAMART');
  const [storeTagline, setStoreTagline] = React.useState('Premium E-Commerce Experience');
  const [supportEmail, setSupportEmail] = React.useState('support@muniamart.com');
  const [contactPhone, setContactPhone] = React.useState('+880 1812-345678');
  const [storeAddress, setStoreAddress] = React.useState('Dhanmondi, Dhaka 1209, Bangladesh');
  const [defaultCurrency, setDefaultCurrency] = React.useState('BDT');
  const [isOpen, setIsOpen] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Store preferences saved successfully!');
    }, 600);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">General Store Information</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure your public storefront branding, contact channels, and currency.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Store Status:</span>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                isOpen
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}
            >
              {isOpen ? '● Live & Open' : '● Maintenance'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5 text-muted-foreground" />
              Store Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5 text-muted-foreground" />
              Store Tagline
            </label>
            <input
              type="text"
              value={storeTagline}
              onChange={(e) => setStoreTagline(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Support Email
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              Contact Phone
            </label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-muted-foreground" />
              Primary Store Currency
            </label>
            <select
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
              <option value="USD">USD ($) - US Dollar</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              Operating Address
            </label>
            <input
              type="text"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-border">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Store Preferences</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

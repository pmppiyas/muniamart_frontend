'use client';

import * as React from 'react';
import { MapPin, Plus, Trash2, CheckCircle2, Home, Briefcase, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface SavedAddress {
  id: string;
  title: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  district: string;
  isDefault: boolean;
}

const STORAGE_KEY = 'muniamart_saved_addresses';

const DEFAULT_INITIAL_ADDRESS: SavedAddress = {
  id: 'addr-default',
  title: 'Home',
  recipientName: 'Primary Recipient',
  phone: '+880 1700-000000',
  street: 'House #12, Road #4, Dhanmondi',
  city: 'Dhaka',
  district: 'Dhaka',
  isDefault: true,
};

export function ProfileAddressesTab() {
  const [addresses, setAddresses] = React.useState<SavedAddress[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {}
    }
    return [DEFAULT_INITIAL_ADDRESS];
  });
  const [isAddingNew, setIsAddingNew] = React.useState(false);

  const [title, setTitle] = React.useState('Home');
  const [recipientName, setRecipientName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [city, setCity] = React.useState('');
  const [district] = React.useState('Dhaka');

  const saveAddresses = (newAddrs: SavedAddress[]) => {
    setAddresses(newAddrs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAddrs));
    } catch {}
  };

  const handleSetDefault = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    saveAddresses(updated);
    toast.success('Default delivery address updated');
  };

  const handleDelete = (id: string) => {
    if (addresses.length <= 1) {
      toast.error('You must keep at least one saved delivery address.');
      return;
    }
    const updated = addresses.filter((a) => a.id !== id);
    if (!updated.some((a) => a.isDefault) && updated.length > 0) {
      updated[0].isDefault = true;
    }
    saveAddresses(updated);
    toast.success('Address removed');
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !phone.trim() || !street.trim() || !city.trim()) {
      toast.error('Please fill in all address fields.');
      return;
    }

    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      title: title.trim() || 'Home',
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      street: street.trim(),
      city: city.trim(),
      district: district.trim() || 'Dhaka',
      isDefault: addresses.length === 0,
    };

    const updated = [...addresses, newAddr];
    saveAddresses(updated);
    toast.success('New delivery address added');

    setTitle('Home');
    setRecipientName('');
    setPhone('');
    setStreet('');
    setCity('');
    setIsAddingNew(false);
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs">
      <div className="border-b border-border pb-4 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Saved Addresses</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your standard delivery destinations for rapid one-click checkout.
          </p>
        </div>

        {!isAddingNew && (
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Address</span>
          </button>
        )}
      </div>

      {isAddingNew && (
        <form onSubmit={handleCreateAddress} className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between border-b border-primary/10 pb-3">
            <h3 className="text-sm font-bold text-foreground">Add New Delivery Address</h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Address Label</label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="Home">Home</option>
                <option value="Office / Work">Office / Work</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Recipient Name *</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Receiver name"
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Contact Phone *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1700-000000"
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">City / Area *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Dhanmondi, Gulshan, Mirpur"
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">Street Address / House / Flat *</label>
            <input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="e.g. House 45, Road 11, Block D"
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={cn(
              'relative rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all',
              addr.isDefault
                ? 'border-primary bg-primary/5 shadow-xs'
                : 'border-border bg-muted/20 hover:border-primary/30'
            )}
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  {addr.title.toLowerCase().includes('office') || addr.title.toLowerCase().includes('work') ? (
                    <Briefcase className="h-4 w-4 text-primary" />
                  ) : (
                    <Home className="h-4 w-4 text-primary" />
                  )}
                  <span className="text-xs font-bold text-foreground">{addr.title}</span>
                </div>

                {addr.isDefault ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    <CheckCircle2 className="h-3 w-3" />
                    Default
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    Set as default
                  </button>
                )}
              </div>

              <div className="pt-3 space-y-1.5 text-xs text-foreground/80">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{addr.recipientName}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{addr.phone}</span>
                </div>
                <div className="flex items-start gap-2 pt-1 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span>
                    {addr.street}, {addr.city}, {addr.district}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-border/50 flex justify-end">
              <button
                type="button"
                onClick={() => handleDelete(addr.id)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

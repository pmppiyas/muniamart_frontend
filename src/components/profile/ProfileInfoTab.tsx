'use client';

import * as React from 'react';
import { User, Phone, Image as ImageIcon, Mail, Save, Loader2, ShieldAlert } from 'lucide-react';
import { CustomerUser } from '@/features/auth/authTypes';
import { useUpdateProfileMutation } from '@/services/api/customerApi';
import { toast } from 'sonner';

interface ProfileInfoTabProps {
  user: CustomerUser;
}

export function ProfileInfoTab({ user }: ProfileInfoTabProps) {
  const [name, setName] = React.useState(user.name || '');
  const [phone, setPhone] = React.useState(user.phone || '');
  const [photoUrl, setPhotoUrl] = React.useState(user.photoUrl || '');

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Full name is required');
      return;
    }

    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
        photoUrl: photoUrl.trim() || undefined,
      }).unwrap();

      toast.success('Profile updated successfully!');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  const hasChanges =
    name !== (user.name || '') ||
    phone !== (user.phone || '') ||
    photoUrl !== (user.photoUrl || '');

  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs">
      <div className="border-b border-border pb-4 mb-6">
        <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Update your public profile details and contact information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
        <div className="space-y-1.5">
          <label htmlFor="profile-name" className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-primary" />
            <span>Full Name *</span>
          </label>
          <input
            id="profile-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="profile-email" className="text-xs font-bold text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-primary" />
              <span>Email Address</span>
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Verified</span>
          </label>
          <div className="relative">
            <input
              id="profile-email"
              type="email"
              disabled
              value={user.email}
              className="h-11 w-full rounded-xl border border-border bg-muted/60 px-3.5 text-sm text-muted-foreground cursor-not-allowed select-none"
            />
          </div>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" />
            Email is tied to your login credentials and cannot be modified directly.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="profile-phone" className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-primary" />
            <span>Phone Number</span>
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+880 1700-000000"
            className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="profile-avatar" className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <ImageIcon className="h-3.5 w-3.5 text-primary" />
            <span>Avatar Photo URL</span>
          </label>
          <input
            id="profile-avatar"
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
          />
          <p className="text-[11px] text-muted-foreground">
            Provide a direct public image link (Unsplash, Cloudinary, Gravatar, etc.).
          </p>
        </div>

        <div className="pt-3 flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoading || !hasChanges}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>

          {hasChanges && (
            <button
              type="button"
              onClick={() => {
                setName(user.name || '');
                setPhone(user.phone || '');
                setPhotoUrl(user.photoUrl || '');
              }}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-muted/60 px-4 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

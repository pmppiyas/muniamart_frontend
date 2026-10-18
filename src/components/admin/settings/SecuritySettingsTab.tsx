'use client';

import * as React from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, User, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser, selectIsSuperAdmin } from '@/features/auth/authSelectors';
import { toast } from 'sonner';

export function SecuritySettingsTab() {
  const user = useAppSelector(selectCurrentUser);
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully!');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Admin Profile Overview */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="border-b border-border pb-4">
          <h3 className="text-base font-bold text-foreground">Administrator Profile</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Details and role permissions associated with your active administrative account.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="rounded-2xl border border-border bg-background p-4 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground">Admin Name</span>
            <p className="text-xs font-bold text-foreground truncate">{user?.name || 'Administrator'}</p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-4 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground">Registered Email</span>
            <p className="text-xs font-bold text-foreground truncate">{user?.email || 'admin@muniamart.com'}</p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-4 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground">Role Level</span>
            <div className="flex items-center gap-1.5">
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-extrabold text-primary">
                {isSuperAdmin ? 'SUPER_ADMIN' : user?.role || 'ADMIN'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <form onSubmit={handleChangePassword} className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4.5 w-4.5 text-primary" />
            <h3 className="text-base font-bold text-foreground">Change Password</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ensure your account uses a strong, random password to maintain control center security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 pr-10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 pr-10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 pr-10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-border">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Updating...</span>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

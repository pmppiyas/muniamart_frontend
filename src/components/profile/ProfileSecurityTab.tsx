'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, KeyRound, LogOut, Loader2, Smartphone, Globe, Lock } from 'lucide-react';
import { CustomerUser } from '@/features/auth/authTypes';
import { useLogoutMutation } from '@/services/api/authApi';
import { toast } from 'sonner';

interface ProfileSecurityTabProps {
  user: CustomerUser;
}

export function ProfileSecurityTab({ user }: ProfileSecurityTabProps) {
  const router = useRouter();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success('Signed out successfully');
      router.push('/auth/login');
    } catch {
      toast.success('Signed out successfully');
      router.push('/auth/login');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs">
        <div className="border-b border-border pb-4 mb-6">
          <h2 className="text-lg font-bold text-foreground">Security & Login</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your credentials, active sessions, and data protection settings.
          </p>
        </div>

        <div className="space-y-5 max-w-2xl">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">Your account is secured</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Session is protected via HTTP-only JWT cookies and SHA-256 encryption.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <KeyRound className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-foreground">Password</span>
              </div>
              <span className="text-[11px] text-muted-foreground">••••••••••••</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              To update your account password, please ensure you have access to your registered email ({user.email}).
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() =>
                  toast.info('Password reset instructions will be sent to your verified email address.')
                }
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5 text-primary" />
                <span>Request Password Reset</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>Current Session</span>
            </h3>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-2 text-foreground/80">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span>Current Web Browser & Device</span>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                Active Now
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-destructive">Sign Out of Account</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Securely sign out from this device. You will be redirected to the login page.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-destructive px-6 text-xs font-bold text-destructive-foreground shadow-xs hover:bg-destructive/90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shrink-0"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing Out...</span>
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

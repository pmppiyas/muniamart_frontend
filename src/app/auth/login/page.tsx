import * as React from 'react';
import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | MUNIAMART',
  description: 'Sign in to your MuniaMart account to manage orders and profile.',
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Enter your email and password to access your MuniaMart account"
    >
      <React.Suspense
        fallback={
          <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
            Loading login form...
          </div>
        }
      >
        <LoginForm />
      </React.Suspense>
    </AuthLayout>
  );
}

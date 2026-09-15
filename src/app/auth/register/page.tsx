import * as React from 'react';
import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create an Account | MUNIAMART',
  description: 'Join MuniaMart today to enjoy fast checkout, order tracking, and exclusive discounts.',
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join thousands of shoppers at MuniaMart for seamless shopping and fast delivery"
    >
      <RegisterForm />
    </AuthLayout>
  );
}

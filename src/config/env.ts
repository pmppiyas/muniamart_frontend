const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '')
  .trim()
  .replace(/\/+$/, '')
  .replace(/\/api\/v1$/, '');

export const env = {
  BACKEND_URL: backendUrl,
  API_BASE_URL: `${backendUrl}/api/v1`,
  SITE_URL: (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, ''),
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
} as const;

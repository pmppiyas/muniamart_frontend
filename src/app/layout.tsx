import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { StoreProvider } from '@/providers/StoreProvider';
import { Header } from '@/components/layout/header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { MobileNav } from '@/components/layout/MobileNav/MobileNav';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    'E-Commerce',
    'Online Shopping',
    'MuniaMart',
    'Electronics',
    'Fashion',
    'Gadgets',
    'Home & Living',
    'Beauty & Wellness',
    'Daily Groceries',
    'Buy Online Bangladesh',
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/og-image.png', type: 'image/png' },
    ],
    shortcut: ['/favicon.svg'],
    apple: [{ url: '/og-image.png', sizes: '512x512', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: '/og-image.png',
        width: 512,
        height: 512,
        alt: `${siteConfig.name} Logo`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    site: '@muniamart',
    creator: '@muniamart',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground pb-24 md:pb-0">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <MobileNav />
            <Toaster position="top-right" richColors />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import { fontVariables } from '@/lib/font';
import ThemeProvider from '@/components/layout/ThemeToggle/theme-provider';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './globals.css';
import './theme.css';
import { SessionProvider } from 'next-auth/react';
import QueryProvider from '@/components/providers/query-provider';
import { AbilityProvider } from '@/components/providers/ability-provider';
import { getLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
};

export const metadata: Metadata = {
  title: 'Next Shadcn',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  const isScaled = activeThemeValue?.endsWith('-scaled');
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          'bg-background overflow-hidden overscroll-none font-sans antialiased',
          activeThemeValue ? `theme-${activeThemeValue}` : '',
          isScaled ? 'theme-scaled' : '',
          fontVariables
        )}
      >
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>
          <SessionProvider>
            <NextIntlClientProvider>
              <ThemeProvider
                attribute='class'
                defaultTheme='system'
                enableSystem
                disableTransitionOnChange
                enableColorScheme
              >
                <AbilityProvider>
                  <Providers activeThemeValue={activeThemeValue as string}>
                    <Toaster />
                    <QueryProvider>
                      <ReactQueryDevtools initialIsOpen={false} />
                      {children}
                    </QueryProvider>
                  </Providers>
                </AbilityProvider>
              </ThemeProvider>
            </NextIntlClientProvider>
          </SessionProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}

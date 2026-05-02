import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import '@/styles/globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { ThemeProvider } from '@/lib/theme-context'
import { Toaster } from 'react-hot-toast'
import CookieBanner from '@/components/ui/CookieBanner'
import BottomNav from '@/components/layout/BottomNav'
import { GA_MEASUREMENT_ID } from '@/lib/analytics'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RapidFix — Home Services On Demand',
  description: 'Connect with skilled local professionals for all your home service needs.',
  keywords: ['home services', 'repair', 'electrician', 'plumber', 'handyman', 'on-demand'],
  icons: { icon: '/logo.png', apple: '/logo.png' },
  manifest: '/manifest.json',
  openGraph: {
    title: 'RapidFix — Home Services On Demand',
    description: 'Connect with skilled local professionals instantly',
    images: ['/logo.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
}

// Injected before React hydrates — reads localStorage and applies
// the correct theme class synchronously to <html> to prevent flash.
const swScript = `
// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').catch(function() {});
  });
}
`

const themeScript = `
(function () {
  try {
    var t = localStorage.getItem('rf-theme');
    var isDark =
      t === 'dark' ||
      (t === 'dynamic' && (new Date().getHours() < 6 || new Date().getHours() >= 19)) ||
      (!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Blocking script — must run before first paint to avoid theme flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: swScript }} />
      </head>
      <body className="pb-safe">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <CookieBanner />
            <BottomNav />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '500',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                },
                success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
          </AuthProvider>
        </ThemeProvider>

        {/* Google Analytics 4 — loads after page is interactive, no blocking */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}

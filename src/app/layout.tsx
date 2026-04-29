import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { Toaster } from 'react-hot-toast'

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
  openGraph: {
    title: 'RapidFix — Home Services On Demand',
    description: 'Connect with skilled local professionals instantly',
    images: ['/logo.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#18181b',
                color: '#fafafa',
                border: '1px solid rgba(0,0,0,0.15)',
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
      </body>
    </html>
  )
}

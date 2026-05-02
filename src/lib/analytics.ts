/**
 * lib/analytics.ts
 * Lightweight GA4 event wrapper.
 *
 * Setup:
 *   1. Go to analytics.google.com → create property → get Measurement ID (G-XXXXXXX)
 *   2. Add to .env.local: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXX
 *   3. The GA4 script is loaded in app/layout.tsx via next/script
 *
 * Usage anywhere in the app:
 *   import { trackEvent } from '@/lib/analytics'
 *   trackEvent('job_posted', { category: 'electrician', urgency: 'high' })
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

/** Fire a GA4 custom event */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', eventName, params)
}

/** Track a page view manually (Next.js App Router handles this automatically via gtag) */
export function trackPageView(url: string) {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return
  window.gtag('config', GA_MEASUREMENT_ID, { page_path: url })
}

// ─── Predefined events for consistency ───────────────────────────────────────

export const analytics = {
  /** User signed up */
  signup: (role: 'customer' | 'worker') =>
    trackEvent('sign_up', { method: 'email', user_role: role }),

  /** User logged in */
  login: (method: string) =>
    trackEvent('login', { method }),

  /** Job posted */
  jobPosted: (category: string, urgency: string) =>
    trackEvent('job_posted', { job_category: category, urgency }),

  /** Job accepted by worker */
  jobAccepted: (category: string) =>
    trackEvent('job_accepted', { job_category: category }),

  /** Payment initiated */
  paymentStarted: (amount: number) =>
    trackEvent('begin_checkout', { value: amount, currency: 'INR' }),

  /** Payment completed */
  paymentCompleted: (amount: number) =>
    trackEvent('purchase', { value: amount, currency: 'INR' }),

  /** Worker withdrawal initiated */
  payoutRequested: (amount: number) =>
    trackEvent('payout_requested', { value: amount }),

  /** City-service page viewed */
  servicePageViewed: (service: string, city: string) =>
    trackEvent('service_page_view', { service, city }),
}

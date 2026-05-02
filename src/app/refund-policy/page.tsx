import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy — RapidFix',
  description: 'RapidFix refund and cancellation policy for customers and workers.',
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
      <span className="text-sm font-medium w-1/2" style={{ color: 'var(--text-primary)' }}>{label}</span>
      <span className="text-sm text-right w-1/2" style={{ color: 'var(--text-secondary)' }}>{value}</span>
    </div>
  )
}

export default function RefundPage() {
  return (
    <><Navbar />
    <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Refund & Cancellation Policy</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Last updated: 1 May 2025</p>
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Quick reference</h2>
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border-default)' }}>
            <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>Cancellation fees</div>
            <div className="px-4">
              <Row label="Before worker accepts job" value="Free — full refund" />
              <Row label="Within 30 min of worker accepting" value="Free — full refund" />
              <Row label="30 min–2 hrs after acceptance" value="10% cancellation fee" />
              <Row label="After 2 hrs or worker en route" value="20% cancellation fee" />
              <Row label="No-show (customer)" value="50% of job amount" />
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Refund eligibility</h2>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>You are eligible for a full refund if: the Worker cancels the job; the Worker does not show up within 60 minutes of the agreed time; the work performed is materially different from what was agreed; or we are unable to find a Worker for your job.</p>
            <p>Refunds are NOT issued for: change of mind after work is completed; dissatisfaction with results when the work matches the agreed scope; delays caused by the customer (e.g. not being home).</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>How to request a refund</h2>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p><strong>Step 1.</strong> Tap the "Report Issue" button on your job page within 48 hours of job completion (or within 24 hours of a no-show).</p>
            <p><strong>Step 2.</strong> Describe the issue in detail. Attach photos if relevant.</p>
            <p><strong>Step 3.</strong> Our team will review within 24 hours and contact you via email.</p>
            <p><strong>Step 4.</strong> Approved refunds are credited to the original payment method within 5–7 business days.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Pro subscription refunds</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>The Worker Pro subscription (₹299/month) is non-refundable for the current billing period. You may cancel at any time and will retain access until the period ends.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Contact</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>For any refund or cancellation queries: <a href="mailto:support@rapidfix.in" className="underline">support@rapidfix.in</a></p>
        </section>

        <div className="mt-10 pt-8 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex gap-4 flex-wrap">
            <Link href="/" className="text-xs" style={{ color: 'var(--text-muted)' }}>← Back home</Link>
            <Link href="/privacy" className="text-xs" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
            <Link href="/terms" className="text-xs" style={{ color: 'var(--text-muted)' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </div><Footer /></>
  )
}

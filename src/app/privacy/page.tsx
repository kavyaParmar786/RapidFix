import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — RapidFix',
  description: 'How RapidFix collects, uses, and protects your personal information.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <><Navbar />
    <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Privacy Policy</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Last updated: 1 May 2025 · Effective immediately</p>
        </div>

        <Section title="1. Who we are">
          <p>RapidFix ("we", "our", "us") is a home-services marketplace operated from Rajkot, Gujarat, India. We connect customers with independent service professionals. Contact: <a href="mailto:support@rapidfix.in" className="underline">support@rapidfix.in</a>.</p>
        </Section>

        <Section title="2. Information we collect">
          <p><strong>Account information:</strong> name, email, phone number, and role (Customer or Worker). Workers additionally provide skills, location, and government-issued ID documents for verification.</p>
          <p><strong>Usage data:</strong> jobs posted/accepted, messages sent, and pages visited — to improve our service.</p>
          <p><strong>Location data:</strong> Workers share GPS location when toggling availability. Customers share a service address per job. We do not track location continuously.</p>
          <p><strong>Payment data:</strong> Payments are processed by Razorpay. We store only the order ID and payment status — never your card number, UPI PIN, or bank credentials.</p>
          <p><strong>Device and log data:</strong> IP address, browser type, OS, and referring URL when you visit.</p>
          <p><strong>Cookies:</strong> Strictly necessary cookies for authentication, and optional analytics cookies (Google Analytics 4) with your consent.</p>
        </Section>

        <Section title="3. How we use your information">
          <p>To provide and improve the platform; match customers with workers; process payments and payouts; send transactional emails and push notifications; verify worker identity; respond to support requests; and comply with legal obligations. We do not use your data for fully automated decisions with legal effects without human review.</p>
        </Section>

        <Section title="4. Who we share your information with">
          <p><strong>Other users:</strong> Your name and photo are visible to the other party in a job. Worker ratings and reviews are public.</p>
          <p><strong>Service providers:</strong> Razorpay (payments), Firebase/Google Cloud (database, auth, push), Cloudinary (images), Resend (email), Google Analytics (anonymous analytics). Each is bound by their own privacy policy and our data processing agreements.</p>
          <p><strong>Legal requirements:</strong> We may disclose data when required by Indian law, court order, or to protect user safety.</p>
          <p>We do not sell your personal data. Ever.</p>
        </Section>

        <Section title="5. Data retention">
          <p>Account data is retained while your account is active. Job data is kept for 3 years for accounting and dispute resolution. You may request deletion at any time. Anonymised aggregated data may be kept indefinitely.</p>
        </Section>

        <Section title="6. Security">
          <p>All data is transmitted over HTTPS. Firestore data is encrypted at rest by Google Cloud. Worker ID documents are stored in private Cloudinary folders accessible only to our trust team. No system is 100% secure — use a strong password and do not share your credentials.</p>
        </Section>

        <Section title="7. Cookies">
          <p><strong>Strictly necessary cookies</strong> are required for login and cannot be disabled.</p>
          <p><strong>Analytics cookies</strong> (Google Analytics 4) are loaded only after you accept via the cookie banner. You can change your preference by clearing cookies and reloading. GA4 data is anonymised and not shared with third parties.</p>
        </Section>

        <Section title="8. Your rights">
          <p>Under the Information Technology Act 2000 and the Digital Personal Data Protection Act 2023, you have the right to: access your data; correct inaccuracies; request deletion; withdraw analytics consent at any time.</p>
          <p>Email <a href="mailto:privacy@rapidfix.in" className="underline">privacy@rapidfix.in</a> with "Privacy Request" in the subject. We respond within 30 days.</p>
        </Section>

        <Section title="9. Children">
          <p>RapidFix is not directed at individuals under 18. Contact us if you believe a minor has registered and we will delete the account promptly.</p>
        </Section>

        <Section title="10. Changes">
          <p>We may update this policy. We will notify you of material changes via email or in-app notice at least 14 days before they take effect.</p>
        </Section>

        <Section title="11. Contact">
          <p>Privacy questions: <a href="mailto:privacy@rapidfix.in" className="underline">privacy@rapidfix.in</a><br />RapidFix, Rajkot, Gujarat 360001, India</p>
        </Section>

        <div className="mt-10 pt-8 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <Link href="/" className="text-xs" style={{ color: 'var(--text-muted)' }}>← Back home</Link>
        </div>
      </div>
    </div><Footer /></>
  )
}

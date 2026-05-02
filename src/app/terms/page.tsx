import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — RapidFix',
  description: 'Terms and conditions for using the RapidFix home services marketplace.',
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

export default function TermsPage() {
  return (
    <><Navbar />
    <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Terms of Service</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Last updated: 1 May 2025 · Governed by Indian law</p>
        </div>

        <Section title="1. Acceptance">
          <p>By creating an account or using RapidFix ("Platform"), you agree to these Terms. If you do not agree, do not use the Platform. We may update these Terms; continued use after the effective date constitutes acceptance.</p>
        </Section>

        <Section title="2. What RapidFix is">
          <p>RapidFix is a technology platform that connects customers seeking home services with independent service professionals ("Workers"). RapidFix is not an employer of Workers and is not responsible for the quality, safety, legality, or timeliness of any service provided. Workers are independent contractors.</p>
        </Section>

        <Section title="3. Eligibility">
          <p>You must be at least 18 years old to use the Platform. By registering, you confirm you are 18 or older and that the information you provide is accurate.</p>
        </Section>

        <Section title="4. Accounts">
          <p>You are responsible for keeping your password secure and for all activity under your account. Notify us immediately at <a href="mailto:support@rapidfix.in" className="underline">support@rapidfix.in</a> if you suspect unauthorised access. We reserve the right to suspend or terminate accounts that violate these Terms.</p>
        </Section>

        <Section title="5. Customers">
          <p>Customers may post job requests describing the service needed, location, and budget. By posting a job you represent that you are the owner or authorised occupant of the property. You agree to pay the agreed amount through the Platform and not to solicit Workers to work off-platform to avoid fees.</p>
          <p><strong>Payment:</strong> Payment is processed by Razorpay at the time of booking. Funds are held in escrow and released to the Worker only after you mark the job as complete. If you are unsatisfied, raise a dispute within 48 hours of job completion via the "Report Issue" button.</p>
        </Section>

        <Section title="6. Workers">
          <p>Workers must complete identity verification (Aadhaar + selfie) before accepting jobs. You represent that you possess the skills and any required licences for the services you offer. By accepting a job you agree to arrive on time, complete the work to a professional standard, and behave respectfully.</p>
          <p><strong>Earnings:</strong> Workers receive 90–92% of the job amount (exact split shown at payout). Earnings are credited after job completion and are available for withdrawal within 1–2 business days via IMPS.</p>
          <p><strong>Pro plan:</strong> The optional Pro subscription (₹299/month) provides priority listing. It does not guarantee jobs. Subscriptions auto-renew and can be cancelled at any time; no refund for partial months.</p>
        </Section>

        <Section title="7. Prohibited conduct">
          <p>You must not: post false information; harass or abuse other users; solicit off-platform payments; use the Platform for any illegal purpose; attempt to reverse-engineer or scrape the Platform; create multiple accounts to circumvent bans.</p>
        </Section>

        <Section title="8. Cancellation and refunds">
          <p><strong>Customers:</strong> You may cancel a posted job at any time before a Worker accepts it at no charge. If a Worker has already accepted, cancellation may incur a fee of up to 20% of the agreed amount to compensate the Worker for lost time.</p>
          <p><strong>Refunds:</strong> If a Worker does not complete the agreed work, contact us within 48 hours via <a href="mailto:support@rapidfix.in" className="underline">support@rapidfix.in</a>. Refunds are issued at our discretion after investigation, typically within 5–7 business days to the original payment method.</p>
          <p><strong>Workers:</strong> Accepting a job and not completing it without reasonable cause may result in account suspension.</p>
        </Section>

        <Section title="9. Disputes">
          <p>Disputes between Customers and Workers should first be raised via the in-app "Report Issue" button. RapidFix may mediate but is not obligated to do so. Our decision on platform-related matters (account suspension, refunds processed through us) is final.</p>
        </Section>

        <Section title="10. Platform fee">
          <p>RapidFix charges a platform fee of 2% on each transaction (included in the checkout total shown to Customers) and retains 8% of the Worker payout as a service commission. Fees are subject to change with 30 days' notice.</p>
        </Section>

        <Section title="11. Intellectual property">
          <p>All content, trademarks, and software on the Platform are owned by RapidFix or our licensors. You may not reproduce or use them without written permission. You grant RapidFix a non-exclusive licence to display content you upload (profile photos, job photos) for the purpose of operating the Platform.</p>
        </Section>

        <Section title="12. Liability limitation">
          <p>To the maximum extent permitted by Indian law, RapidFix's liability for any claim arising from use of the Platform is limited to the greater of: the amount you paid through the Platform in the 3 months preceding the claim, or ₹1,000. We are not liable for indirect, consequential, or punitive damages.</p>
        </Section>

        <Section title="13. Governing law">
          <p>These Terms are governed by the laws of India. Any dispute will be subject to the exclusive jurisdiction of the courts of Rajkot, Gujarat.</p>
        </Section>

        <Section title="14. Contact">
          <p>Legal: <a href="mailto:legal@rapidfix.in" className="underline">legal@rapidfix.in</a><br />General support: <a href="mailto:support@rapidfix.in" className="underline">support@rapidfix.in</a><br />RapidFix, Rajkot, Gujarat 360001, India</p>
        </Section>

        <div className="mt-10 pt-8 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex gap-4">
            <Link href="/" className="text-xs" style={{ color: 'var(--text-muted)' }}>← Back home</Link>
            <Link href="/privacy" className="text-xs" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
            <Link href="/refund-policy" className="text-xs" style={{ color: 'var(--text-muted)' }}>Refund Policy</Link>
          </div>
        </div>
      </div>
    </div><Footer /></>
  )
}

import Link from 'next/link'
import { ArrowRight, Wrench } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl p-12 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.3) 50%, rgba(6,182,212,0.2) 100%)', border: '1px solid rgba(99,102,241,0.3)' }}
        >
          {/* Background shapes */}
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.8) 0%, transparent 70%)', filter: 'blur(30px)' }} />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.8) 0%, transparent 70%)', filter: 'blur(30px)' }} />

          <div className="relative z-10">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-500/30 mb-6 mx-auto">
              <Wrench size={28} className="text-indigo-300" />
            </div>

            <h2
              className="text-4xl sm:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Ready to get started?
            </h2>
            <p className="text-base max-w-lg mx-auto mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Join thousands of customers and skilled workers on RapidFix. Post your first job for free, or sign up as a worker and start earning today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup" className="btn-primary flex items-center gap-2 text-base px-8 py-3.5">
                Post a Job — It's Free
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/auth/signup?role=worker"
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/20"
              >
                Become a Worker
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

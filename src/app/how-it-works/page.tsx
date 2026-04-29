import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Search, UserCheck, Wrench, Star, ArrowRight, CheckCircle, Clock, Shield, Zap } from 'lucide-react'

const CUSTOMER_STEPS = [
  {
    num: '01', icon: Search, title: 'Post your job',
    desc: 'Describe what you need — plumbing, electrical, painting, anything. Add photos and set your budget. Takes under 2 minutes.',
  },
  {
    num: '02', icon: UserCheck, title: 'Get matched instantly',
    desc: 'Our platform notifies verified workers near you. You\'ll see their ratings, experience, and reviews before they arrive.',
  },
  {
    num: '03', icon: Wrench, title: 'Work gets done',
    desc: 'Chat with your worker in real-time, track progress, and get updates. Pay only when you\'re satisfied.',
  },
  {
    num: '04', icon: Star, title: 'Rate & review',
    desc: 'Leave a review to help the community. Your feedback keeps our workers accountable and quality high.',
  },
]

const WORKER_STEPS = [
  { num: '01', icon: UserCheck, title: 'Create your profile', desc: 'Sign up as a worker, add your skills, experience, and set your availability. Verification takes under 24 hours.' },
  { num: '02', icon: Search, title: 'Browse open jobs', desc: 'See all jobs in your category and area. Filter by urgency, budget, and distance. Accept the ones that fit.' },
  { num: '03', icon: Wrench, title: 'Do great work', desc: 'Complete the job, chat with the customer, and mark it done. Get paid directly and securely.' },
  { num: '04', icon: Star, title: 'Build your reputation', desc: 'Great reviews mean more jobs. Top-rated workers get priority placement and more bookings.' },
]

const WHY = [
  { icon: Clock, title: 'Same-day service', desc: 'Most jobs are accepted within 30 minutes. No waiting days for a callback.' },
  { icon: Shield, title: 'Fully verified workers', desc: 'Every worker goes through ID verification and skill assessment before they can accept jobs.' },
  { icon: Zap, title: 'Real-time tracking', desc: 'See when your worker is on the way, communicate via in-app chat, and get live updates.' },
  { icon: CheckCircle, title: 'Satisfaction guaranteed', desc: 'Not happy with the work? We\'ll arrange a free redo or a full refund. No questions asked.' },
]

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-[52px]" style={{ background: 'var(--bg-base)' }}>

        {/* Hero */}
        <div className="border-b border-black/[0.06] bg-zinc-50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1 text-xs font-medium text-zinc-500 mb-6 shadow-sm">
              <Zap size={11} className="text-zinc-400" /> Simple. Fast. Reliable.
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 tracking-tight mb-5">
              How RapidFix works
            </h1>
            <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-8 leading-relaxed">
              From posting a job to getting it done — here's exactly how RapidFix connects you with the right professional.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/auth/signup" className="btn-primary px-6 py-2.5 text-sm rounded-full">
                Post a job free <ArrowRight size={14} className="ml-1.5" />
              </Link>
              <Link href="/auth/signup?role=worker" className="btn-ghost px-6 py-2.5 text-sm rounded-full">
                Become a worker
              </Link>
            </div>
          </div>
        </div>

        {/* For Customers */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">For Customers</p>
            <h2 className="text-3xl font-bold text-zinc-900">Book a professional in 4 steps</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CUSTOMER_STEPS.map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="relative">
                <div className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="flex items-center justify-between mb-5">
                    <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                      <Icon size={18} className="text-zinc-600" />
                    </div>
                    <span className="text-2xl font-black text-zinc-100">{num}</span>
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 mb-2">{title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
                </div>
                {num !== '04' && (
                  <div className="hidden lg:block absolute top-10 -right-3 z-10">
                    <ArrowRight size={14} className="text-zinc-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Why RapidFix */}
        <div className="border-y border-black/[0.06] bg-zinc-50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Why choose us</p>
              <h2 className="text-3xl font-bold text-zinc-900">Built for speed and trust</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {WHY.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-zinc-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-1.5">{title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* For Workers */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">For Workers</p>
            <h2 className="text-3xl font-bold text-zinc-900">Start earning in 4 steps</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKER_STEPS.map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-5">
                  <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                    <Icon size={18} className="text-zinc-600" />
                  </div>
                  <span className="text-2xl font-black text-zinc-100">{num}</span>
                </div>
                <h3 className="text-base font-semibold text-zinc-900 mb-2">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/auth/signup?role=worker" className="btn-primary px-8 py-3 text-sm rounded-full">
              Join as a worker — it's free
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="border-t border-black/[0.06] bg-zinc-50">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
            <h2 className="text-3xl font-bold text-zinc-900 text-center mb-12">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                { q: 'How quickly can I get a worker?', a: 'Most jobs are accepted within 30 minutes during peak hours. For urgent jobs, we notify multiple workers simultaneously.' },
                { q: 'How are workers verified?', a: 'Every worker submits a government ID, phone number, and skill assessment. We also check their track record and reviews.' },
                { q: 'What if I\'m not satisfied?', a: 'Contact us within 48 hours and we\'ll arrange a free redo or full refund. Your satisfaction is our guarantee.' },
                { q: 'Is there a booking fee?', a: 'Posting a job is completely free. You only pay the worker after the job is done to your satisfaction.' },
                { q: 'How do workers get paid?', a: 'Workers receive payment directly after the job is marked complete by the customer. Payments are processed securely.' },
              ].map(({ q, a }) => (
                <div key={q} className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-zinc-900 mb-2">{q}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, ArrowRight, Zap, Shield, Clock, Star } from 'lucide-react'

const PILLS = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Repair', 'Cleaning']

export default function HeroSection() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/auth/signup?service=${encodeURIComponent(query)}`)
  }

  return (
    <section className="relative pt-[52px] overflow-hidden bg-white">
      {/* Subtle dot grid — exactly like Clerk */}
      <div className="absolute inset-0 -z-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #d4d4d8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.5,
        }} />
      {/* Fade edges */}
      <div className="absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0) 0%, white 70%)' }} />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-500 mb-8 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Trusted by 50,000+ customers in Gujarat
        </div>

        {/* Headline — Clerk uses massive tight tracking */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-zinc-900 tracking-tight leading-[1.05] mb-6">
          Home services,<br />
          <span className="text-zinc-400">on demand.</span>
        </h1>

        <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Book a verified professional for any home repair in minutes.
          Fast, reliable, and affordable — right here in Rajkot.
        </p>

        {/* Search — Clerk-style clean input */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-8">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="What do you need fixed?"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 pl-10 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 shadow-sm transition-all" />
          </div>
          <button type="submit" className="btn-primary rounded-xl px-5 py-3 text-sm flex items-center gap-1.5 shadow-sm">
            Search <ArrowRight size={14} />
          </button>
        </form>

        {/* Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {PILLS.map(p => (
            <Link key={p} href={`/services/${p.toLowerCase().replace(' ', '-')}`}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition-all shadow-sm">
              {p}
            </Link>
          ))}
        </div>

        {/* Social proof bar — Clerk style */}
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {[
            { icon: Zap, text: 'Response in 60s' },
            { icon: Shield, text: 'Verified workers' },
            { icon: Clock, text: '24/7 available' },
            { icon: Star, text: '4.8 avg rating' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Icon size={12} className="text-zinc-400" /> {text}
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar — Clerk has a clean separator bar */}
      <div className="border-t border-zinc-100 bg-zinc-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '8K+', label: 'Verified Workers' },
              { value: '1M+', label: 'Jobs Completed' },
              { value: '4.8★', label: 'Average Rating' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-xl font-bold text-zinc-900">{value}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

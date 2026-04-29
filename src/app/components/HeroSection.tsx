'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ArrowRight, Zap, Shield, Clock } from 'lucide-react'
import { CATEGORIES } from '@/lib/utils'

export default function HeroSection() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/auth/signup?service=${encodeURIComponent(query)}`)
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: '#ffffff',
          }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Floating orbs */}
        <div
          className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full opacity-20 animate-float"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.8) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        <div
          className="absolute bottom-1/3 left-1/5 h-48 w-48 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.8) 0%, transparent 70%)', filter: 'blur(30px)', animationDelay: '2s' }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div className="animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Trusted by 50,000+ customers
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-zinc-900 mb-6"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Home Services,{' '}
              <span className="gradient-text">Instantly</span>{' '}
              Fixed.
            </h1>

            <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: 'var(--text-secondary)' }}>
              Post any job — plumbing, electrical, painting — and watch verified professionals bid to fix it. One tap to connect, real-time chat, guaranteed quality.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-lg">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="What do you need fixed?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input-base pl-10"
                />
              </div>
              <button type="submit" className="btn-primary whitespace-nowrap flex items-center gap-2">
                Find Help
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-5">
              {[
                { icon: Zap, text: 'Response in 60s' },
                { icon: Shield, text: 'Verified workers' },
                { icon: Clock, text: '24/7 available' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Icon size={14} className="text-indigo-400" />
                  {text}
                </div>
              ))}
            </div>

            {/* Quick category pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <Link
                  key={cat.value}
                  href="/auth/signup"
                  className="flex items-center gap-1.5 rounded-full border border-black/10 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-300"
                >
                  {cat.icon} {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: visual card stack */}
          <div className="relative hidden lg:block">
            {/* Layout: cards above/below, logo centered with clearance */}
            <div className="relative flex flex-col items-center gap-4">

              {/* Top card */}
              <div
                className="glass-card w-56 p-4 animate-float self-start ml-4"
                style={{ animationDelay: '1s' }}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-xl">⚡</span>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900">Electrician needed</p>
                    <p className="text-[10px] text-zinc-500">Posted 2 min ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-green-400">3 workers nearby</span>
                </div>
              </div>

              {/* Logo — no overlapping cards */}
              <div className="relative flex items-center justify-center w-full py-2">
                <div
                  className="absolute h-56 w-56 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', filter: 'blur(24px)' }}
                />
                <div className="relative h-44 w-44 animate-float" style={{ animationDelay: '0s' }}>
                  <Image
                    src="/logo.png"
                    alt="RapidFix"
                    fill
                    className="object-contain drop-shadow-2xl"
                    style={{ mixBlendMode: 'normal' }}
                  />
                </div>
              </div>

              {/* Bottom cards row */}
              <div className="flex items-start gap-3 w-full justify-between px-2">
                <div
                  className="glass-card w-48 p-4 animate-float"
                  style={{ animationDelay: '2s' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-xs font-bold text-zinc-900 flex-shrink-0">R</div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900">Rajesh Kumar</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="h-2.5 w-2.5 fill-yellow-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500">"Fixed wiring in 30 mins!"</p>
                </div>

                <div
                  className="glass-card w-44 p-3 animate-float"
                  style={{ animationDelay: '0.5s' }}
                >
                  <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Job Accepted</p>
                  <p className="text-xs font-bold text-zinc-900">Pipe Leak Repair</p>
                  <div className="mt-2 h-1 w-full rounded-full bg-zinc-100">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">In Progress</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

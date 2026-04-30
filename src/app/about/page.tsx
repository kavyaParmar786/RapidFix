'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Shield, Zap, Heart, Users, Award, TrendingUp, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  )
}

const STATS = [
  { value: '50,000+', label: 'Jobs completed', icon: Award },
  { value: '12,000+', label: 'Happy customers', icon: Heart },
  { value: '2,400+', label: 'Verified workers', icon: Shield },
  { value: '4.8★', label: 'Average rating', icon: TrendingUp },
]

const VALUES = [
  { icon: Shield, title: 'Trust first', desc: 'Every worker is background-verified with government ID and police clearance before they serve a single customer.' },
  { icon: Zap, title: 'Speed matters', desc: 'From posting a job to getting a worker at your door — our average response time is under 12 minutes.' },
  { icon: Heart, title: 'Fair for workers', desc: 'Workers keep 90% of every job. We believe the people who do the work should earn most of the money.' },
  { icon: Users, title: 'Community-built', desc: 'Started in Rajkot. Built by talking to plumbers, electricians, and homeowners before writing a single line of code.' },
]

const TEAM = [
  { name: 'Kavya', role: 'Founder & CEO', emoji: '👩‍💻', fact: 'Ex-Swiggy. Obsessed with last-mile logistics.' },
  { name: 'Rahul', role: 'CTO', emoji: '👨‍🔧', fact: 'Ex-Ola. Grew up watching his dad fix everything himself.' },
  { name: 'Priya', role: 'Head of Ops', emoji: '👩‍📋', fact: 'Made 600 calls to workers in the first month.' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20" style={{ background: 'var(--bg-base)' }}>

        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-20 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} />
            <div className="absolute inset-0 opacity-[0.025]"
              style={{ backgroundImage: 'radial-gradient(var(--text-primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1.5 rounded-full"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border-default)' }}>
                Our story
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.55 }}
              className="text-4xl sm:text-5xl font-bold mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
              We're fixing the way India{' '}
              <span style={{ color: 'var(--accent)' }}>fixes things</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              RapidFix started in 2023 when our founder couldn't find a reliable electrician for three days straight.
              We figured there had to be a better way. There was.
            </motion.p>
          </div>
        </section>

        {/* Stats */}
        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <FadeIn key={label} delay={i * 0.08}>
                <div className="glass-card p-6 text-center">
                  <Icon size={18} className="mx-auto mb-3" style={{ color: 'var(--accent)' }} />
                  <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="px-4 py-16" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="max-w-5xl mx-auto">
            <FadeIn className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>What we stand for</h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>These aren't just words on a wall. They're decisions we make every day.</p>
            </FadeIn>
            <div className="grid sm:grid-cols-2 gap-5">
              {VALUES.map(({ icon: Icon, title, desc }, i) => (
                <FadeIn key={title} delay={i * 0.08}>
                  <div className="flex gap-4 p-5 rounded-2xl" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'var(--bg-elevated)' }}>
                      <Icon size={16} style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>The team</h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Small team, big ambitions.</p>
            </FadeIn>
            <div className="grid sm:grid-cols-3 gap-5">
              {TEAM.map(({ name, role, emoji, fact }, i) => (
                <FadeIn key={name} delay={i * 0.1}>
                  <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}
                    className="glass-card p-6 text-center">
                    <div className="text-5xl mb-4">{emoji}</div>
                    <h3 className="font-bold text-lg mb-0.5" style={{ color: 'var(--text-primary)' }}>{name}</h3>
                    <p className="text-xs font-semibold mb-3" style={{ color: 'var(--accent)' }}>{role}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{fact}</p>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16">
          <FadeIn>
            <div className="max-w-2xl mx-auto glass-card p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-30"
                style={{ background: 'radial-gradient(circle at 50% 0%, var(--accent), transparent 60%)' }} />
              <h2 className="text-2xl font-bold mb-3 relative" style={{ color: 'var(--text-primary)' }}>
                Ready to experience RapidFix?
              </h2>
              <p className="text-sm mb-6 relative" style={{ color: 'var(--text-secondary)' }}>
                Join thousands of homeowners getting things fixed the right way.
              </p>
              <div className="flex gap-3 justify-center relative">
                <Link href="/auth/signup">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="btn-primary rounded-xl px-6 py-2.5 text-sm font-semibold flex items-center gap-2">
                    Get started free <ArrowRight size={14} />
                  </motion.button>
                </Link>
                <Link href="/jobs/browse">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="btn-ghost rounded-xl px-6 py-2.5 text-sm">
                    Browse services
                  </motion.button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </section>
      </div>
    </>
  )
}

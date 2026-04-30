'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, MapPin, Clock, Laptop, ChevronDown, Search, Zap } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

const PERKS = [
  { emoji: '💰', title: 'Competitive pay', desc: 'Top of market salaries and meaningful equity' },
  { emoji: '🏠', title: 'Remote-first', desc: 'Work from anywhere — we care about output not hours' },
  { emoji: '🏥', title: 'Health coverage', desc: 'Full medical, dental, and vision for you and your family' },
  { emoji: '📚', title: 'Learning budget', desc: '₹50,000/year to spend on courses, books, or conferences' },
  { emoji: '🍕', title: 'Free lunch Fridays', desc: 'Team lunch every Friday at the Rajkot office' },
  { emoji: '🚀', title: 'Real ownership', desc: 'You\'ll build features used by thousands from day one' },
]

const OPENINGS = [
  { id: '1', title: 'Senior Frontend Engineer', team: 'Engineering', type: 'Full-time', location: 'Remote / Rajkot', level: 'Senior', desc: 'Build beautiful, fast interfaces for our customer and worker apps. React, Next.js, TypeScript.' },
  { id: '2', title: 'Backend Engineer', team: 'Engineering', type: 'Full-time', location: 'Remote', level: 'Mid–Senior', desc: 'Scale our Firebase + Node.js backend to handle 10x the current load.' },
  { id: '3', title: 'City Operations Manager', team: 'Operations', type: 'Full-time', location: 'Rajkot', level: 'Mid', desc: 'Own worker onboarding, quality, and growth in our fastest-growing city.' },
  { id: '4', title: 'Growth Marketing Lead', team: 'Marketing', type: 'Full-time', location: 'Remote', level: 'Senior', desc: 'Drive customer acquisition through performance marketing, SEO, and partnerships.' },
  { id: '5', title: 'Product Designer', team: 'Design', type: 'Full-time', location: 'Remote / Rajkot', level: 'Mid', desc: 'Own the end-to-end design of our mobile and web products. Figma, research, pixels.' },
  { id: '6', title: 'Customer Support Lead', team: 'Operations', type: 'Full-time', location: 'Rajkot', level: 'Entry–Mid', desc: 'Be the first person our customers call when something goes wrong. Own resolution quality.' },
]

const TEAMS = ['All', 'Engineering', 'Operations', 'Marketing', 'Design']

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

function JobCard({ job }: { job: typeof OPENINGS[0] }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div layout className="glass-card overflow-hidden" whileHover={{ borderColor: 'var(--border-strong)' }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-start sm:items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-[var(--bg-surface)]">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>{job.title}</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border-default)' }}>
              {job.team}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><MapPin size={10} />{job.location}</span>
            <span className="flex items-center gap-1"><Clock size={10} />{job.type}</span>
            <span className="flex items-center gap-1"><Laptop size={10} />{job.level}</span>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden">
            <div className="px-5 pb-5 pt-1" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <p className="text-sm leading-relaxed mb-4 mt-3" style={{ color: 'var(--text-secondary)' }}>{job.desc}</p>
              <a href={`mailto:careers@rapidfix.in?subject=Application: ${job.title}`}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="btn-primary rounded-xl px-5 py-2 text-sm flex items-center gap-2">
                  Apply now <ArrowRight size={13} />
                </motion.button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function CareersPage() {
  const [search, setSearch] = useState('')
  const [team, setTeam] = useState('All')

  const filtered = OPENINGS.filter(j => {
    const ms = j.title.toLowerCase().includes(search.toLowerCase()) || j.desc.toLowerCase().includes(search.toLowerCase())
    const mt = team === 'All' || j.team === team
    return ms && mt
  })

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20" style={{ background: 'var(--bg-base)' }}>

        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-20 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 7, repeat: Infinity }} />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1.5 rounded-full"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border-default)' }}>
              <Zap size={10} style={{ color: 'var(--accent)' }} /> We're hiring
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold mb-5 leading-tight" style={{ color: 'var(--text-primary)' }}>
              Build the future of<br />home services in India
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              We're a small team solving a real problem. If you want your work to matter and move fast, you'll fit right in.
            </motion.p>
          </div>
        </section>

        {/* Perks */}
        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PERKS.map(({ emoji, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-2xl mb-3 block">{emoji}</span>
                  <h3 className="font-semibold mb-1.5 text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Openings */}
        <section className="px-4 pb-20">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Open roles <span className="text-sm font-normal ml-2" style={{ color: 'var(--text-muted)' }}>({filtered.length})</span>
              </h2>
            </FadeIn>

            {/* Filters */}
            <FadeIn delay={0.05}>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input type="text" placeholder="Search roles…" value={search} onChange={e => setSearch(e.target.value)}
                    className="input-base pl-9 py-2 text-sm" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {TEAMS.map(t => (
                    <button key={t} onClick={() => setTeam(t)}
                      className="rounded-lg px-3 py-2 text-xs font-medium transition-all"
                      style={{ background: team === t ? 'var(--accent)' : 'var(--bg-surface)', color: team === t ? 'var(--bg-base)' : 'var(--text-muted)', border: '1px solid var(--border-default)' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>

            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-center py-16">
                  <p className="text-2xl mb-2">🔍</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No roles match your search.</p>
                </motion.div>
              ) : (
                <motion.div className="space-y-3">
                  {filtered.map((job, i) => (
                    <motion.div key={job.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.05 }}>
                      <JobCard job={job} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <FadeIn delay={0.3}>
              <div className="mt-10 text-center glass-card p-6">
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Don't see the right role?</p>
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>We're always looking for exceptional people. Send us a note.</p>
                <a href="mailto:careers@rapidfix.in">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="btn-ghost rounded-xl px-5 py-2 text-sm">
                    careers@rapidfix.in →
                  </motion.button>
                </a>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
    </>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, Zap, Shield, Clock, Star } from 'lucide-react'
import { fadeUp, fadeIn, staggerContainer } from '@/lib/animations'

const PILLS = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Repair', 'Cleaning']
const ROTATING_WORDS = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Repair']

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (isInView) motionVal.set(target)
  }, [isInView, motionVal, target])

  useEffect(() => spring.on('change', (v) => setDisplay(Math.round(v))), [spring])

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>
}

export default function HeroSection() {
  const [query, setQuery] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % ROTATING_WORDS.length), 2200)
    return () => clearInterval(t)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/auth/signup?service=${encodeURIComponent(query)}`)
  }

  return (
    <section className="relative pt-[52px] overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Animated dot grid */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5 }}
        style={{
          backgroundImage: 'radial-gradient(circle, var(--border-strong) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 0%, var(--bg-base) 70%)' }} />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-8 shadow-sm"
          style={{ border: '1px solid var(--border-default)', background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
        >
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-green-500"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
          Trusted by 50,000+ customers in Gujarat
        </motion.div>

        {/* Headline */}
        <motion.div variants={staggerContainer(0.1, 0.1)} initial="hidden" animate="show">
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Book a
          </motion.h1>
          <motion.div variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-3 flex items-center justify-center gap-4 overflow-hidden">
            <div className="relative h-[1.05em] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIdx}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="block"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {ROTATING_WORDS[wordIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            in minutes.
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Book a verified professional for any home repair in minutes.
          Fast, reliable, and affordable — right here in Rajkot.
        </motion.p>

        {/* Search bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex gap-2 max-w-lg mx-auto mb-8"
        >
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="What do you need fixed?"
              className="input-base pl-10 rounded-xl shadow-sm"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary rounded-xl px-5 py-3 text-sm flex items-center gap-1.5 shadow-sm"
          >
            Search <ArrowRight size={14} />
          </motion.button>
        </motion.form>

        {/* Pills */}
        <motion.div
          variants={staggerContainer(0.07, 0.6)}
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {PILLS.map(p => (
            <motion.div key={p} variants={fadeUp}>
              <Link
                href={`/services/${p.toLowerCase().replace(' ', '-')}`}
                className="rounded-full px-3 py-1.5 text-xs font-medium transition-all shadow-sm inline-block"
                style={{
                  border: '1px solid var(--border-default)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                }}
              >
                {p}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust bar */}
        <motion.div
          variants={staggerContainer(0.1, 0.8)}
          initial="hidden"
          animate="show"
          className="flex items-center justify-center gap-8 flex-wrap"
        >
          {[
            { icon: Zap, text: 'Response in 60s' },
            { icon: Shield, text: 'Verified workers' },
            { icon: Clock, text: '24/7 available' },
            { icon: Star, text: '4.8 avg rating' },
          ].map(({ icon: Icon, text }) => (
            <motion.div key={text} variants={fadeIn} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Icon size={12} /> {text}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { value: 50000, suffix: '+', label: 'Happy Customers' },
              { value: 8000, suffix: '+', label: 'Verified Workers' },
              { value: 1000000, suffix: '+', label: 'Jobs Completed' },
              { value: 4.8, suffix: '★', label: 'Average Rating', isFloat: true },
            ].map(({ value, suffix, label, isFloat }) => (
              <div key={label}>
                <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {isFloat ? value : <AnimatedCounter target={value as number} suffix={suffix} />}
                  {isFloat && suffix}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

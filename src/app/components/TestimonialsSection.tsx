'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const TESTIMONIALS = [
  { name: 'Priya Sharma',  role: 'Customer · Plumbing',    avatar: 'P', avatarColor: '#7c3aed', avatarBg: 'rgba(139,92,246,0.15)',  rating: 5, text: 'Pipe burst at midnight and within 20 minutes a plumber was at my door. RapidFix is genuinely incredible.' },
  { name: 'Amit Patel',   role: 'Electrician · Worker',   avatar: 'A', avatarColor: '#2563eb', avatarBg: 'rgba(59,130,246,0.15)',   rating: 5, text: 'As a worker, RapidFix transformed my business. Consistent jobs, transparent payments, great customers.' },
  { name: 'Sneha Mehta',  role: 'Customer · AC Repair',   avatar: 'S', avatarColor: '#0d9488', avatarBg: 'rgba(20,184,166,0.15)',   rating: 5, text: 'Worker showed up on time, fixed the AC perfectly, and cleaned up after. 10/10 would use again.' },
  { name: 'Raj Kumar',    role: 'Customer · Carpenter',   avatar: 'R', avatarColor: '#b45309', avatarBg: 'rgba(245,158,11,0.15)',   rating: 5, text: 'Had my entire wardrobe assembled in 3 hours. The quality of workers on this platform is outstanding.' },
  { name: 'Kavita Joshi', role: 'Customer · Painting',    avatar: 'K', avatarColor: '#db2777', avatarBg: 'rgba(236,72,153,0.15)',   rating: 5, text: 'Got 3 rooms painted for a very fair price. The painter was professional and the finish is flawless.' },
  { name: 'Mohammed Ali', role: 'Plumber · Worker',       avatar: 'M', avatarColor: '#0284c7', avatarBg: 'rgba(14,165,233,0.15)',   rating: 5, text: 'I get 5-6 jobs a week through RapidFix. The app is simple and customers are always satisfied.' },
]

function StarIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" style={{ fill: '#f59e0b' }}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

function TestimonialCard({ t, delay, isInView }: { t: typeof TESTIMONIALS[0]; delay: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}
        transition={{ duration: 0.22 }}
        className="rounded-2xl p-6 h-full"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="flex gap-0.5 mb-4">
          {[...Array(t.rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: delay + i * 0.07, type: 'spring', stiffness: 300 }}
            >
              <StarIcon />
            </motion.div>
          ))}
        </div>
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: t.avatarBg, color: t.avatarColor }}
          >
            {t.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      className="py-20"
      style={{ background: 'var(--bg-base)', borderTop: '1px solid var(--border-subtle)' }}
      ref={ref}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Reviews</p>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Loved by customers<br />and workers alike.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} t={t} delay={i * 0.09} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}

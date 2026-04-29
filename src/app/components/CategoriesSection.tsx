'use client'

import Link from 'next/link'
import { ArrowRight, Zap, Droplets, Hammer, PaintBucket, Wind, Settings2, Bug, Shield, Sparkles, Trash2 } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeUp, staggerContainer } from '@/lib/animations'

const CATS = [
  { icon: Zap,        label: 'Electrician',    slug: 'electrician',    desc: 'Wiring, fuse, lights',    iconColor: '#d97706', iconBg: 'rgba(251,191,36,0.12)' },
  { icon: Droplets,   label: 'Plumber',        slug: 'plumber',        desc: 'Leaks, pipes, drains',    iconColor: '#2563eb', iconBg: 'rgba(59,130,246,0.12)'  },
  { icon: Hammer,     label: 'Carpenter',      slug: 'carpenter',      desc: 'Furniture, doors',        iconColor: '#b45309', iconBg: 'rgba(245,158,11,0.12)'  },
  { icon: PaintBucket,label: 'Painter',        slug: 'painter',        desc: 'Interior & exterior',     iconColor: '#db2777', iconBg: 'rgba(236,72,153,0.12)'  },
  { icon: Wind,       label: 'AC Repair',      slug: 'ac-repair',      desc: 'Install, service, gas',   iconColor: '#0284c7', iconBg: 'rgba(14,165,233,0.12)'  },
  { icon: Settings2,  label: 'Appliance Repair',slug: 'appliance-repair',desc: 'Washer, fridge, TV',  iconColor: '#7c3aed', iconBg: 'rgba(139,92,246,0.12)'  },
  { icon: Bug,        label: 'Pest Control',   slug: 'pest-control',   desc: 'Cockroach, rats, ants',   iconColor: '#65a30d', iconBg: 'rgba(132,204,22,0.12)'  },
  { icon: Shield,     label: 'Security',       slug: 'security',       desc: 'CCTV, smart locks',       iconColor: '#475569', iconBg: 'rgba(100,116,139,0.12)' },
  { icon: Sparkles,   label: 'Cleaning',       slug: 'cleaning',       desc: 'Home deep clean',         iconColor: '#0d9488', iconBg: 'rgba(20,184,166,0.12)'  },
  { icon: Trash2,     label: 'Other',          slug: 'other',          desc: 'Anything else',           iconColor: 'var(--text-secondary)', iconBg: 'var(--bg-elevated)' },
]

const cardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  }),
}

export default function CategoriesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="categories"
      className="py-20"
      style={{ background: 'var(--bg-base)', borderTop: '1px solid var(--border-subtle)' }}
      ref={ref}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Services</p>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Every home service,<br />one platform.
            </h2>
          </div>
          <Link
            href="/auth/signup"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            View all <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATS.map(({ icon: Icon, label, slug, desc, iconColor, iconBg }, i) => (
            <motion.div
              key={slug}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              animate={isInView ? 'show' : 'hidden'}
            >
              <motion.div
                whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.12)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Link
                  href={`/services/${slug}`}
                  className="group flex flex-col gap-3 rounded-2xl p-5 block transition-all duration-200"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center transition-colors"
                    style={{ background: iconBg, color: iconColor }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

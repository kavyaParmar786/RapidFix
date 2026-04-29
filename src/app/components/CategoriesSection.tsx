'use client'

import Link from 'next/link'
import { ArrowRight, Zap, Droplets, Hammer, PaintBucket, Wind, Settings2, Bug, Shield, Sparkles, Trash2 } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeUp, staggerContainer } from '@/lib/animations'

const CATS = [
  { icon: Zap, label: 'Electrician', slug: 'electrician', desc: 'Wiring, fuse, lights', color: 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100' },
  { icon: Droplets, label: 'Plumber', slug: 'plumber', desc: 'Leaks, pipes, drains', color: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' },
  { icon: Hammer, label: 'Carpenter', slug: 'carpenter', desc: 'Furniture, doors', color: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100' },
  { icon: PaintBucket, label: 'Painter', slug: 'painter', desc: 'Interior & exterior', color: 'bg-pink-50 text-pink-600 group-hover:bg-pink-100' },
  { icon: Wind, label: 'AC Repair', slug: 'ac-repair', desc: 'Install, service, gas', color: 'bg-sky-50 text-sky-600 group-hover:bg-sky-100' },
  { icon: Settings2, label: 'Appliance Repair', slug: 'appliance-repair', desc: 'Washer, fridge, TV', color: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100' },
  { icon: Bug, label: 'Pest Control', slug: 'pest-control', desc: 'Cockroach, rats, ants', color: 'bg-lime-50 text-lime-600 group-hover:bg-lime-100' },
  { icon: Shield, label: 'Security', slug: 'security', desc: 'CCTV, smart locks', color: 'bg-slate-50 text-slate-600 group-hover:bg-slate-100' },
  { icon: Sparkles, label: 'Cleaning', slug: 'cleaning', desc: 'Home deep clean', color: 'bg-teal-50 text-teal-600 group-hover:bg-teal-100' },
  { icon: Trash2, label: 'Other', slug: 'other', desc: 'Anything else', color: 'bg-zinc-50 text-zinc-600 group-hover:bg-zinc-100' },
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
    <section id="categories" className="py-20 bg-white border-t border-zinc-100" ref={ref}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Services</p>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Every home service,<br />one platform.</h2>
          </div>
          <Link href="/auth/signup" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATS.map(({ icon: Icon, label, slug, desc, color }, i) => (
            <motion.div
              key={slug}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              animate={isInView ? 'show' : 'hidden'}
            >
              <motion.div
                whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.08)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Link
                  href={`/services/${slug}`}
                  className="group flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm hover:border-zinc-300 transition-all duration-200 block"
                >
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{label}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{desc}</p>
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

'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion, useInView } from 'framer-motion'

export default function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="py-20 bg-zinc-50 border-t border-zinc-100" ref={ref}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Animated sparkle icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-zinc-900 mb-6"
        >
          <Sparkles size={20} className="text-white" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl font-bold text-zinc-900 tracking-tight mb-4"
        >
          Ready to get started?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-base text-zinc-400 max-w-md mx-auto mb-10"
        >
          Post your first job for free, or sign up as a worker and start earning today. No fees to join.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.26, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/auth/signup" className="btn-primary rounded-full px-7 py-3 text-sm flex items-center gap-2 shadow-sm">
              Post a job — it's free <ArrowRight size={14} />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/auth/signup?role=worker" className="btn-ghost rounded-full px-7 py-3 text-sm">
              Become a worker
            </Link>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6 text-xs text-zinc-300"
        >
          No credit card required · Free to post · Pay only when done
        </motion.p>
      </div>
    </section>
  )
}

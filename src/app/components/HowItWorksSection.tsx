'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FileText, UserCheck, MessageCircle, Star } from 'lucide-react'

const STEPS = [
  { num: '01', icon: FileText, title: 'Post your job', desc: 'Describe what you need, add photos, set a budget. Takes under 2 minutes.' },
  { num: '02', icon: UserCheck, title: 'Worker accepts', desc: 'A verified professional near you sees and accepts your job instantly.' },
  { num: '03', icon: MessageCircle, title: 'Chat & coordinate', desc: 'Real-time chat opens between you. Discuss details, share images, agree on time.' },
  { num: '04', icon: Star, title: 'Job done & rate', desc: 'Worker completes the job. Pay and leave a review to help the community.' },
]

export default function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="how-it-works" className="py-20 bg-zinc-50 border-t border-zinc-100" ref={ref}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Process</p>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">How RapidFix works</h2>
          <p className="text-sm text-zinc-400 mt-3 max-w-md mx-auto">From posting a job to getting it done in 4 simple steps.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map(({ num, icon: Icon, title, desc }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm h-full"
              >
                {/* Animated connector line */}
                {i < STEPS.length - 1 && (
                  <motion.div
                    className="hidden lg:block absolute top-10 -right-2 h-px bg-zinc-200 z-10"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: 16 } : {}}
                    transition={{ delay: i * 0.1 + 0.4, duration: 0.4 }}
                  />
                )}

                <div className="flex items-center justify-between mb-5">
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center"
                  >
                    <Icon size={17} className="text-zinc-600" />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: i * 0.1 + 0.25, type: 'spring', stiffness: 200 }}
                    className="text-3xl font-black text-zinc-100 select-none"
                  >
                    {num}
                  </motion.span>
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-1.5">{title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

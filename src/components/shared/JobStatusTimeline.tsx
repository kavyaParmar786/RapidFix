'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, Zap, Wrench, Star } from 'lucide-react'
import { Job } from '@/types'
import { formatRelativeTime } from '@/lib/utils'

const STEPS: { key: Job['status'] | 'review'; label: string; desc: string; icon: React.ElementType }[] = [
  { key: 'posted',      label: 'Job Posted',     desc: 'Looking for workers',          icon: Clock },
  { key: 'accepted',    label: 'Worker Assigned', desc: 'Worker is on the way',        icon: Zap },
  { key: 'in_progress', label: 'In Progress',     desc: 'Work is being done',          icon: Wrench },
  { key: 'completed',   label: 'Completed',       desc: 'Job done successfully',       icon: CheckCircle },
  { key: 'review',      label: 'Review',          desc: 'Rate your experience',        icon: Star },
]

const ORDER: Job['status'][] = ['posted', 'accepted', 'in_progress', 'completed']

interface Props { job: Job }

export default function JobStatusTimeline({ job }: Props) {
  if (job.status === 'cancelled') return null

  const currentIdx = ORDER.indexOf(job.status)
  const isDone = job.status === 'completed'

  return (
    <div className="glass-card p-5 mb-5">
      <h2 className="font-semibold text-sm mb-5" style={{ color: 'var(--text-primary)' }}>
        Job Progress
      </h2>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[18px] top-3 bottom-3 w-px" style={{ background: 'var(--border-default)' }} />
        {/* Animated fill line */}
        <motion.div
          className="absolute left-[18px] top-3 w-px origin-top"
          style={{ background: 'var(--accent)' }}
          initial={{ height: 0 }}
          animate={{ height: `${(currentIdx / (ORDER.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="space-y-5">
          {STEPS.map(({ key, label, desc, icon: Icon }, i) => {
            const stepIdx = ORDER.indexOf(key as Job['status'])
            const done = key === 'review' ? isDone : stepIdx <= currentIdx
            const active = key === job.status || (key === 'review' && isDone)
            const future = !done && !active

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 relative z-10"
              >
                {/* Circle */}
                <motion.div
                  animate={{
                    scale: active ? [1, 1.15, 1] : 1,
                    background: done ? 'var(--accent)' : active ? 'var(--accent)' : 'var(--bg-elevated)',
                    borderColor: done || active ? 'var(--accent)' : 'var(--border-default)',
                  }}
                  transition={{ duration: active ? 1.5 : 0.3, repeat: active && !done ? Infinity : 0, repeatDelay: 2 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border"
                >
                  <Icon
                    size={15}
                    style={{ color: done || active ? 'var(--bg-base)' : 'var(--text-muted)' }}
                  />
                </motion.div>

                <div className="pt-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold"
                      style={{ color: future ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {label}
                    </p>
                    {active && !done && (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80' }}>
                        Now
                      </motion.span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                  {/* Timestamp */}
                  {key === 'posted' && job.createdAt && (
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{formatRelativeTime(job.createdAt)}</p>
                  )}
                  {key === 'accepted' && job.acceptedAt && (
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{formatRelativeTime(job.acceptedAt)}</p>
                  )}
                  {key === 'completed' && job.completedAt && (
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{formatRelativeTime(job.completedAt)}</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

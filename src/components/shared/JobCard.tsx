'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, DollarSign, Zap, CheckCircle, Navigation } from 'lucide-react'
import { motion } from 'framer-motion'
import { Job } from '@/types'
import { cn, getCategoryConfig, STATUS_CONFIG, URGENCY_CONFIG, formatRelativeTime, haversineKm, formatDistance } from '@/lib/utils'

interface JobCardProps {
  job: Job
  showAccept?: boolean
  viewAs?: 'worker' | 'customer'
  onAccept?: (jobId: string) => void
  accepting?: boolean
  workerLat?: number
  workerLng?: number
}

export default function JobCard({ job, showAccept, viewAs, onAccept, accepting, workerLat, workerLng }: JobCardProps) {
  const canAccept = showAccept || (viewAs === 'worker' && !!onAccept)
  const cat = getCategoryConfig(job.category)

  const distanceStr = (workerLat && workerLng && job.locationLat && job.locationLng)
    ? formatDistance(haversineKm(workerLat, workerLng, job.locationLat, job.locationLng))
    : null

  const isProWorker = (job as any).workerIsPro === true
  const isVerifiedWorker = (job as any).workerIsVerified === true
  const status = STATUS_CONFIG[job.status]
  const urgency = URGENCY_CONFIG[job.urgency]

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="glass-card group relative overflow-hidden p-5 transition-all duration-300"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-lg flex-shrink-0`}>
            {cat.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold leading-tight line-clamp-1" style={{ color: 'var(--text-primary)' }}>{job.title}</h3>
              {isProWorker && (
                <span className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-wide"
                  style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff' }}>
                  ⭐ PRO
                </span>
              )}
              {isVerifiedWorker && (
                <span className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-wide bg-green-500/15 text-green-500">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{cat.label}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={cn('status-badge', status.bg, status.color)}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status.label}
          </span>
          {job.urgency === 'emergency' && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-red-400">
              <Zap size={9} className="fill-current" /> URGENT
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed line-clamp-2 mb-4" style={{ color: 'var(--text-secondary)' }}>
        {job.description}
      </p>

      {/* Images preview */}
      {job.images && job.images.length > 0 && (
        <div className="flex gap-2 mb-4">
          {job.images.slice(0, 3).map((img, i) => (
            <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg" style={{ border: '1px solid var(--border-default)' }}>
              <Image src={img} alt="Job photo" fill className="object-cover" />
              {i === 2 && job.images!.length > 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-bold text-white">
                  +{job.images!.length - 3}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
        <span className="flex items-center gap-1">
          <MapPin size={11} style={{ color: 'var(--text-muted)' }} />
          {job.location}
          {distanceStr && (
            <span className="ml-1 flex items-center gap-0.5 text-indigo-400 font-medium">
              <Navigation size={9} />
              {distanceStr}
            </span>
          )}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} style={{ color: 'var(--text-muted)' }} />
          {formatRelativeTime(job.createdAt)}
        </span>
        {job.budget && (
          <span className="flex items-center gap-1 font-semibold text-green-400">
            <DollarSign size={11} />
            ₹{job.budget.toLocaleString()}
          </span>
        )}
        <span className={cn('flex items-center gap-1 font-medium', urgency.color)}>
          {urgency.label} Priority
        </span>
      </div>

      {/* Customer info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 overflow-hidden rounded-full flex-shrink-0 flex items-center justify-center"
            style={{ background: 'var(--bg-elevated)' }}
          >
            {job.customerPhoto ? (
              <Image src={job.customerPhoto} alt="Customer photo" width={24} height={24} className="object-cover" />
            ) : (
              <span className="text-[10px] font-bold" style={{ color: 'var(--text-primary)' }}>
                {job.customerName?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{job.customerName}</span>
        </div>

        {canAccept && job.status === 'posted' && (
          <button
            onClick={() => onAccept?.(job.id)}
            disabled={accepting}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold transition-all',
              accepting ? 'cursor-not-allowed' : 'hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105'
            )}
            style={
              accepting
                ? { background: 'var(--bg-elevated)', color: 'var(--text-muted)' }
                : { background: 'linear-gradient(to right, #3f3f46, #7c3aed)', color: 'white' }
            }
          >
            <CheckCircle size={13} />
            {accepting ? 'Accepting…' : 'Accept Job'}
          </button>
        )}

        {job.chatId && (
          <Link
            href={`/chat/${job.chatId}`}
            className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold transition-all"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
          >
            Open Chat
          </Link>
        )}
      </div>
    </motion.div>
  )
}

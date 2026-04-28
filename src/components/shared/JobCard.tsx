'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, DollarSign, Zap, CheckCircle } from 'lucide-react'
import { Job } from '@/types'
import { cn, getCategoryConfig, STATUS_CONFIG, URGENCY_CONFIG, formatRelativeTime } from '@/lib/utils'

interface JobCardProps {
  job: Job
  showAccept?: boolean
  onAccept?: (jobId: string) => void
  accepting?: boolean
}

export default function JobCard({ job, showAccept, onAccept, accepting }: JobCardProps) {
  const cat = getCategoryConfig(job.category)
  const status = STATUS_CONFIG[job.status]
  const urgency = URGENCY_CONFIG[job.urgency]

  return (
    <div className="glass-card group relative overflow-hidden p-5 transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-indigo-500/10">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-lg flex-shrink-0`}>
            {cat.icon}
          </div>
          <div>
            <h3 className="font-semibold text-white leading-tight line-clamp-1">{job.title}</h3>
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
            <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg border border-white/10">
              <Image src={img} alt="" fill className="object-cover" />
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
          <MapPin size={11} className="text-indigo-400" />
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} className="text-indigo-400" />
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
          <div className="h-6 w-6 overflow-hidden rounded-full bg-indigo-500 flex-shrink-0">
            {job.customerPhoto ? (
              <Image src={job.customerPhoto} alt="" width={24} height={24} className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-white">
                {job.customerName?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-xs text-white/60">{job.customerName}</span>
        </div>

        {showAccept && job.status === 'posted' && (
          <button
            onClick={() => onAccept?.(job.id)}
            disabled={accepting}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold transition-all',
              accepting
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105'
            )}
          >
            <CheckCircle size={13} />
            {accepting ? 'Accepting…' : 'Accept Job'}
          </button>
        )}

        {job.chatId && (
          <Link
            href={`/chat/${job.chatId}`}
            className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold bg-white/10 text-white transition-all hover:bg-white/15"
          >
            Open Chat
          </Link>
        )}
      </div>
    </div>
  )
}

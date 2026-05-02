'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, MapPin, Briefcase, CheckCircle, Shield, MessageCircle, ArrowLeft, Clock, AlertTriangle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { getUserProfile, getWorkerReviews } from '@/lib/firestore'
import { UserProfile } from '@/types'

interface Review {
  id: string
  customerName: string
  customerPhoto?: string
  rating: number
  comment: string
  createdAt: string
}

function StarRow({ rating, count, total }: { rating: number; count: number; total: number }) {
  return (
    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
      <span className="w-2">{rating}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-amber-400"
        />
      </div>
      <span className="w-4 text-right">{count}</span>
    </div>
  )
}

export default function WorkerProfilePage() {
  const { id } = useParams()
  const [worker, setWorker] = useState<UserProfile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const reviewRef = useRef(null)
  const reviewsInView = useInView(reviewRef, { once: true })

  useEffect(() => {
    async function load() {
      try {
        const [profile, workerReviews] = await Promise.all([
          getUserProfile(id as string),
          getWorkerReviews(id as string),
        ])
        if (!profile || profile.role !== 'worker') { setNotFound(true); return }
        setWorker(profile)
        setReviews(workerReviews as Review[])
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-2xl px-4 py-8 space-y-4 animate-pulse">
          {/* Hero card skeleton */}
          <div className="glass-card p-6 flex gap-4">
            <div className="h-20 w-20 rounded-2xl flex-shrink-0" style={{ background: 'var(--bg-elevated)' }} />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 w-36 rounded" style={{ background: 'var(--bg-elevated)' }} />
              <div className="h-3 w-24 rounded" style={{ background: 'var(--bg-elevated)' }} />
              <div className="h-3 w-20 rounded" style={{ background: 'var(--bg-elevated)' }} />
            </div>
          </div>
          {/* Stats skeleton */}
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card p-4 space-y-2">
                <div className="h-5 w-12 rounded mx-auto" style={{ background: 'var(--bg-elevated)' }} />
                <div className="h-3 w-16 rounded mx-auto" style={{ background: 'var(--bg-elevated)' }} />
              </div>
            ))}
          </div>
          {/* Reviews skeleton */}
          <div className="glass-card p-5 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-7 w-7 rounded-full flex-shrink-0" style={{ background: 'var(--bg-elevated)' }} />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-24 rounded" style={{ background: 'var(--bg-elevated)' }} />
                  <div className="h-3 w-full rounded" style={{ background: 'var(--bg-elevated)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )

  if (notFound || !worker) return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <AlertTriangle size={36} className="text-amber-400 mb-4" />
        <p className="text-lg font-semibold text-[var(--text-primary)] mb-2">Worker not found</p>
        <Link href="/jobs/browse" className="btn-primary px-6 py-2.5 rounded-xl text-sm mt-2">Browse Jobs</Link>
      </div>
    </>
  )

  const w = worker
  const totalReviews = reviews.length
  const avgRating = totalReviews > 0
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / totalReviews) * 10) / 10
    : 0

  // Build star breakdown from actual reviews
  const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
  }))

  const memberSince = w.createdAt
    ? new Date(w.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : 'Recently joined'

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20" style={{ background: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-3xl px-4 py-8">

          <Link href="/jobs/browse" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={14} /> Back to browse
          </Link>

          {/* Profile card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-6 mb-5">
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="relative shrink-0"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-3xl font-bold"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                  {w.photoURL
                    ? <Image src={w.photoURL} alt={w.displayName} fill className="object-cover" />
                    : w.displayName[0]}
                </div>
                {w.isVerified && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                    className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--bg-base)', border: '2px solid var(--bg-base)' }}>
                    <Shield size={13} className="text-green-400 fill-green-400" />
                  </motion.div>
                )}
              </motion.div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{w.displayName}</h1>
                    <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--accent)' }}>{w.category}</p>
                  </div>
                  <Link href={`/jobs/post?worker=${w.id}`}>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="btn-primary rounded-xl px-5 py-2.5 text-sm flex items-center gap-2">
                      <Briefcase size={13} /> Hire {w.displayName.split(' ')[0]}
                    </motion.button>
                  </Link>
                </div>

                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>{w.bio}</p>

                {/* Meta row */}
                <div className="flex flex-wrap gap-4 mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1"><MapPin size={11} />{w.location}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />Responds {w.responseTime ?? "< 30 min"}</span>
                  <span className="flex items-center gap-1"><CheckCircle size={11} />Member since {memberSince}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Rating', value: `${avgRating}★`, sub: `${totalReviews} reviews`, color: 'text-amber-400' },
              { label: 'Jobs Done', value: w.completedJobs ?? 0, sub: 'All time', color: 'text-green-400' },
              { label: 'Response', value: w.responseTime ?? "< 30 min", sub: 'Average', color: 'text-blue-400' },
            ].map(({ label, value, sub, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }} className="glass-card p-4 text-center">
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>{label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Skills */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-5 mb-5">
            <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Skills & Services</h2>
            <div className="flex flex-wrap gap-2">
              {w.skills.map((s, i) => (
                <motion.span key={s} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>
                  {s}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Ratings breakdown */}
          <motion.div ref={reviewRef} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }} className="glass-card p-5 mb-5">
            <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
              Reviews <span className="font-normal" style={{ color: 'var(--text-muted)' }}>({totalReviews})</span>
            </h2>

            <div className="flex gap-6 mb-5">
              <div className="text-center">
                <p className="text-4xl font-bold text-amber-400">{avgRating}</p>
                <div className="flex gap-0.5 mt-1 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-[var(--border-strong)]'} />
                  ))}
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{totalReviews} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {ratingBreakdown.map(({ stars, count }) => (
                  <StarRow key={stars} rating={stars} count={count} total={totalReviews} />
                ))}
              </div>
            </div>

            {/* Individual reviews */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No reviews yet.</p>
              ) : reviews.map((r, i) => (
                <motion.div key={r.id}
                  initial={{ opacity: 0, x: -10 }} animate={reviewsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.08 }}
                  className="pb-4 border-b last:border-0 last:pb-0"
                  style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                      {r.customerName?.[0] ?? '?'}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{r.customerName}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(r.rating)].map((_, i) => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{r.comment}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Chat CTA */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="flex gap-3">
            <Link href={`/jobs/post?worker=${w.id}`} className="flex-1">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="btn-primary w-full rounded-xl py-3 text-sm flex items-center justify-center gap-2">
                <Briefcase size={14} /> Hire for a Job
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  )
}

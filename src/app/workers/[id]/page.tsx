'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, MapPin, Briefcase, CheckCircle, Shield, MessageCircle, ArrowLeft, Clock } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { PageLoader } from '@/components/ui/Spinner'

// Mock data — wire to Firestore: getUserProfile(id), getReviewsForWorker(id)
const MOCK_WORKER = {
  id: '1',
  displayName: 'Amit Patel',
  photoURL: null,
  category: 'Electrician',
  skills: ['Wiring', 'MCB Installation', 'Fan Fitting', 'AC Wiring', 'CCTV Installation'],
  bio: 'Licensed electrician with 8+ years of experience in residential and commercial work. I take pride in clean, safe, and professional work. Available 7 days a week.',
  location: 'Rajkot, Gujarat',
  rating: 4.8,
  totalReviews: 124,
  completedJobs: 312,
  responseTime: '< 15 min',
  verified: true,
  memberSince: 'Jan 2023',
}

const MOCK_REVIEWS = [
  { id: '1', name: 'Sneha M.', rating: 5, comment: 'Amit was on time, professional, and did a clean job. Highly recommend!', date: '2 days ago', avatar: 'S' },
  { id: '2', name: 'Raj K.', rating: 5, comment: 'Fixed our entire wiring in one visit. Very knowledgeable.', date: '1 week ago', avatar: 'R' },
  { id: '3', name: 'Kavita J.', rating: 4, comment: 'Good work, slightly delayed but kept me informed throughout.', date: '2 weeks ago', avatar: 'K' },
  { id: '4', name: 'Arjun S.', rating: 5, comment: 'Third time hiring Amit — always reliable. Won\'t use anyone else.', date: '1 month ago', avatar: 'A' },
]

function StarRow({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
      <span className="w-2">{rating}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(count / MOCK_WORKER.totalReviews) * 100}%` }}
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
  const [loading, setLoading] = useState(true)
  const reviewRef = useRef(null)
  const reviewsInView = useInView(reviewRef, { once: true })

  useEffect(() => {
    // wire: getUserProfile(id as string).then(setWorker)
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [id])

  if (loading) return <PageLoader />

  const w = MOCK_WORKER
  const ratingBreakdown = [
    { stars: 5, count: 89 },
    { stars: 4, count: 24 },
    { stars: 3, count: 7 },
    { stars: 2, count: 3 },
    { stars: 1, count: 1 },
  ]

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
                {w.verified && (
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
                  <span className="flex items-center gap-1"><Clock size={11} />Responds {w.responseTime}</span>
                  <span className="flex items-center gap-1"><CheckCircle size={11} />Member since {w.memberSince}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Rating', value: `${w.rating}★`, sub: `${w.totalReviews} reviews`, color: 'text-amber-400' },
              { label: 'Jobs Done', value: w.completedJobs, sub: 'All time', color: 'text-green-400' },
              { label: 'Response', value: w.responseTime, sub: 'Average', color: 'text-blue-400' },
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
              Reviews <span className="font-normal" style={{ color: 'var(--text-muted)' }}>({w.totalReviews})</span>
            </h2>

            <div className="flex gap-6 mb-5">
              <div className="text-center">
                <p className="text-4xl font-bold text-amber-400">{w.rating}</p>
                <div className="flex gap-0.5 mt-1 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < Math.round(w.rating) ? 'fill-amber-400 text-amber-400' : 'text-[var(--border-strong)]'} />
                  ))}
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{w.totalReviews} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {ratingBreakdown.map(({ stars, count }) => (
                  <StarRow key={stars} rating={stars} count={count} />
                ))}
              </div>
            </div>

            {/* Individual reviews */}
            <div className="space-y-4">
              {MOCK_REVIEWS.map((r, i) => (
                <motion.div key={r.id}
                  initial={{ opacity: 0, x: -10 }} animate={reviewsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.08 }}
                  className="pb-4 border-b last:border-0 last:pb-0"
                  style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                      {r.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{r.date}</p>
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

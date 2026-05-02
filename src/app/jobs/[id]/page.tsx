'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, DollarSign, User, Zap, MessageCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { getJob, updateJobStatus, acceptJob, createReview } from '@/lib/firestore'
import { Job } from '@/types'
import { cn, getCategoryConfig, STATUS_CONFIG, URGENCY_CONFIG, formatRelativeTime } from '@/lib/utils'
import { PageLoader } from '@/components/ui/Spinner'
import ReviewModal from '@/components/shared/ReviewModal'
import JobStatusTimeline from '@/components/shared/JobStatusTimeline'
import CancelJobDialog from '@/components/shared/CancelJobDialog'
import { motion, AnimatePresence } from 'framer-motion'
import StarRating from '@/components/ui/StarRating'
import Navbar from '@/components/layout/Navbar'
import toast from 'react-hot-toast'

export default function JobDetailPage() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewSent, setReviewSent] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [showDispute, setShowDispute] = useState(false)
  const [disputeReason, setDisputeReason] = useState('')
  const [disputeSubmitting, setDisputeSubmitting] = useState(false)
  const [disputeDone, setDisputeDone] = useState(false)

  useEffect(() => {
    if (!id) return
    getJob(id as string).then((j) => {
      setJob(j)
      setLoading(false)
    })
  }, [id])

  if (loading) return <PageLoader />
  if (!job) return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <p className="text-[var(--text-muted)]">Job not found</p>
    </div>
  )

  const cat = getCategoryConfig(job.category)
  const status = STATUS_CONFIG[job.status]
  const urgency = URGENCY_CONFIG[job.urgency]
  const isCustomer = user?.uid === job.customerId
  const isWorker = user?.uid === job.workerId

  const handleStatusChange = async (newStatus: Job['status']) => {
    setActionLoading(true)
    await updateJobStatus(job.id, newStatus)
    setJob((prev) => prev ? { ...prev, status: newStatus } : null)
    toast.success(`Job marked as ${newStatus.replace('_', ' ')}`)
    setActionLoading(false)
    if (newStatus === 'completed') setShowReview(true)
  }

  const handleReviewSubmit = async () => {
    if (!user || !profile || !job.workerId) return
    await createReview({
      jobId: job.id,
      reviewerId: user.uid,
      reviewerName: profile.displayName,
      reviewerPhoto: profile.photoURL,
      revieweeId: job.workerId,
      rating,
      comment,
    })
    toast.success('Review submitted! ⭐')
    setShowReview(false)
    setReviewSent(true)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16" style={{ background: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href={`/dashboard/${profile?.role || 'customer'}`}
            className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-[var(--text-primary)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={14} /> Back
          </Link>

          {/* Header */}
          <div className="glass-card p-6 mb-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {cat.icon}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-sans)' }}>
                    {job.title}
                  </h1>
                  <p className="text-sm text-[var(--text-muted)]">{cat.label}</p>
                </div>
              </div>
              <span className={cn('status-badge', status.bg, status.color)}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {status.label}
              </span>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 mt-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1.5"><MapPin size={13} className="text-[var(--text-muted)]" />{job.location}</span>
              <span className="flex items-center gap-1.5"><Clock size={13} className="text-[var(--text-muted)]" />{formatRelativeTime(job.createdAt)}</span>
              {job.budget && <span className="flex items-center gap-1.5 text-green-400 font-medium"><DollarSign size={13} />₹{job.budget.toLocaleString()}</span>}
              <span className={cn('flex items-center gap-1.5 font-medium', urgency.color)}>
                <Zap size={13} />{urgency.label} Priority
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="glass-card p-6 mb-5">
            <h2 className="font-semibold text-[var(--text-primary)] mb-3">Description</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
              {job.description}
            </p>
          </div>

          <JobStatusTimeline job={job} />

          {/* Images */}
          {job.images && job.images.length > 0 && (
            <div className="glass-card p-6 mb-5">
              <h2 className="font-semibold text-[var(--text-primary)] mb-3">Photos</h2>
              <div className="grid grid-cols-3 gap-3">
                {job.images.map((img, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                    <Image src={img} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Worker info (if accepted) */}
          {job.workerId && (
            <div className="glass-card p-5 mb-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-zinc-900/30 flex items-center justify-center text-sm font-bold text-[var(--text-secondary)]">
                  {job.workerPhoto ? (
                    <Image src={job.workerPhoto} alt="" width={40} height={40} className="object-cover rounded-full" />
                  ) : (
                    job.workerName?.[0]
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{job.workerName}</p>
                  <p className="text-xs text-[var(--text-muted)]">Assigned Worker</p>
                </div>
              </div>
              {job.chatId && (
                <Link href={`/chat/${job.chatId}`} className="flex items-center gap-2 btn-secondary text-sm">
                  <MessageCircle size={14} /> Open Chat
                </Link>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {/* Worker actions */}
            {isWorker && job.status === 'accepted' && (
              <button
                onClick={() => handleStatusChange('in_progress')}
                disabled={actionLoading}
                className="btn-primary flex items-center gap-2"
              >
                Start Job
              </button>
            )}
            {isWorker && job.status === 'in_progress' && (
              <button
                onClick={() => handleStatusChange('completed')}
                disabled={actionLoading}
                className="btn-primary flex items-center gap-2"
              >
                Mark Completed
              </button>
            )}

            {/* Customer actions */}
            {isCustomer && job.status === 'in_progress' && (
              <button
                onClick={() => handleStatusChange('completed')}
                disabled={actionLoading}
                className="btn-primary flex items-center gap-2"
              >
                Mark as Done
              </button>
            )}
            {isCustomer && (job.status === 'posted' || job.status === 'accepted') && (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowCancel(true)}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20"
              >
            {/* Report Issue — available on any active/in-progress job for both parties */}
            {(isCustomer || isWorker) && ['accepted', 'in_progress'].includes(job.status) && (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowDispute(true)}
                className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-400 transition-all hover:bg-amber-500/20"
              >
                ⚠️ Report Issue
              </motion.button>
            )}
                Cancel Job
              </motion.button>
            )}
          </div>

          {/* Review modal */}
          <AnimatePresence>
          {showReview && isCustomer && !reviewSent && (
            <ReviewModal
              workerName={job.workerName || 'Worker'}
              jobTitle={job.title}
              onSubmit={async (r, comment) => {
                setRating(r)
                await createReview({
                  jobId: job.id,
                  reviewerId: user!.uid,
                  reviewerName: profile!.displayName,
                  reviewerPhoto: profile!.photoURL,
                  revieweeId: job.workerId!,
                  rating: r,
                  comment,
                })
              }}
              onClose={() => { setShowReview(false); setReviewSent(true) }}
            />
          )}
          </AnimatePresence>

        </div>

          {/* Cancel dialog */}
          <AnimatePresence>
            {showCancel && (
              <CancelJobDialog
                jobTitle={job.title}
                onConfirm={async (reason) => {
                  await handleStatusChange('cancelled')
                  setShowCancel(false)
                }}
                onClose={() => setShowCancel(false)}
                isWorker={isWorker}
              />
            )}
          </AnimatePresence>

          {/* Dispute modal */}
          <AnimatePresence>
            {showDispute && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] flex items-center justify-center p-4"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
                onClick={() => setShowDispute(false)}>
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 10 }}
                  className="glass-card p-6 w-full max-w-sm"
                  onClick={e => e.stopPropagation()}>
                  {disputeDone ? (
                    <div className="text-center py-4">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(34,197,94,0.1)' }}>
                        <span className="text-2xl">✓</span>
                      </div>
                      <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Dispute raised</h3>
                      <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Our team will review and contact you within 24 hours.</p>
                      <button onClick={() => setShowDispute(false)} className="btn-primary rounded-xl px-8 py-2.5 text-sm">Done</button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Report an Issue</h3>
                      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Describe the problem. Our team reviews within 24 hours.</p>
                      <textarea
                        value={disputeReason}
                        onChange={e => setDisputeReason(e.target.value)}
                        rows={4}
                        placeholder="What went wrong? Please be as specific as possible…"
                        className="input-base w-full rounded-xl resize-none mb-4 text-sm"
                      />
                      <div className="flex gap-3">
                        <button onClick={() => setShowDispute(false)} className="flex-1 btn-ghost rounded-xl py-2.5 text-sm">Cancel</button>
                        <motion.button whileTap={{ scale: 0.97 }}
                          disabled={!disputeReason.trim() || disputeSubmitting}
                          onClick={async () => {
                            setDisputeSubmitting(true)
                            try {
                              const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
                              const { db } = await import('@/lib/firebase')
                              await addDoc(collection(db, 'disputes'), {
                                jobId: job.id,
                                jobTitle: job.title,
                                reporterId: user?.uid,
                                reporterName: profile?.displayName,
                                reason: disputeReason.trim(),
                                status: 'open',
                                createdAt: new Date().toISOString(),
                              })
                              setDisputeDone(true)
                            } catch { toast.error('Failed to submit dispute') }
                            finally { setDisputeSubmitting(false) }
                          }}
                          className="flex-1 btn-primary rounded-xl py-2.5 text-sm flex items-center justify-center gap-2">
                          {disputeSubmitting
                            ? <><motion.div className="w-3 h-3 rounded-full border-2 border-current/30 border-t-current" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} /> Submitting…</>
                            : 'Submit'}
                        </motion.button>
                      </div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </>
  )
}

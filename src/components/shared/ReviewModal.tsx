'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, CheckCircle, Send } from 'lucide-react'

interface ReviewModalProps {
  workerName: string
  jobTitle: string
  onSubmit: (rating: number, comment: string) => Promise<void>
  onClose: () => void
}

const LABELS = ['', 'Terrible', 'Bad', 'OK', 'Great', 'Amazing!']
const QUICK_REVIEWS = ['Great work!', 'On time', 'Very professional', 'Highly recommend', 'Clean & tidy', 'Friendly']

export default function ReviewModal({ workerName, jobTitle, onSubmit, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const activeRating = hovered || rating

  const handleSubmit = async () => {
    if (!rating) return
    setLoading(true)
    await onSubmit(rating, comment)
    setDone(true)
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="glass-card p-6 w-full max-w-sm relative"
        onClick={e => e.stopPropagation()}
      >
        {!done ? (
          <>
            <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors">
              <X size={14} style={{ color: 'var(--text-muted)' }} />
            </button>

            <h3 className="font-bold text-lg mb-0.5" style={{ color: 'var(--text-primary)' }}>Rate your experience</h3>
            <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
              How was <strong style={{ color: 'var(--text-secondary)' }}>{workerName}</strong> for "{jobTitle}"?
            </p>

            {/* Stars */}
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map(s => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(s)}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <motion.div animate={{ rotate: hovered === s ? [0, -15, 15, 0] : 0 }}
                    transition={{ duration: 0.3 }}>
                    <Star
                      size={32}
                      className={s <= activeRating ? 'fill-amber-400 text-amber-400' : 'text-[var(--border-strong)]'}
                      style={{ transition: 'color 0.15s, fill 0.15s' }}
                    />
                  </motion.div>
                </motion.button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={activeRating}
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-center text-sm font-semibold mb-5 h-5"
                style={{ color: activeRating >= 4 ? '#fbbf24' : 'var(--text-muted)' }}>
                {LABELS[activeRating]}
              </motion.p>
            </AnimatePresence>

            {/* Quick tags */}
            {rating >= 4 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-wrap gap-1.5 mb-4">
                {QUICK_REVIEWS.map(q => (
                  <motion.button key={q} whileTap={{ scale: 0.95 }}
                    onClick={() => setComment(prev => prev ? `${prev}, ${q}` : q)}
                    className="text-xs px-3 py-1 rounded-full transition-all"
                    style={{ background: comment.includes(q) ? 'var(--accent)' : 'var(--bg-elevated)', color: comment.includes(q) ? 'var(--bg-base)' : 'var(--text-muted)', border: '1px solid var(--border-default)' }}>
                    {q}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Comment */}
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment (optional)…"
              rows={3}
              className="input-base w-full rounded-xl text-sm mb-4 resize-none"
              style={{ minHeight: 72 }}
            />

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 btn-ghost rounded-xl py-2.5 text-sm">Skip</button>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={!rating || loading}
                className="flex-1 btn-primary rounded-xl py-2.5 text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <motion.div className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current"
                    animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                ) : (
                  <><Send size={12} /> Submit</>
                )}
              </motion.button>
            </div>
          </>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }} className="text-center py-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 14 }}
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.3)' }}>
              <CheckCircle size={28} className="text-green-500" />
            </motion.div>
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(rating)].map((_, i) => (
                <motion.div key={i} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}>
                  <Star size={20} className="fill-amber-400 text-amber-400" />
                </motion.div>
              ))}
            </div>
            <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Thanks for the review!</h3>
            <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Your feedback helps workers improve.</p>
            <button onClick={onClose} className="btn-ghost rounded-xl px-6 py-2 text-sm">Close</button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

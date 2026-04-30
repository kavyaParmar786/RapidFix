'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, RefreshCw } from 'lucide-react'

const REASONS = [
  'Changed my mind',
  'Found another worker',
  'Worker hasn\'t responded',
  'Price too high',
  'Emergency came up',
  'Other',
]

interface Props {
  jobTitle: string
  onConfirm: (reason: string) => Promise<void>
  onClose: () => void
  isWorker?: boolean
}

export default function CancelJobDialog({ jobTitle, onConfirm, onClose, isWorker }: Props) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const WORKER_REASONS = ['Emergency came up', 'Overbooked', 'Job out of my skillset', 'Personal reason', 'Other']
  const reasons = isWorker ? WORKER_REASONS : REASONS

  const handleConfirm = async () => {
    if (!reason) return
    setLoading(true)
    await onConfirm(reason)
    setLoading(false)
    onClose()
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
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="glass-card p-6 w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.1)' }}>
              <AlertTriangle size={18} className="text-red-400" />
            </motion.div>
            <div>
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Cancel job?</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{jobTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)]">
            <X size={14} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        {/* Policy notice */}
        <div className="rounded-xl p-3 mb-4 text-xs leading-relaxed"
          style={{ background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.2)', color: '#a16207' }}>
          {isWorker
            ? '⚠️ Cancelling a job affects your reliability score. Repeated cancellations may limit your visibility.'
            : '⚠️ If the worker has already accepted, a cancellation fee of ₹50 may apply.'
          }
        </div>

        <p className="text-xs font-semibold mb-2.5" style={{ color: 'var(--text-secondary)' }}>Why are you cancelling?</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {reasons.map((r, i) => (
            <motion.button key={r}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setReason(r)}
              className="text-left rounded-xl px-3 py-2.5 text-xs font-medium transition-all"
              style={{
                background: reason === r ? 'rgba(239,68,68,0.1)' : 'var(--bg-elevated)',
                border: `1px solid ${reason === r ? 'rgba(239,68,68,0.4)' : 'var(--border-default)'}`,
                color: reason === r ? '#f87171' : 'var(--text-secondary)',
              }}>
              {r}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-ghost rounded-xl py-2.5 text-sm">Keep Job</button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleConfirm}
            disabled={!reason || loading}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all disabled:opacity-40"
            style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            {loading ? <motion.div className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} /> : 'Cancel Job'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

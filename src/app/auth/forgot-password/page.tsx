'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    // Simulated — wire to your auth provider's password reset
    await new Promise(r => setTimeout(r, 1200))
    setSent(true)
    setLoading(false)
  }

  const particles = Array.from({ length: 8 })

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-16 overflow-hidden"
      style={{ background: 'var(--bg-base)' }}>

      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(var(--text-primary) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        {particles.map((_, i) => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{ width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2, background: 'var(--text-muted)', left: `${10 + i * 11}%`, top: `${15 + (i % 4) * 20}%` }}
            animate={{ y: [0, -40, 0], opacity: [0.1, 0.4, 0.1], scale: [1, 1.3, 1] }}
            transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          />
        ))}
        <motion.div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, var(--bg-elevated) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[400px]"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <Link href="/" className="flex items-center gap-2.5">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}
              className="relative h-9 w-9">
              <Image src="/logo.png" alt="RapidFix" fill className="object-contain" />
            </motion.div>
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>RapidFix</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl p-8 relative overflow-hidden"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.08)',
          }}
        >
          <div className="absolute -top-px -left-px w-28 h-28 rounded-br-full opacity-30"
            style={{ background: 'radial-gradient(circle at top left, var(--bg-overlay), transparent)' }} />

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
                >
                  <Mail size={20} style={{ color: 'var(--text-secondary)' }} />
                </motion.div>

                <h1 className="text-2xl font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>Reset password</h1>
                <p className="text-sm mb-7" style={{ color: 'var(--text-muted)' }}>
                  Enter your email and we'll send you a reset link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Email address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com" className="input-base pl-10 py-3 rounded-xl" required />
                    </div>
                  </div>

                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full py-3 rounded-xl text-sm font-semibold relative overflow-hidden"
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-2">
                          <motion.div
                            className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          />
                          Sending…
                        </motion.span>
                      ) : (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-2">
                          Send reset link <ArrowRight size={14} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }} className="text-center py-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}
                >
                  <CheckCircle size={28} className="text-green-500" />
                </motion.div>
                <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Check your inbox!
                </motion.h2>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                  We sent a reset link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
                </motion.p>

                {/* Animated email path */}
                <motion.div className="flex items-center justify-center gap-3 mb-6">
                  {[...Array(3)].map((_, i) => (
                    <motion.div key={i}
                      className="w-2 h-2 rounded-full bg-green-500"
                      animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </motion.div>

                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  onClick={() => { setSent(false); setEmail('') }}
                  className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Try a different email
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <Link href="/auth/login" className="flex items-center justify-center gap-1.5 text-sm transition-colors"
              style={{ color: 'var(--text-muted)' }}>
              <ArrowLeft size={13} /> Back to sign in
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

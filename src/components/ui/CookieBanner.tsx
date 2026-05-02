'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Shield } from 'lucide-react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('rf-cookie-consent')
    if (!consent) setTimeout(() => setVisible(true), 1500)
  }, [])

  const accept = () => {
    localStorage.setItem('rf-cookie-consent', 'accepted')
    setVisible(false)
    // Grant GA4 analytics consent immediately without page reload
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('consent', 'update', { analytics_storage: 'granted' })
    }
  }
  const decline = () => { localStorage.setItem('rf-cookie-consent', 'declined'); setVisible(false) }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-xl"
        >
          <div className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            }}>

            {/* Animated cookie icon */}
            <motion.div
              animate={{ rotate: [0, -12, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-elevated)' }}
            >
              <Cookie size={18} style={{ color: '#f59e0b' }} />
            </motion.div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                We use cookies 🍪
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                We use cookies to improve your experience and analyse traffic.{' '}
                <Link href="/privacy" className="underline underline-offset-2 transition-colors hover:text-[var(--text-primary)]">
                  Privacy policy
                </Link>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={accept}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold"
                style={{ background: 'var(--accent)', color: 'var(--bg-base)' }}
              >
                <Shield size={11} /> Accept
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={decline}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border-default)' }}
              >
                Decline
              </motion.button>
              <button onClick={decline} className="p-1.5 rounded-lg transition-colors hover:bg-[var(--bg-elevated)]">
                <X size={13} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

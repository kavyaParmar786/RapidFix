'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <html>
      <body style={{ background: '#09090b', margin: 0, fontFamily: 'system-ui' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', maxWidth: 400 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              style={{
                width: 64, height: 64, borderRadius: 20, background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 24px',
              }}
            >
              <AlertTriangle size={28} color="#ef4444" />
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ fontSize: 24, fontWeight: 700, color: '#fafafa', marginBottom: 8 }}>
              Something went wrong
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ fontSize: 14, color: '#71717a', marginBottom: 32, lineHeight: 1.6 }}>
              An unexpected error occurred. Our team has been notified.
              {error.digest && <span style={{ display: 'block', fontSize: 11, marginTop: 6, fontFamily: 'monospace', color: '#52525b' }}>Error ID: {error.digest}</span>}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={reset}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                  borderRadius: 12, background: '#18181b', border: '1px solid #27272a',
                  color: '#a1a1aa', fontSize: 13, cursor: 'pointer', fontWeight: 500
                }}>
                <RefreshCw size={13} /> Try again
              </button>
              <a href="/"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                  borderRadius: 12, background: '#fafafa', color: '#09090b',
                  fontSize: 13, textDecoration: 'none', cursor: 'pointer', fontWeight: 600
                }}>
                <Home size={13} /> Go home
              </a>
            </motion.div>
          </motion.div>
        </div>
      </body>
    </html>
  )
}

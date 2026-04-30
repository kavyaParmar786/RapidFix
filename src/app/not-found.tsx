'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Home, ArrowLeft, Search } from 'lucide-react'

const FLOATING_TOOLS = ['🔧', '🔌', '🪛', '🔨', '💡', '🛠️', '🪚', '⚡']

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden"
      style={{ background: 'var(--bg-base)' }}>

      {/* Floating tool emojis */}
      {FLOATING_TOOLS.map((tool, i) => (
        <motion.span key={i}
          className="absolute text-2xl select-none pointer-events-none"
          style={{ left: `${8 + i * 11}%`, top: `${10 + (i % 3) * 25}%`, filter: 'grayscale(0.5)', opacity: 0.18 }}
          animate={{ y: [0, -20, 0], rotate: [0, i % 2 === 0 ? 15 : -15, 0] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}>
          {tool}
        </motion.span>
      ))}

      {/* Grid bg */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(var(--text-primary) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Logo */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative z-10 mb-8">
        <Link href="/" className="inline-block">
          <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}
            className="relative h-12 w-12 mx-auto">
            <Image src="/logo.png" alt="RapidFix" fill className="object-contain opacity-80" />
          </motion.div>
        </Link>
      </motion.div>

      {/* 404 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 180, damping: 16 }}
        className="relative z-10 mb-4"
      >
        <span className="text-[120px] font-black leading-none select-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: '2px var(--border-strong)',
            letterSpacing: '-0.04em',
          }}>
          404
        </span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="relative z-10 max-w-sm">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Nothing to fix here
        </h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          This page doesn't exist — but don't worry, our workers can't fix that one. Let's get you back on track.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="btn-primary rounded-xl px-5 py-2.5 text-sm flex items-center gap-2">
              <Home size={13} /> Go home
            </motion.button>
          </Link>
          <Link href="/jobs/browse">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="btn-ghost rounded-xl px-5 py-2.5 text-sm flex items-center gap-2">
              <Search size={13} /> Browse services
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'

function OrbBackground() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const orb1X = useTransform(mouseX, [0, 1], [-20, 20])
  const orb1Y = useTransform(mouseY, [0, 1], [-20, 20])
  const orb2X = useTransform(mouseX, [0, 1], [20, -20])
  const orb2Y = useTransform(mouseY, [0, 1], [20, -20])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [mouseX, mouseY])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <motion.div style={{ x: orb1X, y: orb1Y, background: 'radial-gradient(circle, var(--text-primary) 0%, transparent 70%)' } as any}
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div style={{ x: orb2X, y: orb2Y, background: 'radial-gradient(circle, var(--text-primary) 0%, transparent 70%)' } as any}
        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      {[...Array(6)].map((_, i) => (
        <motion.div key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ background: 'var(--text-muted)', left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
        />
      ))}
    </div>
  )
}

export default function LoginPage() {
  const { user, profile, loading, signInWithGoogle, signInWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [unverified, setUnverified] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  useEffect(() => {
    if (loading) return
    if (user && profile?.role) window.location.href = `/dashboard/${profile.role}`
    if (user && !profile) window.location.href = '/auth/role-select'
  }, [loading, user, profile])

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try { await signInWithGoogle() }
    catch (err: any) { toast.error(err.message || 'Google sign-in failed'); setGoogleLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Fill all fields'); return }
    setSubmitting(true); setUnverified(false)
    try { await signInWithEmail(email, password); toast.success('Signed in!') }
    catch (err: any) {
      if (err?.code === 'auth/email-not-verified') setUnverified(true)
      else toast.error(err.message || 'Sign-in failed')
    } finally { setSubmitting(false) }
  }

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }
  const fadeUp = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-16" style={{ background: 'var(--bg-base)' }}>
      <OrbBackground />
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10 w-full max-w-[400px]">

        {/* Logo */}
        <motion.div variants={fadeUp} className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}
              className="relative h-9 w-9">
              <Image src="/logo.png" alt="RapidFix" fill className="object-contain" />
            </motion.div>
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>RapidFix</span>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div variants={fadeUp}
          className="rounded-3xl p-8 relative overflow-hidden"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.08), 0 0 0 1px var(--border-subtle)',
          }}>

          <div className="absolute -top-px -right-px w-32 h-32 rounded-bl-full opacity-40"
            style={{ background: 'radial-gradient(circle at top right, var(--bg-overlay), transparent)' }} />

          <div className="mb-7">
            <h1 className="text-2xl font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>Welcome back</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sign in to your RapidFix account</p>
          </div>

          {/* Google */}
          <motion.button onClick={handleGoogle} disabled={googleLoading || submitting}
            whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-medium transition-all duration-150 disabled:opacity-40 mb-5"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}>
            {googleLoading
              ? <div className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--border-strong)', borderTopColor: 'transparent' }} />
              : <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
            }
            <span>{googleLoading ? 'Signing in…' : 'Continue with Google'}</span>
          </motion.button>

          <div className="divider-text mb-5 text-xs" style={{ color: 'var(--text-muted)' }}>or continue with email</div>

          <AnimatePresence>
            {unverified && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mb-4 rounded-xl px-4 py-3" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>
                <p className="text-xs font-semibold text-yellow-600 mb-0.5">Email not verified</p>
                <p className="text-xs text-yellow-500">Check your inbox and verify your email first.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Email address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: focusedField === 'email' ? 'var(--text-primary)' : 'var(--text-muted)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com" className="input-base pl-10 py-3 text-sm rounded-xl" required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: focusedField === 'pw' ? 'var(--text-primary)' : 'var(--text-muted)' }} />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('pw')} onBlur={() => setFocusedField(null)}
                  placeholder="••••••••" className="input-base pl-10 pr-10 py-3 text-sm rounded-xl" required />
                <motion.button type="button" onClick={() => setShowPw(!showPw)} whileTap={{ scale: 0.85 }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </motion.button>
              </div>
            </div>

            <motion.button type="submit" disabled={submitting || googleLoading}
              whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-3 rounded-xl mt-2 text-sm font-semibold">
              {submitting
                ? <><div className="h-4 w-4 rounded-full border-2 border-current/40 border-t-current animate-spin mr-2 inline-block" />Signing in…</>
                : <>Sign in <ArrowRight size={14} className="ml-1.5 inline" /></>}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-semibold transition-colors" style={{ color: 'var(--text-primary)' }}>Sign up free</Link>
          </p>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          <Link href="/terms" className="hover:underline">Terms</Link>
          {' · '}
          <Link href="/privacy" className="hover:underline">Privacy</Link>
        </motion.p>
      </motion.div>
    </div>
  )
}

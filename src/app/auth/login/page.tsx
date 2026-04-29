'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }),
}

export default function LoginPage() {
  const { user, profile, loading, signInWithGoogle, signInWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [unverified, setUnverified] = useState(false)

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

  if (!loading && user && profile?.role) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="h-5 w-5 rounded-full border border-zinc-300 border-t-zinc-700 animate-spin mx-auto mb-3" />
        <p className="text-xs text-zinc-400">Redirecting…</p>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 border-r border-black/[0.06] bg-zinc-50 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none" style={{ background: 'linear-gradient(to top, #fafafa, transparent)' }} />

        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="relative h-8 w-8"><Image src="/logo.png" alt="RapidFix" fill className="object-contain" /></div>
          <span className="text-base font-semibold text-zinc-900">RapidFix</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 space-y-8"
        >
          <div>
            <h2 className="text-4xl font-bold text-zinc-900 leading-tight mb-4">Home services,<br />on demand.</h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">Book trusted professionals for any home repair in minutes. Fast, reliable, and affordable.</p>
          </div>
          <motion.div
            whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-black/[0.08] bg-white p-5 shadow-sm"
          >
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <motion.svg key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.08, type: 'spring' }} className="h-3.5 w-3.5 fill-zinc-900" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </motion.svg>
              ))}
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">"Got my plumbing fixed in under 2 hours. The worker was professional and the app was seamless."</p>
            <div className="flex items-center gap-2.5 mt-4">
              <div className="h-7 w-7 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-semibold text-zinc-900">P</div>
              <div>
                <p className="text-xs font-medium text-zinc-900">Priya Sharma</p>
                <p className="text-xs text-zinc-400">Rajkot, Gujarat</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <p className="text-xs text-zinc-300 relative z-10">© 2025 RapidFix. All rights reserved.</p>
      </motion.div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="relative h-7 w-7"><Image src="/logo.png" alt="RapidFix" fill className="object-contain" /></div>
            <span className="text-sm font-semibold text-zinc-900">RapidFix</span>
          </Link>

          <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show" className="mb-7">
            <motion.h1 variants={fadeUp} className="text-2xl font-bold text-zinc-900 mb-1.5">Sign in</motion.h1>
            <motion.p variants={fadeUp} className="text-sm text-zinc-400">Welcome back to RapidFix</motion.p>
          </motion.div>

          <motion.button
            custom={1} variants={fadeUp} initial="hidden" animate="show"
            onClick={handleGoogle} disabled={googleLoading || submitting}
            whileHover={{ scale: 1.015, backgroundColor: '#f9f9f9' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-zinc-200 bg-white py-2.5 text-sm font-medium text-zinc-900 transition-all duration-150 disabled:opacity-40 mb-4 shadow-sm"
          >
            {googleLoading
              ? <div className="h-4 w-4 rounded-full border border-zinc-300 border-t-zinc-700 animate-spin" />
              : <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
            }
            {googleLoading ? 'Signing in…' : 'Continue with Google'}
          </motion.button>

          <div className="divider-text mb-4">or continue with email</div>

          <AnimatePresence>
            {unverified && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-3.5 py-3"
              >
                <p className="text-xs font-medium text-yellow-700 mb-0.5">Email not verified</p>
                <p className="text-xs text-yellow-600">Check your inbox and click the verification link before signing in.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            onSubmit={handleSubmit}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }}
            initial="hidden" animate="show"
            className="space-y-3"
          >
            <motion.div variants={fadeUp}>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input-base pl-9" required />
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input-base pl-9 pr-9" required />
                <motion.button type="button" onClick={() => setShowPw(!showPw)} whileTap={{ scale: 0.85 }} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </motion.button>
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <motion.button
                type="submit" disabled={submitting || googleLoading}
                whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}
                className="btn-primary w-full mt-1 py-2.5"
              >
                {submitting
                  ? <><div className="h-3.5 w-3.5 rounded-full border border-white/40 border-t-white animate-spin mr-2 inline-block" />Signing in…</>
                  : <>Sign in <ArrowRight size={13} className="ml-1.5 inline" /></>}
              </motion.button>
            </motion.div>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-6 text-center text-xs text-zinc-400"
          >
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-zinc-900 hover:text-zinc-700 font-medium transition-colors">Sign up free</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

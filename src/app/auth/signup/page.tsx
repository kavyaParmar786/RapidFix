'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { UserRole } from '@/types'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as any } },
}

function SignupForm() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') as UserRole || 'customer'
  const { signInWithGoogle, signUpWithEmail } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [role, setRole] = useState<UserRole>(defaultRole)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleGoogle = async () => {
    setGoogleLoading(true)
    sessionStorage.setItem('pendingRole', role)
    try { await signInWithGoogle() }
    catch (err: any) { toast.error(err.message || 'Google sign-up failed'); setGoogleLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) { toast.error('Fill all fields'); return }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try { await signUpWithEmail(email, password, name, role); setDone(true) }
    catch (err: any) { toast.error(err.message || 'Sign-up failed') }
    finally { setLoading(false) }
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        className="w-full max-w-sm text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 mb-6"
        >
          <CheckCircle size={24} className="text-zinc-900" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-bold text-zinc-900 mb-2">Check your email</motion.h2>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="text-sm text-zinc-400 mb-6">We sent a verification link to <span className="font-medium text-zinc-900">{email}</span>. Click it to activate your account.</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Link href="/auth/login" className="btn-primary rounded-lg px-6 py-2.5 text-sm inline-flex items-center gap-2">Go to Sign in <ArrowRight size={13} /></Link>
        </motion.div>
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
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute bottom-0 left-0 right-0 h-64" style={{ background: 'linear-gradient(to top, #fafafa, transparent)' }} />

        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="relative h-8 w-8"><Image src="/logo.png" alt="RapidFix" fill className="object-contain" /></div>
          <span className="text-base font-semibold text-zinc-900">RapidFix</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 space-y-6"
        >
          <div>
            <h2 className="text-4xl font-bold text-zinc-900 leading-tight mb-4">Join 50,000+<br />happy customers.</h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">Get any home service done quickly and reliably. Workers are verified, professional, and nearby.</p>
          </div>
          <div className="space-y-3">
            {[
              { emoji: '⚡', title: 'Response in 60 seconds', desc: 'Workers respond nearly instantly' },
              { emoji: '🛡️', title: 'Verified professionals', desc: 'Background-checked and rated' },
              { emoji: '💰', title: 'Transparent pricing', desc: 'No hidden fees, ever' },
            ].map(({ emoji, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-3"
              >
                <span className="text-lg">{emoji}</span>
                <div>
                  <p className="text-sm font-medium text-zinc-900">{title}</p>
                  <p className="text-xs text-zinc-400">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="text-xs text-zinc-300 relative z-10">© 2025 RapidFix. All rights reserved.</p>
      </motion.div>

      {/* Right panel */}
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
            <motion.h1 variants={fadeUp} className="text-2xl font-bold text-zinc-900 mb-1.5">Create account</motion.h1>
            <motion.p variants={fadeUp} className="text-sm text-zinc-400">Join 50,000+ users on RapidFix</motion.p>
          </motion.div>

          {/* Role toggle */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 mb-5">
            {(['customer', 'worker'] as UserRole[]).map(r => (
              <motion.button key={r} type="button" onClick={() => setRole(r)}
                whileTap={{ scale: 0.96 }}
                className={cn('flex-1 rounded-md py-2 text-xs font-semibold capitalize transition-all duration-200 relative',
                  role === r ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-zinc-700'
                )}>
                {r === 'customer' ? 'Customer' : 'Worker'}
              </motion.button>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
            onClick={handleGoogle} disabled={googleLoading}
            whileHover={{ scale: 1.015, backgroundColor: '#f9f9f9' }} whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-zinc-200 bg-white py-2.5 text-sm font-medium text-zinc-900 transition-all duration-150 disabled:opacity-40 mb-4 shadow-sm"
          >
            {googleLoading ? <div className="h-4 w-4 rounded-full border border-zinc-300 border-t-zinc-700 animate-spin" />
              : <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
            }
            {googleLoading ? 'Signing up…' : 'Continue with Google'}
          </motion.button>

          <div className="divider-text mb-4">or</div>

          <motion.form
            onSubmit={handleSubmit}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } } }}
            initial="hidden" animate="show"
            className="space-y-3"
          >
            {[
              { label: 'Full name', type: 'text', val: name, set: setName, placeholder: 'Raj Kumar', icon: User },
              { label: 'Email address', type: 'email', val: email, set: setEmail, placeholder: 'you@example.com', icon: Mail },
            ].map(({ label, type, val, set, placeholder, icon: Icon }) => (
              <motion.div key={label} variants={fadeUp}>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={placeholder} className="input-base pl-9" required />
                </div>
              </motion.div>
            ))}
            <motion.div variants={fadeUp}>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" className="input-base pl-9 pr-9" required />
                <motion.button type="button" onClick={() => setShowPw(!showPw)} whileTap={{ scale: 0.85 }} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </motion.button>
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }} className="btn-primary w-full mt-1 py-2.5">
                {loading ? <><div className="h-3.5 w-3.5 rounded-full border border-white/40 border-t-white animate-spin mr-2 inline-block" />Creating account…</> : <>Create account <ArrowRight size={13} className="ml-1.5 inline" /></>}
              </motion.button>
            </motion.div>
          </motion.form>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-6 text-center text-xs text-zinc-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-zinc-900 font-medium hover:text-zinc-700 transition-colors">Sign in</Link>
          </motion.p>
          <p className="mt-4 text-center text-[11px] text-zinc-300">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-zinc-400">Terms</Link>{' '}and{' '}
            <Link href="/privacy" className="underline hover:text-zinc-400">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="h-5 w-5 rounded-full border border-zinc-300 border-t-zinc-700 animate-spin" /></div>}>
      <SignupForm />
    </Suspense>
  )
}

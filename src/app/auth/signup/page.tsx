'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { UserRole } from '@/types'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

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
    try {
      await signInWithGoogle()
    } catch (err: any) {
      toast.error(err.message || 'Google sign-up failed')
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) { toast.error('Fill all fields'); return }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await signUpWithEmail(email, password, name, role)
      setDone(true)
    } catch (err: any) {
      toast.error(err.message || 'Sign-up failed')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-base)' }}>
        <div className="w-full max-w-sm text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] mb-6">
            <CheckCircle size={24} className="text-zinc-900" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Check your email</h2>
          <p className="text-sm text-zinc-400 mb-2">We sent a verification link to</p>
          <p className="text-sm font-medium text-zinc-900 mb-8">{email}</p>
          <p className="text-xs text-zinc-400 mb-6">Click the link to activate your account, then sign in.</p>
          <Link href="/auth/login" className="btn-primary px-6 py-2.5 text-sm">Go to sign in</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 border-r border-black/[0.06] bg-zinc-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #fafafa, transparent)' }} />

        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="relative h-8 w-8"><Image src="/logo.png" alt="RapidFix" fill className="object-contain" /></div>
          <span className="text-base font-semibold text-zinc-900">RapidFix</span>
        </Link>

        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-zinc-900 leading-tight mb-4">
              Join thousands of<br />happy customers.
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              Get trusted professionals at your door in minutes. No calls, no hassle.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Verified professionals', desc: 'Every worker is background-checked and rated' },
              { title: 'Real-time tracking', desc: 'Know exactly when your worker arrives' },
              { title: 'Transparent pricing', desc: 'No hidden charges, ever' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-white/8 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">{title}</p>
                  <p className="text-xs text-zinc-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-zinc-300 relative z-10">© 2025 RapidFix. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="relative h-7 w-7"><Image src="/logo.png" alt="RapidFix" fill className="object-contain" /></div>
            <span className="text-sm font-semibold text-zinc-900">RapidFix</span>
          </Link>

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-zinc-900 mb-1.5">Create account</h1>
            <p className="text-sm text-zinc-400">Join 50,000+ users on RapidFix</p>
          </div>

          {/* Role toggle */}
          <div className="flex rounded-lg border border-black/[0.08] bg-zinc-100 p-0.5 mb-5">
            {(['customer', 'worker'] as UserRole[]).map(r => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={cn(
                  'flex-1 rounded-md py-2 text-xs font-semibold capitalize transition-all duration-150',
                  role === r ? 'bg-white text-black' : 'text-zinc-400 hover:text-zinc-900/70'
                )}>
                {r === 'customer' ? 'Customer' : 'Worker'}
              </button>
            ))}
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] py-2.5 text-sm font-medium text-zinc-900 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-150 disabled:opacity-40 mb-4">
            {googleLoading
              ? <div className="h-4 w-4 rounded-full border border-zinc-300 border-t-zinc-700 animate-spin" />
              : <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
            }
            {googleLoading ? 'Signing up…' : 'Continue with Google'}
          </button>

          <div className="divider-text mb-4">or</div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-900/50 mb-1.5">Full name</label>
              <div className="relative">
                <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Raj Kumar" className="input-base pl-9" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-900/50 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className="input-base pl-9" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-900/50 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min 6 characters" className="input-base pl-9 pr-9" required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-500 transition-colors">
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-1 py-2.5">
              {loading
                ? <><div className="h-3.5 w-3.5 rounded-full border border-white/40 border-t-white animate-spin mr-2" />Creating account…</>
                : <>Create account <ArrowRight size={13} className="ml-1.5" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-900/30">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-zinc-900 font-medium hover:text-zinc-900/80 transition-colors">Sign in</Link>
          </p>

          <p className="mt-4 text-center text-[11px] text-zinc-300">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-zinc-400">Terms</Link>{' '}and{' '}
            <Link href="/privacy" className="underline hover:text-zinc-400">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="h-5 w-5 rounded-full border border-zinc-300 border-t-zinc-700 animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}

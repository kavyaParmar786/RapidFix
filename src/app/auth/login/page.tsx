'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'

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
    try {
      await signInWithGoogle()
    } catch (err: any) {
      toast.error(err.message || 'Google sign-in failed')
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Fill all fields'); return }
    setSubmitting(true)
    setUnverified(false)
    try {
      await signInWithEmail(email, password)
      toast.success('Signed in!')
    } catch (err: any) {
      if (err?.code === 'auth/email-not-verified') {
        setUnverified(true)
      } else {
        toast.error(err.message || 'Sign-in failed')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!loading && user && profile?.role) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="text-center">
          <div className="h-5 w-5 rounded-full border border-white/20 border-t-white animate-spin mx-auto mb-3" />
          <p className="text-xs text-white/30">Redirecting…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 border-r border-white/[0.06] relative overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--bg-base), transparent)' }} />

        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="relative h-8 w-8">
            <Image src="/logo.png" alt="RapidFix" fill className="object-contain" />
          </div>
          <span className="text-base font-semibold text-white">RapidFix</span>
        </Link>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Home services,<br />on demand.
            </h2>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Book trusted professionals for any home repair in minutes. 
              Fast, reliable, and affordable.
            </p>
          </div>
          {/* Testimonial */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-3.5 w-3.5 fill-white" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              "Got my plumbing fixed in under 2 hours. The worker was professional and the app was seamless."
            </p>
            <div className="flex items-center gap-2.5 mt-4">
              <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white">P</div>
              <div>
                <p className="text-xs font-medium text-white">Priya Sharma</p>
                <p className="text-xs text-white/30">Rajkot, Gujarat</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/20 relative z-10">© 2025 RapidFix. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="relative h-7 w-7"><Image src="/logo.png" alt="RapidFix" fill className="object-contain" /></div>
            <span className="text-sm font-semibold text-white">RapidFix</span>
          </Link>

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-white mb-1.5">Sign in</h1>
            <p className="text-sm text-white/40">Welcome back to RapidFix</p>
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={googleLoading || submitting}
            className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] py-2.5 text-sm font-medium text-white hover:bg-white/[0.07] hover:border-white/20 transition-all duration-150 disabled:opacity-40 mb-4">
            {googleLoading
              ? <div className="h-4 w-4 rounded-full border border-white/20 border-t-white animate-spin" />
              : <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
            }
            {googleLoading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <div className="divider-text mb-4">or continue with email</div>

          {unverified && (
            <div className="mb-4 rounded-lg border border-yellow-500/20 bg-yellow-500/[0.06] px-3.5 py-3">
              <p className="text-xs font-medium text-yellow-300 mb-0.5">Email not verified</p>
              <p className="text-xs text-yellow-300/60">Check your inbox and click the verification link before signing in.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className="input-base pl-9" required />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-white/50">Password</label>
              </div>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className="input-base pl-9 pr-9" required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting || googleLoading} className="btn-primary w-full mt-1 py-2.5">
              {submitting
                ? <><div className="h-3.5 w-3.5 rounded-full border border-black/20 border-t-black animate-spin mr-2" />Signing in…</>
                : <>Sign in <ArrowRight size={13} className="ml-1.5" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-white/30">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-white hover:text-white/80 font-medium transition-colors">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

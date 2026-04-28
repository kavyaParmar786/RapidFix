'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { UserRole } from '@/types'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { UserProfile } from '@/types'

export default function RoleSelectPage() {
  const { user, profile, loading } = useAuth()
  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      return (sessionStorage.getItem('pendingRole') as UserRole) || 'customer'
    }
    return 'customer'
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (loading) return
    // If user already has a profile with a role, send them to their dashboard
    if (user && profile?.role) {
      window.location.href = `/dashboard/${profile.role}`
    }
    // No user at all → back to login
    if (!user && !loading) {
      window.location.href = '/auth/login'
    }
  }, [user, profile, loading])

  const handleContinue = async () => {
    if (!user) {
      toast.error('Session expired. Please sign in again.')
      window.location.href = '/auth/login'
      return
    }
    setSaving(true)
    try {
      // Check once more if profile was created by a concurrent session
      const snap = await getDoc(doc(db, 'users', user.uid))
      if (snap.exists()) {
        const existing = snap.data() as UserProfile
        window.location.href = `/dashboard/${existing.role}`
        return
      }

      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: sessionStorage.getItem('pendingName') || user.displayName,
        photoURL: user.photoURL || '',
        role,
        ...(role === 'worker' && { isAvailable: false }),
        rating: 0,
        reviewCount: 0,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      await setDoc(doc(db, 'users', user.uid), newProfile)
      sessionStorage.removeItem('pendingRole')
      sessionStorage.removeItem('pendingName')
      toast.success('Welcome to RapidFix! 🎉')
      window.location.href = `/dashboard/${role}`
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="h-8 w-8 rounded-full border-2 border-white/10 border-t-indigo-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-base)' }}>
      <div className="absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 60%)' }} />

      <div className="w-full max-w-lg text-center">
        <div className="relative h-14 w-14 mx-auto mb-6 overflow-hidden rounded-2xl bg-transparent">
          <Image src="/logo.png" alt="RapidFix" fill className="object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
          How will you use RapidFix?
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--text-secondary)' }}>
          Choose your role — you can always create a separate account later.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            {
              value: 'customer' as UserRole,
              emoji: '👤',
              title: 'Customer',
              desc: 'Post jobs and hire skilled professionals for home services.',
              gradient: 'from-indigo-500 to-blue-600',
            },
            {
              value: 'worker' as UserRole,
              emoji: '🔧',
              title: 'Worker',
              desc: 'Accept jobs, earn money, and grow your professional reputation.',
              gradient: 'from-violet-500 to-purple-700',
            },
          ].map((opt) => (
            <button key={opt.value} onClick={() => setRole(opt.value)}
              className={cn(
                'glass-card p-6 text-left transition-all duration-300',
                role === opt.value ? 'border-indigo-500/60 shadow-lg shadow-indigo-500/20' : 'hover:border-white/20'
              )}>
              <div className={cn('h-12 w-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl mb-4', opt.gradient)}>
                {opt.emoji}
              </div>
              <h3 className="font-bold text-white mb-1" style={{ fontFamily: 'var(--font-syne)' }}>{opt.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{opt.desc}</p>
              {role === opt.value && (
                <div className="mt-3 h-0.5 w-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              )}
            </button>
          ))}
        </div>

        <button onClick={handleContinue} disabled={saving}
          className="btn-primary mx-auto flex items-center gap-2 px-8 py-3.5">
          {saving
            ? <><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Setting up…</>
            : <> Continue <ArrowRight size={16} /></>}
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { UserRole } from '@/types'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { ArrowRight, Check } from 'lucide-react'
import Image from 'next/image'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { UserProfile } from '@/types'
import { motion } from 'framer-motion'
import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler'

const ROLES = [
  {
    value: 'customer' as UserRole,
    title: 'Customer',
    desc: 'Post jobs and hire skilled professionals for home services.',
    gradient: 'linear-gradient(135deg, #3f4a6b 0%, #2563eb 100%)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    value: 'worker' as UserRole,
    title: 'Worker',
    desc: 'Accept jobs, earn money, and grow your professional reputation.',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
]

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
    if (user && profile?.role) {
      window.location.href = `/dashboard/${profile.role}`
    }
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
        <div className="h-8 w-8 rounded-full border-2 border-[var(--border-default)] border-t-indigo-500 animate-spin" />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 60%)' }}
      />

      {/* Theme toggler — top right */}
      <div className="absolute top-5 right-5">
        <ThemeTogglerButton modes={['light', 'dark']} size="sm" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-14 w-14 mx-auto mb-6 overflow-hidden rounded-2xl"
        >
          <Image src="/logo.png" alt="RapidFix" fill className="object-contain" />
        </motion.div>

        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}
        >
          How will you use RapidFix?
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--text-secondary)' }}>
          Choose your role — you can always create a separate account later.
        </p>

        {/* Role Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {ROLES.map((opt, i) => {
            const isSelected = role === opt.value
            return (
              <motion.button
                key={opt.value}
                onClick={() => setRole(opt.value)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.97 }}
                className="relative p-6 text-left rounded-2xl border outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: isSelected ? 'rgba(99,102,241,0.65)' : 'var(--border-default)',
                  boxShadow: isSelected
                    ? '0 0 0 3px rgba(99,102,241,0.12), 0 8px 32px rgba(99,102,241,0.15)'
                    : '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              >
                {/* Selected check badge */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute top-3 right-3 h-5 w-5 rounded-full flex items-center justify-center"
                    style={{ background: '#6366f1' }}
                  >
                    <Check size={11} strokeWidth={3} color="white" />
                  </motion.div>
                )}

                {/* Icon */}
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: opt.gradient }}
                >
                  {opt.icon}
                </div>

                {/* Title */}
                <h3
                  className="font-bold mb-1.5 text-base"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}
                >
                  {opt.title}
                </h3>

                {/* Description */}
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {opt.desc}
                </p>

                {/* Active indicator bar */}
                <motion.div
                  initial={false}
                  animate={{ scaleX: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 h-0.5 w-full rounded-full origin-left"
                  style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
                />
              </motion.button>
            )
          })}
        </div>

        {/* Continue Button */}
        <motion.button
          onClick={handleContinue}
          disabled={saving}
          whileHover={{ scale: saving ? 1 : 1.02 }}
          whileTap={{ scale: saving ? 1 : 0.97 }}
          className="mx-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-opacity duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'var(--accent)',
            color: 'var(--bg-base)',
            minWidth: '180px',
          }}
        >
          {saving ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
              Setting up…
            </>
          ) : (
            <>
              Continue <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  )
}

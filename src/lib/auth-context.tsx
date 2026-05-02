'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useSession, signIn, signOut, signUp } from '@/lib/auth-client'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { UserProfile, UserRole } from '@/types'

interface AuthContextType {
  user: { uid: string; email: string; displayName: string; photoURL: string } | null
  profile: UserProfile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, name: string, role: UserRole, extras?: { acceptedTermsAt?: string; referredBy?: string }) => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  refreshProfile: () => Promise<void>
  resendVerificationEmail: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  const user = session?.user
    ? {
        uid: session.user.id,
        email: session.user.email ?? '',
        displayName: session.user.name ?? 'User',
        photoURL: session.user.image ?? '',
      }
    : null

  const loading = isPending || profileLoading

  const fetchProfile = useCallback(async (uid: string) => {
    try {
      const snap = await getDoc(doc(db, 'users', uid))
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile)
        return snap.data() as UserProfile
      }
    } catch (err) {
      console.error('fetchProfile error:', err)
    }
    return null
  }, [])

  useEffect(() => {
    if (isPending) return
    if (!session?.user) {
      setProfile(null)
      setProfileLoading(false)
      return
    }
    setProfileLoading(true)
    fetchProfile(session.user.id).finally(() => {
      setProfileLoading(false)
      // Register FCM token after login so worker gets push when jobs appear
      import('@/lib/firebase').then(({ requestFCMToken }) => {
        requestFCMToken(session.user.id).catch(() => {/* silently ignore if blocked */})
      })
    })
  }, [isPending, session, fetchProfile])

  const signInWithGoogle = async () => {
    await signIn.social({ provider: 'google', callbackURL: '/sso-callback' })
  }

  const signInWithEmail = async (email: string, password: string) => {
    const res = await signIn.email({ email, password })
    if (res.error) throw new Error(res.error.message || 'Sign-in failed')
  }

  const signUpWithEmail = async (email: string, password: string, name: string, role: UserRole, extras?: { acceptedTermsAt?: string; referredBy?: string }) => {
    sessionStorage.setItem('pendingRole', role)
    sessionStorage.setItem('pendingName', name)
    if (extras?.acceptedTermsAt) sessionStorage.setItem('acceptedTermsAt', extras.acceptedTermsAt)
    if (extras?.referredBy) sessionStorage.setItem('referredBy', extras.referredBy)
    const res = await signUp.email({ email, password, name, callbackURL: '/auth/role-select' })
    if (res.error) throw new Error(res.error.message || 'Sign-up failed')
  }

  const logout = async () => {
    setProfile(null)
    await signOut()
  }

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return
    const updated = { ...data, updatedAt: new Date().toISOString() }
    await setDoc(doc(db, 'users', user.uid), updated, { merge: true })
    setProfile((prev) => (prev ? { ...prev, ...updated } : null))
  }

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.uid)
  }

  const resendVerificationEmail = async () => {}

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      signInWithGoogle, signInWithEmail, signUpWithEmail,
      logout, updateUserProfile, refreshProfile, resendVerificationEmail,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

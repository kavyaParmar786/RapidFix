'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'

/**
 * Better Auth redirects here after Google OAuth.
 * Session is already set — just check profile and forward.
 */
export default function SSOCallback() {
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (user && profile?.role) {
      window.location.href = `/dashboard/${profile.role}`
    } else if (user && !profile) {
      window.location.href = '/auth/role-select'
    }
  }, [user, profile, loading])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <div className="text-center">
        <div className="h-10 w-10 rounded-full border-2 border-black/10 border-t-indigo-500 animate-spin mx-auto mb-4" />
        <p className="text-sm text-zinc-500">Completing sign in…</p>
      </div>
    </div>
  )
}

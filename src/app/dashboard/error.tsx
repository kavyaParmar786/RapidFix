'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
        <AlertTriangle size={28} className="text-amber-400" />
      </div>
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
        Dashboard failed to load
      </h2>
      <p className="text-sm text-[var(--text-secondary)] max-w-xs mb-6">
        Something went wrong in your dashboard. The rest of the app is still working fine.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
        >
          <RefreshCw size={14} /> Try again
        </button>
        <Link href="/" className="flex items-center gap-2 rounded-xl border border-[var(--border-default)] px-5 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          Go home
        </Link>
      </div>
    </div>
  )
}

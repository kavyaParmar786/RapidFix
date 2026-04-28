import { cn } from '@/lib/utils'

export default function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-8 w-8 rounded-full border-2 border-white/10 border-t-indigo-500 animate-spin',
        className
      )}
    />
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <div className="text-center">
        <Spinner className="mx-auto mb-4" />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</p>
      </div>
    </div>
  )
}

import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="relative h-16 w-16 mb-6">
        <Image src="/logo.png" alt="RapidFix" fill className="object-contain opacity-60" />
      </div>
      <h1
        className="text-7xl font-bold mb-4 text-zinc-900"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        404
      </h1>
      <p className="text-xl font-semibold text-zinc-900 mb-2">Page Not Found</p>
      <p className="text-sm max-w-xs mb-8" style={{ color: 'var(--text-secondary)' }}>
        Looks like this page went missing. Let's get you back on track.
      </p>
      <Link href="/" className="btn-primary">
        ← Back to Home
      </Link>
    </div>
  )
}

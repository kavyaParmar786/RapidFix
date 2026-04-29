import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 bg-zinc-50 border-t border-zinc-100">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-zinc-900 tracking-tight mb-4">
          Ready to get started?
        </h2>
        <p className="text-base text-zinc-400 max-w-md mx-auto mb-10">
          Post your first job for free, or sign up as a worker and start earning today. No fees to join.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/auth/signup" className="btn-primary rounded-full px-7 py-3 text-sm flex items-center gap-2 shadow-sm">
            Post a job — it's free <ArrowRight size={14} />
          </Link>
          <Link href="/auth/signup?role=worker" className="btn-ghost rounded-full px-7 py-3 text-sm">
            Become a worker
          </Link>
        </div>
        <p className="mt-6 text-xs text-zinc-300">No credit card required · Free to post · Pay only when done</p>
      </div>
    </section>
  )
}

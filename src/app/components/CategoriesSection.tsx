'use client'

import Link from 'next/link'
import { ArrowRight, Zap, Droplets, Hammer, PaintBucket, Wind, Settings2, Bug, Shield, Sparkles, Trash2 } from 'lucide-react'

const CATS = [
  { icon: Zap, label: 'Electrician', slug: 'electrician', desc: 'Wiring, fuse, lights' },
  { icon: Droplets, label: 'Plumber', slug: 'plumber', desc: 'Leaks, pipes, drains' },
  { icon: Hammer, label: 'Carpenter', slug: 'carpenter', desc: 'Furniture, doors' },
  { icon: PaintBucket, label: 'Painter', slug: 'painter', desc: 'Interior & exterior' },
  { icon: Wind, label: 'AC Repair', slug: 'ac-repair', desc: 'Install, service, gas' },
  { icon: Settings2, label: 'Appliance Repair', slug: 'appliance-repair', desc: 'Washer, fridge, TV' },
  { icon: Bug, label: 'Pest Control', slug: 'pest-control', desc: 'Cockroach, rats, ants' },
  { icon: Shield, label: 'Security', slug: 'security', desc: 'CCTV, smart locks' },
  { icon: Sparkles, label: 'Cleaning', slug: 'cleaning', desc: 'Home deep clean' },
  { icon: Trash2, label: 'Other', slug: 'other', desc: 'Anything else' },
]

export default function CategoriesSection() {
  return (
    <section id="categories" className="py-20 bg-white border-t border-zinc-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Services</p>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Every home service,<br />one platform.</h2>
          </div>
          <Link href="/auth/signup" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATS.map(({ icon: Icon, label, slug, desc }) => (
            <Link key={slug} href={`/services/${slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm hover:border-zinc-300 hover:shadow-md transition-all duration-200">
              <div className="h-9 w-9 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                <Icon size={16} className="text-zinc-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">{label}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

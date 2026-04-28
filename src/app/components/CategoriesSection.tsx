'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/utils'

export default function CategoriesSection() {
  return (
    <section id="categories" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
            What we offer
          </p>
          <h2 className="section-title text-white mb-4">
            Every Home Service,{' '}
            <span className="gradient-text">One Platform</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            From electrical emergencies to routine maintenance, find skilled professionals for every need.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href="/auth/signup"
              className="glass-card group flex flex-col items-center gap-3 p-5 text-center transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
            >
              <div
                className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                {cat.icon}
              </div>
              <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Browse all services
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}

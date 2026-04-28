'use client'

import { FileText, UserCheck, MessageCircle, Star } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: FileText,
    title: 'Post Your Job',
    desc: 'Describe your problem, choose a category, set your budget, and upload photos if needed. Takes less than 2 minutes.',
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    num: '02',
    icon: UserCheck,
    title: 'Worker Accepts',
    desc: 'A verified professional in your area sees your job and accepts it. Once accepted, it\'s locked — no bidding wars.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    num: '03',
    icon: MessageCircle,
    title: 'Chat & Coordinate',
    desc: 'A private real-time chat opens between you and the worker. Discuss details, share images, set a time.',
    gradient: 'from-cyan-500 to-teal-600',
  },
  {
    num: '04',
    icon: Star,
    title: 'Job Done & Rate',
    desc: 'Worker completes the job. Mark it as done and leave a review. Build a trusted community.',
    gradient: 'from-amber-500 to-orange-600',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
            Simple process
          </p>
          <h2 className="section-title text-white mb-4">
            How <span className="gradient-text">RapidFix</span> Works
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Getting your home repaired has never been simpler. Four easy steps from problem to solved.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px -translate-y-1/2 z-0"
                  style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.4), rgba(99,102,241,0.1))' }}
                />
              )}

              <div className="glass-card p-6 relative z-10 h-full transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
                {/* Number + icon */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                    <step.icon size={22} className="text-white" />
                  </div>
                  <span
                    className="text-4xl font-bold opacity-20 text-white"
                    style={{ fontFamily: 'var(--font-syne)' }}
                  >
                    {step.num}
                  </span>
                </div>

                <h3
                  className="text-lg font-bold text-white mb-2"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

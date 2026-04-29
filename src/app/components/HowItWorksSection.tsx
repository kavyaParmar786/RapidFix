'use client'

import { FileText, UserCheck, MessageCircle, Star } from 'lucide-react'

const STEPS = [
  { num: '01', icon: FileText, title: 'Post your job', desc: 'Describe what you need, add photos, set a budget. Takes under 2 minutes.' },
  { num: '02', icon: UserCheck, title: 'Worker accepts', desc: 'A verified professional near you sees and accepts your job instantly.' },
  { num: '03', icon: MessageCircle, title: 'Chat & coordinate', desc: 'Real-time chat opens between you. Discuss details, share images, agree on time.' },
  { num: '04', icon: Star, title: 'Job done & rate', desc: 'Worker completes the job. Pay and leave a review to help the community.' },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-zinc-50 border-t border-zinc-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Process</p>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">How RapidFix works</h2>
          <p className="text-sm text-zinc-400 mt-3 max-w-md mx-auto">From posting a job to getting it done in 4 simple steps.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map(({ num, icon: Icon, title, desc }, i) => (
            <div key={num} className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-2 w-4 h-px bg-zinc-200 z-10" />
              )}
              <div className="flex items-center justify-between mb-5">
                <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                  <Icon size={17} className="text-zinc-600" />
                </div>
                <span className="text-3xl font-black text-zinc-100 select-none">{num}</span>
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1.5">{title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

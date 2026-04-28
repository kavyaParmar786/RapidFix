import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
export default function CareersPage() {
  return (
    <><Navbar />
    <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20">
        <p className="text-xs font-medium text-white/25 uppercase tracking-widest mb-4">Careers</p>
        <h1 className="text-3xl font-bold text-white mb-4">Work at RapidFix</h1>
        <p className="text-sm text-white/40 leading-relaxed mb-8">We're a small, fast-moving team building India's best home services platform. If you're passionate about great products, we'd love to hear from you.</p>
        <a href="mailto:kavyaparmar7866@gmail.com" className="btn-primary px-6 py-2.5 text-sm inline-flex">Send us your resume</a>
        <div className="mt-8"><Link href="/" className="btn-ghost text-xs px-4 py-2">← Back home</Link></div>
      </div>
    </div><Footer /></>
  )
}

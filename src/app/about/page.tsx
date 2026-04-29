import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
export default function AboutPage() {
  return (
    <><Navbar />
    <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">Company</p>
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">About RapidFix</h1>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">RapidFix is a home services marketplace based in Rajkot, Gujarat, India. We connect skilled local professionals with customers who need reliable, fast, and affordable services.</p>
        <p className="text-sm text-zinc-400 leading-relaxed mb-8">Our mission is simple: make hiring a trusted professional as easy as ordering food online.</p>
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 mb-8">
          <p className="text-xs text-zinc-400 mb-1">Get in touch</p>
          <a href="mailto:kavyaparmar7866@gmail.com" className="text-sm text-zinc-900 hover:text-zinc-600 transition-colors">kavyaparmar7866@gmail.com</a>
          <br />
          <a href="tel:+919409405573" className="text-sm text-zinc-900 hover:text-zinc-600 transition-colors">+91 94094 05573</a>
        </div>
        <Link href="/" className="btn-ghost text-xs px-4 py-2">← Back home</Link>
      </div>
    </div><Footer /></>
  )
}

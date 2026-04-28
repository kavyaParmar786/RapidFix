import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
export default function TermsPage() {
  return (
    <><Navbar />
    <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20">
        <h1 className="text-3xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-sm text-white/40 leading-relaxed mb-4">By using RapidFix you agree to use the platform responsibly. We connect customers with independent service professionals and are not responsible for the conduct of either party.</p>
        <p className="text-sm text-white/40 leading-relaxed mb-8">For full terms or any questions, contact us at <a href="mailto:kavyaparmar7866@gmail.com" className="text-white hover:underline">kavyaparmar7866@gmail.com</a></p>
        <Link href="/" className="btn-ghost text-xs px-4 py-2">← Back home</Link>
      </div>
    </div><Footer /></>
  )
}

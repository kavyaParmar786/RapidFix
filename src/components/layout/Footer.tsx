'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Github, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06]" style={{ background: 'var(--bg-base)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative h-7 w-7">
                <Image src="/logo.png" alt="RapidFix" fill className="object-contain" />
              </div>
              <span className="text-sm font-semibold text-white">RapidFix</span>
            </Link>
            <p className="text-xs leading-relaxed text-white/35 mb-5 max-w-[200px]">
              Connecting skilled professionals with customers who need them. Fast, reliable, affordable.
            </p>
            <div className="flex items-center gap-2">
              {[
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Github, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white hover:border-white/20 hover:bg-white/[0.07] transition-all">
                  <Icon size={12} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Electrician', href: '/services/electrician' },
                { label: 'Plumber', href: '/services/plumber' },
                { label: 'Carpenter', href: '/services/carpenter' },
                { label: 'Painter', href: '/services/painter' },
                { label: 'AC Repair', href: '/services/ac-repair' },
                { label: 'Appliance Repair', href: '/services/appliance-repair' },
                { label: 'Pest Control', href: '/services/pest-control' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-white/35 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'How it Works', href: '/#how-it-works' },
                { label: 'Become a Worker', href: '/auth/signup?role=worker' },
                { label: 'Post a Job', href: '/auth/signup' },
                { label: 'Careers', href: '/careers' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-white/35 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              {[
                { icon: Phone, text: '+91 94094 05573', href: 'tel:+919409405573' },
                { icon: Mail, text: 'kavyaparmar7866@gmail.com', href: 'mailto:kavyaparmar7866@gmail.com' },
                { icon: MapPin, text: 'Rajkot, Gujarat, India', href: '#' },
              ].map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  <a href={href} className="flex items-start gap-2.5 text-xs text-white/35 hover:text-white transition-colors">
                    <Icon size={12} className="mt-0.5 shrink-0 text-white/25" />
                    <span className="break-all">{text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/20">© {new Date().getFullYear()} RapidFix. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms', 'Cookies'].map(l => (
              <Link key={l} href={`/${l.toLowerCase().replace(' ', '-')}`} className="text-[11px] text-white/20 hover:text-white/50 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

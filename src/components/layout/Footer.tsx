'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Github, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative h-6 w-6"><Image src="/logo.png" alt="RapidFix" fill className="object-contain" /></div>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>RapidFix</span>
            </Link>
            <p className="text-xs leading-relaxed mb-5 max-w-[200px]" style={{ color: 'var(--text-muted)' }}>
              Connecting skilled professionals with customers. Fast, reliable, affordable.
            </p>
            <div className="flex items-center gap-2">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#"
                  className="flex h-7 w-7 items-center justify-center rounded-lg transition-all"
                  style={{ border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
                >
                  <Icon size={12} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Services</h4>
            <ul className="space-y-2.5">
              {['Electrician','Plumber','Carpenter','Painter','AC Repair','Appliance Repair','Pest Control'].map(s => (
                <li key={s}>
                  <Link href={`/services/${s.toLowerCase().replace(' ','-')}`}
                    className="text-xs transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  >{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'How it Works', href: '/how-it-works' },
                { label: 'Become a Worker', href: '/auth/signup?role=worker' },
                { label: 'Careers', href: '/careers' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-xs transition-colors" style={{ color: 'var(--text-muted)' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Contact</h4>
            <ul className="space-y-3">
              {[
                { icon: Phone,  text: '+91 94094 05573',            href: 'tel:+919409405573' },
                { icon: Mail,   text: 'kavyaparmar7866@gmail.com',  href: 'mailto:kavyaparmar7866@gmail.com' },
                { icon: MapPin, text: 'Rajkot, Gujarat, India',     href: '#' },
              ].map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  <a href={href} className="flex items-start gap-2.5 text-xs transition-colors" style={{ color: 'var(--text-muted)' }}>
                    <Icon size={12} className="mt-0.5 shrink-0" /><span className="break-all">{text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} RapidFix. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms', 'Cookies'].map(l => (
              <Link key={l} href={`/${l.toLowerCase().replace(' ','-')}`}
                className="text-[11px] transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

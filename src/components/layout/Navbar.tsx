'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  Bell, Menu, X, LogOut, User, LayoutDashboard,
  ChevronDown, Zap, Droplets, Hammer, PaintBucket,
  Wind, Settings2, Bug, Shield, Sparkles,
  Settings,
  Share2, Copy, Check
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { subscribeToNotifications } from '@/lib/firestore'
import { Notification } from '@/types'
import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler'

const SERVICES = [
  { label: 'Electrician', icon: Zap, href: '/services/electrician', desc: 'Wiring, fuse, lights' },
  { label: 'Plumber', icon: Droplets, href: '/services/plumber', desc: 'Pipes, leaks, drains' },
  { label: 'Carpenter', icon: Hammer, href: '/services/carpenter', desc: 'Furniture, doors' },
  { label: 'Painter', icon: PaintBucket, href: '/services/painter', desc: 'Interior & exterior' },
  { label: 'AC Repair', icon: Wind, href: '/services/ac-repair', desc: 'Install, service, gas' },
  { label: 'Appliance Repair', icon: Settings2, href: '/services/appliance-repair', desc: 'Washer, fridge, more' },
  { label: 'Pest Control', icon: Bug, href: '/services/pest-control', desc: 'Cockroach, rats, ants' },
  { label: 'Security', icon: Shield, href: '/services/security', desc: 'CCTV, smart locks' },
]

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -6 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.95, y: -6, transition: { duration: 0.12 } },
}

function ShareButton() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const platforms = [
    { label: 'Twitter / X', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=Check out RapidFix!`, emoji: '🐦' },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, emoji: '📘' },
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent('Check out RapidFix: ' + (typeof window !== 'undefined' ? window.location.href : ''))}`, emoji: '💬' },
  ]

  return (
    <div ref={ref} className="relative">
      <motion.button onClick={() => setOpen(!open)} whileTap={{ scale: 0.9 }}
        className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-[var(--bg-base)]/10 hover:text-white transition-colors">
        <Share2 size={14} />
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div variants={dropdownVariants} initial="hidden" animate="show" exit="exit"
            className="absolute right-0 top-full mt-3 w-52 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] shadow-xl p-2 origin-top-right z-50">
            <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-2 py-1">Share</p>
            {platforms.map(({ label, href, emoji }, i) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
                onClick={() => setOpen(false)}>
                <span className="text-base">{emoji}</span> {label}
              </motion.a>
            ))}
            <div className="my-1 h-px bg-[var(--border-subtle)]" />
            <button onClick={handleCopy}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors">
              {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ThemeToggle() {
  return <ThemeTogglerButton modes={['light', 'dark', 'dynamic']} size="sm" />
}

function SettingsPanel({ onClose }: { onClose: () => void }) {
  const [notifs, setNotifs] = useState(true)
  const [publicProfile, setPublicProfile] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <motion.button onClick={() => onChange(!value)}
      className={cn('relative w-9 h-5 rounded-full transition-colors duration-200', value ? 'bg-[var(--accent)]' : 'bg-[var(--bg-overlay)]')}>
      <motion.div animate={{ x: value ? 16 : 2 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-0.5 h-4 w-4 rounded-full bg-[var(--bg-base)] shadow" />
    </motion.button>
  )

  return (
    <motion.div variants={dropdownVariants} initial="hidden" animate="show" exit="exit"
      className="absolute right-0 top-full mt-3 w-[280px] rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] shadow-2xl shadow-black/15 p-4 origin-top-right z-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings size={14} className="text-[var(--text-muted)]" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">Settings</span>
        </div>
        <button onClick={onClose} className="h-6 w-6 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] transition-colors">
          <X size={12} />
        </button>
      </div>
      <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Appearance</p>
      <ThemeToggle />
      <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 mt-4">Notifications</p>
      <div className="space-y-1">
        {[
          { label: 'Push notifications', value: notifs, set: setNotifs },
          { label: 'Email alerts', value: emailAlerts, set: setEmailAlerts },
        ].map(({ label, value, set }) => (
          <div key={label} className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[var(--bg-surface)] transition-colors">
            <span className="text-xs text-[var(--text-primary)]">{label}</span>
            <Toggle value={value} onChange={set} />
          </div>
        ))}
      </div>
      <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 mt-4">Privacy</p>
      <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[var(--bg-surface)] transition-colors">
        <span className="text-xs text-[var(--text-primary)]">Public profile</span>
        <Toggle value={publicProfile} onChange={setPublicProfile} />
      </div>
      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
        <p className="text-[10px] text-[var(--text-muted)] text-center">
          RapidFix v0.1.0 · <Link href="/privacy" className="underline">Privacy</Link> · <Link href="/terms" className="underline">Terms</Link>
        </p>
      </div>
    </motion.div>
  )
}

export default function Navbar() {
  const { user, profile, logout } = useAuth()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const userMenuRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!user) return
    return subscribeToNotifications(user.uid, setNotifications)
  }, [user])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length
  const handleLogout = async () => { await logout(); window.location.href = '/' }
  const isWorker = profile?.role === 'worker'

  const anyDropdownOpen = servicesOpen || userMenuOpen || notifOpen || settingsOpen

  return (
    <>
      {/* ── Backdrop blur overlay when any dropdown is open ── */}
      <AnimatePresence>
        {anyDropdownOpen && (
          <motion.div
            key="nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 pointer-events-none"
            style={{
              backdropFilter: 'blur(6px) saturate(120%)',
              WebkitBackdropFilter: 'blur(6px) saturate(120%)',
              background: 'rgba(0,0,0,0.18)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Desktop: Dynamic Island floating pill ── */}
      <div className="fixed top-4 left-0 right-0 z-50 hidden md:flex justify-center px-4 pointer-events-none">
        <motion.nav
          initial={{ y: -20, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: scrolled ? 'rgba(9,9,11,0.88)' : 'rgba(9,9,11,0.72)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: scrolled
              ? '0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05)'
              : '0 4px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05)',
          }}
          className="pointer-events-auto flex items-center gap-0.5 rounded-full px-2.5 py-2 transition-all duration-500"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 mr-1 px-2.5 py-1 rounded-full hover:bg-[var(--bg-base)]/10 transition-colors">
            <div className="relative h-5 w-5">
              <Image src="/logo.png" alt="RapidFix" fill className="object-contain" />
            </div>
            <span className="text-[13px] font-semibold text-white tracking-tight">RapidFix</span>
          </Link>

          <div className="w-px h-4 bg-white/15 mx-1.5" />

          {/* Services dropdown */}
          <div ref={servicesRef} className="relative">
            <motion.button onClick={() => setServicesOpen(!servicesOpen)} whileTap={{ scale: 0.97 }}
              className={cn('flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
                servicesOpen ? 'bg-white/15 text-white' : 'text-white/65 hover:text-white hover:bg-[var(--bg-base)]/10')}>
              Services
              <motion.span animate={{ rotate: servicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={11} />
              </motion.span>
            </motion.button>
            <AnimatePresence>
              {servicesOpen && (
                <motion.div variants={dropdownVariants} initial="hidden" animate="show" exit="exit"
                  className="absolute left-0 top-full mt-3 w-[420px] rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] shadow-xl shadow-black/10 p-3 origin-top-left">
                  <div className="grid grid-cols-2 gap-1">
                    {SERVICES.map(({ label, icon: Icon, href, desc }, i) => (
                      <motion.div key={label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <Link href={href} onClick={() => setServicesOpen(false)}
                          className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-[var(--bg-surface)] transition-colors">
                          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: 'spring', stiffness: 300 }}
                            className="h-8 w-8 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center shrink-0">
                            <Icon size={14} className="text-[var(--text-secondary)]" />
                          </motion.div>
                          <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
                            <p className="text-xs text-[var(--text-muted)]">{desc}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-[var(--border-subtle)]">
                    <Link href="/how-it-works" onClick={() => setServicesOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[var(--bg-surface)] transition-colors">
                      <Sparkles size={13} className="text-[var(--text-muted)]" />
                      <span className="text-sm font-medium text-[var(--text-secondary)]">How RapidFix works</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/how-it-works"
            className={cn('rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
              pathname === '/how-it-works' ? 'bg-white/15 text-white' : 'text-white/65 hover:text-white hover:bg-[var(--bg-base)]/10')}>
            How it Works
          </Link>

          {isWorker && (
            <Link href="/jobs/browse"
              className={cn('rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
                pathname === '/jobs/browse' ? 'bg-white/15 text-white' : 'text-white/65 hover:text-white hover:bg-[var(--bg-base)]/10')}>
              Browse Jobs
            </Link>
          )}

          <Link href="/auth/signup?role=worker"
            className="rounded-full px-3 py-1.5 text-[13px] font-medium text-white/65 hover:text-white hover:bg-[var(--bg-base)]/10 transition-colors">
            Become a Worker
          </Link>

          <div className="w-px h-4 bg-white/15 mx-1.5" />

          {/* Right actions */}
          {user && profile ? (
            <>
              <ShareButton />

              <div ref={notifRef} className="relative">
                <motion.button onClick={() => setNotifOpen(!notifOpen)} whileTap={{ scale: 0.9 }}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-[var(--bg-base)]/10 hover:text-white transition-colors">
                  <Bell size={14} />
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--bg-base)]" />
                    )}
                  </AnimatePresence>
                </motion.button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div variants={dropdownVariants} initial="hidden" animate="show" exit="exit"
                      className="absolute right-0 top-full mt-3 w-72 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] shadow-xl overflow-hidden origin-top-right">
                      <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Notifications</p>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0
                          ? <p className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">All caught up!</p>
                          : notifications.map((n) => (
                            <div key={n.id} className={cn('px-4 py-3 border-b border-[var(--border-subtle)] last:border-0', !n.read && 'bg-[var(--bg-surface)]')}>
                              <p className="text-sm font-medium text-[var(--text-primary)]">{n.title}</p>
                              <p className="text-xs text-[var(--text-muted)] mt-0.5">{n.body}</p>
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div ref={settingsRef} className="relative">
                <motion.button onClick={() => setSettingsOpen(!settingsOpen)} whileTap={{ scale: 0.9 }}
                  className={cn('flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                    settingsOpen ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-[var(--bg-base)]/10 hover:text-white')}>
                  <motion.span animate={{ rotate: settingsOpen ? 90 : 0 }} transition={{ duration: 0.25, type: 'spring' }}>
                    <Settings size={14} />
                  </motion.span>
                </motion.button>
                <AnimatePresence>
                  {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
                </AnimatePresence>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link href={`/dashboard/${profile.role}`}
                  className={cn('flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
                    pathname.startsWith('/dashboard') ? 'bg-white/20 text-white' : 'text-white/65 hover:text-white hover:bg-[var(--bg-base)]/10')}>
                  <LayoutDashboard size={12} /> Dashboard
                </Link>
              </motion.div>

              <div ref={userMenuRef} className="relative ml-0.5">
                <motion.button onClick={() => setUserMenuOpen(!userMenuOpen)} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 pl-1 pr-2.5 py-1 transition-all hover:bg-[var(--bg-base)]/15 hover:border-white/25">
                  <div className="h-6 w-6 rounded-full overflow-hidden bg-white/20 flex items-center justify-center shrink-0">
                    {profile.photoURL
                      ? <Image src={profile.photoURL} alt="" width={24} height={24} className="object-cover" />
                      : <span className="text-[10px] font-bold text-white">{profile.displayName?.[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <span className="text-[12px] font-medium text-white/80 max-w-[72px] truncate">{profile.displayName}</span>
                  <motion.span animate={{ rotate: userMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={10} className="text-white/50" />
                  </motion.span>
                </motion.button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div variants={dropdownVariants} initial="hidden" animate="show" exit="exit"
                      className="absolute right-0 top-full mt-3 w-44 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] shadow-xl p-1.5 origin-top-right">
                      {[
                        { href: '/profile', icon: User, label: 'Profile' },
                        { href: `/dashboard/${profile.role}`, icon: LayoutDashboard, label: 'Dashboard' },
                      ].map(({ href, icon: Icon, label }, i) => (
                        <motion.div key={label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                          <Link href={href} onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors">
                            <Icon size={13} /> {label}
                          </Link>
                        </motion.div>
                      ))}
                      <div className="my-1 h-px bg-[var(--border-subtle)]" />
                      <motion.button onClick={handleLogout} whileHover={{ backgroundColor: 'rgba(239,68,68,0.08)' }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-500 transition-colors">
                        <LogOut size={13} /> Sign out
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <ShareButton />
              <Link href="/auth/login"
                className="text-[13px] font-medium text-white/65 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-[var(--bg-base)]/10">
                Sign in
              </Link>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/auth/signup"
                  className="rounded-full bg-[var(--bg-base)] text-[#09090b] px-4 py-1.5 text-[13px] font-semibold transition-all hover:bg-[var(--bg-base)]/90">
                  Get started →
                </Link>
              </motion.div>
            </>
          )}
        </motion.nav>
      </div>

      {/* Spacer so page content clears the floating pill */}
      <div className="hidden md:block h-20" />

      {/* ── Mobile backdrop blur ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 pointer-events-none md:hidden"
            style={{
              backdropFilter: 'blur(8px) saturate(120%)',
              WebkitBackdropFilter: 'blur(8px) saturate(120%)',
              background: 'rgba(0,0,0,0.2)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile: classic top bar ── */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-14 items-center gap-4">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="relative h-6 w-6">
                <Image src="/logo.png" alt="RapidFix" fill className="object-contain" />
              </div>
              <span className="text-[15px] font-semibold text-[var(--text-primary)] tracking-tight">RapidFix</span>
            </Link>
            <motion.button whileTap={{ scale: 0.9 }}
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)]"
              onClick={() => setMobileOpen(!mobileOpen)}>
              <AnimatePresence mode="wait">
                {mobileOpen
                  ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={15} /></motion.span>
                  : <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={15} /></motion.span>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-3 space-y-0.5 overflow-hidden">
              {SERVICES.map(({ label, href }, i) => (
                <motion.div key={label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link href={href} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]">{label}</Link>
                </motion.div>
              ))}
              <div className="h-px bg-[var(--border-subtle)] my-2" />
              <Link href="/how-it-works" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]">How it Works</Link>
              {isWorker && <Link href="/jobs/browse" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]">Browse Jobs</Link>}
              {user && profile ? (
                <>
                  <Link href={`/dashboard/${profile.role}`} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]">Dashboard</Link>
                  <button onClick={handleLogout} className="block w-full text-left rounded-lg px-3 py-2.5 text-sm text-red-500">Sign out</button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link href="/auth/login" className="btn-ghost flex-1 text-center text-sm py-2">Sign in</Link>
                  <Link href="/auth/signup" className="btn-primary flex-1 text-center text-sm py-2 rounded-full">Get started</Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}

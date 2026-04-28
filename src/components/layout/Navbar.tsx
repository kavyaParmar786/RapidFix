'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  Bell, Menu, X, LogOut, User, LayoutDashboard,
  ChevronDown, Briefcase, Wrench, Zap, Droplets,
  Hammer, PaintBucket, Wind, Settings2, Bug, Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { subscribeToNotifications } from '@/lib/firestore'
import { Notification } from '@/types'

const SERVICES = [
  { label: 'Electrician', icon: Zap, href: '/services/electrician' },
  { label: 'Plumber', icon: Droplets, href: '/services/plumber' },
  { label: 'Carpenter', icon: Hammer, href: '/services/carpenter' },
  { label: 'Painter', icon: PaintBucket, href: '/services/painter' },
  { label: 'AC Repair', icon: Wind, href: '/services/ac-repair' },
  { label: 'Appliance Repair', icon: Settings2, href: '/services/appliance-repair' },
  { label: 'Pest Control', icon: Bug, href: '/services/pest-control' },
  { label: 'Security', icon: Shield, href: '/services/security' },
]

export default function Navbar() {
  const { user, profile, logout } = useAuth()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const userMenuRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!user) return
    return subscribeToNotifications(user.uid, setNotifications)
  }, [user])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  const isWorker = profile?.role === 'worker'

  return (
    <>
      <nav className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
        scrolled
          ? 'border-b border-white/[0.07] bg-[#0a0a0a]/90 backdrop-blur-xl'
          : 'bg-transparent'
      )}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="relative h-7 w-7">
                <Image src="/logo.png" alt="RapidFix" fill className="object-contain" />
              </div>
              <span className="text-[15px] font-semibold text-white tracking-tight" style={{ fontFamily: 'var(--font-sans)' }}>
                RapidFix
              </span>
            </Link>

            {/* Desktop center nav */}
            <div className="hidden md:flex items-center gap-1">
              {/* Services dropdown */}
              <div ref={servicesRef} className="relative">
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className={cn(
                    'flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150',
                    servicesOpen ? 'bg-white/8 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  Services
                  <ChevronDown size={13} className={cn('transition-transform duration-150', servicesOpen && 'rotate-180')} />
                </button>
                {servicesOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-56 rounded-xl border border-white/[0.08] bg-[#111111] p-1.5 shadow-2xl shadow-black/50">
                    <div className="grid grid-cols-2 gap-0.5">
                      {SERVICES.map(({ label, icon: Icon, href }) => (
                        <Link key={label} href={href}
                          onClick={() => setServicesOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-white/60 hover:bg-white/6 hover:text-white transition-colors">
                          <Icon size={13} className="shrink-0 text-white/40" />
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/#how-it-works" className={cn('nav-link rounded-md px-3 py-1.5 hover:bg-white/5')}>
                How it Works
              </Link>

              {/* Worker-only: Browse Jobs */}
              {isWorker && (
                <Link href="/jobs/browse"
                  className={cn('nav-link rounded-md px-3 py-1.5 hover:bg-white/5', pathname === '/jobs/browse' && 'text-white bg-white/5')}>
                  Browse Jobs
                </Link>
              )}

              <Link href="/auth/signup?role=worker"
                className={cn('nav-link rounded-md px-3 py-1.5 hover:bg-white/5')}>
                Become a Worker
              </Link>
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {user && profile ? (
                <>
                  {/* Notifications */}
                  <div ref={notifRef} className="relative">
                    <button
                      onClick={() => setNotifOpen(!notifOpen)}
                      className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/6 hover:text-white transition-colors"
                    >
                      <Bell size={15} />
                      {unreadCount > 0 && (
                        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </button>
                    {notifOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-72 rounded-xl border border-white/[0.08] bg-[#111111] shadow-2xl shadow-black/50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/[0.06]">
                          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Notifications</p>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="px-4 py-6 text-center text-sm text-white/30">No notifications yet</p>
                          ) : notifications.map(n => (
                            <div key={n.id} className={cn('px-4 py-3 border-b border-white/[0.04] last:border-0', !n.read && 'bg-white/[0.02]')}>
                              <p className="text-sm font-medium text-white">{n.title}</p>
                              <p className="text-xs text-white/40 mt-0.5">{n.body}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dashboard link */}
                  <Link href={`/dashboard/${profile.role}`}
                    className={cn('btn-ghost h-8 px-3 text-xs', pathname.startsWith('/dashboard') && 'bg-white/8 text-white')}>
                    <LayoutDashboard size={13} className="mr-1.5" />
                    Dashboard
                  </Link>

                  {/* User menu */}
                  <div ref={userMenuRef} className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/4 pl-1.5 pr-2.5 py-1 hover:bg-white/8 transition-colors"
                    >
                      <div className="h-6 w-6 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
                        {profile.photoURL
                          ? <Image src={profile.photoURL} alt="" width={24} height={24} className="object-cover" />
                          : <span className="text-[10px] font-semibold text-white">{profile.displayName?.[0]?.toUpperCase()}</span>
                        }
                      </div>
                      <span className="text-xs font-medium text-white max-w-[100px] truncate">{profile.displayName}</span>
                      <ChevronDown size={11} className="text-white/40" />
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-white/[0.08] bg-[#111111] p-1 shadow-2xl shadow-black/50">
                        <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/6 hover:text-white transition-colors">
                          <User size={13} /> Profile
                        </Link>
                        <Link href={`/dashboard/${profile.role}`} onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/6 hover:text-white transition-colors">
                          <LayoutDashboard size={13} /> Dashboard
                        </Link>
                        <div className="my-1 h-px bg-white/[0.06]" />
                        <button onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/8 transition-colors">
                          <LogOut size={13} /> Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn-ghost h-8 px-4 text-xs">Sign in</Link>
                  <Link href="/auth/signup" className="btn-primary h-8 px-4 text-xs">Get started</Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/70"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.07] bg-[#0a0a0a] px-4 py-3 space-y-1">
            <Link href="/#categories" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5">Services</Link>
            <Link href="/#how-it-works" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5">How it Works</Link>
            {isWorker && <Link href="/jobs/browse" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5">Browse Jobs</Link>}
            {user && profile ? (
              <>
                <Link href={`/dashboard/${profile.role}`} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5">Dashboard</Link>
                <Link href="/profile" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5">Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left rounded-lg px-3 py-2 text-sm text-red-400">Sign out</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link href="/auth/login" className="btn-ghost flex-1 text-center text-xs py-2">Sign in</Link>
                <Link href="/auth/signup" className="btn-primary flex-1 text-center text-xs py-2">Get started</Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  Bell, Menu, X, LogOut, User, LayoutDashboard,
  ChevronDown, Zap, Droplets, Hammer, PaintBucket,
  Wind, Settings2, Bug, Shield, Wrench, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { subscribeToNotifications } from '@/lib/firestore'
import { Notification } from '@/types'

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
    const onScroll = () => setScrolled(window.scrollY > 4)
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
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length
  const handleLogout = async () => { await logout(); window.location.href = '/' }
  const isWorker = profile?.role === 'worker'
  const isAdmin = profile?.email === 'kavyaparmar7866@gmail.com'

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
      scrolled
        ? 'border-b border-black/[0.08] bg-white/95 backdrop-blur-xl shadow-sm'
        : 'bg-white border-b border-black/[0.06]'
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[52px] items-center gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
            <div className="relative h-6 w-6">
              <Image src="/logo.png" alt="RapidFix" fill className="object-contain" />
            </div>
            <span className="text-[15px] font-semibold text-zinc-900 tracking-tight">RapidFix</span>
          </Link>

          {/* Desktop nav — Clerk pattern: items separated by subtle divider feel */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {/* Services dropdown */}
            <div ref={servicesRef} className="relative">
              <button onClick={() => setServicesOpen(!servicesOpen)}
                className={cn(
                  'flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  servicesOpen ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                )}>
                Services <ChevronDown size={13} className={cn('transition-transform', servicesOpen && 'rotate-180')} />
              </button>
              {servicesOpen && (
                <div className="absolute left-0 top-full mt-2 w-[420px] rounded-2xl border border-black/[0.08] bg-white shadow-xl shadow-black/10 p-3">
                  <div className="grid grid-cols-2 gap-1">
                    {SERVICES.map(({ label, icon: Icon, href, desc }) => (
                      <Link key={label} href={href} onClick={() => setServicesOpen(false)}
                        className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-zinc-50 transition-colors group">
                        <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-zinc-200 transition-colors">
                          <Icon size={14} className="text-zinc-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-900">{label}</p>
                          <p className="text-xs text-zinc-400">{desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-black/[0.06]">
                    <Link href="/how-it-works" onClick={() => setServicesOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-50 transition-colors">
                      <Sparkles size={13} className="text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-600">How RapidFix works</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/how-it-works"
              className={cn('nav-link rounded-md px-3 py-1.5 hover:bg-zinc-50 hover:text-zinc-900', pathname === '/how-it-works' && 'text-zinc-900 bg-zinc-50')}>
              How it Works
            </Link>

            {isWorker && (
              <Link href="/jobs/browse"
                className={cn('nav-link rounded-md px-3 py-1.5 hover:bg-zinc-50 hover:text-zinc-900', pathname === '/jobs/browse' && 'text-zinc-900 bg-zinc-50')}>
                Browse Jobs
              </Link>
            )}

            <Link href="/auth/signup?role=worker"
              className="nav-link rounded-md px-3 py-1.5 hover:bg-zinc-50 hover:text-zinc-900">
              Become a Worker
            </Link>

            {isAdmin && (
              <Link href="/admin"
                className={cn('nav-link rounded-md px-3 py-1.5 hover:bg-zinc-50 hover:text-zinc-900 font-medium', pathname.startsWith('/admin') && 'text-zinc-900 bg-zinc-50')}>
                Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {user && profile ? (
              <>
                {/* Notifs */}
                <div ref={notifRef} className="relative">
                  <button onClick={() => setNotifOpen(!notifOpen)}
                    className="relative flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors">
                    <Bell size={15} />
                    {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-zinc-900" />}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-black/[0.08] bg-white shadow-xl shadow-black/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-black/[0.06]">
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Notifications</p>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0
                          ? <p className="px-4 py-6 text-center text-sm text-zinc-400">All caught up!</p>
                          : notifications.map(n => (
                            <div key={n.id} className={cn('px-4 py-3 border-b border-black/[0.04] last:border-0', !n.read && 'bg-zinc-50')}>
                              <p className="text-sm font-medium text-zinc-900">{n.title}</p>
                              <p className="text-xs text-zinc-400 mt-0.5">{n.body}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard */}
                <Link href={`/dashboard/${profile.role}`}
                  className={cn('btn-ghost h-8 px-3 text-xs', pathname.startsWith('/dashboard') && 'bg-zinc-100 border-zinc-200 text-zinc-900')}>
                  <LayoutDashboard size={13} className="mr-1.5" /> Dashboard
                </Link>

                {/* User menu — Clerk style pill */}
                <div ref={userMenuRef} className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-full border border-black/10 bg-zinc-50 pl-1 pr-2.5 py-1 hover:bg-zinc-100 hover:border-black/20 transition-all">
                    <div className="h-6 w-6 rounded-full overflow-hidden bg-zinc-200 flex items-center justify-center shrink-0">
                      {profile.photoURL
                        ? <Image src={profile.photoURL} alt="" width={24} height={24} className="object-cover" />
                        : <span className="text-[10px] font-bold text-zinc-600">{profile.displayName?.[0]?.toUpperCase()}</span>
                      }
                    </div>
                    <span className="text-xs font-medium text-zinc-700 max-w-[90px] truncate">{profile.displayName}</span>
                    <ChevronDown size={11} className="text-zinc-400" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-black/[0.08] bg-white shadow-xl shadow-black/10 p-1">
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                        <User size={13} /> Profile
                      </Link>
                      <Link href={`/dashboard/${profile.role}`} onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                        <LayoutDashboard size={13} /> Dashboard
                      </Link>
                      <div className="my-1 h-px bg-black/[0.06]" />
                      <button onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={13} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors px-3 py-1.5">
                  Sign in
                </Link>
                <Link href="/auth/signup" className="btn-primary h-8 px-4 text-xs rounded-full">
                  Get started →
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden ml-auto flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-zinc-600"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-black/[0.06] bg-white px-4 py-3 space-y-0.5">
          {SERVICES.map(({ label, href }) => (
            <Link key={label} href={href} onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50">{label}</Link>
          ))}
          <div className="h-px bg-black/[0.06] my-2" />
          <Link href="/how-it-works" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50">How it Works</Link>
          {isWorker && <Link href="/jobs/browse" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50">Browse Jobs</Link>}
          {isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-zinc-700 font-medium hover:bg-zinc-50">Admin Panel</Link>}
          {user && profile ? (
            <>
              <Link href={`/dashboard/${profile.role}`} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50">Dashboard</Link>
              <button onClick={handleLogout} className="block w-full text-left rounded-lg px-3 py-2 text-sm text-red-500">Sign out</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/auth/login" className="btn-ghost flex-1 text-center text-xs py-2">Sign in</Link>
              <Link href="/auth/signup" className="btn-primary flex-1 text-center text-xs py-2 rounded-full">Get started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

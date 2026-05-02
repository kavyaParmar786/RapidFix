'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { subscribeToChats } from '@/lib/firestore'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

const TABS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/jobs/browse', icon: Search, label: 'Browse' },
  { href: '/jobs/post', icon: PlusCircle, label: 'Post', primary: true },
  { href: '/chat', icon: MessageCircle, label: 'Chat', badge: true },
  { href: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { user, profile } = useAuth()
  const [totalUnread, setTotalUnread] = useState(0)

  useEffect(() => {
    if (!user || !profile) return
    const role = profile.role as 'customer' | 'worker'
    const unsub = subscribeToChats(user.uid, role, (chats) => {
      const sum = chats.reduce((acc, c) => acc + (c.unreadCount?.[user.uid] ?? 0), 0)
      setTotalUnread(sum)
    })
    return () => unsub()
  }, [user, profile])

  // Hide on auth pages and non-app pages
  const hide = ['/auth/', '/sso-callback'].some(p => pathname.startsWith(p))
  if (hide) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-1">
        {TABS.map(({ href, icon: Icon, label, primary, badge }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={user || href === '/' ? href : '/auth/login'}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-2 px-1',
                primary ? 'pb-1' : ''
              )}>
              {active && !primary && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-x-1 -top-px h-0.5 rounded-full"
                  style={{ background: 'var(--accent)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {primary ? (
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: 'var(--accent)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                    marginTop: -16,
                  }}
                >
                  <Icon size={22} style={{ color: 'var(--bg-base)' }} />
                </motion.div>
              ) : (
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  animate={{ y: active ? -1 : 0 }}
                  className="relative flex flex-col items-center gap-0.5"
                >
                  <div className="relative">
                    <Icon
                      size={20}
                      style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}
                      strokeWidth={active ? 2.2 : 1.8}
                    />
                    {badge && totalUnread > 0 && (
                      <AnimatePresence>
                        <motion.span
                          key={totalUnread}
                          initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                          className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white"
                        >
                          {totalUnread > 9 ? '9+' : totalUnread}
                        </motion.span>
                      </AnimatePresence>
                    )}
                  </div>
                  <span className="text-[10px] font-medium"
                    style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {label}
                  </span>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

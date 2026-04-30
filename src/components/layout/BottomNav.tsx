'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/jobs/browse', icon: Search, label: 'Browse' },
  { href: '/jobs/post', icon: PlusCircle, label: 'Post', primary: true },
  { href: '/chat', icon: MessageCircle, label: 'Chat' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()

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
        {TABS.map(({ href, icon: Icon, label, primary }) => {
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
                  className="flex flex-col items-center gap-0.5"
                >
                  <Icon
                    size={20}
                    style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
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

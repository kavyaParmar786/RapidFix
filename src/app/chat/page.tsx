'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { subscribeToChats } from '@/lib/firestore'
import { Chat } from '@/types'
import { formatRelativeTime, cn } from '@/lib/utils'
import { PageLoader } from '@/components/ui/Spinner'
import Navbar from '@/components/layout/Navbar'

export default function ChatInboxPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) { window.location.href = '/auth/login'; return }
  }, [authLoading, user])

  useEffect(() => {
    if (!user || !profile) return
    const role = profile.role as 'customer' | 'worker'
    const unsub = subscribeToChats(user.uid, role, (incoming) => {
      // Sort by most recent message
      const sorted = [...incoming].sort((a, b) => {
        const ta = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : new Date(a.createdAt).getTime()
        const tb = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : new Date(b.createdAt).getTime()
        return tb - ta
      })
      setChats(sorted)
      setLoading(false)
    })
    return () => unsub()
  }, [user, profile])

  if (authLoading || !profile) return <PageLoader />

  const isWorker = profile.role === 'worker'

  const filtered = chats.filter((c) => {
    const q = search.toLowerCase()
    const name = isWorker ? c.customerName : c.workerName
    return name.toLowerCase().includes(q) || c.jobTitle.toLowerCase().includes(q)
  })

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16" style={{ background: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-2xl px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Messages</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Your conversations with {isWorker ? 'customers' : 'workers'}
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or job…"
              className="input-base pl-10"
            />
          </div>

          {/* List */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card p-4 flex gap-3 animate-pulse">
                  <div className="h-12 w-12 rounded-full bg-[var(--bg-elevated)] flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3.5 w-32 rounded bg-[var(--bg-elevated)]" />
                    <div className="h-3 w-48 rounded bg-[var(--bg-elevated)]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-20 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: 'var(--bg-elevated)' }}>
                <MessageCircle size={28} className="text-[var(--text-muted)]" />
              </div>
              <p className="font-medium text-[var(--text-primary)]">No conversations yet</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {isWorker
                  ? 'Accept a job to start chatting with a customer.'
                  : 'Post a job and a worker will reach out.'}
              </p>
              <Link
                href={isWorker ? '/feed' : '/jobs/post'}
                className="btn-primary mt-6 px-6 py-2.5 text-sm"
              >
                {isWorker ? 'Browse Jobs' : 'Post a Job'}
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="space-y-2">
                {filtered.map((chat, i) => {
                  const other = isWorker
                    ? { name: chat.customerName, photo: chat.customerPhoto }
                    : { name: chat.workerName, photo: chat.workerPhoto }
                  const unread = chat.unreadCount?.[user!.uid] ?? 0

                  return (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link href={`/chat/${chat.id}`}>
                        <div className={cn(
                          'glass-card p-4 flex gap-3 transition-all hover:scale-[1.01] cursor-pointer',
                          unread > 0 && 'border-[var(--border-strong)]/40'
                        )}>
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            {other.photo ? (
                              <Image
                                src={other.photo}
                                alt={other.name}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 font-semibold text-lg">
                                {other.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            {unread > 0 && (
                              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                                {unread > 9 ? '9+' : unread}
                              </span>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <p className={cn(
                                'truncate text-sm font-semibold',
                                unread > 0 ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                              )}>
                                {other.name}
                              </p>
                              {chat.lastMessageAt && (
                                <span className="text-[11px] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                                  {formatRelativeTime(chat.lastMessageAt)}
                                </span>
                              )}
                            </div>
                            <p className="truncate text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                              Re: {chat.jobTitle}
                            </p>
                            {chat.lastMessage && (
                              <p className={cn(
                                'truncate text-xs',
                                unread > 0 ? 'text-[var(--text-secondary)] font-medium' : 'text-[var(--text-muted)]'
                              )}>
                                {chat.lastMessage}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  )
}

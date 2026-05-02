'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Briefcase, MessageCircle, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { subscribeToCustomerJobs, subscribeToChats } from '@/lib/firestore'
import { Job, Chat } from '@/types'
import { STATUS_CONFIG, formatRelativeTime, getCategoryConfig } from '@/lib/utils'
import { DashboardSkeleton } from '@/components/ui/Skeletons'
import JobCard from '@/components/shared/JobCard'
import Navbar from '@/components/layout/Navbar'

export default function CustomerDashboard() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [activeTab, setActiveTab] = useState<'all' | Job['status']>('all')

  useEffect(() => {
    if (authLoading) return          // wait for Firebase to resolve
    if (!user) { window.location.href = '/auth/login'; return }
    if (!profile) return             // user exists but profile still loading
    if (profile.role !== 'customer') {
      window.location.href = '/dashboard/worker'
    }
  }, [authLoading, user, profile])

  useEffect(() => {
    if (!user) return
    const unsub1 = subscribeToCustomerJobs(user.uid, setJobs)
    const unsub2 = subscribeToChats(user.uid, 'customer', setChats)
    return () => { unsub1(); unsub2() }
  }, [user])

  if (authLoading || !profile) return <><Navbar /><div className='min-h-screen pt-16' style={{background:'var(--bg-base)'}}><div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10'><DashboardSkeleton /></div></div></>

  const filteredJobs = activeTab === 'all' ? jobs : jobs.filter(j => j.status === activeTab)
  const stats = {
    total: jobs.length,
    active: jobs.filter(j => ['accepted', 'in_progress'].includes(j.status)).length,
    completed: jobs.filter(j => j.status === 'completed').length,
    unreadChats: chats.length,
  }

  const tabs: Array<{ key: typeof activeTab; label: string }> = [
    { key: 'all', label: 'All Jobs' },
    { key: 'posted', label: 'Posted' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16" style={{ background: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-sans)' }}>
                Welcome, {profile?.displayName?.split(' ')[0]} 👋
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Manage your service requests and chats
              </p>
            </div>
            <Link href="/jobs/post" className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Post a Job
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Briefcase, label: 'Total Jobs', value: stats.total, color: 'text-[var(--text-muted)]', bg: 'from-zinc-700/20 to-indigo-600/10' },
              { icon: TrendingUp, label: 'Active', value: stats.active, color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-600/10' },
              { icon: CheckCircle, label: 'Completed', value: stats.completed, color: 'text-green-400', bg: 'from-green-500/20 to-green-600/10' },
              { icon: MessageCircle, label: 'Chats', value: stats.unreadChats, color: 'text-cyan-400', bg: 'from-cyan-500/20 to-cyan-600/10' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className={`glass-card p-5 bg-gradient-to-br ${bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <Icon size={18} className={color} />
                  <span className={`text-2xl font-bold ${color}`} style={{ fontFamily: 'var(--font-sans)' }}>
                    {value}
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Jobs */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex gap-1 rounded-xl border border-black/10 bg-[var(--bg-surface)] p-1 mb-5 overflow-x-auto">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      activeTab === t.key
                        ? 'bg-gradient-to-r from-zinc-700 to-violet-600 text-[var(--text-primary)] shadow'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {t.label}
                    {t.key !== 'all' && (
                      <span className="ml-1.5 text-[10px] opacity-70">
                        ({jobs.filter(j => j.status === t.key).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                  jobs.length === 0 ? (
                    // First-time user — richer empty state
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-10 text-center">
                      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl"
                        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))' }}>
                        <span className="text-4xl">⚡</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Post your first job
                      </h3>
                      <p className="text-sm mb-1 max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        Get matched with a verified professional in minutes.
                      </p>
                      <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
                        Electrician · Plumber · Carpenter · Painter · and more
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/jobs/post" className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl">
                          <Plus size={14} /> Post a Job
                        </Link>
                        <Link href="/jobs/browse" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-colors"
                          style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>
                          Browse Services
                        </Link>
                      </div>
                      <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                        {[['⚡', 'Instant match'], ['🔒', 'Background verified'], ['⭐', 'Rated 4.8/5']].map(([icon, label]) => (
                          <div key={label} className="rounded-xl py-3 px-2" style={{ background: 'var(--bg-elevated)' }}>
                            <div className="text-lg mb-1">{icon}</div>
                            <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    // Has jobs but filtered tab is empty
                    <div className="glass-card p-10 text-center">
                      <div className="text-3xl mb-3">🔍</div>
                      <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>No {activeTab} jobs</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Try a different filter or post a new job.
                      </p>
                    </div>
                  )
                ) : (
                  filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
                )}
              </div>
            </div>

            {/* Sidebar: Recent Chats */}
            <div>
              <h2 className="font-semibold text-[var(--text-primary)] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
                Recent Chats
              </h2>
              <div className="space-y-3">
                {chats.length === 0 ? (
                  <div className="glass-card p-6 text-center">
                    <MessageCircle size={24} className="mx-auto mb-2 text-[var(--text-muted)]" />
                    <p className="text-sm text-[var(--text-muted)]">No active chats</p>
                  </div>
                ) : (
                  chats.map((chat) => (
                    <Link
                      key={chat.id}
                      href={`/chat/${chat.id}`}
                      className="glass-card flex items-center gap-3 p-4 transition-all hover:border-black/20 hover:bg-[var(--bg-surface)]"
                    >
                      <div className="h-9 w-9 rounded-full bg-zinc-900/30 flex items-center justify-center text-sm font-bold text-[var(--text-secondary)] flex-shrink-0">
                        {chat.workerName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{chat.workerName}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                          {chat.lastMessage || chat.jobTitle}
                        </p>
                      </div>
                      {chat.lastMessageAt && (
                        <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                          {formatRelativeTime(chat.lastMessageAt)}
                        </span>
                      )}
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

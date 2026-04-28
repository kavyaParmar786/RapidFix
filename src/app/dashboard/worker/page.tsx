'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, CheckCircle, MessageCircle, ToggleLeft, ToggleRight, Star, Filter } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { subscribeToJobs, subscribeToWorkerJobs, subscribeToChats, acceptJob } from '@/lib/firestore'
import { Job, Chat, JobCategory } from '@/types'
import { CATEGORIES, formatRelativeTime } from '@/lib/utils'
import { PageLoader } from '@/components/ui/Spinner'
import JobCard from '@/components/shared/JobCard'
import Navbar from '@/components/layout/Navbar'
import toast from 'react-hot-toast'

export default function WorkerDashboard() {
  const { user, profile, updateUserProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [myJobs, setMyJobs] = useState<Job[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [tab, setTab] = useState<'my-jobs' | 'completed'>('my-jobs')
  const [categoryFilter, setCategoryFilter] = useState<JobCategory | 'all'>('all')
  const [acceptingId, setAcceptingId] = useState<string | null>(null)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    if (authLoading) return          // wait for Firebase to resolve
    if (!user) { window.location.href = '/auth/login'; return }
    if (!profile) return             // user exists but profile still loading
    if (profile.role !== 'worker') {
      window.location.href = '/dashboard/customer'
    }
  }, [authLoading, user, profile])

  useEffect(() => {
    if (!user || !profile) return
    const unsub1 = subscribeToWorkerJobs(user.uid, setMyJobs)
    const unsub2 = subscribeToChats(user.uid, 'worker', setChats)
    return () => { unsub1(); unsub2() }
  }, [user, profile, categoryFilter])

  if (authLoading || !profile) return <PageLoader />

  const handleAccept = async (jobId: string) => {
    if (!user || !profile) return
    if (!profile.isAvailable) { toast.error('Set yourself as Online first'); return }
    setAcceptingId(jobId)
    const success = await acceptJob(jobId, user.uid, profile.displayName, profile.photoURL)
    if (success) {
      toast.success('Job accepted! Chat is now open 🎉')
    } else {
      toast.error('Job was already taken by another worker')
    }
    setAcceptingId(null)
  }

  const toggleAvailability = async () => {
    setToggling(true)
    await updateUserProfile({ isAvailable: !profile?.isAvailable })
    toast.success(profile?.isAvailable ? 'You are now Offline' : 'You are now Online')
    setToggling(false)
  }

  const stats = {
    active: myJobs.filter(j => ['accepted', 'in_progress'].includes(j.status)).length,
    completed: myJobs.filter(j => j.status === 'completed').length,
    rating: profile?.rating ?? 0,
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16" style={{ background: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

          {/* Header */}
          <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
                Worker Dashboard 🔧
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {profile?.isAvailable ? 'You\'re Online — actively receiving jobs' : 'You\'re Offline — toggle to receive jobs'}
              </p>
            </div>
            <button
              onClick={toggleAvailability}
              disabled={toggling}
              className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                profile?.isAvailable
                  ? 'bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30'
                  : 'bg-white/10 border border-white/15 text-white/60 hover:bg-white/15'
              }`}
            >
              {profile?.isAvailable ? (
                <><ToggleRight size={18} /> Online</>
              ) : (
                <><ToggleLeft size={18} /> Offline</>
              )}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Briefcase, label: 'Available Jobs', value: stats.available, color: 'text-indigo-400', bg: 'from-indigo-500/20 to-indigo-600/10' },
              { icon: CheckCircle, label: 'Active', value: stats.active, color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-600/10' },
              { icon: CheckCircle, label: 'Completed', value: stats.completed, color: 'text-green-400', bg: 'from-green-500/20 to-green-600/10' },
              { icon: Star, label: 'Rating', value: stats.rating || '—', color: 'text-amber-400', bg: 'from-amber-500/20 to-amber-600/10' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className={`glass-card p-5 bg-gradient-to-br ${bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <Icon size={18} className={color} />
                  <span className={`text-2xl font-bold ${color}`} style={{ fontFamily: 'var(--font-syne)' }}>
                    {value}
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Tab */}
              <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1 mb-5">
                {[{ key: 'available', label: 'Available Jobs' }, { key: 'my-jobs', label: 'My Jobs' }].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key as any)}
                    className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                      tab === t.key
                        ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Category filter (available tab) */}
              {tab === 'available' && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      categoryFilter === 'all'
                        ? 'bg-indigo-500/30 border border-indigo-500/50 text-indigo-300'
                        : 'border border-white/10 bg-white/5 text-white/50 hover:text-white'
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategoryFilter(cat.value)}
                      className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        categoryFilter === cat.value
                          ? 'bg-indigo-500/30 border border-indigo-500/50 text-indigo-300'
                          : 'border border-white/10 bg-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Job list */}
              <div className="space-y-4">
                {(tab === 'available' ? availableJobs : myJobs).length === 0 ? (
                  <div className="glass-card p-12 text-center">
                    <div className="text-4xl mb-3">{tab === 'available' ? '🔍' : '📋'}</div>
                    <p className="font-medium text-white mb-1">
                      {tab === 'available' ? 'No available jobs' : 'No accepted jobs yet'}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {tab === 'available'
                        ? 'New jobs matching your category will appear here in real time'
                        : 'Accept available jobs to see them here'}
                    </p>
                  </div>
                ) : (
                  (tab === 'available' ? availableJobs : myJobs).map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      showAccept={tab === 'available'}
                      onAccept={handleAccept}
                      accepting={acceptingId === job.id}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Sidebar: Chats */}
            <div>
              <h2 className="font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
                Active Chats
              </h2>
              <div className="space-y-3">
                {chats.length === 0 ? (
                  <div className="glass-card p-6 text-center">
                    <MessageCircle size={24} className="mx-auto mb-2 text-white/30" />
                    <p className="text-sm text-white/50">No chats yet</p>
                  </div>
                ) : (
                  chats.map((chat) => (
                    <Link
                      key={chat.id}
                      href={`/chat/${chat.id}`}
                      className="glass-card flex items-center gap-3 p-4 transition-all hover:border-white/20"
                    >
                      <div className="h-9 w-9 rounded-full bg-violet-500/30 flex items-center justify-center text-sm font-bold text-violet-300 flex-shrink-0">
                        {chat.customerName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{chat.customerName}</p>
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

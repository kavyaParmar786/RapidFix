'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Briefcase, CheckCircle, MessageCircle, ToggleLeft, ToggleRight, Star, ExternalLink } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { subscribeToWorkerJobs, subscribeToChats } from '@/lib/firestore'
import { Job, Chat } from '@/types'
import { formatRelativeTime } from '@/lib/utils'
import { PageLoader } from '@/components/ui/Spinner'
import JobCard from '@/components/shared/JobCard'
import Navbar from '@/components/layout/Navbar'
import toast from 'react-hot-toast'

export default function WorkerDashboard() {
  const { user, profile, updateUserProfile, loading: authLoading } = useAuth()
  const [myJobs, setMyJobs] = useState<Job[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [tab, setTab] = useState<'active' | 'completed'>('active')
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) { window.location.href = '/auth/login'; return }
    if (!profile) return
    if (profile.role !== 'worker') window.location.href = '/dashboard/customer'
  }, [authLoading, user, profile])

  useEffect(() => {
    if (!user || !profile) return
    const unsub1 = subscribeToWorkerJobs(user.uid, setMyJobs)
    const unsub2 = subscribeToChats(user.uid, 'worker', setChats)
    return () => { unsub1(); unsub2() }
  }, [user, profile])

  if (authLoading || !profile) return <PageLoader />

  const toggleAvailability = async () => {
    setToggling(true)
    await updateUserProfile({ isAvailable: !profile.isAvailable })
    toast.success(profile.isAvailable ? 'You are now Offline' : 'You are now Online')
    setToggling(false)
  }

  const activeJobs = myJobs.filter(j => ['accepted', 'in_progress', 'posted'].includes(j.status))
  const completedJobs = myJobs.filter(j => j.status === 'completed')
  const displayJobs = tab === 'active' ? activeJobs : completedJobs

  const stats = [
    { icon: Briefcase, label: 'Active Jobs', value: activeJobs.length },
    { icon: CheckCircle, label: 'Completed', value: completedJobs.length },
    { icon: MessageCircle, label: 'Chats', value: chats.length },
    { icon: Star, label: 'Rating', value: profile.rating ? profile.rating.toFixed(1) : '—' },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-14" className='bg-white'>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap mb-8 pb-6 border-b border-black/[0.06]">
            <div>
              <h1 className="text-xl font-bold text-zinc-900 mb-0.5">Worker Dashboard</h1>
              <p className="text-sm text-zinc-400">
                {profile.isAvailable ? 'You\'re Online — visible to customers' : 'You\'re Offline — toggle to receive jobs'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/jobs/browse"
                className="btn-ghost h-8 px-3 text-xs flex items-center gap-1.5">
                <ExternalLink size={12} /> Browse Jobs
              </Link>
              <button onClick={toggleAvailability} disabled={toggling}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all border ${
                  profile.isAvailable
                    ? 'bg-white/[0.06] border-black/20 text-zinc-900'
                    : 'bg-white/[0.03] border-black/10 text-zinc-400 hover:text-zinc-600'
                }`}>
                {profile.isAvailable ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                {profile.isAvailable ? 'Online' : 'Offline'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-black/[0.07] bg-zinc-50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <Icon size={14} className="text-zinc-400" />
                  <span className="text-2xl font-bold text-zinc-900">{value}</span>
                </div>
                <p className="text-xs text-zinc-400">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Jobs */}
            <div className="lg:col-span-2">
              <div className="flex gap-1 rounded-lg border border-black/[0.08] bg-white/[0.03] p-0.5 mb-5">
                {[{ key: 'active', label: 'Active Jobs' }, { key: 'completed', label: 'Completed' }].map(t => (
                  <button key={t.key} onClick={() => setTab(t.key as 'active' | 'completed')}
                    className={`flex-1 rounded-md py-2 text-xs font-medium transition-all ${
                      tab === t.key ? 'bg-white text-black' : 'text-zinc-400 hover:text-zinc-900'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {displayJobs.length === 0 ? (
                  <div className="rounded-xl border border-black/[0.07] bg-zinc-50 p-12 text-center">
                    <Briefcase size={20} className="mx-auto mb-3 text-zinc-300" />
                    <p className="text-sm font-medium text-zinc-500 mb-1">
                      {tab === 'active' ? 'No active jobs' : 'No completed jobs yet'}
                    </p>
                    <p className="text-xs text-zinc-400 mb-4">
                      {tab === 'active' ? 'Accept jobs from Browse Jobs to see them here' : 'Completed jobs will appear here'}
                    </p>
                    {tab === 'active' && (
                      <Link href="/jobs/browse" className="btn-primary px-4 py-2 text-xs">Browse available jobs</Link>
                    )}
                  </div>
                ) : (
                  displayJobs.map(job => (
                    <JobCard key={job.id} job={job} viewAs="worker" />
                  ))
                )}
              </div>
            </div>

            {/* Chats sidebar */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 mb-4">Active Chats</h2>
              <div className="space-y-2">
                {chats.length === 0 ? (
                  <div className="rounded-xl border border-black/[0.07] bg-zinc-50 p-6 text-center">
                    <MessageCircle size={16} className="mx-auto mb-2 text-zinc-300" />
                    <p className="text-xs text-zinc-400">No chats yet</p>
                  </div>
                ) : chats.map(chat => (
                  <Link key={chat.id} href={`/chat/${chat.id}`}
                    className="flex items-center gap-3 rounded-xl border border-black/[0.07] bg-zinc-50 p-3.5 hover:border-black/15 hover:bg-zinc-100 transition-all">
                    <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-semibold text-zinc-900 shrink-0">
                      {chat.customerName?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">{chat.customerName}</p>
                      <p className="text-xs text-zinc-400 truncate">{chat.lastMessage || chat.jobTitle}</p>
                    </div>
                    {chat.lastMessageAt && (
                      <span className="text-[10px] text-zinc-400 shrink-0">{formatRelativeTime(chat.lastMessageAt)}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

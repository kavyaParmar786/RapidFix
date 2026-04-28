'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Filter, RefreshCw } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { subscribeToJobs, acceptJob } from '@/lib/firestore'
import { Job, JobCategory } from '@/types'
import { CATEGORIES, cn } from '@/lib/utils'
import { PageLoader } from '@/components/ui/Spinner'
import JobCard from '@/components/shared/JobCard'
import Navbar from '@/components/layout/Navbar'
import toast from 'react-hot-toast'

export default function FeedPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [filter, setFilter] = useState<JobCategory | 'all'>('all')
  const [acceptingId, setAcceptingId] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  useEffect(() => {
    if (authLoading) return
    if (!authLoading && !user) { window.location.href = '/auth/login'; return }
    if (!authLoading && profile && profile.role !== 'worker') {
      window.location.href = '/auth/login'
    }
  }, [user, profile, authLoading])

  useEffect(() => {
    const unsub = subscribeToJobs(filter, (newJobs) => {
      setJobs(newJobs)
      setLastRefresh(new Date())
    })
    return unsub
  }, [filter])

  if (authLoading) return <PageLoader />

  const handleAccept = async (jobId: string) => {
    if (!user || !profile) return
    if (!profile.isAvailable) {
      toast.error('You must be Online to accept jobs')
      return
    }
    setAcceptingId(jobId)
    const success = await acceptJob(jobId, user.uid, profile.displayName, profile.photoURL)
    if (success) {
      toast.success('Job accepted! Chat is now open 🎉')
      window.location.href = '/dashboard/worker'
    } else {
      toast.error('Someone else accepted this job first!')
    }
    setAcceptingId(null)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16" style={{ background: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
                Job Feed
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {jobs.length} jobs available · Last updated {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium',
                profile?.isAvailable
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-white/10 text-white/50 border border-white/15'
              )}>
                <span className={cn('h-1.5 w-1.5 rounded-full', profile?.isAvailable ? 'bg-green-400 animate-pulse' : 'bg-white/30')} />
                {profile?.isAvailable ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <Filter size={14} className="text-white/40 flex-shrink-0" />
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                filter === 'all'
                  ? 'bg-indigo-500/30 border border-indigo-500/50 text-indigo-300'
                  : 'border border-white/10 bg-white/5 text-white/50 hover:text-white'
              )}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={cn(
                  'flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                  filter === cat.value
                    ? 'bg-indigo-500/30 border border-indigo-500/50 text-indigo-300'
                    : 'border border-white/10 bg-white/5 text-white/50 hover:text-white'
                )}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Offline warning */}
          {!profile?.isAvailable && (
            <div className="glass-card p-4 mb-5 flex items-center gap-3 border-yellow-500/30 bg-yellow-500/10">
              <span className="text-yellow-400 text-xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-300">You are currently Offline</p>
                <p className="text-xs text-yellow-300/60">Toggle Online in your dashboard to accept jobs</p>
              </div>
            </div>
          )}

          {/* Jobs */}
          {jobs.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-medium text-white mb-1">No jobs available</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                New jobs matching your filter will appear here in real time
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  showAccept
                  onAccept={handleAccept}
                  accepting={acceptingId === job.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

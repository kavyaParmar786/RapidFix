'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { subscribeToJobs } from '@/lib/firestore'
import { Job, JobCategory } from '@/types'
import { CATEGORIES } from '@/lib/utils'
import Navbar from '@/components/layout/Navbar'
import JobCard from '@/components/shared/JobCard'
import { PageLoader } from '@/components/ui/Spinner'
import { acceptJob } from '@/lib/firestore'
import { Filter, Search, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function BrowseJobsPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [category, setCategory] = useState<JobCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [acceptingId, setAcceptingId] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) { window.location.href = '/auth/login'; return }
    if (profile && profile.role !== 'worker') { window.location.href = '/dashboard/customer'; return }
  }, [authLoading, user, profile])

  useEffect(() => {
    if (!user || !profile) return
    const unsub = subscribeToJobs(category, setJobs)
    return unsub
  }, [user, profile, category])

  if (authLoading || !profile) return <PageLoader />

  const filtered = jobs.filter(j =>
    search === '' ||
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.description.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  )

  const handleAccept = async (jobId: string) => {
    if (!user || !profile) return
    if (!profile.isAvailable) { toast.error('Set yourself as Online in your dashboard first'); return }
    setAcceptingId(jobId)
    const success = await acceptJob(jobId, user.uid, profile.displayName, profile.photoURL)
    if (success) toast.success('Job accepted! Chat opened 🎉')
    else toast.error('Job already taken by another worker')
    setAcceptingId(null)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
        {/* Header */}
        <div className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Browse Jobs</h1>
                <p className="text-sm text-[var(--text-muted)]">{filtered.length} available job{filtered.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Search + filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search jobs, location…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input-base pl-9 py-2"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <Filter size={13} className="text-[var(--text-muted)] shrink-0" />
                {(['all', ...Object.keys(CATEGORIES)] as (JobCategory | 'all')[]).slice(0, 6).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      'shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150',
                      category === cat
                        ? 'bg-[var(--bg-base)] text-[var(--text-primary)]'
                        : 'bg-white/[0.04] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)]/[0.08] border border-white/[0.08]'
                    )}
                  >
                    {cat === 'all' ? 'All' : cat.toString().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Jobs grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="h-14 w-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center mb-4">
                <Briefcase size={20} className="text-[var(--text-muted)]" />
              </div>
              <p className="text-base font-medium text-[var(--text-muted)] mb-1">No jobs found</p>
              <p className="text-sm text-[var(--text-muted)]">Try a different category or check back soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  viewAs="worker"
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

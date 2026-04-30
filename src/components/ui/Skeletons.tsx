'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('shimmer rounded-lg', className)} />
  )
}

export function JobCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <div className="flex gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </motion.div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-7 w-10" />
      </div>
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          {[...Array(3)].map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-3.5 flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-card p-6 flex items-start gap-5">
        <Skeleton className="h-20 w-20 rounded-full shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>
      <div className="glass-card p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}

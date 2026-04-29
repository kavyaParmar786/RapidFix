import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { JobCategory, JobStatus, UrgencyLevel } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CATEGORIES: { value: JobCategory; label: string; icon: string; color: string }[] = [
  { value: 'electrician',    label: 'Electrician',     icon: '⚡', color: 'from-yellow-500 to-orange-500' },
  { value: 'plumber',        label: 'Plumber',         icon: '🔧', color: 'from-blue-500 to-cyan-500' },
  { value: 'carpenter',      label: 'Carpenter',       icon: '🪚', color: 'from-amber-600 to-yellow-600' },
  { value: 'painter',        label: 'Painter',         icon: '🎨', color: 'from-pink-500 to-rose-500' },
  { value: 'cleaner',        label: 'Cleaning',        icon: '🧹', color: 'from-green-500 to-teal-500' },
  { value: 'ac_repair',      label: 'AC Repair',       icon: '❄️', color: 'from-sky-500 to-blue-600' },
  { value: 'appliance_repair', label: 'Appliance Repair', icon: '🔌', color: 'from-purple-500 to-violet-600' },
  { value: 'pest_control',   label: 'Pest Control',    icon: '🐛', color: 'from-lime-500 to-green-600' },
  { value: 'security',       label: 'Security',        icon: '🔒', color: 'from-slate-500 to-gray-700' },
  { value: 'other',          label: 'Other',           icon: '🛠️', color: 'from-indigo-500 to-purple-600' },
]

export const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; color: string; bg: string }
> = {
  posted:      { label: 'Posted',      color: 'text-blue-400',   bg: 'bg-blue-500/20' },
  accepted:    { label: 'Accepted',    color: 'text-purple-400', bg: 'bg-purple-500/20' },
  in_progress: { label: 'In Progress', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  completed:   { label: 'Completed',   color: 'text-green-400',  bg: 'bg-green-500/20' },
  cancelled:   { label: 'Cancelled',   color: 'text-red-400',    bg: 'bg-red-500/20' },
}

export const URGENCY_CONFIG: Record<
  UrgencyLevel,
  { label: string; color: string }
> = {
  low:       { label: 'Low',       color: 'text-green-400' },
  medium:    { label: 'Medium',    color: 'text-yellow-400' },
  high:      { label: 'High',      color: 'text-orange-400' },
  emergency: { label: 'Emergency', color: 'text-red-400' },
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function getCategoryConfig(category: JobCategory) {
  return CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[CATEGORIES.length - 1]
}

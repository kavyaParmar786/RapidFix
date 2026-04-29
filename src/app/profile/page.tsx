'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { User, Phone, MapPin, Briefcase, Star, Edit3, Save, X, Camera } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { motion } from 'framer-motion'
import { getWorkerReviews, uploadImage } from '@/lib/firestore'
import { motion } from 'framer-motion'
import { Review, JobCategory } from '@/types'
import { motion } from 'framer-motion'
import { CATEGORIES, cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { PageLoader } from '@/components/ui/Spinner'
import { motion } from 'framer-motion'
import StarRating from '@/components/ui/StarRating'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, profile, updateUserProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    displayName: '',
    phone: '',
    location: '',
    bio: '',
    experience: '',
    skills: [] as JobCategory[],
  })

  useEffect(() => {
    if (!authLoading && !user) window.location.href = '/auth/login'
  }, [user, authLoading])

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.displayName || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        experience: profile.experience || '',
        skills: profile.skills || [],
      })
    }
  }, [profile])

  useEffect(() => {
    if (user && profile?.role === 'worker') {
      getWorkerReviews(user.uid).then(setReviews)
    }
  }, [user, profile])

  if (authLoading || !profile) return <PageLoader />

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    try {
      const url = await uploadImage(file, `avatars/${user.uid}`)
      await updateUserProfile({ photoURL: url })
      toast.success('Profile photo updated!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateUserProfile(form)
      toast.success('Profile saved!')
      setEditing(false)
    } catch {
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const toggleSkill = (skill: JobCategory) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }))
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16" style={{ background: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-zinc-900 mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
            My Profile
          </h1>

          {/* Avatar + basics */}
          <div className="glass-card p-6 mb-6">
            <div className="flex items-start gap-5 flex-wrap">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="h-20 w-20 overflow-hidden rounded-2xl bg-zinc-900/30 flex items-center justify-center text-3xl font-bold text-zinc-600">
                  {profile.photoURL ? (
                    <Image src={profile.photoURL} alt="" width={80} height={80} className="object-cover" />
                  ) : (
                    profile.displayName?.[0]?.toUpperCase()
                  )}
                </div>
                <label className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-zinc-900 border-2 border-[var(--bg-base)] text-zinc-900 hover:bg-zinc-700 transition-colors">
                  {uploading ? (
                    <div className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <Camera size={12} />
                  )}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              <div className="flex-1 min-w-0">
                {editing ? (
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
                    className="input-base text-lg font-bold mb-2"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-zinc-900 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                    {profile.displayName}
                  </h2>
                )}
                <p className="text-sm text-zinc-500 capitalize mb-2">{profile.role}</p>

                {profile.role === 'worker' && (
                  <div className="flex items-center gap-2">
                    <StarRating value={profile.rating || 0} readonly size={14} />
                    <span className="text-sm text-zinc-500">
                      {profile.rating?.toFixed(1) || '0.0'} ({profile.reviewCount || 0} reviews)
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => editing ? setEditing(false) : setEditing(true)}
                className="flex items-center gap-1.5 rounded-xl border border-black/15 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900"
              >
                {editing ? <><X size={14} /> Cancel</> : <><Edit3 size={14} /> Edit</>}
              </button>
            </div>
          </div>

          {/* Details form */}
          <div className="glass-card p-6 mb-6 space-y-5">
            <h3 className="font-semibold text-zinc-900" style={{ fontFamily: 'var(--font-sans)' }}>
              Personal Info
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Email</label>
                <div className="input-base opacity-60 text-sm">{profile.email}</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Phone</label>
                {editing ? (
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="input-base text-sm"
                  />
                ) : (
                  <div className="input-base text-sm opacity-80">{profile.phone || '—'}</div>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Location</label>
                {editing ? (
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                    placeholder="City, State"
                    className="input-base text-sm"
                  />
                ) : (
                  <div className="input-base text-sm opacity-80">{profile.location || '—'}</div>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Bio</label>
                {editing ? (
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                    rows={3}
                    placeholder="Tell customers about yourself…"
                    className="input-base text-sm resize-none"
                  />
                ) : (
                  <div className="input-base text-sm opacity-80 min-h-[80px]">{profile.bio || '—'}</div>
                )}
              </div>
            </div>

            {/* Worker-specific */}
            {profile.role === 'worker' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">Experience</label>
                  {editing ? (
                    <input
                      type="text"
                      value={form.experience}
                      onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
                      placeholder="e.g., 5 years in residential electrical work"
                      className="input-base text-sm"
                    />
                  ) : (
                    <div className="input-base text-sm opacity-80">{profile.experience || '—'}</div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-2">Skills / Categories</label>
                  {editing ? (
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => toggleSkill(cat.value)}
                          className={cn(
                            'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all',
                            form.skills.includes(cat.value)
                              ? 'border-zinc-300/60 bg-zinc-900/20 text-zinc-600'
                              : 'border-black/10 bg-zinc-50 text-zinc-500 hover:border-black/20'
                          )}
                        >
                          {cat.icon} {cat.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(profile.skills || []).length === 0 ? (
                        <span className="text-sm text-zinc-400">No skills set</span>
                      ) : (
                        profile.skills!.map((s) => {
                          const cat = CATEGORIES.find((c) => c.value === s)
                          return cat ? (
                            <span key={s} className="flex items-center gap-1.5 rounded-full border border-zinc-300/30 bg-zinc-900/10 px-3 py-1 text-xs text-zinc-600">
                              {cat.icon} {cat.label}
                            </span>
                          ) : null
                        })
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {editing && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                <Save size={14} />
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            )}
          </div>

          {/* Reviews (worker only) */}
          {profile.role === 'worker' && (
            <div className="glass-card p-6">
              <h3 className="font-semibold text-zinc-900 mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
                Reviews ({reviews.length})
              </h3>
              {reviews.length === 0 ? (
                <p className="text-sm text-zinc-400">No reviews yet. Complete jobs to earn reviews.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="rounded-xl border border-black/8 bg-white/3 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-7 w-7 rounded-full bg-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300">
                          {r.reviewerName?.[0]}
                        </div>
                        <span className="text-sm font-medium text-zinc-900">{r.reviewerName}</span>
                        <StarRating value={r.rating} readonly size={12} />
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

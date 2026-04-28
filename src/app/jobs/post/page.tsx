'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { MapPin, Upload, X, ArrowLeft, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { createJob } from '@/lib/firestore'
import { uploadImage } from '@/lib/firestore'
import { JobCategory, UrgencyLevel } from '@/types'
import { CATEGORIES, cn } from '@/lib/utils'
import Navbar from '@/components/layout/Navbar'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

export default function PostJobPage() {
  const { user, profile } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<JobCategory>('electrician')
  const [budget, setBudget] = useState('')
  const [location, setLocation] = useState('')
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((files: File[]) => {
    const valid = files.slice(0, 5 - images.length)
    setImages((prev) => [...prev, ...valid])
    setPreviews((prev) => [...prev, ...valid.map((f) => URL.createObjectURL(f))])
  }, [images])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 5,
    disabled: images.length >= 5,
  })

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i))
    setPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) { window.location.href = '/auth/login'; return }
    if (!title.trim() || !description.trim() || !location.trim()) {
      toast.error('Fill in all required fields')
      return
    }

    setLoading(true)
    try {
      // Upload images
      const imageUrls: string[] = []
      for (const file of images) {
        const url = await uploadImage(file, `jobs/${user.uid}/${Date.now()}_${file.name}`)
        imageUrls.push(url)
      }

      await createJob({
        title: title.trim(),
        description: description.trim(),
        category,
        urgency,
        budget: budget ? Number(budget) : undefined,
        location: location.trim(),
        images: imageUrls,
        status: 'posted',
        customerId: user.uid,
        customerName: profile.displayName,
        customerPhoto: profile.photoURL,
      })

      toast.success('Job posted successfully! 🚀')
      window.location.href = '/dashboard/customer'
    } catch (err: any) {
      toast.error(err.message || 'Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  const urgencyLevels: { value: UrgencyLevel; label: string; color: string; desc: string }[] = [
    { value: 'low', label: 'Low', color: 'border-green-500/50 bg-green-500/10 text-green-400', desc: 'Within a week' },
    { value: 'medium', label: 'Medium', color: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400', desc: 'Within 2-3 days' },
    { value: 'high', label: 'High', color: 'border-orange-500/50 bg-orange-500/10 text-orange-400', desc: 'Today' },
    { value: 'emergency', label: 'Emergency', color: 'border-red-500/50 bg-red-500/10 text-red-400', desc: 'Right now!' },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16" style={{ background: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">

          {/* Back */}
          <Link href="/dashboard/customer" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-white"
            style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          <div className="glass-card p-8">
            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
              Post a Service Request
            </h1>
            <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
              Describe your problem and connect with skilled professionals nearby.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Job Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Fix a leaking pipe under the kitchen sink"
                  className="input-base"
                  maxLength={100}
                  required
                />
                <p className="mt-1 text-right text-xs text-white/30">{title.length}/100</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={cn(
                        'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all',
                        category === cat.value
                          ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-300'
                          : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white'
                      )}
                    >
                      <span>{cat.icon}</span>
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the problem in detail. Include any relevant context, size, materials, etc."
                  rows={4}
                  className="input-base resize-none"
                  required
                />
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Urgency Level</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {urgencyLevels.map((u) => (
                    <button
                      key={u.value}
                      type="button"
                      onClick={() => setUrgency(u.value)}
                      className={cn(
                        'rounded-xl border p-3 text-center transition-all',
                        urgency === u.value ? u.color : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                      )}
                    >
                      <p className="text-sm font-semibold">{u.label}</p>
                      <p className="text-[10px] opacity-70 mt-0.5">{u.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget + Location */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Budget (₹) — Optional</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g., 500"
                    className="input-base"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Your area, city"
                      className="input-base pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Photos (up to 5)
                </label>
                <div
                  {...getRootProps()}
                  className={cn(
                    'rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer',
                    isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/15 hover:border-white/25',
                    images.length >= 5 && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload size={24} className="mx-auto mb-3 text-white/40" />
                  <p className="text-sm text-white/60">
                    {isDragActive ? 'Drop here…' : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-xs text-white/30 mt-1">PNG, JPG up to 10MB ({images.length}/5)</p>
                </div>

                {previews.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {previews.map((src, i) => (
                      <div key={i} className="relative h-20 w-20 rounded-xl overflow-hidden border border-white/10">
                        <Image src={src} alt="" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-600"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {urgency === 'emergency' && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">
                    Emergency jobs are immediately visible to all available workers nearby.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-base"
              >
                {loading ? 'Posting job…' : '🚀 Post Job'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

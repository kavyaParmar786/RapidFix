'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MapPin, Upload, X, ArrowLeft, AlertTriangle, Navigation, GripVertical } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { createJob } from '@/lib/firestore'
import { uploadImage } from '@/lib/firestore'
import { JobCategory, UrgencyLevel } from '@/types'
import { CATEGORIES, cn } from '@/lib/utils'
import Navbar from '@/components/layout/Navbar'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

// ─── Sortable image thumb ─────────────────────────────────────────────────────
function SortableThumb({ id, src, onRemove }: { id: string; src: string; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="relative h-20 w-20 rounded-xl overflow-hidden border border-black/10 group"
    >
      <Image src={src} alt="" fill className="object-cover" />
      {/* drag handle */}
      <div {...attributes} {...listeners}
        className="absolute left-1 top-1 cursor-grab active:cursor-grabbing rounded-md bg-black/50 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical size={10} className="text-white" />
      </div>
      <button type="button" onClick={onRemove}
        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors">
        <X size={10} />
      </button>
      {/* first image badge */}
    </div>
  )
}

// ─── Leaflet map picker (lazy-loaded, no SSR) ────────────────────────────────
function MapPicker({ onSelect }: { onSelect: (address: string, lat: number, lng: number) => void }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready'>('idle')

  useEffect(() => {
    let cancelled = false
    async function init() {
      setStatus('loading')
      // Dynamically import Leaflet so it never runs on the server
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css' as any)

      if (cancelled || !mapRef.current || mapInstanceRef.current) return

      // Default center: Rajkot, Gujarat
      const defaultLat = 22.3039
      const defaultLng = 70.8022

      const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 13)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      // Custom pin icon
      const icon = L.divIcon({
        html: `<div style="background:#6366f1;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)"></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        className: '',
      })

      const addMarker = async (lat: number, lng: number) => {
        if (markerRef.current) markerRef.current.remove()
        markerRef.current = L.marker([lat, lng], { icon }).addTo(map)
        // Reverse geocode using Nominatim (free, no API key)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          )
          const data = await res.json()
          const address = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
          onSelect(address, lat, lng)
        } catch {
          onSelect(`${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng)
        }
      }

      map.on('click', (e: any) => addMarker(e.latlng.lat, e.latlng.lng))
      setStatus('ready')
    }
    init()
    return () => { cancelled = true }
  }, [onSelect])

  const locateMe = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const map = mapInstanceRef.current
        if (map) map.setView([coords.latitude, coords.longitude], 15)
      },
      () => toast.error('Could not get your location')
    )
  }

  return (
    <div className="space-y-2">
      <div className="relative rounded-xl overflow-hidden border border-black/10" style={{ height: 220 }}>
        {status === 'loading' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-surface)]">
            <p className="text-sm text-[var(--text-muted)]">Loading map…</p>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
        <button
          type="button"
          onClick={locateMe}
          className="absolute bottom-3 right-3 z-[400] flex items-center gap-1.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur px-3 py-1.5 text-xs font-medium shadow-md border border-black/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <Navigation size={12} /> Use my location
        </button>
      </div>
      <p className="text-[11px] text-[var(--text-muted)]">Tap the map to pin your exact address.</p>
    </div>
  )
}


export default function PostJobPage() {
  const { user, profile } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<JobCategory>('electrician')
  const [budget, setBudget] = useState('')
  const [location, setLocation] = useState('')
  const [locationLat, setLocationLat] = useState<number | undefined>()
  const [locationLng, setLocationLng] = useState<number | undefined>()
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [imageIds, setImageIds] = useState<string[]>([])  // stable ids for dnd-kit
  const [loading, setLoading] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleMapSelect = useCallback((address: string, lat: number, lng: number) => {
    setLocation(address)
    setLocationLat(lat)
    setLocationLng(lng)
  }, [])

  const onDrop = useCallback((files: File[]) => {
    const valid = files.slice(0, 5 - images.length)
    const newIds = valid.map(() => Math.random().toString(36).slice(2))
    setImages((prev) => [...prev, ...valid])
    setPreviews((prev) => [...prev, ...valid.map((f) => URL.createObjectURL(f))])
    setImageIds((prev) => [...prev, ...newIds])
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
    setImageIds((prev) => prev.filter((_, idx) => idx !== i))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIdx = imageIds.indexOf(active.id as string)
      const newIdx = imageIds.indexOf(over.id as string)
      setImages(arr => arrayMove(arr, oldIdx, newIdx))
      setPreviews(arr => arrayMove(arr, oldIdx, newIdx))
      setImageIds(arr => arrayMove(arr, oldIdx, newIdx))
    }
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
        locationLat,
        locationLng,
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
          <Link href="/dashboard/customer" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-[var(--text-primary)]"
            style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          <div className="glass-card p-8">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
              Post a Service Request
            </h1>
            <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
              Describe your problem and connect with skilled professionals nearby.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
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
                <p className="mt-1 text-right text-xs text-[var(--text-muted)]">{title.length}/100</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={cn(
                        'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all',
                        category === cat.value
                          ? 'border-[var(--border-strong)]/60 bg-zinc-900/15 text-[var(--text-secondary)]'
                          : 'border-black/10 bg-[var(--bg-surface)] text-[var(--text-muted)] hover:border-black/20 hover:text-[var(--text-primary)]'
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
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
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
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Urgency Level</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {urgencyLevels.map((u) => (
                    <button
                      key={u.value}
                      type="button"
                      onClick={() => setUrgency(u.value)}
                      className={cn(
                        'rounded-xl border p-3 text-center transition-all',
                        urgency === u.value ? u.color : 'border-black/10 bg-[var(--bg-surface)] text-[var(--text-muted)] hover:border-black/20'
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
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Budget (₹) — Optional</label>
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
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <MapPicker onSelect={handleMapSelect} />
                  {location && (
                    <div className="mt-2 flex items-start gap-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-2">
                      <MapPin size={13} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-indigo-300 break-all">{location}</p>
                    </div>
                  )}
                  {/* Fallback manual input */}
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Or type your address manually…"
                    className="input-base mt-2 text-xs"
                  />
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Photos (up to 5)
                </label>
                <div
                  {...getRootProps()}
                  className={cn(
                    'rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer',
                    isDragActive ? 'border-[var(--border-strong)] bg-zinc-900/10' : 'border-black/15 hover:border-white/25',
                    images.length >= 5 && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload size={24} className="mx-auto mb-3 text-[var(--text-muted)]" />
                  <p className="text-sm text-[var(--text-muted)]">
                    {isDragActive ? 'Drop here…' : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">PNG, JPG up to 10MB ({images.length}/5)</p>
                </div>

                {previews.length > 0 && (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={imageIds} strategy={rectSortingStrategy}>
                      <div className="flex flex-wrap gap-3 mt-3">
                        {imageIds.map((id, i) => (
                          <SortableThumb key={id} id={id} src={previews[i]} onRemove={() => removeImage(i)} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
                {previews.length > 0 && (
                  <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
                    Drag to reorder · First photo is the cover image
                  </p>
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

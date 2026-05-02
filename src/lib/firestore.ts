import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  limit,
  Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import { Job, JobCategory, Chat, Message, Notification, Review } from '@/types'

// ─── JOBS ───────────────────────────────────────────────────────────────────

export async function createJob(data: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) {
  const ref = await addDoc(collection(db, 'jobs'), {
    ...data,
    status: 'posted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  // Notify available workers with matching category in the same city (fire-and-forget)
  if (typeof window !== 'undefined') {
    fetch('/api/notify-workers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId: ref.id,
        jobTitle: data.title,
        category: data.category,
        location: data.location,
      }),
    }).catch(() => {})
  }

  return ref.id
}

export async function getJob(jobId: string): Promise<Job | null> {
  const snap = await getDoc(doc(db, 'jobs', jobId))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Job) : null
}

export function subscribeToJobs(
  category: JobCategory | 'all',
  callback: (jobs: Job[]) => void
): Unsubscribe {
  let q =
    category === 'all'
      ? query(collection(db, 'jobs'), where('status', '==', 'posted'), orderBy('createdAt', 'desc'))
      : query(
          collection(db, 'jobs'),
          where('status', '==', 'posted'),
          where('category', '==', category),
          orderBy('createdAt', 'desc')
        )
  return onSnapshot(q, (snap) => {
    const jobs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Job))
    // Pro workers surface first, then by recency
    jobs.sort((a, b) => {
      const aPro = (a as any).workerIsPro ? 1 : 0
      const bPro = (b as any).workerIsPro ? 1 : 0
      if (bPro !== aPro) return bPro - aPro
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    callback(jobs)
  })
}

export function subscribeToCustomerJobs(
  customerId: string,
  callback: (jobs: Job[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'jobs'),
    where('customerId', '==', customerId),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Job)))
  })
}

export function subscribeToWorkerJobs(
  workerId: string,
  callback: (jobs: Job[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'jobs'),
    where('workerId', '==', workerId),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Job)))
  })
}

// Atomic accept: only one worker wins
export async function acceptJob(
  jobId: string,
  workerId: string,
  workerName: string,
  workerPhoto?: string
): Promise<boolean> {
  const jobRef = doc(db, 'jobs', jobId)
  try {
    let chatId = ''
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(jobRef)
      if (!snap.exists()) throw new Error('Job not found')
      const data = snap.data() as Job
      if (data.status !== 'posted') throw new Error('Job already taken')

      // Create chat inside transaction
      const chatRef = doc(collection(db, 'chats'))
      chatId = chatRef.id
      const chat: Omit<Chat, 'id'> = {
        jobId,
        jobTitle: data.title,
        customerId: data.customerId,
        customerName: data.customerName,
        customerPhoto: data.customerPhoto,
        workerId,
        workerName,
        workerPhoto,
        createdAt: new Date().toISOString(),
      }
      tx.set(chatRef, chat)

      tx.update(jobRef, {
        status: 'accepted',
        workerId,
        workerName,
        workerPhoto: workerPhoto || '',
        chatId,
        acceptedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    })

    // Notify customer via in-app notification
    const job = await getJob(jobId)
    await createNotification({
      userId: job!.customerId,
      type: 'job_accepted',
      title: 'Job Accepted! 🎉',
      body: `${workerName} accepted your job request`,
      jobId,
      chatId,
    })

    // Send transactional email to customer (fire-and-forget)
    if (typeof window !== 'undefined' && job?.customerEmail) {
      fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'job_accepted',
          to: job.customerEmail,
          name: job.customerName,
          workerName,
          jobTitle: job.title,
          chatId,
          jobId,
        }),
      }).catch(() => {})
    }

    return true
  } catch {
    return false
  }
}

export async function updateJobStatus(
  jobId: string,
  status: Job['status']
): Promise<void> {
  await updateDoc(doc(db, 'jobs', jobId), {
    status,
    updatedAt: new Date().toISOString(),
    ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {}),
  })

  // Release escrowed funds to worker when job is completed
  if (status === 'completed' && typeof window !== 'undefined') {
    fetch('/api/payment/release', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId }),
    }).catch(() => {})
  }
}

// ─── CHAT ────────────────────────────────────────────────────────────────────

export function subscribeToMessages(
  chatId: string,
  callback: (messages: Message[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'asc')
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message)))
  })
}

export async function sendMessage(
  chatId: string,
  message: Omit<Message, 'id' | 'createdAt'>
): Promise<void> {
  const msgRef = collection(db, 'chats', chatId, 'messages')
  await addDoc(msgRef, { ...message, createdAt: new Date().toISOString() })
  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: message.text || '📷 Image',
    lastMessageAt: new Date().toISOString(),
  })
}

export function subscribeToChats(
  userId: string,
  role: 'customer' | 'worker',
  callback: (chats: Chat[]) => void
): Unsubscribe {
  const field = role === 'customer' ? 'customerId' : 'workerId'
  const q = query(collection(db, 'chats'), where(field, '==', userId))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Chat)))
  })
}

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────

export async function createNotification(
  data: Omit<Notification, 'id' | 'read' | 'createdAt'>
): Promise<void> {
  await addDoc(collection(db, 'notifications'), {
    ...data,
    read: false,
    createdAt: new Date().toISOString(),
  })
}

export function subscribeToNotifications(
  userId: string,
  callback: (notifs: Notification[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notification)))
  })
}

export async function markNotificationRead(notifId: string): Promise<void> {
  await updateDoc(doc(db, 'notifications', notifId), { read: true })
}

// ─── IMAGE UTILS (Cloudinary) ────────────────────────────────────────────────

/**
 * Compresses an image file using a canvas to reduce file size before upload.
 * Targets ≤ 800px wide / tall and 0.82 JPEG quality — cuts a 6MB iPhone photo
 * down to ~150KB while keeping it visually sharp on mobile screens.
 */
export async function compressImage(file: File, maxDim = 1200, quality = 0.82): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width <= maxDim && height <= maxDim) {
        // Already small enough — skip compression
        resolve(file)
        return
      }
      if (width > height) {
        height = Math.round((height * maxDim) / width)
        width = maxDim
      } else {
        width = Math.round((width * maxDim) / height)
        height = maxDim
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('Compression failed')); return }
          resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }))
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')) }
    img.src = url
  })
}

/**
 * Uploads a file to Cloudinary via unsigned upload and returns the secure URL.
 * Automatically compresses large images before upload.
 * Set in .env.local:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME   — your Cloudinary cloud name
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET — an unsigned upload preset
 * (Free tier at cloudinary.com, no credit card required.)
 */
export async function uploadImage(file: File, _path: string): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local'
    )
  }

  // Compress image before upload (saves Firebase Storage bandwidth + speeds 4G loads)
  const compressed = await compressImage(file).catch(() => file)

  const formData = new FormData()
  formData.append('file', compressed)
  formData.append('upload_preset', uploadPreset)
  // Use the first segment of _path as a Cloudinary folder (e.g. "avatars", "jobs", "chats")
  const folder = _path.split('/')[0]
  if (folder) formData.append('folder', folder)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || 'Cloudinary upload failed')
  }

  const data = await res.json()
  return data.secure_url as string
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────

export async function createReview(
  data: Omit<Review, 'id' | 'createdAt'>
): Promise<void> {
  await addDoc(collection(db, 'reviews'), {
    ...data,
    createdAt: new Date().toISOString(),
  })

  // Update worker's average rating
  const reviews = await getDocs(
    query(collection(db, 'reviews'), where('revieweeId', '==', data.revieweeId))
  )
  const total = reviews.docs.reduce((sum, d) => sum + (d.data().rating as number), 0)
  const avg = total / reviews.docs.length
  await updateDoc(doc(db, 'users', data.revieweeId), {
    rating: Math.round(avg * 10) / 10,
    reviewCount: reviews.docs.length,
  })
}

export async function getWorkerReviews(workerId: string): Promise<Review[]> {
  const q = query(
    collection(db, 'reviews'),
    where('revieweeId', '==', workerId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review))
}

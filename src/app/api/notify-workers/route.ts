import { NextRequest, NextResponse } from 'next/server'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * POST /api/notify-workers
 * Sends FCM push notifications to all available workers in the same city when a job is posted.
 *
 * Called from: lib/firestore.ts → createJob() after the job doc is written
 * Body: { jobId, jobTitle, category, location }
 *
 * Required env vars:
 *   FIREBASE_SERVER_KEY   — FCM legacy server key (Firebase console → Project settings → Cloud Messaging)
 *   Or upgrade to FCM HTTP v1 with a service account for production.
 */
export async function POST(req: NextRequest) {
  const serverKey = process.env.FIREBASE_SERVER_KEY
  if (!serverKey) {
    return NextResponse.json({ error: 'FIREBASE_SERVER_KEY not set' }, { status: 500 })
  }

  const { jobId, jobTitle, category, location } = await req.json()
  if (!jobId || !jobTitle) {
    return NextResponse.json({ error: 'jobId and jobTitle required' }, { status: 400 })
  }

  // Find all available workers who match the category and have an FCM token
  const cityKeyword = location?.split(',')[0]?.trim().toLowerCase() ?? ''

  const workersSnap = await getDocs(
    query(
      collection(db, 'users'),
      where('role', '==', 'worker'),
      where('isAvailable', '==', true)
    )
  )

  const tokens: string[] = []
  workersSnap.docs.forEach((d) => {
    const w = d.data()
    if (!w.fcmToken) return
    // Filter by category if worker has one set
    if (w.category && category && w.category.toLowerCase() !== category.toLowerCase()) return
    // Optionally filter by city using worker's stored location field
    if (cityKeyword && w.location) {
      if (!w.location.toLowerCase().includes(cityKeyword)) return
    }
    tokens.push(w.fcmToken)
  })

  if (tokens.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, reason: 'No matching available workers' })
  }

  // FCM multicast — batch into groups of 500 (FCM limit)
  let totalSent = 0
  for (let i = 0; i < tokens.length; i += 500) {
    const batch = tokens.slice(i, i + 500)
    const res = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${serverKey}`,
      },
      body: JSON.stringify({
        registration_ids: batch,
        notification: {
          title: `New ${category} job nearby 📍`,
          body: jobTitle,
          icon: '/icon-192.png',
          click_action: `https://rapidfix.in/jobs/${jobId}`,
        },
        data: { jobId, type: 'new_job' },
        android: { priority: 'high' },
        apns: { headers: { 'apns-priority': '10' } },
      }),
    })
    if (res.ok) totalSent += batch.length
  }

  return NextResponse.json({ ok: true, sent: totalSent, total: tokens.length })
}

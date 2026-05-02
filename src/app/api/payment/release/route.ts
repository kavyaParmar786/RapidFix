import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * POST /api/payment/release
 * Releases escrowed funds to the worker when a job is marked as completed.
 *
 * Called from:  lib/firestore.ts → updateJobStatus() when status → 'completed'
 * Body: { jobId: string }
 *
 * Flow:
 *   1. Verify job exists + paymentStatus === 'held'
 *   2. Credit pendingEarnings on worker's Firestore user doc (92% — platform keeps 8%)
 *   3. Update job paymentStatus → 'released'
 *   4. Send completion email to customer asking for a review
 */
export async function POST(req: NextRequest) {
  const { jobId } = await req.json()
  if (!jobId) return NextResponse.json({ error: 'jobId required' }, { status: 400 })

  const jobRef = doc(db, 'jobs', jobId)
  const snap = await getDoc(jobRef)
  if (!snap.exists()) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

  const job = snap.data()

  // Only release if payment was captured (held in escrow)
  if (job.paymentStatus !== 'held') {
    return NextResponse.json({ ok: true, skipped: true, reason: 'Payment not held' })
  }

  const grossAmount = job.budget ?? 0
  const platformFee = Math.round(grossAmount * 0.08)         // platform takes 8%
  const workerEarnings = grossAmount - platformFee

  // Credit worker's pending earnings in Firestore
  if (job.workerId) {
    const workerRef = doc(db, 'users', job.workerId)
    const workerSnap = await getDoc(workerRef)
    const current = workerSnap.exists() ? (workerSnap.data().pendingEarnings ?? 0) : 0
    await updateDoc(workerRef, {
      pendingEarnings: current + workerEarnings,
      totalEarned: (workerSnap.data()?.totalEarned ?? 0) + workerEarnings,
    })
  }

  // Mark job as released
  await updateDoc(jobRef, {
    paymentStatus: 'released',
    releasedAt: new Date().toISOString(),
    workerEarnings,
    platformFee,
    updatedAt: new Date().toISOString(),
  })

  // Send review request email to customer
  if (job.customerEmail) {
    fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'job_completed',
        to: job.customerEmail,
        name: job.customerName,
        jobTitle: job.title,
        workerName: job.workerName,
        jobId,
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true, workerEarnings, platformFee })
}

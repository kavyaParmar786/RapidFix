import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * POST /api/payment/webhook
 * Receives Razorpay webhook events and releases funds on payment capture.
 *
 * Required env vars:
 *   RAZORPAY_WEBHOOK_SECRET — webhook signing secret from Razorpay dashboard
 *
 * Razorpay dashboard → Settings → Webhooks → Add:
 *   URL: https://your-domain.in/api/payment/webhook
 *   Events: payment.captured, payment.failed
 */

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature') || ''

  // Verify webhook signature
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  if (expected !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)
  const eventType: string = event.event

  if (eventType === 'payment.captured') {
    const payment = event.payload?.payment?.entity
    const jobId = payment?.notes?.jobId

    if (jobId) {
      try {
        const jobRef = doc(db, 'jobs', jobId)
        const snap = await getDoc(jobRef)
        if (snap.exists()) {
          // ESCROW: mark payment as held — funds will only release when job is completed
          await updateDoc(jobRef, {
            paymentStatus: 'held',       // "held" = money captured but not yet released to worker
            paymentId: payment.id,
            paidAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          // No worker payout yet — that fires when job status changes to "completed"
          // See: api/payment/release/route.ts
        }
      } catch (err) {
        console.error('[webhook] Firestore update failed:', err)
      }
    }
  }

  if (eventType === 'payment.failed') {
    const payment = event.payload?.payment?.entity
    const jobId = payment?.notes?.jobId
    if (jobId) {
      try {
        await updateDoc(doc(db, 'jobs', jobId), {
          paymentStatus: 'failed',
          updatedAt: new Date().toISOString(),
        })
      } catch (err) {
        console.error('[webhook] Failed payment update error:', err)
      }
    }
  }

  return NextResponse.json({ received: true })
}

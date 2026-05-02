import { NextRequest, NextResponse } from 'next/server'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * POST /api/subscription/create
 * Creates a Razorpay subscription for a worker's Pro plan (₹299/month).
 * Pro workers get:  priority listing in feed, "Pro" badge, unlimited job accepts
 *
 * Body: { workerId: string }
 *
 * Required env vars:
 *   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
 *   RAZORPAY_SUBSCRIPTION_PLAN_ID  — create once in Razorpay dashboard → Subscriptions → Plans
 *     Plan amount: 29900 paise (₹299), interval: monthly
 */
export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  const planId = process.env.RAZORPAY_SUBSCRIPTION_PLAN_ID

  if (!keyId || !keySecret || !planId) {
    return NextResponse.json({ error: 'Subscription not configured' }, { status: 500 })
  }

  const { workerId } = await req.json()
  if (!workerId) return NextResponse.json({ error: 'workerId required' }, { status: 400 })

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')

  const res = await fetch('https://api.razorpay.com/v1/subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
    body: JSON.stringify({
      plan_id: planId,
      total_count: 12,               // auto-renews for 12 months, then prompts again
      quantity: 1,
      notes: { workerId },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ error: err?.error?.description || 'Subscription creation failed' }, { status: 500 })
  }

  const sub = await res.json()
  return NextResponse.json({
    subscriptionId: sub.id,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    status: sub.status,
  })
}

/**
 * POST /api/subscription/webhook
 * Razorpay sends subscription events here.
 * Add in Razorpay dashboard: subscription.activated, subscription.halted, subscription.cancelled
 */
export async function PUT(req: NextRequest) {
  const { event, payload } = await req.json()
  const workerId = payload?.subscription?.entity?.notes?.workerId

  if (!workerId) return NextResponse.json({ ok: true })

  const workerRef = doc(db, 'users', workerId)

  if (event === 'subscription.activated') {
    await updateDoc(workerRef, {
      isPro: true,
      proSince: new Date().toISOString(),
      subscriptionId: payload.subscription.entity.id,
    })
  }

  if (event === 'subscription.halted' || event === 'subscription.cancelled') {
    await updateDoc(workerRef, {
      isPro: false,
      proExpiredAt: new Date().toISOString(),
    })
  }

  return NextResponse.json({ ok: true })
}

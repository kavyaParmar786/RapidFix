import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * POST /api/payment/create-order
 * Creates a Razorpay order and returns the order_id + key to the client.
 *
 * Body: { amount: number (in paise), jobId: string, currency?: string }
 *
 * Required env vars (.env.local):
 *   RAZORPAY_KEY_ID       — your live/test key id
 *   RAZORPAY_KEY_SECRET   — your live/test key secret
 *   NEXT_PUBLIC_RAZORPAY_KEY_ID — same key id, exposed to browser
 */
export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 })
  }

  const { amount, jobId, currency = 'INR' } = await req.json()

  if (!amount || !jobId) {
    return NextResponse.json({ error: 'amount and jobId are required' }, { status: 400 })
  }

  // amount must be in paise (₹1 = 100 paise)
  // IMPORTANT: fee is calculated SERVER-SIDE so users cannot tamper with it via DevTools.
  // Client sends base service amount only; platform fee (2%) is added here.
  const baseAmountPaise = Math.round(amount)          // service cost from client (paise)
  const platformFeePaise = Math.round(baseAmountPaise * 0.02)
  const totalAmountPaise = baseAmountPaise + platformFeePaise

  const body = JSON.stringify({
    amount: totalAmountPaise,
    currency,
    receipt: `job_${jobId}_${Date.now()}`,
    notes: { jobId, baseAmount: baseAmountPaise, platformFee: platformFeePaise },
  })

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')

  const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
    body,
  })

  if (!rzpRes.ok) {
    const err = await rzpRes.json().catch(() => ({}))
    return NextResponse.json({ error: err?.error?.description || 'Razorpay error' }, { status: 500 })
  }

  const order = await rzpRes.json()

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  })
}

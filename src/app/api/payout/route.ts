import { NextRequest, NextResponse } from 'next/server'
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * POST /api/payout
 * Initiates a Razorpay Payout to a worker's bank account.
 *
 * Body: {
 *   workerId: string
 *   amount: number        — in rupees (we convert to paise)
 *   accountNumber: string
 *   ifsc: string
 *   accountHolderName: string
 * }
 *
 * Required env vars:
 *   RAZORPAY_KEY_ID
 *   RAZORPAY_KEY_SECRET
 *   RAZORPAY_ACCOUNT_NUMBER  — your RazorpayX current account number
 *
 * Note: Razorpay Payouts requires a RazorpayX account (free, apply at razorpay.com).
 */
export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  const razorpayAccountNumber = process.env.RAZORPAY_ACCOUNT_NUMBER

  if (!keyId || !keySecret || !razorpayAccountNumber) {
    return NextResponse.json({ error: 'Razorpay Payouts not configured' }, { status: 500 })
  }

  const { workerId, amount, accountNumber, ifsc, accountHolderName } = await req.json()

  if (!workerId || !amount || !accountNumber || !ifsc || !accountHolderName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')

  // Step 1: Create a contact
  const contactRes = await fetch('https://api.razorpay.com/v1/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
    body: JSON.stringify({ name: accountHolderName, type: 'employee', reference_id: workerId }),
  })
  if (!contactRes.ok) {
    const err = await contactRes.json().catch(() => ({}))
    return NextResponse.json({ error: err?.error?.description || 'Contact creation failed' }, { status: 500 })
  }
  const contact = await contactRes.json()

  // Step 2: Create a fund account (bank)
  const faRes = await fetch('https://api.razorpay.com/v1/fund_accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
    body: JSON.stringify({
      contact_id: contact.id,
      account_type: 'bank_account',
      bank_account: { name: accountHolderName, ifsc, account_number: accountNumber },
    }),
  })
  if (!faRes.ok) {
    const err = await faRes.json().catch(() => ({}))
    return NextResponse.json({ error: err?.error?.description || 'Fund account creation failed' }, { status: 500 })
  }
  const fundAccount = await faRes.json()

  // Step 3: Create payout
  const payoutRes = await fetch('https://api.razorpay.com/v1/payouts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
      'X-Payout-Idempotency': `${workerId}_${Date.now()}`,
    },
    body: JSON.stringify({
      account_number: razorpayAccountNumber,
      fund_account_id: fundAccount.id,
      amount: Math.round(amount * 100),  // paise
      currency: 'INR',
      mode: 'IMPS',
      purpose: 'payout',
      queue_if_low_balance: true,
      reference_id: `rf_payout_${workerId}_${Date.now()}`,
      narration: 'RapidFix Earnings',
    }),
  })
  if (!payoutRes.ok) {
    const err = await payoutRes.json().catch(() => ({}))
    return NextResponse.json({ error: err?.error?.description || 'Payout failed' }, { status: 500 })
  }
  const payout = await payoutRes.json()

  // Record payout in Firestore
  await addDoc(collection(db, 'payouts'), {
    workerId,
    amount,
    razorpayPayoutId: payout.id,
    status: payout.status,
    createdAt: new Date().toISOString(),
  })

  // Deduct from worker's pending earnings
  await updateDoc(doc(db, 'users', workerId), {
    pendingEarnings: 0,
    lastPayoutAt: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true, payoutId: payout.id, status: payout.status })
}

import { NextRequest, NextResponse } from 'next/server'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * POST /api/promo
 * Validates a promo code and returns the discount amount.
 *
 * Body: { code: string, amount: number, userId: string }
 * Response: { valid: true, discount: number, type: 'percent'|'flat', finalAmount: number }
 *          | { valid: false, error: string }
 *
 * Promo codes live in Firestore collection "promoCodes" with fields:
 *   code (string, uppercase), type ('percent'|'flat'), value (number),
 *   maxUses (number), usedCount (number), expiresAt (ISO string),
 *   active (boolean), minOrderAmount (number, optional)
 */
export async function POST(req: NextRequest) {
  const { code, amount, userId } = await req.json()

  if (!code || !amount || !userId) {
    return NextResponse.json({ valid: false, error: 'Missing required fields' }, { status: 400 })
  }

  const q = query(
    collection(db, 'promoCodes'),
    where('code', '==', code.toUpperCase()),
    where('active', '==', true)
  )
  const snap = await getDocs(q)

  if (snap.empty) {
    return NextResponse.json({ valid: false, error: 'Invalid or expired promo code' })
  }

  const promoDoc = snap.docs[0]
  const promo = promoDoc.data()

  // Check expiry
  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return NextResponse.json({ valid: false, error: 'This promo code has expired' })
  }

  // Check usage limit
  if (promo.maxUses && promo.usedCount >= promo.maxUses) {
    return NextResponse.json({ valid: false, error: 'This promo code has reached its usage limit' })
  }

  // Check minimum order amount
  if (promo.minOrderAmount && amount < promo.minOrderAmount) {
    return NextResponse.json({
      valid: false,
      error: `Minimum order of ₹${promo.minOrderAmount} required for this code`,
    })
  }

  // Calculate discount
  let discount = 0
  if (promo.type === 'percent') {
    discount = Math.round((amount * promo.value) / 100)
    if (promo.maxDiscount) discount = Math.min(discount, promo.maxDiscount)
  } else {
    discount = Math.min(promo.value, amount)
  }

  const finalAmount = Math.max(0, amount - discount)

  // Increment usage count
  await updateDoc(doc(db, 'promoCodes', promoDoc.id), {
    usedCount: (promo.usedCount || 0) + 1,
  })

  return NextResponse.json({
    valid: true,
    discount,
    type: promo.type,
    value: promo.value,
    finalAmount,
    message: promo.type === 'percent'
      ? `${promo.value}% off applied! You save ₹${discount}`
      : `₹${discount} off applied!`,
  })
}

/**
 * GET /api/promo — Admin: list all promo codes
 */
export async function GET() {
  const snap = await getDocs(collection(db, 'promoCodes'))
  const codes = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  return NextResponse.json({ codes })
}

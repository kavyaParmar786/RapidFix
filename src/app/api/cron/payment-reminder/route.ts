import { NextRequest, NextResponse } from 'next/server'
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * GET /api/cron/payment-reminder
 * Runs once per day at 10am via Vercel Cron (Hobby plan limit: once/day).
 * Finds jobs that are "accepted" but unpaid after 30+ minutes and sends a reminder.
 *
 * vercel.json schedule: "0 10 * * *"  ← runs at 10:00 AM UTC daily
 *
 * ⚠️  If you upgrade to Vercel Pro, change schedule to "*/30 * * * *" for
 *     real-time 30-minute reminders.
 */
export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const now = Date.now()
  const thirtyMinutesAgo = new Date(now - 30 * 60 * 1000).toISOString()
  const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000).toISOString()

  // Find accepted jobs with no payment, created 30–120 min ago, not yet reminded
  const snap = await getDocs(
    query(
      collection(db, 'jobs'),
      where('status', '==', 'accepted'),
      where('paymentStatus', '==', null),
      where('paymentReminderSent', '==', false)
    )
  )

  let sent = 0
  const { updateDoc, doc } = await import('firebase/firestore')

  for (const jobDoc of snap.docs) {
    const job = jobDoc.data()
    const createdAt = job.createdAt as string
    if (createdAt < twoHoursAgo || createdAt > thirtyMinutesAgo) continue
    if (!job.customerEmail) continue

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'payment_reminder',
          to: job.customerEmail,
          name: job.customerName,
          jobTitle: job.title,
          workerName: job.workerName,
          jobId: jobDoc.id,
        }),
      })

      // Mark as reminded so we don't spam
      await updateDoc(doc(db, 'jobs', jobDoc.id), {
        paymentReminderSent: true,
        paymentReminderAt: new Date().toISOString(),
      })
      sent++
    } catch (err) {
      console.error('[cron] Failed to send reminder for job', jobDoc.id, err)
    }
  }

  return NextResponse.json({ ok: true, sent, checked: snap.size })
}

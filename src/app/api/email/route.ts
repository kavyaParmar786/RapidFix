import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/email
 * Sends transactional emails via Resend (free tier: 3,000/month).
 *
 * Body: { type, to, name, ...extra }
 *
 * Supported types:
 *   signup          — welcome email after registration
 *   job_accepted    — customer: worker accepted your job
 *   job_completed   — customer: job marked complete, please review
 *   job_posted      — worker: new job available matching your skills
 *
 * Set RESEND_API_KEY in .env.local (get it free at resend.com).
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not set' }, { status: 500 })
  }

  const body = await req.json()
  const { type, to, name } = body

  if (!type || !to) {
    return NextResponse.json({ error: 'Missing type or to' }, { status: 400 })
  }

  const from = 'RapidFix <noreply@rapidfix.in>'
  let subject = ''
  let html = ''

  switch (type) {
    case 'signup': {
      subject = 'Welcome to RapidFix! 🔧'
      html = emailTemplate(`Hi ${name || 'there'} 👋`, `
        <p>Thanks for joining <strong>RapidFix</strong> — your go-to platform for fast, reliable home services.</p>
        <p>Here's what you can do next:</p>
        <ul>
          <li>Browse available services in your city</li>
          <li>Post a job and get matched with a professional in minutes</li>
          <li>Track job status in real-time</li>
        </ul>
        <a href="https://rapidfix.in/jobs/browse" class="btn">Browse Services →</a>
      `)
      break
    }

    case 'job_accepted': {
      const { workerName, jobTitle, chatId, jobId } = body
      subject = `${workerName} accepted your job! 🎉`
      html = emailTemplate('Your job has been accepted', `
        <p>Good news, <strong>${name || 'there'}</strong>!</p>
        <p><strong>${workerName}</strong> has accepted your job: <em>${jobTitle}</em>.</p>
        <p>You can now chat with the worker and coordinate the visit.</p>
        <a href="https://rapidfix.in/chat/${chatId || ''}" class="btn">Open Chat →</a>
        <p style="margin-top:16px;font-size:13px;color:#888;">Job ID: ${jobId || 'N/A'}</p>
      `)
      break
    }

    case 'job_completed': {
      const { workerName: wn, jobTitle: jt, jobId: ji } = body
      subject = 'Job completed — please leave a review ⭐'
      html = emailTemplate('How did it go?', `
        <p>Hi <strong>${name || 'there'}</strong>,</p>
        <p>Your job <em>${jt}</em> with <strong>${wn}</strong> has been marked as complete.</p>
        <p>Your feedback helps workers build their reputation and helps other customers choose wisely.</p>
        <a href="https://rapidfix.in/jobs/${ji}" class="btn">Leave a Review →</a>
      `)
      break
    }

    case 'job_posted': {
      const { jobTitle: title, jobLocation, category } = body
      subject = `New ${category} job near you 📍`
      html = emailTemplate('New job available!', `
        <p>Hi <strong>${name || 'there'}</strong>,</p>
        <p>A new <strong>${category}</strong> job has been posted in <strong>${jobLocation}</strong>:</p>
        <blockquote style="border-left:3px solid #6366f1;padding-left:12px;color:#444;">${title}</blockquote>
        <p>Be the first to accept it!</p>
        <a href="https://rapidfix.in/feed" class="btn">View Job →</a>
      `)
      break
    }

    case 'payment_reminder': {
      const { workerName: wr, jobTitle: jt, jobId: ji } = body
      subject = `Don't forget to pay ${wr} 💳`
      html = emailTemplate('Your job is waiting for payment', `
        <p>Hi <strong>${name || 'there'}</strong>,</p>
        <p><strong>${wr}</strong> has accepted your job <em>${jt}</em> and is ready to get started.</p>
        <p>Complete the payment to confirm the booking and get your job done!</p>
        <a href="https://rapidfix.in/jobs/${ji}" class="btn">Pay Now →</a>
        <p style="margin-top:16px;font-size:13px;color:#888;">This reminder was sent because your job has been accepted but not yet paid.</p>
      `)
      break
    }

    default:
      return NextResponse.json({ error: `Unknown email type: ${type}` }, { status: 400 })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ from, to, subject, html }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ error: err?.message || 'Resend error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// ─── Minimal responsive email template ───────────────────────────────────────
function emailTemplate(heading: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width" />
<style>
  body { margin:0; padding:0; background:#f4f4f5; font-family: system-ui, -apple-system, sans-serif; }
  .wrap { max-width:520px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 16px rgba(0,0,0,.08); }
  .head { background:#09090b; padding:24px 32px; }
  .head img { height:28px; }
  .body { padding:28px 32px; color:#1a1a1a; line-height:1.6; }
  .body h2 { margin:0 0 16px; font-size:20px; font-weight:600; }
  .body p, .body li { font-size:14px; color:#333; margin:0 0 10px; }
  .body ul { padding-left:18px; margin:0 0 16px; }
  .body blockquote { margin:0 0 16px; }
  .btn { display:inline-block; margin-top:8px; padding:12px 24px; background:#6366f1; color:#fff!important; border-radius:8px; text-decoration:none; font-size:14px; font-weight:600; }
  .foot { padding:16px 32px; font-size:11px; color:#aaa; border-top:1px solid #f0f0f0; text-align:center; }
</style>
</head>
<body>
<div class="wrap">
  <div class="head">
    <span style="color:#fff;font-weight:700;font-size:20px;letter-spacing:-0.5px;">⚡ RapidFix</span>
  </div>
  <div class="body">
    <h2>${heading}</h2>
    ${bodyHtml}
  </div>
  <div class="foot">You're receiving this because you have an account on RapidFix. &nbsp;·&nbsp; <a href="https://rapidfix.in" style="color:#aaa;">rapidfix.in</a></div>
</div>
</body>
</html>`
}

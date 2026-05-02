'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, CreditCard, Shield, Zap, Lock, Smartphone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import Navbar from '@/components/layout/Navbar'
import toast from 'react-hot-toast'

type PayStep = 'summary' | 'pay' | 'success'

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Card', icon: '💳', desc: 'Credit or Debit card' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
]

function SuccessConfetti() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            background: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'][i % 5],
            left: `${5 + i * 4.5}%`,
            top: '-10%',
          }}
          initial={{ y: '-10%', rotate: 0, opacity: 1 }}
          animate={{ y: '110%', rotate: 360 * (i % 2 === 0 ? 1 : -1), opacity: [1, 1, 0] }}
          transition={{ duration: 1.5 + Math.random(), delay: i * 0.06, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}

function PaymentContent() {
  const searchParams = useSearchParams()
  const { user, profile } = useAuth()
  const [step, setStep] = useState<PayStep>('summary')
  const [method, setMethod] = useState('upi')
  const [upi, setUpi] = useState('')
  const [processing, setProcessing] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState<{ discount: number; message: string } | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState('')

  const amount = Number(searchParams.get('amount') || 500)
  const jobTitle = searchParams.get('job') || 'Home Service'
  const jobId = searchParams.get('jobId') || ''
  const workerName = searchParams.get('worker') || 'Worker'

  const fee = Math.round(amount * 0.02)
  const discount = promoApplied?.discount ?? 0
  const total = Math.max(0, amount + fee - discount)

  const applyPromo = async () => {
    if (!promoCode.trim()) return
    setPromoLoading(true)
    setPromoError('')
    try {
      const res = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim(), amount: amount + fee, userId: user?.uid }),
      })
      const data = await res.json()
      if (data.valid) {
        setPromoApplied({ discount: data.discount, message: data.message })
        setPromoError('')
      } else {
        setPromoError(data.error || 'Invalid code')
        setPromoApplied(null)
      }
    } catch {
      setPromoError('Could not validate code. Try again.')
    } finally {
      setPromoLoading(false)
    }
  }

  const removePromo = () => {
    setPromoApplied(null)
    setPromoCode('')
    setPromoError('')
  }

  const handlePay = async () => {
    setProcessing(true)
    try {
      // 1. Create order server-side
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount * 100, jobId }),  // base paise — server adds 2% fee
      })
      if (!res.ok) throw new Error('Could not create payment order')
      const order = await res.json()

      // 2. Load Razorpay checkout SDK
      await new Promise<void>((resolve, reject) => {
        if ((window as any).Razorpay) { resolve(); return }
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Razorpay SDK load failed'))
        document.head.appendChild(script)
      })

      // 3. Open Razorpay checkout
      await new Promise<void>((resolve, reject) => {
        const rzp = new (window as any).Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          order_id: order.orderId,
          name: 'RapidFix',
          description: jobTitle,
          prefill: {
            name: profile?.displayName || '',
            email: user?.email || '',
          },
          theme: { color: '#6366f1' },
          handler: () => {
            setProcessing(false)
            setStep('success')
            toast.success('Payment successful! 🎉')
            resolve()
          },
          modal: {
            ondismiss: () => {
              setProcessing(false)
              reject(new Error('dismissed'))
            },
          },
        })
        rzp.open()
      })
    } catch (err: any) {
      if (err?.message !== 'dismissed') toast.error(err?.message || 'Payment failed')
      setProcessing(false)
    }
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20" style={{ background: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-lg px-4 py-10">

          <Link href={jobId ? `/jobs/${jobId}` : '/dashboard/customer'}
            className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft size={14} /> Back
          </Link>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mb-8">
            {(['summary', 'pay', 'success'] as PayStep[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <motion.div
                  animate={{
                    background: step === s ? 'var(--accent)' : i < ['summary','pay','success'].indexOf(step) ? '#22c55e' : 'var(--bg-elevated)',
                    scale: step === s ? 1.1 : 1,
                  }}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ color: step === s || i < ['summary','pay','success'].indexOf(step) ? 'var(--bg-base)' : 'var(--text-muted)' }}
                >
                  {i < ['summary','pay','success'].indexOf(step) ? '✓' : i + 1}
                </motion.div>
                <span className="text-xs capitalize hidden sm:block" style={{ color: step === s ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s}</span>
                {i < 2 && <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait" custom={step === 'pay' ? 1 : step === 'success' ? 1 : -1}>
            {step === 'summary' && (
              <motion.div key="summary" variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card p-6 space-y-5"
              >
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Payment Summary</h1>

                {/* Job info */}
                <div className="rounded-xl p-4 space-y-2" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>Service</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{jobTitle}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>Worker</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{workerName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>Service fee</span>
                    <span style={{ color: 'var(--text-secondary)' }}>₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>Platform fee (2%)</span>
                    <span style={{ color: 'var(--text-secondary)' }}>₹{fee}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">Promo discount</span>
                      <span className="text-green-400 font-medium">−₹{promoApplied.discount}</span>
                    </div>
                  )}
                  <div className="h-px" style={{ background: 'var(--border-default)' }} />
                  <div className="flex justify-between text-base font-bold">
                    <span style={{ color: 'var(--text-primary)' }}>Total</span>
                    <motion.span
                      key={total}
                      initial={{ scale: 0.85 }} animate={{ scale: 1 }}
                      className="text-green-500">₹{total.toLocaleString()}</motion.span>
                  </div>
                </div>

                {/* Promo code */}
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Promo / referral code
                  </label>
                  {promoApplied ? (
                    <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)' }}>
                      <span className="text-green-400 flex-1 font-medium">{promoApplied.message}</span>
                      <button onClick={removePromo} className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError('') }}
                        onKeyDown={e => e.key === 'Enter' && applyPromo()}
                        placeholder="Enter code"
                        className="input-base flex-1 rounded-xl font-mono tracking-wider text-sm"
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={applyPromo}
                        disabled={promoLoading || !promoCode.trim()}
                        className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}
                      >
                        {promoLoading ? '…' : 'Apply'}
                      </motion.button>
                    </div>
                  )}
                  {promoError && <p className="text-xs text-red-400 mt-1.5">{promoError}</p>}
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-4 flex-wrap">
                  {[
                    { icon: Shield, text: 'Secure payment' },
                    { icon: Lock, text: '256-bit encrypted' },
                    { icon: Zap, text: 'Instant release' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Icon size={11} /> {text}
                    </div>
                  ))}
                </div>

                <motion.button onClick={() => setStep('pay')}
                  whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
                  className="btn-primary w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                  <CreditCard size={16} /> Proceed to Pay ₹{total.toLocaleString()}
                </motion.button>
              </motion.div>
            )}

            {step === 'pay' && (
              <motion.div key="pay" variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card p-6 space-y-5"
              >
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Choose payment method</h2>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map((m, i) => (
                    <motion.button key={m.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      onClick={() => setMethod(m.id)}
                      className="w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all"
                      style={{
                        background: method === m.id ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                        border: `1px solid ${method === m.id ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
                      }}
                    >
                      <span className="text-xl">{m.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{m.label}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.desc}</p>
                      </div>
                      <motion.div
                        animate={{ scale: method === m.id ? 1 : 0.7, opacity: method === m.id ? 1 : 0 }}
                        className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--accent)' }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--bg-base)' }} />
                      </motion.div>
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence>
                  {method === 'upi' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>UPI ID</label>
                      <div className="relative">
                        <Smartphone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                        <input type="text" value={upi} onChange={e => setUpi(e.target.value)}
                          placeholder="yourname@upi" className="input-base pl-10 rounded-xl" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button onClick={handlePay} disabled={processing}
                  whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
                  className="btn-primary w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 relative overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {processing ? (
                      <motion.span key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2">
                        <motion.div className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current"
                          animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                        Processing payment…
                      </motion.span>
                    ) : (
                      <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2">
                        <Lock size={14} /> Pay ₹{total.toLocaleString()} securely
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <button onClick={() => setStep('summary')}
                  className="w-full text-center text-xs transition-colors" style={{ color: 'var(--text-muted)' }}>
                  ← Change amount
                </button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="success" variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card p-8 text-center relative overflow-hidden"
              >
                <SuccessConfetti />

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.2 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.3)' }}
                >
                  <CheckCircle size={36} className="text-green-500" />
                </motion.div>

                <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Payment successful!
                </motion.h2>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                  ₹{total.toLocaleString()} paid for <strong style={{ color: 'var(--text-primary)' }}>{jobTitle}</strong>
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="text-xs mb-8" style={{ color: 'var(--text-muted)' }}>
                  Funds will be released to {workerName} after job completion.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                  className="flex gap-3 justify-center">
                  <Link href="/dashboard/customer" className="btn-primary rounded-xl px-6 py-2.5 text-sm">
                    Go to Dashboard
                  </Link>
                  {jobId && (
                    <Link href={`/jobs/${jobId}`} className="btn-ghost rounded-xl px-6 py-2.5 text-sm">
                      View Job
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
            Powered by Razorpay · Secured by 256-bit encryption
          </p>
        </div>
      </div>
    </>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="h-5 w-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--border-strong)', borderTopColor: 'transparent' }} />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}

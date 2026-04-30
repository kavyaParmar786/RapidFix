'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Share2, Gift, Users, IndianRupee, ArrowRight, Zap } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'

const MOCK_REFERRALS = [
  { name: 'Sneha M.', date: '2 days ago', status: 'signed_up', credit: 100 },
  { name: 'Raj K.', date: '1 week ago', status: 'booked', credit: 100 },
  { name: 'Arjun S.', date: '2 weeks ago', status: 'booked', credit: 100 },
]

function FloatingCredit({ amount }: { amount: number }) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 1, scale: 1 }}
      animate={{ y: -60, opacity: 0, scale: 1.3 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className="absolute top-0 left-1/2 -translate-x-1/2 text-lg font-bold text-green-400 pointer-events-none"
    >
      +₹{amount}
    </motion.div>
  )
}

export default function ReferralPage() {
  const { user, profile } = useAuth()
  const [copied, setCopied] = useState(false)
  const [showCredit, setShowCredit] = useState(false)

  // Generate stable referral code from user ID
  const referralCode = user ? `RF${user.uid.slice(0, 6).toUpperCase()}` : 'RF------'
  const referralLink = `https://rapidfix.in/auth/signup?ref=${referralCode}`

  const totalEarned = MOCK_REFERRALS.filter(r => r.status === 'booked').length * 100
  const pendingCredit = MOCK_REFERRALS.filter(r => r.status === 'signed_up').length * 100

  const copyCode = async () => {
    await navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setShowCredit(true)
    toast.success('Code copied!')
    setTimeout(() => { setCopied(false); setShowCredit(false) }, 2000)
  }

  const shareLink = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Try RapidFix',
        text: `Get ₹100 off your first home service! Use my code: ${referralCode}`,
        url: referralLink,
      })
    } else {
      await navigator.clipboard.writeText(referralLink)
      toast.success('Link copied!')
    }
  }

  const steps = [
    { icon: Share2, label: 'Share your code', desc: 'Send your unique code to friends and family' },
    { icon: Users, label: 'They sign up', desc: 'Friend creates a RapidFix account using your link' },
    { icon: Zap, label: 'They book a job', desc: 'Friend completes their first home service booking' },
    { icon: Gift, label: 'Both get ₹100', desc: 'You and your friend each receive ₹100 credit instantly' },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20" style={{ background: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-2xl px-4 py-10">

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, delay: 0.5 }}
              className="text-5xl mb-4">🎁</motion.div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Invite friends, earn{' '}
              <span className="text-green-400">₹100</span> each
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              For every friend who books their first job, you both get ₹100 credit — no limit.
            </p>
          </motion.div>

          {/* Credit summary */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Users, label: 'Referred', value: MOCK_REFERRALS.length, color: 'text-blue-400' },
              { icon: IndianRupee, label: 'Earned', value: `₹${totalEarned}`, color: 'text-green-400' },
              { icon: Gift, label: 'Pending', value: `₹${pendingCredit}`, color: 'text-amber-400' },
            ].map(({ icon: Icon, label, value, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }} className="glass-card p-4 text-center">
                <Icon size={14} className={`${color} mx-auto mb-1.5`} />
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Referral code card */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-6 mb-6 relative overflow-hidden">
            <div className="absolute -top-px left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />

            <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Your referral code</p>

            {/* Code display */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 rounded-xl px-5 py-4 text-center font-mono text-2xl font-bold tracking-[0.2em]"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '2px dashed var(--border-strong)', letterSpacing: '0.25em' }}>
                {referralCode}
              </div>
            </div>

            <div className="flex gap-3 relative">
              {showCredit && <FloatingCredit amount={100} />}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                onClick={copyCode}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>
                <AnimatePresence mode="wait">
                  {copied
                    ? <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-green-400"><Check size={14} /> Copied!</motion.span>
                    : <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2"><Copy size={14} /> Copy code</motion.span>
                  }
                </AnimatePresence>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                onClick={shareLink}
                className="flex-1 btn-primary rounded-xl py-3 text-sm flex items-center justify-center gap-2">
                <Share2 size={14} /> Share link
              </motion.button>
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="glass-card p-6 mb-6">
            <h2 className="font-semibold text-sm mb-5" style={{ color: 'var(--text-primary)' }}>How it works</h2>
            <div className="space-y-4">
              {steps.map(({ icon: Icon, label, desc }, i) => (
                <motion.div key={label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
                    <Icon size={15} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Referral history */}
          {MOCK_REFERRALS.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="glass-card overflow-hidden">
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Your referrals</h2>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                {MOCK_REFERRALS.map((r, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="flex items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                        {r.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status === 'booked' ? 'bg-green-500/12 text-green-400' : 'bg-amber-500/12 text-amber-400'}`}>
                        {r.status === 'booked' ? 'Completed' : 'Signed up'}
                      </span>
                      {r.status === 'booked' && (
                        <span className="text-sm font-bold text-green-400">+₹{r.credit}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
            Credits are valid for 6 months. Max ₹5,000 per account. T&amp;C apply.
          </p>
        </div>
      </div>
    </>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Wallet, Clock, CheckCircle, ArrowUpRight, Download, IndianRupee, Calendar } from 'lucide-react'

const WEEKLY = [1200, 2400, 1800, 3200, 2800, 4100, 3600]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

const MOCK_TRANSACTIONS = [
  { id: '1', job: 'Electrical wiring fix', customer: 'Sneha M.', amount: 1800, date: '2 hours ago', status: 'credited' },
  { id: '2', job: 'Fan installation', customer: 'Raj K.', amount: 650, date: 'Yesterday', status: 'credited' },
  { id: '3', job: 'Switch replacement', customer: 'Kavita J.', amount: 400, date: '2 days ago', status: 'credited' },
  { id: '4', job: 'MCB panel work', customer: 'Arjun S.', amount: 2200, date: '4 days ago', status: 'credited' },
  { id: '5', job: 'Payout to bank', customer: '—', amount: -3500, date: '1 week ago', status: 'withdrawn' },
]

function BarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  return (
    <div className="flex items-end gap-2 h-24 w-full">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(v / max) * 100}%` }}
            transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full rounded-t-md"
            style={{ background: color, opacity: i === data.length - 1 ? 1 : 0.45 }}
          />
          <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{MONTHS[i]}</span>
        </div>
      ))}
    </div>
  )
}

function WithdrawModal({ balance, onClose }: { balance: number; onClose: () => void }) {
  const [amount, setAmount] = useState(String(balance))
  const [step, setStep] = useState<'form' | 'confirm' | 'done'>('form')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 10, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="glass-card p-6 w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Withdraw Earnings</h3>
              <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Available: ₹{balance.toLocaleString()}</p>
              <div className="relative mb-4">
                <IndianRupee size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  max={balance} min={100} className="input-base pl-9 rounded-xl text-lg font-semibold" />
              </div>
              <div className="flex gap-2 flex-wrap mb-5">
                {[500, 1000, 2000, balance].map(q => (
                  <button key={q} onClick={() => setAmount(String(q))}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                    style={{ background: amount === String(q) ? 'var(--accent)' : 'var(--bg-elevated)', color: amount === String(q) ? 'var(--bg-base)' : 'var(--text-muted)', border: '1px solid var(--border-default)' }}>
                    {q === balance ? 'All' : `₹${q}`}
                  </button>
                ))}
              </div>
              <div className="rounded-xl p-3 mb-5 text-xs space-y-1" style={{ background: 'var(--bg-elevated)' }}>
                <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Processing time</span><span style={{ color: 'var(--text-secondary)' }}>1–2 business days</span></div>
                <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Transfer fee</span><span className="text-green-400">Free</span></div>
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 btn-ghost rounded-xl py-2.5 text-sm">Cancel</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setStep('confirm')} disabled={Number(amount) < 100 || Number(amount) > balance}
                  className="flex-1 btn-primary rounded-xl py-2.5 text-sm">Continue</motion.button>
              </div>
            </motion.div>
          )}
          {step === 'confirm' && (
            <motion.div key="confirm" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Confirm withdrawal</h3>
              <div className="rounded-2xl p-5 text-center mb-5" style={{ background: 'var(--bg-elevated)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Amount to withdraw</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>₹{Number(amount).toLocaleString()}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('form')} className="flex-1 btn-ghost rounded-xl py-2.5 text-sm">Back</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setStep('done')} className="flex-1 btn-primary rounded-xl py-2.5 text-sm">Confirm</motion.button>
              </div>
            </motion.div>
          )}
          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }} className="text-center py-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 180, damping: 14 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.3)' }}>
                <CheckCircle size={28} className="text-green-500" />
              </motion.div>
              <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Withdrawal initiated!</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>₹{Number(amount).toLocaleString()} will reach your bank in 1–2 days.</p>
              <button onClick={onClose} className="btn-primary rounded-xl px-8 py-2.5 text-sm">Done</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default function EarningsTab() {
  const [showWithdraw, setShowWithdraw] = useState(false)
  const totalEarned = 19350
  const availableBalance = 5050
  const thisMonth = 6100
  const pending = 1200

  const earningsCards = [
    { icon: Wallet, label: 'Available Balance', value: availableBalance, color: 'text-green-400', highlight: true },
    { icon: TrendingUp, label: 'This Month', value: thisMonth, color: 'text-blue-400', highlight: false },
    { icon: CheckCircle, label: 'Total Earned', value: totalEarned, color: 'text-purple-400', highlight: false },
    { icon: Clock, label: 'Pending Release', value: pending, color: 'text-amber-400', highlight: false },
  ]

  return (
    <>
      {/* Earnings Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {earningsCards.map(({ icon: Icon, label, value, color, highlight }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass-card p-5 relative overflow-hidden"
            style={highlight ? { border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.04)' } : {}}>
            {highlight && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400/60 to-transparent" />}
            <div className="flex items-center justify-between mb-2">
              <Icon size={14} className={color} />
              {highlight && (
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setShowWithdraw(true)}
                  className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg"
                  style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
                  <ArrowUpRight size={9} /> Withdraw
                </motion.button>
              )}
            </div>
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>₹{value.toLocaleString()}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Monthly earnings</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Last 7 months</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 transition-colors"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border-default)' }}>
              <Download size={11} /> Export
            </button>
          </div>
          <BarChart data={WEEKLY} color="var(--accent)" />
        </motion.div>

        {/* Quick stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-card p-5 space-y-4">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>This month</h3>
          {[
            { label: 'Jobs completed', value: '9', icon: CheckCircle, color: 'text-green-400' },
            { label: 'Avg per job', value: '₹678', icon: IndianRupee, color: 'text-blue-400' },
            { label: 'Best day', value: '₹1,800', icon: TrendingUp, color: 'text-purple-400' },
            { label: 'Hours worked', value: '~32h', icon: Calendar, color: 'text-amber-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon size={13} className={color} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Transaction history */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card mt-6 overflow-hidden">
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Transaction history</h3>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {MOCK_TRANSACTIONS.map((tx, i) => (
            <motion.div key={tx.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.06 }}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-[var(--bg-surface)] transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-500/12' : 'bg-red-500/12'}`}>
                  {tx.amount > 0
                    ? <ArrowUpRight size={13} className="text-green-400 rotate-180" />
                    : <ArrowUpRight size={13} className="text-red-400" />}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{tx.job}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{tx.customer !== '—' ? `From ${tx.customer}` : 'Bank transfer'} · {tx.date}</p>
                </div>
              </div>
              <span className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Withdraw modal */}
      <AnimatePresence>
        {showWithdraw && <WithdrawModal balance={availableBalance} onClose={() => setShowWithdraw(false)} />}
      </AnimatePresence>
    </>
  )
}

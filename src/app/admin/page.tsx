'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Briefcase, TrendingUp, AlertTriangle, CheckCircle, XCircle, Clock, Star, Search, ShieldCheck, Ban } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { cn } from '@/lib/utils'

type AdminTab = 'overview' | 'workers' | 'jobs' | 'disputes' | 'promo'

function Counter({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const steps = 40; const inc = value / steps; let cur = 0
    const t = setInterval(() => { cur = Math.min(cur + inc, value); setCount(Math.round(cur)); if (cur >= value) clearInterval(t) }, 30)
    return () => clearInterval(t)
  }, [value])
  return <span>{prefix}{count.toLocaleString()}</span>
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data), h = 32, w = 80
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`).join(' ')
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}><polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} /></svg>
}


const MOCK_DISPUTES = [
  { id: 'd1', jobTitle: 'Fix AC unit', customer: 'Sneha M.', worker: 'Rohit S.', amount: 1800, reason: 'Work not completed properly', date: '2 hours ago' },
  { id: 'd2', jobTitle: 'Paint living room', customer: 'Raj K.', worker: 'Priya S.', amount: 4500, reason: 'Worker cancelled last minute', date: '1 day ago' },
  { id: 'd3', jobTitle: 'Fix electrical wiring', customer: 'Kavita J.', worker: 'Amit P.', amount: 2200, reason: 'Price dispute', date: '2 days ago' },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('overview')
  const [search, setSearch] = useState('')
  const [workerFilter, setWorkerFilter] = useState<'all' | 'pending' | 'verified'>('all')
  const [workers, setWorkers] = useState<any[]>([])

  useEffect(() => {
    async function loadWorkers() {
      try {
        const { collection, query, where, getDocs, orderBy } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')
        const snap = await getDocs(query(
          collection(db, 'users'),
          where('role', '==', 'worker'),
          orderBy('createdAt', 'desc')
        ))
        setWorkers(snap.docs.map(d => ({
          id: d.id,
          name: d.data().displayName || 'Unnamed',
          category: d.data().category || 'Unknown',
          rating: d.data().rating || 0,
          jobs: d.data().completedJobs || 0,
          verified: d.data().isVerified || false,
          joinedDays: Math.floor((Date.now() - new Date(d.data().createdAt).getTime()) / 86400000),
          verificationDocs: d.data().verificationDocs || null,
        })))
      } catch (e) { console.error('Failed to load workers', e) }
    }
    loadWorkers()
  }, [])

  // Promo code state
  const [promos, setPromos] = useState<any[]>([])
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoForm, setPromoForm] = useState({ code: '', type: 'flat', value: '', maxUses: '', expiresAt: '', minOrderAmount: '', active: true })
  const [promoSaving, setPromoSaving] = useState(false)

  const loadPromos = async () => {
    setPromoLoading(true)
    try {
      const res = await fetch('/api/promo')
      const data = await res.json()
      setPromos(data.codes || [])
    } catch {}
    finally { setPromoLoading(false) }
  }

  const savePromo = async () => {
    if (!promoForm.code || !promoForm.value) return
    setPromoSaving(true)
    try {
      const { addDoc, collection } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')
      await addDoc(collection(db, 'promoCodes'), {
        code: promoForm.code.toUpperCase().trim(),
        type: promoForm.type,
        value: Number(promoForm.value),
        maxUses: promoForm.maxUses ? Number(promoForm.maxUses) : null,
        minOrderAmount: promoForm.minOrderAmount ? Number(promoForm.minOrderAmount) : null,
        expiresAt: promoForm.expiresAt || null,
        usedCount: 0,
        active: true,
        createdAt: new Date().toISOString(),
      })
      setPromoForm({ code: '', type: 'flat', value: '', maxUses: '', expiresAt: '', minOrderAmount: '', active: true })
      await loadPromos()
    } catch (e) { console.error(e) }
    finally { setPromoSaving(false) }
  }

  const togglePromo = async (id: string, active: boolean) => {
    const { updateDoc, doc } = await import('firebase/firestore')
    const { db } = await import('@/lib/firebase')
    await updateDoc(doc(db, 'promoCodes', id), { active: !active })
    setPromos(prev => prev.map(p => p.id === id ? { ...p, active: !active } : p))
  }

  useEffect(() => { if (tab === 'promo') loadPromos() }, [tab])

  const filteredWorkers = workers.filter(w => {
    const ms = w.name.toLowerCase().includes(search.toLowerCase()) || w.category.toLowerCase().includes(search.toLowerCase())
    const mf = workerFilter === 'all' || (workerFilter === 'pending' && !w.verified) || (workerFilter === 'verified' && w.verified)
    return ms && mf
  })

  const pendingCount = workers.filter(w => !w.verified).length

  const tabs = [
    { key: 'overview' as AdminTab, label: 'Overview' },
    { key: 'workers' as AdminTab, label: 'Workers', badge: pendingCount },
    { key: 'jobs' as AdminTab, label: 'Jobs' },
    { key: 'disputes' as AdminTab, label: 'Disputes', badge: MOCK_DISPUTES.length },
    { key: 'promo' as AdminTab, label: 'Promo Codes' },
  ]

  const statCards = [
    { label: 'Total Users', value: 1247, icon: Users, color: 'text-blue-400', data: [42,55,61,48,72,89,76], sc: '#60a5fa', prefix: '' },
    { label: 'Active Workers', value: 342, icon: ShieldCheck, color: 'text-green-400', data: [22,28,31,25,35,40,38], sc: '#4ade80', prefix: '' },
    { label: 'Total Jobs', value: 8901, icon: Briefcase, color: 'text-purple-400', data: [420,550,610,480,720,890,760], sc: '#a78bfa', prefix: '' },
    { label: 'Revenue', value: 245000, icon: TrendingUp, color: 'text-amber-400', data: [12000,15000,11000,18000,22000,19000,25000], sc: '#fbbf24', prefix: '₹' },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20" style={{ background: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Platform management & analytics</p>
            </div>
            {pendingCount > 0 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm"
                style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)', color: '#eab308' }}>
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}>
                  <AlertTriangle size={14} />
                </motion.div>
                {pendingCount} pending verifications
              </motion.div>
            )}
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 rounded-xl p-1 mb-8 w-fit" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={cn('relative flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  tab === t.key ? 'bg-[var(--bg-base)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]')}>
                {t.label}
                {t.badge && t.badge > 0 ? (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{ background: t.key === 'disputes' ? '#ef4444' : '#eab308' }}>
                    {t.badge}
                  </motion.span>
                ) : null}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* OVERVIEW */}
            {tab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {statCards.map(({ label, value, icon: Icon, color, data, sc, prefix }, i) => (
                    <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-5">
                      <div className="flex items-start justify-between mb-3">
                        <Icon size={16} className={color} />
                        <Sparkline data={data} color={sc} />
                      </div>
                      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}><Counter value={value} prefix={prefix} /></p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: Star, label: 'Avg Worker Rating', value: '4.7★', color: 'text-amber-400' },
                    { icon: CheckCircle, label: 'Job Completion Rate', value: '94%', color: 'text-green-400' },
                    { icon: AlertTriangle, label: 'Open Disputes', value: MOCK_DISPUTES.length, color: 'text-red-400' },
                  ].map(({ icon: Icon, label, value, color }, i) => (
                    <motion.div key={label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
                      className="flex items-center gap-4 glass-card p-4">
                      <Icon size={20} className={color} />
                      <div>
                        <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {pendingCount > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    className="rounded-2xl p-5 flex items-center justify-between"
                    style={{ background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.2)' }}>
                    <div className="flex items-center gap-3">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                        <Clock size={18} style={{ color: '#eab308' }} />
                      </motion.div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#eab308' }}>{pendingCount} workers awaiting verification</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Review and approve new sign-ups</p>
                      </div>
                    </div>
                    <button onClick={() => { setTab('workers'); setWorkerFilter('pending') }} className="btn-ghost text-xs px-3 py-1.5">Review now →</button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* WORKERS */}
            {tab === 'workers' && (
              <motion.div key="workers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <div className="relative flex-1">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input type="text" placeholder="Search workers…" value={search} onChange={e => setSearch(e.target.value)} className="input-base pl-9 py-2 text-sm" />
                  </div>
                  <div className="flex gap-1.5">
                    {(['all', 'pending', 'verified'] as const).map(f => (
                      <button key={f} onClick={() => setWorkerFilter(f)}
                        className={cn('rounded-lg px-3 py-2 text-xs font-medium capitalize transition-all',
                          workerFilter === f ? 'bg-[var(--accent)] text-[var(--bg-base)]' : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-default)]')}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <tr>
                          {['Worker', 'Category', 'Rating', 'Jobs', 'Joined', 'Status', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {filteredWorkers.map((w, i) => (
                            <motion.tr key={w.id}
                              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                              transition={{ delay: i * 0.04 }}
                              style={{ borderBottom: '1px solid var(--border-subtle)' }}
                              className="hover:bg-[var(--bg-surface)] transition-colors">
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>{w.name[0]}</div>
                                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{w.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>{w.category}</td>
                              <td className="px-4 py-3.5">{w.rating > 0 ? <span className="text-amber-400 text-xs font-semibold">★ {w.rating}</span> : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                              <td className="px-4 py-3.5 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{w.jobs}</td>
                              <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>{w.joinedDays}d ago</td>
                              <td className="px-4 py-3.5">
                                <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', w.verified ? 'bg-green-500/15 text-green-400' : 'bg-amber-500/15 text-amber-400')}>
                                  <span className="h-1 w-1 rounded-full bg-current" />{w.verified ? 'Verified' : 'Pending'}
                                </span>
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-1.5">
                                  {!w.verified && (
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                      onClick={async () => {
                                        try {
                                          const { updateDoc, doc } = await import('firebase/firestore')
                                          const { db } = await import('@/lib/firebase')
                                          await updateDoc(doc(db, 'users', w.id), {
                                            isVerified: true,
                                            verifiedAt: new Date().toISOString(),
                                          })
                                          setWorkers(prev => prev.map(wk => wk.id === w.id ? { ...wk, verified: true } : wk))
                                          toast.success(`${w.name} approved ✓`)
                                        } catch { toast.error('Failed to approve') }
                                      }}
                                      className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-green-400"
                                      style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                                      <CheckCircle size={10} /> Approve
                                    </motion.button>
                                  )}
                                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    onClick={async () => {
                                      try {
                                        const { updateDoc, doc } = await import('firebase/firestore')
                                        const { db } = await import('@/lib/firebase')
                                        await updateDoc(doc(db, 'users', w.id), {
                                          isVerified: false,
                                          isAvailable: false,
                                          adminNote: 'Removed by admin',
                                        })
                                        setWorkers(prev => prev.filter(wk => wk.id !== w.id))
                                        toast.success('Worker removed')
                                      } catch { toast.error('Failed to remove') }
                                    }}
                                    className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] text-red-400"
                                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                    <Ban size={10} /> Remove
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DISPUTES */}
            {tab === 'disputes' && (
              <motion.div key="disputes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{MOCK_DISPUTES.length} open disputes</p>
                {MOCK_DISPUTES.map((d, i) => (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle size={14} className="text-red-400" />
                          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{d.jobTitle}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">Open</span>
                        </div>
                        <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{d.reason}</p>
                        <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <span>Customer: <strong style={{ color: 'var(--text-secondary)' }}>{d.customer}</strong></span>
                          <span>Worker: <strong style={{ color: 'var(--text-secondary)' }}>{d.worker}</strong></span>
                          <span>Amount: <strong className="text-amber-400">₹{d.amount}</strong></span>
                          <span>{d.date}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold"
                          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}>
                          <CheckCircle size={11} /> Resolve
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold"
                          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                          <XCircle size={11} /> Refund
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* JOBS */}
            {tab === 'jobs' && (
              <motion.div key="jobs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="glass-card p-12 text-center">
                  <Briefcase size={32} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                  <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>All Platform Jobs</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Connect Firestore listener here to show all live jobs.</p>
                </div>
              </motion.div>
            )}

            {/* PROMO CODES */}
            {tab === 'promo' && (
              <motion.div key="promo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="glass-card p-6">
                  <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Create Promo Code</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Code *</label>
                      <input className="input-base font-mono tracking-wider uppercase" placeholder="SAVE100" value={promoForm.code} onChange={e => setPromoForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} />
                    </div>
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Type</label>
                      <select className="input-base" value={promoForm.type} onChange={e => setPromoForm(p => ({ ...p, type: e.target.value }))}>
                        <option value="flat">Flat (₹)</option>
                        <option value="percent">Percent (%)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Value * {promoForm.type === 'percent' ? '(%)' : '(₹)'}</label>
                      <input className="input-base" type="number" placeholder={promoForm.type === 'percent' ? '10' : '100'} value={promoForm.value} onChange={e => setPromoForm(p => ({ ...p, value: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Max uses</label>
                      <input className="input-base" type="number" placeholder="Unlimited" value={promoForm.maxUses} onChange={e => setPromoForm(p => ({ ...p, maxUses: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Min order (₹)</label>
                      <input className="input-base" type="number" placeholder="None" value={promoForm.minOrderAmount} onChange={e => setPromoForm(p => ({ ...p, minOrderAmount: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Expires at</label>
                      <input className="input-base" type="date" value={promoForm.expiresAt} onChange={e => setPromoForm(p => ({ ...p, expiresAt: e.target.value }))} />
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={savePromo}
                    disabled={promoSaving || !promoForm.code || !promoForm.value}
                    className="btn-primary px-6 py-2.5 text-sm rounded-xl disabled:opacity-50">
                    {promoSaving ? 'Creating…' : '+ Create Code'}
                  </motion.button>
                </div>
                <div className="glass-card overflow-hidden">
                  <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      Codes <span className="ml-1 font-normal" style={{ color: 'var(--text-muted)' }}>({promos.length})</span>
                    </h2>
                  </div>
                  {promoLoading ? (
                    <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</div>
                  ) : promos.length === 0 ? (
                    <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No codes yet. Create one above.</div>
                  ) : (
                    <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                      {promos.map((p, i) => (
                        <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                          className="flex items-center justify-between px-5 py-3.5">
                          <div>
                            <span className="font-mono font-bold text-sm tracking-wider" style={{ color: 'var(--text-primary)' }}>{p.code}</span>
                            <span className="ml-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                              {p.type === 'percent' ? `${p.value}% off` : `₹${p.value} off`}
                              {p.minOrderAmount && ` · min ₹${p.minOrderAmount}`}
                              {p.maxUses && ` · ${p.usedCount ?? 0}/${p.maxUses} used`}
                              {p.expiresAt && ` · expires ${new Date(p.expiresAt).toLocaleDateString('en-IN')}`}
                            </span>
                          </div>
                          <button onClick={() => togglePromo(p.id, p.active)}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${p.active ? 'bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400' : 'bg-red-500/10 text-red-400 hover:bg-green-500/10 hover:text-green-400'}`}>
                            {p.active ? 'Active' : 'Disabled'}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

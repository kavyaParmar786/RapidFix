'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy } from 'firebase/firestore'
import Navbar from '@/components/layout/Navbar'
import { Save, Settings, Users, Briefcase, DollarSign, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const ADMIN_EMAIL = 'kavyaparmar7866@gmail.com'

const DEFAULT_PRICES: Record<string, { name: string; base: number; unit: string }> = {
  electrician:      { name: 'Electrician',      base: 299,  unit: 'per visit' },
  plumber:          { name: 'Plumber',           base: 249,  unit: 'per visit' },
  carpenter:        { name: 'Carpenter',         base: 349,  unit: 'per visit' },
  painter:          { name: 'Painter',           base: 15,   unit: 'per sqft' },
  cleaner:          { name: 'Cleaning',          base: 499,  unit: 'per session' },
  ac_repair:        { name: 'AC Repair',         base: 399,  unit: 'per visit' },
  appliance_repair: { name: 'Appliance Repair',  base: 299,  unit: 'per visit' },
  pest_control:     { name: 'Pest Control',      base: 599,  unit: 'per treatment' },
  security:         { name: 'Security',          base: 799,  unit: 'per install' },
}

interface SiteConfig {
  prices: Record<string, { name: string; base: number; unit: string }>
  siteName: string
  contactPhone: string
  contactEmail: string
  maintenanceMode: boolean
  commissionPercent: number
}

export default function AdminPage() {
  const { user, profile, loading } = useAuth()
  const [config, setConfig] = useState<SiteConfig>({
    prices: DEFAULT_PRICES,
    siteName: 'RapidFix',
    contactPhone: '+91 94094 05573',
    contactEmail: 'kavyaparmar7866@gmail.com',
    maintenanceMode: false,
    commissionPercent: 10,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<'pricing' | 'general' | 'stats'>('pricing')
  const [stats, setStats] = useState({ users: 0, jobs: 0, workers: 0, customers: 0 })
  const [loadingStats, setLoadingStats] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user || profile?.email !== ADMIN_EMAIL) {
      window.location.href = '/'
    }
  }, [loading, user, profile])

  useEffect(() => {
    if (!user || profile?.email !== ADMIN_EMAIL) return
    getDoc(doc(db, 'config', 'site')).then(snap => {
      if (snap.exists()) {
        const data = snap.data() as SiteConfig
        setConfig(prev => ({ ...prev, ...data, prices: { ...DEFAULT_PRICES, ...data.prices } }))
      }
    })
  }, [user, profile])

  const loadStats = async () => {
    setLoadingStats(true)
    try {
      const usersSnap = await getDocs(collection(db, 'users'))
      const jobsSnap = await getDocs(collection(db, 'jobs'))
      const workers = usersSnap.docs.filter(d => d.data().role === 'worker').length
      setStats({ users: usersSnap.size, jobs: jobsSnap.size, workers, customers: usersSnap.size - workers })
    } catch { toast.error('Failed to load stats') }
    setLoadingStats(false)
  }

  useEffect(() => { if (tab === 'stats') loadStats() }, [tab])

  const saveConfig = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, 'config', 'site'), config, { merge: true })
      setSaved(true)
      toast.success('Config saved!')
      setTimeout(() => setSaved(false), 2000)
    } catch { toast.error('Save failed') }
    setSaving(false)
  }

  const updatePrice = (key: string, field: 'base' | 'unit', value: string | number) => {
    setConfig(prev => ({
      ...prev,
      prices: { ...prev.prices, [key]: { ...prev.prices[key], [field]: field === 'base' ? Number(value) : value } }
    }))
  }

  if (loading || !profile) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <div className="h-5 w-5 rounded-full border-2 border-zinc-200 border-t-zinc-700 animate-spin" />
    </div>
  )

  if (profile.email !== ADMIN_EMAIL) return null

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-[52px]" style={{ background: 'var(--bg-base)' }}>
        <div className="border-b border-black/[0.06] bg-zinc-50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-zinc-900">Admin Panel</h1>
              <p className="text-sm text-zinc-400">Configure RapidFix settings and pricing</p>
            </div>
            <button onClick={saveConfig} disabled={saving}
              className={cn('btn-primary px-5 py-2.5 text-sm flex items-center gap-2 rounded-lg', saved && 'bg-green-600 hover:bg-green-700')}>
              {saving ? <RefreshCw size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save changes'}
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="flex gap-1 rounded-xl border border-black/[0.08] bg-zinc-50 p-1 mb-8 w-fit">
            {[
              { key: 'pricing', icon: DollarSign, label: 'Pricing' },
              { key: 'general', icon: Settings, label: 'General' },
              { key: 'stats', icon: Users, label: 'Stats' },
            ].map(({ key, icon: Icon, label }) => (
              <button key={key} onClick={() => setTab(key as any)}
                className={cn('flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  tab === key ? 'bg-white shadow-sm text-zinc-900 border border-black/[0.08]' : 'text-zinc-500 hover:text-zinc-700'
                )}>
                <Icon size={13} />{label}
              </button>
            ))}
          </div>

          {/* Pricing tab */}
          {tab === 'pricing' && (
            <div>
              <div className="mb-6">
                <h2 className="text-base font-semibold text-zinc-900 mb-1">Service Pricing</h2>
                <p className="text-sm text-zinc-400">Set the base price shown on each service page and used as job budget defaults.</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(config.prices).map(([key, val]) => (
                  <div key={key} className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-zinc-900 mb-4">{val.name}</p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Base price (₹)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">₹</span>
                          <input type="number" value={val.base} onChange={e => updatePrice(key, 'base', e.target.value)}
                            className="input-base pl-7" min="0" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Unit label</label>
                        <input type="text" value={val.unit} onChange={e => updatePrice(key, 'unit', e.target.value)}
                          className="input-base" placeholder="per visit" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm">
                <label className="block text-sm font-semibold text-zinc-900 mb-1">Platform commission (%)</label>
                <p className="text-xs text-zinc-400 mb-3">Percentage taken from each job payment.</p>
                <input type="number" value={config.commissionPercent}
                  onChange={e => setConfig(p => ({ ...p, commissionPercent: Number(e.target.value) }))}
                  className="input-base max-w-[120px]" min="0" max="50" />
              </div>
            </div>
          )}

          {/* General tab */}
          {tab === 'general' && (
            <div className="space-y-5 max-w-xl">
              <h2 className="text-base font-semibold text-zinc-900 mb-4">Site Settings</h2>
              {[
                { label: 'Site name', key: 'siteName', type: 'text', placeholder: 'RapidFix' },
                { label: 'Contact phone', key: 'contactPhone', type: 'tel', placeholder: '+91 94094 05573' },
                { label: 'Contact email', key: 'contactEmail', type: 'email', placeholder: 'support@rapidfix.app' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key} className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm">
                  <label className="block text-sm font-medium text-zinc-700 mb-2">{label}</label>
                  <input type={type} value={(config as any)[key]} placeholder={placeholder}
                    onChange={e => setConfig(p => ({ ...p, [key]: e.target.value }))}
                    className="input-base" />
                </div>
              ))}

              <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">Maintenance mode</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Show a maintenance message to all visitors</p>
                  </div>
                  <button onClick={() => setConfig(p => ({ ...p, maintenanceMode: !p.maintenanceMode }))}
                    className={cn('relative h-6 w-11 rounded-full transition-colors', config.maintenanceMode ? 'bg-zinc-900' : 'bg-zinc-200')}>
                    <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', config.maintenanceMode ? 'left-5' : 'left-0.5')} />
                  </button>
                </div>
                {config.maintenanceMode && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                    <AlertTriangle size={12} /> Site is currently in maintenance mode
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stats tab */}
          {tab === 'stats' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-zinc-900">Platform Stats</h2>
                <button onClick={loadStats} disabled={loadingStats} className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5">
                  <RefreshCw size={12} className={loadingStats ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Users', value: stats.users, icon: Users },
                  { label: 'Total Jobs', value: stats.jobs, icon: Briefcase },
                  { label: 'Workers', value: stats.workers, icon: Settings },
                  { label: 'Customers', value: stats.customers, icon: Users },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <Icon size={16} className="text-zinc-400" />
                      <span className="text-3xl font-bold text-zinc-900">{loadingStats ? '…' : value}</span>
                    </div>
                    <p className="text-xs text-zinc-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

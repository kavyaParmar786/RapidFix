'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Upload, ToggleRight, CheckCircle, ArrowRight, X, Camera } from 'lucide-react'

const STEPS = [
  { icon: User, title: 'Complete your profile', sub: 'Customers choose workers based on your profile' },
  { icon: Upload, title: 'Upload your ID', sub: 'Aadhaar + selfie for verification' },
  { icon: ToggleRight, title: 'Go live!', sub: 'Toggle availability and start accepting jobs' },
]

const CATEGORIES = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Repair', 'Cleaner', 'Mason', 'Welder']

interface Props { onComplete: () => void }

export default function WorkerOnboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [bio, setBio] = useState('')
  const [category, setCategory] = useState('')
  const [experience, setExperience] = useState('')
  const [aadhaarUploaded, setAadhaarUploaded] = useState(false)
  const [selfieUploaded, setSelfieUploaded] = useState(false)

  const progress = ((step) / (STEPS.length - 1)) * 100

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="glass-card w-full max-w-md overflow-hidden"
      >
        {/* Progress bar */}
        <div className="h-1 w-full" style={{ background: 'var(--bg-elevated)' }}>
          <motion.div className="h-full" style={{ background: 'var(--accent)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
        </div>

        <div className="p-6">
          {/* Step icons */}
          <div className="flex items-center justify-between mb-6">
            {STEPS.map(({ icon: Icon }, i) => (
              <div key={i} className="flex items-center gap-2">
                <motion.div
                  animate={{
                    background: i < step ? '#22c55e' : i === step ? 'var(--accent)' : 'var(--bg-elevated)',
                    scale: i === step ? 1.1 : 1,
                  }}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                >
                  {i < step
                    ? <CheckCircle size={16} style={{ color: 'white' }} />
                    : <Icon size={16} style={{ color: i === step ? 'var(--bg-base)' : 'var(--text-muted)' }} />
                  }
                </motion.div>
                {i < STEPS.length - 1 && (
                  <motion.div className="h-px w-12 sm:w-16"
                    animate={{ background: i < step ? '#22c55e' : 'var(--border-default)' }} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 0 — Profile */}
            {step === 0 && (
              <motion.div key="step0"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h2 className="font-bold text-lg mb-0.5" style={{ color: 'var(--text-primary)' }}>
                  Complete your profile
                </h2>
                <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
                  Workers with complete profiles get 3× more jobs.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Your specialty</label>
                    <div className="grid grid-cols-3 gap-2">
                      {CATEGORIES.map(c => (
                        <motion.button key={c} whileTap={{ scale: 0.95 }}
                          onClick={() => setCategory(c)}
                          className="rounded-xl py-2 text-xs font-medium transition-all"
                          style={{
                            background: category === c ? 'var(--accent)' : 'var(--bg-elevated)',
                            color: category === c ? 'var(--bg-base)' : 'var(--text-muted)',
                            border: `1px solid ${category === c ? 'var(--accent)' : 'var(--border-default)'}`,
                          }}>
                          {c}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Years of experience</label>
                    <input type="number" value={experience} onChange={e => setExperience(e.target.value)}
                      placeholder="e.g. 5" className="input-base rounded-xl" min={0} max={50} />
                  </div>

                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Brief bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)}
                      placeholder="Tell customers about your skills and experience…"
                      rows={3} className="input-base rounded-xl resize-none text-sm" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1 — ID Upload */}
            {step === 1 && (
              <motion.div key="step1"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h2 className="font-bold text-lg mb-0.5" style={{ color: 'var(--text-primary)' }}>Verify your identity</h2>
                <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
                  Required by law and builds customer trust. Your data is secure.
                </p>

                <div className="space-y-3">
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAadhaarUploaded(true)}
                    className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all"
                    style={{
                      background: aadhaarUploaded ? 'rgba(34,197,94,0.06)' : 'var(--bg-elevated)',
                      border: `1px solid ${aadhaarUploaded ? 'rgba(34,197,94,0.3)' : 'var(--border-default)'}`,
                    }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-surface)' }}>
                      {aadhaarUploaded ? <CheckCircle size={18} className="text-green-400" /> : <Upload size={18} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Aadhaar Card</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{aadhaarUploaded ? 'Uploaded ✓' : 'Front and back photo'}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelfieUploaded(true)}
                    className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all"
                    style={{
                      background: selfieUploaded ? 'rgba(34,197,94,0.06)' : 'var(--bg-elevated)',
                      border: `1px solid ${selfieUploaded ? 'rgba(34,197,94,0.3)' : 'var(--border-default)'}`,
                    }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-surface)' }}>
                      {selfieUploaded ? <CheckCircle size={18} className="text-green-400" /> : <Camera size={18} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Selfie</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{selfieUploaded ? 'Uploaded ✓' : 'Clear photo of your face'}</p>
                    </div>
                  </motion.div>
                </div>

                <p className="text-[10px] mt-4 text-center" style={{ color: 'var(--text-muted)' }}>
                  🔒 Your documents are encrypted and only reviewed by our trust team.
                </p>
              </motion.div>
            )}

            {/* Step 2 — Go Live */}
            {step === 2 && (
              <motion.div key="step2"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                className="text-center py-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 14 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)' }}>
                  <CheckCircle size={36} className="text-green-500" />
                </motion.div>
                <h2 className="font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>You're all set!</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                  Your ID is under review (usually within 2 hours). Once approved, toggle your availability to start accepting jobs.
                </p>
                <div className="text-left glass-card p-4 mb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Availability</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>You can toggle this anytime</p>
                    </div>
                    <div className="w-11 h-6 rounded-full flex items-center px-0.5"
                      style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.3)' }}>
                      <motion.div animate={{ x: 18 }} className="w-5 h-5 rounded-full bg-green-400" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="flex-1 btn-ghost rounded-xl py-2.5 text-sm">
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setStep(s => s + 1)}
                disabled={step === 0 && !category}
                className="flex-1 btn-primary rounded-xl py-2.5 text-sm flex items-center justify-center gap-2">
                Continue <ArrowRight size={13} />
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={onComplete}
                className="flex-1 btn-primary rounded-xl py-2.5 text-sm">
                Go to Dashboard 🚀
              </motion.button>
            )}
          </div>

          {step < STEPS.length - 1 && (
            <button onClick={onComplete} className="w-full text-center text-xs mt-3 transition-colors"
              style={{ color: 'var(--text-muted)' }}>
              Skip for now
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

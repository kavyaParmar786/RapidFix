'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft, Send, ImageIcon, CheckCheck, X,
  Phone, MoreVertical, Star, Flag
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { subscribeToMessages, sendMessage, uploadImage } from '@/lib/firestore'
import {
  doc, getDoc, setDoc, onSnapshot,
  updateDoc, arrayUnion
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Message, Chat } from '@/types'
import { cn, formatRelativeTime } from '@/lib/utils'
import { PageLoader } from '@/components/ui/Spinner'
import Navbar from '@/components/layout/Navbar'
import toast from 'react-hot-toast'

// ─── Quick reply chips ────────────────────────────────────────────────────────
const QUICK_REPLIES = [
  'On my way!',
  'Arriving in 15 min',
  'Job is done ✓',
  'Can we reschedule?',
  'What\'s the issue exactly?',
  'Please share your address',
]

export default function ChatPage() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [otherIsTyping, setOtherIsTyping] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [unreadIds, setUnreadIds] = useState<Set<string>>(new Set())
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch chat metadata
  useEffect(() => {
    if (!id) return
    getDoc(doc(db, 'chats', id as string)).then((snap) => {
      if (snap.exists()) setChat({ id: snap.id, ...snap.data() } as Chat)
    })
  }, [id])

  // Subscribe to messages + mark as read
  useEffect(() => {
    if (!id || !user) return
    const unsub = subscribeToMessages(id as string, (msgs) => {
      setMessages(msgs)
      // Mark unread messages from the other person as read
      const unread = msgs.filter(m => m.senderId !== user.uid && !m.read)
      if (unread.length > 0) {
        unread.forEach(m => {
          updateDoc(doc(db, 'chats', id as string, 'messages', m.id), { read: true }).catch(() => {})
        })
        // Reset unread count in chat doc
        updateDoc(doc(db, 'chats', id as string), {
          [`unreadCount.${user.uid}`]: 0,
        }).catch(() => {})
      }
    })
    return unsub
  }, [id, user])

  // Typing indicator subscription
  useEffect(() => {
    if (!id || !user) return
    const typingRef = doc(db, 'chats', id as string, 'typing', 'status')
    const unsub = onSnapshot(typingRef, (snap) => {
      if (!snap.exists()) { setOtherIsTyping(false); return }
      const data = snap.data()
      const otherId = Object.keys(data).find(k => k !== user.uid)
      if (otherId && data[otherId]) {
        setOtherIsTyping(Date.now() - data[otherId] < 4000)
      } else {
        setOtherIsTyping(false)
      }
    }, () => setOtherIsTyping(false))  // silently ignore permission errors on typing doc
    return () => unsub()
  }, [id, user])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, otherIsTyping])

  // Validate access
  useEffect(() => {
    if (chat && user) {
      if (chat.customerId !== user.uid && chat.workerId !== user.uid) {
        window.location.href = '/dashboard/customer'
      }
    }
  }, [chat, user])

  // Auto-resize textarea
  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 128) + 'px'
  }

  const handleTyping = (value: string) => {
    setText(value)
    if (textareaRef.current) autoResize(textareaRef.current)
    if (!user || !id) return

    setDoc(
      doc(db, 'chats', id as string, 'typing', 'status'),
      { [user.uid]: Date.now() },
      { merge: true }
    ).catch(() => {})  // silently ignore if typing doc write fails

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => {
      setDoc(
        doc(db, 'chats', id as string, 'typing', 'status'),
        { [user.uid]: null },
        { merge: true }
      ).catch(() => {})
    }, 3500)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSend = async (overrideText?: string) => {
    if (!user || !profile || !chat) return
    const msgText = overrideText ?? text
    if (!msgText.trim() && !imageFile) return

    setSending(true)
    setShowQuickReplies(false)
    try {
      let imageUrl: string | undefined
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, `chats/${chat.id}/${Date.now()}`)
      }
      await sendMessage(chat.id, {
        chatId: chat.id,
        senderId: user.uid,
        senderName: profile.displayName,
        senderPhoto: profile.photoURL,
        text: msgText.trim() || undefined,
        imageUrl,
        type: imageFile ? 'image' : 'text',
        read: false,
      })
      setText('')
      setImageFile(null)
      setImagePreview(null)
      if (textareaRef.current) { textareaRef.current.style.height = 'auto' }

      // Clear own typing indicator
      setDoc(
        doc(db, 'chats', chat.id, 'typing', 'status'),
        { [user.uid]: null },
        { merge: true }
      ).catch(() => {})
    } catch {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!chat) return <PageLoader />

  const isCustomer = user?.uid === chat.customerId
  const otherName = isCustomer ? chat.workerName : chat.customerName
  const otherPhoto = isCustomer ? chat.workerPhoto : chat.customerPhoto

  // Group messages by date
  const grouped: { date: string; msgs: Message[] }[] = []
  messages.forEach((m) => {
    const d = new Date(m.createdAt)
    const today = new Date()
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
    let label: string
    if (d.toDateString() === today.toDateString()) label = 'Today'
    else if (d.toDateString() === yesterday.toDateString()) label = 'Yesterday'
    else label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    const last = grouped[grouped.length - 1]
    if (last?.date === label) last.msgs.push(m)
    else grouped.push({ date: label, msgs: [m] })
  })

  return (
    <>
      <Navbar />
      <div className="flex h-screen flex-col pt-16" style={{ background: 'var(--bg-base)' }}>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="border-b border-black/10 px-4 py-3 flex items-center gap-3 z-10"
          style={{ background: 'rgba(15,20,32,0.97)', backdropFilter: 'blur(20px)' }}>
          <Link href={profile?.role === 'customer' ? '/dashboard/customer' : '/dashboard/worker'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0">
            <ArrowLeft size={14} />
          </Link>

          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="h-9 w-9 overflow-hidden rounded-full bg-zinc-900/30 flex items-center justify-center text-sm font-bold text-[var(--text-secondary)]">
                {otherPhoto
                  ? <Image src={otherPhoto} alt={otherName} width={36} height={36} className="object-cover rounded-full" />
                  : otherName?.[0]?.toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0f1420] bg-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{otherName}</p>
              <p className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                {otherIsTyping
                  ? <span className="text-green-400 font-medium">typing…</span>
                  : `Re: ${chat.jobTitle}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href={`/jobs/${chat.jobId}`}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-black/10 bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              View Job
            </Link>
            {/* More menu */}
            <div className="relative">
              <button onClick={() => setShowMenu(v => !v)}
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-black/10 bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <MoreVertical size={14} />
              </button>
              <AnimatePresence>
                {showMenu && (
                  <motion.div initial={{ opacity: 0, scale: 0.9, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute right-0 top-10 w-44 rounded-xl shadow-xl z-50 overflow-hidden"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                    {[
                      { icon: Star, label: 'Leave a review', href: `/jobs/${chat.jobId}#review` },
                      { icon: Flag, label: 'Report issue', href: `/jobs/${chat.jobId}#report` },
                    ].map(({ icon: Icon, label, href }) => (
                      <Link key={label} href={href} onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-xs transition-colors hover:bg-[var(--bg-elevated)]"
                        style={{ color: 'var(--text-secondary)' }}>
                        <Icon size={13} />  {label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Messages ─────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full gap-3 py-16">
              <div className="h-16 w-16 rounded-2xl bg-zinc-900/20 flex items-center justify-center text-3xl">💬</div>
              <p className="font-semibold text-[var(--text-primary)]">Start the conversation</p>
              <p className="text-sm text-center max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                Send a message to coordinate with {otherName} about the job.
              </p>
              {/* Quick start chips */}
              <div className="flex flex-wrap gap-2 justify-center mt-2 max-w-xs">
                {QUICK_REPLIES.slice(0, 3).map(r => (
                  <button key={r} onClick={() => handleSend(r)}
                    className="rounded-full px-3 py-1.5 text-xs font-medium transition-all hover:scale-105"
                    style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>
                    {r}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {grouped.map(({ date, msgs }) => (
            <div key={date} className="mb-2">
              {/* Date divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
                <span className="text-[10px] font-medium rounded-full px-3 py-1"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>{date}</span>
                <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
              </div>

              <div className="space-y-1">
                {msgs.map((msg, idx) => {
                  const isMe = msg.senderId === user?.uid
                  const nextMsg = msgs[idx + 1]
                  const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId
                  const showAvatar = !isMe && isLastInGroup

                  return (
                    <div key={msg.id} className={cn('flex gap-2 items-end', isMe ? 'flex-row-reverse' : 'flex-row')}>
                      {/* Avatar — only for last message in a group from other */}
                      <div className="w-7 h-7 flex-shrink-0">
                        {showAvatar && (
                          <div className="h-7 w-7 rounded-full bg-zinc-900/30 flex items-center justify-center text-xs font-bold text-[var(--text-secondary)] overflow-hidden">
                            {msg.senderPhoto
                              ? <Image src={msg.senderPhoto} alt="Sender photo" width={28} height={28} className="rounded-full object-cover" />
                              : msg.senderName?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className={cn('max-w-[72%] sm:max-w-[60%]', isMe ? 'items-end flex flex-col' : 'items-start flex flex-col')}>
                        {/* Bubble */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.92, y: 4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className={cn(
                            'rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                            isMe
                              ? 'rounded-br-sm bg-gradient-to-br from-zinc-700 to-violet-700 text-white'
                              : 'rounded-bl-sm text-[var(--text-primary)]'
                          )}
                          style={!isMe ? { background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' } : {}}
                        >
                          {msg.imageUrl && (
                            <div className="relative mb-2 w-52 h-40 overflow-hidden rounded-xl cursor-pointer"
                              onClick={() => window.open(msg.imageUrl, '_blank')}>
                              <Image src={msg.imageUrl} alt="Shared image" fill className="object-cover hover:scale-105 transition-transform" />
                            </div>
                          )}
                          {msg.text && <p className="leading-relaxed break-words">{msg.text}</p>}
                        </motion.div>

                        {/* Timestamp + read receipt — only on last in group */}
                        {isLastInGroup && (
                          <span className="mt-0.5 text-[10px] px-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                            {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            {isMe && (
                              <CheckCheck size={11}
                                className={msg.read ? 'text-indigo-400' : 'text-[var(--text-muted)]'}
                              />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {otherIsTyping && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                className="flex items-end gap-2 pl-9 pb-1">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm px-4 py-3"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* ── Quick replies ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showQuickReplies && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide border-t border-black/10"
              style={{ background: 'rgba(15,20,32,0.97)' }}>
              {QUICK_REPLIES.map(r => (
                <button key={r} onClick={() => { handleSend(r); setShowQuickReplies(false) }}
                  className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium flex-shrink-0 transition-all hover:scale-105 active:scale-95"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>
                  {r}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Image preview ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {imagePreview && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="px-4 py-2 border-t border-black/10 flex items-center gap-3"
              style={{ background: 'rgba(15,20,32,0.97)' }}>
              <div className="relative h-14 w-14 overflow-hidden rounded-xl flex-shrink-0">
                <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
              </div>
              <p className="text-xs text-[var(--text-muted)] flex-1 truncate">{imageFile?.name}</p>
              <button onClick={() => { setImageFile(null); setImagePreview(null) }}
                className="h-6 w-6 flex items-center justify-center rounded-full bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-red-500/20 hover:text-red-400 transition-colors">
                <X size={11} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Input bar ────────────────────────────────────────────────────── */}
        <div className="border-t border-black/10 px-3 py-2.5 flex items-end gap-2"
          style={{ background: 'rgba(15,20,32,0.97)', backdropFilter: 'blur(20px)' }}>

          {/* Attachment */}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          <button onClick={() => fileRef.current?.click()}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-black/10 bg-[var(--bg-surface)] text-[var(--text-muted)] transition-all hover:text-[var(--text-primary)]">
            <ImageIcon size={16} />
          </button>

          {/* Quick replies toggle */}
          <button onClick={() => setShowQuickReplies(v => !v)}
            className={cn(
              'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border text-xs font-bold transition-all',
              showQuickReplies
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
                : 'border-black/10 bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}>
            ⚡
          </button>

          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => handleTyping(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            className="input-base flex-1 resize-none py-2.5 text-sm min-h-[40px] max-h-32 leading-relaxed"
          />

          {/* Send */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSend()}
            disabled={sending || (!text.trim() && !imageFile)}
            className={cn(
              'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all',
              sending || (!text.trim() && !imageFile)
                ? 'bg-[var(--bg-surface)] text-[var(--text-muted)] cursor-not-allowed'
                : 'bg-gradient-to-br from-zinc-700 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/25'
            )}>
            {sending
              ? <motion.div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white"
                  animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }} />
              : <Send size={15} />}
          </motion.button>
        </div>
      </div>
    </>
  )
}

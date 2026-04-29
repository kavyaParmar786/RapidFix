'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Send, ImageIcon, CheckCheck, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { subscribeToMessages, sendMessage, uploadImage } from '@/lib/firestore'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Message, Chat } from '@/types'
import { cn, formatRelativeTime } from '@/lib/utils'
import { PageLoader } from '@/components/ui/Spinner'
import Navbar from '@/components/layout/Navbar'
import toast from 'react-hot-toast'

export default function ChatPage() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const router = useRouter()
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Fetch chat metadata
  useEffect(() => {
    if (!id) return
    getDoc(doc(db, 'chats', id as string)).then((snap) => {
      if (snap.exists()) setChat({ id: snap.id, ...snap.data() } as Chat)
    })
  }, [id])

  // Subscribe to messages
  useEffect(() => {
    if (!id) return
    const unsub = subscribeToMessages(id as string, setMessages)
    return unsub
  }, [id])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Validate access
  useEffect(() => {
    if (chat && user) {
      if (chat.customerId !== user.uid && chat.workerId !== user.uid) {
        window.location.href = '/dashboard/customer'
      }
    }
  }, [chat, user])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSend = async () => {
    if (!user || !profile || !chat) return
    if (!text.trim() && !imageFile) return

    setSending(true)
    try {
      let imageUrl: string | undefined
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, `chats/${chat.id}/${Date.now()}_${imageFile.name}`)
      }

      await sendMessage(chat.id, {
        chatId: chat.id,
        senderId: user.uid,
        senderName: profile.displayName,
        senderPhoto: profile.photoURL,
        text: text.trim() || undefined,
        imageUrl,
        type: imageFile ? 'image' : 'text',
        read: false,
      })

      setText('')
      setImageFile(null)
      setImagePreview(null)
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

  const otherName = user?.uid === chat.customerId ? chat.workerName : chat.customerName
  const otherPhoto = user?.uid === chat.customerId ? chat.workerPhoto : chat.customerPhoto

  // Group messages by date
  const grouped: { date: string; msgs: Message[] }[] = []
  messages.forEach((m) => {
    const date = new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    const last = grouped[grouped.length - 1]
    if (last?.date === date) last.msgs.push(m)
    else grouped.push({ date, msgs: [m] })
  })

  return (
    <>
      <Navbar />
      <div className="flex h-screen flex-col pt-16" style={{ background: 'var(--bg-base)' }}>
        {/* Chat header */}
        <div className="border-b border-black/10 px-4 py-3 flex items-center gap-3"
          style={{ background: 'rgba(15,20,32,0.95)', backdropFilter: 'blur(20px)' }}>
          <Link
            href={profile?.role === 'customer' ? '/dashboard/customer' : '/dashboard/worker'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-zinc-50 text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={14} />
          </Link>

          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="relative">
              <div className="h-9 w-9 overflow-hidden rounded-full bg-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-300 flex-shrink-0">
                {otherPhoto ? (
                  <Image src={otherPhoto} alt="" width={36} height={36} className="object-cover rounded-full" />
                ) : (
                  otherName?.[0]?.toUpperCase()
                )}
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0f1420] bg-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-900 truncate">{otherName}</p>
              <p className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                Re: {chat.jobTitle}
              </p>
            </div>
          </div>

          <Link
            href={`/jobs/${chat.jobId}`}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-black/10 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            View Job
          </Link>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
              <div className="h-16 w-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-3xl">
                💬
              </div>
              <p className="font-medium text-zinc-900">Start the conversation</p>
              <p className="text-sm text-center max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                Send a message to coordinate with {otherName} about the job.
              </p>
            </div>
          )}

          {grouped.map(({ date, msgs }) => (
            <div key={date}>
              {/* Date divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-zinc-100" />
                <span className="text-xs text-zinc-400 bg-zinc-50 rounded-full px-3 py-1">{date}</span>
                <div className="flex-1 h-px bg-zinc-100" />
              </div>

              <div className="space-y-3">
                {msgs.map((msg) => {
                  const isMe = msg.senderId === user?.uid
                  return (
                    <div key={msg.id} className={cn('flex gap-2', isMe && 'flex-row-reverse')}>
                      {/* Avatar */}
                      {!isMe && (
                        <div className="h-7 w-7 rounded-full bg-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300 flex-shrink-0 self-end">
                          {msg.senderPhoto ? (
                            <Image src={msg.senderPhoto} alt="" width={28} height={28} className="rounded-full object-cover" />
                          ) : (
                            msg.senderName?.[0]?.toUpperCase()
                          )}
                        </div>
                      )}

                      <div className={cn('max-w-xs lg:max-w-sm xl:max-w-md', isMe && 'items-end flex flex-col')}>
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                            isMe
                              ? 'rounded-br-sm bg-gradient-to-br from-indigo-500 to-violet-600 text-zinc-900'
                              : 'rounded-bl-sm bg-zinc-100 text-zinc-900 border border-black/10'
                          )}
                        >
                          {msg.imageUrl && (
                            <div className="relative mb-2 w-48 h-36 overflow-hidden rounded-xl">
                              <Image src={msg.imageUrl} alt="Image" fill className="object-cover" />
                            </div>
                          )}
                          {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                        </div>
                        <span className="mt-1 text-[10px] px-1" style={{ color: 'var(--text-muted)' }}>
                          {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          {isMe && <CheckCheck size={11} className="inline ml-1 text-indigo-300" />}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* Image preview */}
        {imagePreview && (
          <div className="px-4 py-2 border-t border-black/10 flex items-center gap-2"
            style={{ background: 'rgba(15,20,32,0.95)' }}>
            <div className="relative h-14 w-14 overflow-hidden rounded-xl">
              <Image src={imagePreview} alt="" fill className="object-cover" />
            </div>
            <p className="text-xs text-zinc-500 flex-1">{imageFile?.name}</p>
            <button onClick={() => { setImageFile(null); setImagePreview(null) }}
              className="h-6 w-6 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-red-500/30 hover:text-red-400">
              <X size={12} />
            </button>
          </div>
        )}

        {/* Input bar */}
        <div className="border-t border-black/10 px-4 py-3 flex items-end gap-3"
          style={{ background: 'rgba(15,20,32,0.95)', backdropFilter: 'blur(20px)' }}>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-black/10 bg-zinc-50 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-900"
          >
            <ImageIcon size={16} />
          </button>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            rows={1}
            className="input-base flex-1 resize-none py-2.5 text-sm min-h-[40px] max-h-32"
            style={{ lineHeight: '1.5' }}
          />

          <button
            onClick={handleSend}
            disabled={sending || (!text.trim() && !imageFile)}
            className={cn(
              'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all',
              sending || (!text.trim() && !imageFile)
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-zinc-900 hover:shadow-lg hover:shadow-indigo-500/30'
            )}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  )
}

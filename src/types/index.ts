export type UserRole = 'customer' | 'worker'

export type JobStatus = 'posted' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'emergency'

export type JobCategory =
  | 'electrician'
  | 'plumber'
  | 'carpenter'
  | 'painter'
  | 'cleaner'
  | 'ac_repair'
  | 'appliance_repair'
  | 'pest_control'
  | 'security'
  | 'other'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: UserRole
  phone?: string
  location?: string
  bio?: string
  skills?: JobCategory[]
  experience?: string
  rating?: number
  reviewCount?: number
  isAvailable?: boolean  // Worker only
  isVerified?: boolean
  createdAt: string
  updatedAt: string
}

export interface Job {
  id: string
  title: string
  description: string
  category: JobCategory
  status: JobStatus
  urgency: UrgencyLevel
  budget?: number
  location: string
  locationLat?: number
  locationLng?: number
  images?: string[]
  customerId: string
  customerName: string
  customerEmail?: string
  customerPhoto?: string
  workerId?: string
  workerName?: string
  workerPhoto?: string
  chatId?: string
  createdAt: string
  updatedAt: string
  acceptedAt?: string
  completedAt?: string
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  senderName: string
  senderPhoto?: string
  text?: string
  imageUrl?: string
  type: 'text' | 'image' | 'system'
  createdAt: string
  read: boolean
}

export interface Chat {
  id: string
  jobId: string
  jobTitle: string
  customerId: string
  customerName: string
  customerPhoto?: string
  workerId: string
  workerName: string
  workerPhoto?: string
  lastMessage?: string
  lastMessageAt?: string
  unreadCount?: { [uid: string]: number }
  createdAt: string
}

export interface Review {
  id: string
  jobId: string
  reviewerId: string
  reviewerName: string
  reviewerPhoto?: string
  revieweeId: string
  rating: number
  comment: string
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  type: 'new_job' | 'job_accepted' | 'new_message' | 'job_completed' | 'job_cancelled'
  title: string
  body: string
  jobId?: string
  chatId?: string
  read: boolean
  createdAt: string
}

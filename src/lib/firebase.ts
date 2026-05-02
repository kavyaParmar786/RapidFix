import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Prevent duplicate app initialization in Next.js dev mode
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

googleProvider.addScope('email')
googleProvider.addScope('profile')

/**
 * Requests notification permission and returns the FCM token.
 * Stores the token in Firestore under users/{uid}.fcmToken so the
 * server-side createNotification() trigger can target this device.
 *
 * Usage (call after user logs in):
 *   import { requestFCMToken } from '@/lib/firebase'
 *   const token = await requestFCMToken(user.uid)
 */
export async function requestFCMToken(uid: string): Promise<string | null> {
  try {
    const supported = await isSupported()
    if (!supported) return null

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return null

    const messaging = getMessaging(app)
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: await navigator.serviceWorker.ready })

    if (token) {
      // Persist token in Firestore so backend can send targeted pushes
      const { updateDoc, doc } = await import('firebase/firestore')
      await updateDoc(doc(db, 'users', uid), { fcmToken: token, fcmUpdatedAt: new Date().toISOString() })
    }

    return token
  } catch {
    return null
  }
}

export default app

// firebase-messaging-sw.js
// Handles push notifications when the app is closed or in the background.
// This file MUST be in /public/ and named exactly firebase-messaging-sw.js
//
// Replace the config values below with your actual Firebase project config.
// These are public-safe values (same as NEXT_PUBLIC_FIREBASE_* env vars).

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: self.__FIREBASE_API_KEY__ || 'YOUR_API_KEY',
  authDomain: self.__FIREBASE_AUTH_DOMAIN__ || 'YOUR_AUTH_DOMAIN',
  projectId: self.__FIREBASE_PROJECT_ID__ || 'YOUR_PROJECT_ID',
  messagingSenderId: self.__FIREBASE_MESSAGING_SENDER_ID__ || 'YOUR_SENDER_ID',
  appId: self.__FIREBASE_APP_ID__ || 'YOUR_APP_ID',
})

const messaging = firebase.messaging()

// Handle background push messages from FCM
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon, click_action } = payload.notification || {}

  self.registration.showNotification(title || 'RapidFix', {
    body: body || 'You have a new notification',
    icon: icon || '/logo.png',
    badge: '/logo.png',
    data: { url: click_action || payload.data?.url || '/' },
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  })
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  const url = e.notification.data?.url || '/'
  if (e.action === 'dismiss') return
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      const match = windowClients.find((c) => c.url === url && 'focus' in c)
      if (match) return match.focus()
      return clients.openWindow(url)
    })
  )
})

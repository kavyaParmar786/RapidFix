const CACHE = 'rapidfix-v1'
const SHELL = [
  '/',
  '/jobs/browse',
  '/about',
  '/manifest.json',
  '/logo.png',
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  const { request } = e
  const url = new URL(request.url)

  // Skip non-GET, Firebase, and API calls
  if (request.method !== 'GET') return
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis')) return
  if (url.pathname.startsWith('/api/')) return

  // Network-first for HTML pages, cache-first for assets
  const isNav = request.mode === 'navigate'

  if (isNav) {
    e.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone()
          caches.open(CACHE).then(c => c.put(request, clone))
          return res
        })
        .catch(() => caches.match('/') || caches.match(request))
    )
  } else {
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(res => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE).then(c => c.put(request, clone))
          }
          return res
        })
      })
    )
  }
})

// Push notification handler
self.addEventListener('push', e => {
  const data = e.data?.json() ?? {}
  e.waitUntil(
    self.registration.showNotification(data.title || 'RapidFix', {
      body: data.body || 'You have a new notification',
      icon: '/logo.png',
      badge: '/logo.png',
      data: { url: data.url || '/' },
      actions: data.actions || [],
      vibrate: [200, 100, 200],
    })
  )
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  const url = e.notification.data?.url || '/'
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      const match = windowClients.find(c => c.url === url)
      if (match) return match.focus()
      return clients.openWindow(url)
    })
  )
})

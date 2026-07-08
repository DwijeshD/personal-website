const CACHE = 'portfolio-v2'
const PRECACHE = [
  '/',
  '/vscode-icon.png',
  '/manifest.webmanifest',
  '/fonts/file-icons.woff2',
  '/fonts/octicons.woff2',
  '/fonts/fontawesome.woff2',
  '/fonts/devopicons.woff2',
  '/fonts/mfixx.woff2',
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE).catch(() => {}))
  )
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  const { request } = e
  if (request.method !== 'GET') return

  // Network-only for API routes — never cache dynamic responses
  if (request.url.includes('/api/')) {
    e.respondWith(
      fetch(request).catch(() => new Response('{"error":"offline"}', {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }))
    )
    return
  }

  // Cache-first for everything else
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached
      return fetch(request).then(res => {
        const toCache = res.clone()
        if (res.ok && request.url.startsWith(self.location.origin)) {
          caches.open(CACHE).then(c => c.put(request, toCache))
        }
        return res
      })
    })
  )
})

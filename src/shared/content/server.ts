export const SERVER_TS = `// server.ts — Nusmark Calendar Platform

interface Endpoint {
  method: string
  path: string
  description: string
}

const API_VERSION: string = 'v1'
const BASE_URL: string = 'https://api.nusmark.com'

const endpoints: Endpoint[] = [
  { method: 'POST',   path: '/auth/google',           description: 'Initiate Google OAuth2 flow'          },
  { method: 'POST',   path: '/auth/outlook',          description: 'Initiate Microsoft OAuth2 flow'       },
  { method: 'GET',    path: '/calendar/events',       description: 'List synced calendar events'          },
  { method: 'POST',   path: '/calendar/sync',         description: 'Trigger manual sync'                  },
  { method: 'DELETE', path: '/calendar/events/:id',   description: 'Remove a calendar event'              },
  { method: 'POST',   path: '/webhooks/google',       description: 'Handle Google push notification'      },
  { method: 'POST',   path: '/webhooks/outlook',      description: 'Handle Microsoft change notification' },
  { method: 'GET',    path: '/health',                description: 'Service health check'                 },
]

console.log(BASE_URL + '/api/' + API_VERSION)
console.log('─────────────────────────────────────────────────────────────')
console.log('')
endpoints.forEach(({ method, path, description }) => {
  console.log('  ' + method.padEnd(8) + path.padEnd(28) + description)
})
console.log('')
console.warn('Stack: Python · FastAPI · Firestore · OAuth2 · Webhooks · Azure')`

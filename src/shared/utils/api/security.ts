import { NextRequest } from 'next/server'

export function allowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true
  try {
    const host = req.headers.get('host') ?? ''
    const { hostname } = new URL(origin)
    return hostname === 'localhost' || hostname === host.split(':')[0]
  } catch { return false }
}

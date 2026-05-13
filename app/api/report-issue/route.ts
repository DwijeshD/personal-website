import { NextRequest, NextResponse } from 'next/server'

const OWNER = 'DwijeshD'
const REPO  = 'personalwebsite'

// In-memory rate limit: 3 reports per IP per hour
const rateMap = new Map<string, { count: number; reset: number }>()
const LIMIT = 3
const WINDOW_MS = 60 * 60 * 1000

function getIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

function checkRate(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + WINDOW_MS })
    return { allowed: true, remaining: LIMIT - 1 }
  }
  if (entry.count >= LIMIT) return { allowed: false, remaining: 0 }
  entry.count++
  return { allowed: true, remaining: LIMIT - entry.count }
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)
  const { allowed, remaining } = checkRate(ip)
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit reached. Max 3 reports per hour.' }, { status: 429 })
  }

  const token = process.env.GITHUB_ISSUES_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Issue reporting not configured.' }, { status: 503 })
  }

  let body: { title?: string; description?: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const title = (body.title ?? '').slice(0, 100).trim()
  const description = (body.description ?? '').slice(0, 2000).trim()

  if (!title) return NextResponse.json({ error: 'Title required.' }, { status: 400 })

  const issueBody = [
    description || '_No description provided._',
    '',
    '---',
    `*Reported via portfolio chat · ${new Date().toUTCString()}*`,
  ].join('\n')

  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      body: issueBody,
      labels: ['user-reported'],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ error: err.message ?? 'GitHub API error.' }, { status: 502 })
  }

  const issue = await res.json()
  return NextResponse.json({ number: issue.number, remaining }, { status: 201 })
}

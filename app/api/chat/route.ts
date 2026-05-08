import { NextRequest, NextResponse } from 'next/server'
import { AI_SYSTEM_PROMPT } from '@/lib/data'
import { buildContext } from '@/lib/contextBuilder'

export const runtime = 'edge'

const MAX_MESSAGES   = 20
const MAX_MSG_LENGTH = 2000
const MAX_BODY_BYTES = 50_000
const MODEL_TIMEOUT  = 20_000

// Ordered by quality — skips 429s automatically until one works
const CHAT_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen3-coder:free',
  'nousresearch/hermes-3-llama-3.1-405b:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'openai/gpt-oss-20b:free',
]

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function err(msg: string, status: number) {
  return NextResponse.json({ error: msg }, { status })
}

// Reject cross-origin requests from unknown domains
function allowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true  // same-origin or non-browser (no Origin header)
  try {
    const host = req.headers.get('host') ?? ''
    const { hostname } = new URL(origin)
    return hostname === 'localhost' || hostname === host.split(':')[0]
  } catch { return false }
}

export async function POST(req: NextRequest) {
  if (!allowedOrigin(req)) return err('Forbidden', 403)

  if (!(req.headers.get('content-type') ?? '').includes('application/json'))
    return err('Content-Type must be application/json', 400)

  // Read raw bytes first — Content-Length is attacker-controlled and can be missing
  let raw: ArrayBuffer
  try { raw = await req.arrayBuffer() } catch { return err('Failed to read body', 400) }
  if (raw.byteLength > MAX_BODY_BYTES) return err('Request body too large', 400)

  let messages: unknown
  try {
    messages = JSON.parse(new TextDecoder().decode(raw))?.messages
  } catch {
    return err('Invalid JSON body', 400)
  }

  if (!Array.isArray(messages))       return err('messages must be an array', 400)
  if (messages.length === 0)          return err('messages must not be empty', 400)
  if (messages.length > MAX_MESSAGES) return err(`Too many messages (max ${MAX_MESSAGES})`, 400)

  for (const m of messages) {
    if (typeof m !== 'object' || m === null)         return err('Each message must be an object', 400)
    if (m.role !== 'user' && m.role !== 'assistant') return err('Message role must be user or assistant', 400)
    if (typeof m.content !== 'string')               return err('Message content must be a string', 400)
    if (m.content.length === 0)                      return err('Message content must not be empty', 400)
    if (m.content.length > MAX_MSG_LENGTH)           return err(`Message too long (max ${MAX_MSG_LENGTH} chars)`, 400)
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return err('AI assistant not configured', 503)

  const lastUserMsg = [...(messages as Message[])].reverse().find(m => m.role === 'user')
  const context = buildContext(lastUserMsg?.content ?? '')

  const body = JSON.stringify({
    messages: [
      { role: 'system', content: `${AI_SYSTEM_PROMPT}\n\n${context}` },
      ...(messages as Message[]),
    ],
    max_tokens:  300,
    temperature: 0.3,
    stream:      true,
  })

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type':  'application/json',
    'HTTP-Referer':  'https://dwijesh.dev',
    'X-Title':       'Dwijesh Portfolio',
  }

  // Try each model in order; skip on 429 or timeout
  for (const model of CHAT_MODELS) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), MODEL_TIMEOUT)

    let response: Response
    try {
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers,
        signal: controller.signal,
        body: JSON.stringify({ ...JSON.parse(body), model }),
      })
    } catch {
      clearTimeout(timer)
      continue  // timeout or network error — try next
    }

    clearTimeout(timer)

    if (response.status === 429 || response.status === 404) continue  // rate-limited or unavailable
    if (!response.ok) continue  // unexpected error — try next

    return new NextResponse(response.body, {
      headers: {
        'Content-Type':            'text/event-stream',
        'Cache-Control':           'no-cache, no-store',
        'X-Content-Type-Options':  'nosniff',
      },
    })
  }

  return err('All AI models are currently unavailable. Please try again in a moment.', 503)
}

import { NextRequest, NextResponse } from 'next/server'
import { AI_SYSTEM_PROMPT } from '@/lib/ai/systemPrompt'
import { buildContext } from '@/lib/contextBuilder'
import { checkRateLimit, isVpnOrProxy } from '@/lib/rateLimit'
import { allowedOrigin } from '@/lib/security'

export const runtime = 'edge'

const MAX_MESSAGES   = 20
const MAX_MSG_LENGTH = 2000
const MAX_BODY_BYTES = 50_000
const MODEL_TIMEOUT  = 45_000

// openrouter/free lets OpenRouter pick the best available free model at
// request time — no hardcoded slug to go stale when a provider deprecates
// a model. Occasional bad picks (e.g. a model leaking a moderation tag
// instead of a real reply) are caught client-side, see isJunkOnly in
// CopilotPanel.
const CHAT_MODELS = [
  'openrouter/free',
]

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface FileContext {
  path: string
  content: string
}

function err(msg: string, status: number) {
  return NextResponse.json({ error: msg }, { status })
}

export async function POST(req: NextRequest) {
  if (!allowedOrigin(req)) return err('Forbidden', 403)

  const ip = req.headers.get('x-real-ip') ?? req.headers.get('cf-connecting-ip') ?? 'unknown'

  const vpn = await isVpnOrProxy(ip)
  if (vpn) return err('Access denied.', 403)

  const limit = checkRateLimit(ip)
  if (!limit.allowed) {
    const resetIn = Math.ceil((limit.resetAt - Date.now()) / 1000 / 60 / 60)
    return err(`Daily message limit reached. Resets in ~${resetIn}h.`, 429)
  }

  if (!(req.headers.get('content-type') ?? '').includes('application/json'))
    return err('Content-Type must be application/json', 400)

  // Read raw bytes first — Content-Length is attacker-controlled and can be missing
  let raw: ArrayBuffer
  try { raw = await req.arrayBuffer() } catch { return err('Failed to read body', 400) }
  if (raw.byteLength > MAX_BODY_BYTES) return err('Request body too large', 400)

  let messages: unknown
  let fileContext: FileContext[] | undefined
  let workspaceFiles: string[] | undefined
  try {
    const parsed = JSON.parse(new TextDecoder().decode(raw))
    messages      = parsed?.messages
    fileContext   = Array.isArray(parsed?.fileContext)  ? parsed.fileContext  : undefined
    workspaceFiles = Array.isArray(parsed?.workspaceFiles) ? parsed.workspaceFiles : undefined
  } catch {
    return err('Invalid JSON body', 400)
  }

  if (!Array.isArray(messages)) return err('messages must be an array', 400)
  if (messages.length === 0) return err('messages must not be empty', 400)
  if (messages.length > MAX_MESSAGES) return err(`Too many messages (max ${MAX_MESSAGES})`, 400)

  for (const m of messages) {
    if (typeof m !== 'object' || m === null) return err('Each message must be an object', 400)
    if (m.role !== 'user' && m.role !== 'assistant') return err('Message role must be user or assistant', 400)
    if (typeof m.content !== 'string') return err('Message content must be a string', 400)
    if (m.content.length === 0) return err('Message content must not be empty', 400)
    if (m.content.length > MAX_MSG_LENGTH) return err(`Message too long (max ${MAX_MSG_LENGTH} chars)`, 400)
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return err('AI assistant not configured', 503)

  const lastUserMsg = [...(messages as Message[])].reverse().find(m => m.role === 'user')
  const context = buildContext(lastUserMsg?.content ?? '')

  let systemContent = `${AI_SYSTEM_PROMPT}\n\n${context}`

  if (workspaceFiles && workspaceFiles.length > 0) {
    const names = workspaceFiles.filter(f => typeof f === 'string').slice(0, 30).join('\n')
    systemContent += `\n\n=== WORKSPACE FILES ===\nThe following files exist in the workspace:\n${names}`
  }

  if (fileContext && fileContext.length > 0) {
    const blocks = fileContext
      .filter(f => typeof f.path === 'string' && typeof f.content === 'string')
      .map(f => `File: ${f.path}\n\`\`\`\n${f.content.slice(0, 2500)}\n\`\`\``)
      .join('\n\n')
    systemContent += `\n\n=== FILE CONTEXT ===\n${blocks}`
  }

  const hasFiles = fileContext && fileContext.length > 0
  const body = JSON.stringify({
    messages: [
      { role: 'system', content: systemContent },
      ...(messages as Message[]),
    ],
    max_tokens: hasFiles ? 3000 : 800,
    temperature: 0.4,
    stream: true,
    thinking: { type: 'disabled' },
    max_tokens_for_reasoning: 0,
  })

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://dwijesh.dev',
    'X-Title': 'Dwijesh Portfolio',
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
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-RateLimit-Remaining': String(limit.remaining),
        'Access-Control-Expose-Headers': 'X-RateLimit-Remaining',
      },
    })
  }

  return err('All AI models are currently unavailable. Please try again in a moment.', 503)
}

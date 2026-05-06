import { NextRequest, NextResponse } from 'next/server'
import { AI_SYSTEM_PROMPT } from '@/lib/data'
import { buildContext } from '@/lib/contextBuilder'

export const runtime = 'edge'

const MAX_MESSAGES   = 20
const MAX_MSG_LENGTH = 2000
const MAX_BODY_BYTES = 50_000

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function err(msg: string, status: number) {
  return NextResponse.json({ error: msg }, { status })
}

export async function POST(req: NextRequest) {
  if (!(req.headers.get('content-type') ?? '').includes('application/json')) {
    return err('Content-Type must be application/json', 400)
  }

  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) return err('Request body too large', 400)

  let messages: unknown
  try {
    messages = (await req.json())?.messages
  } catch {
    return err('Invalid JSON body', 400)
  }

  if (!Array.isArray(messages))          return err('messages must be an array', 400)
  if (messages.length === 0)             return err('messages must not be empty', 400)
  if (messages.length > MAX_MESSAGES)    return err(`Too many messages (max ${MAX_MESSAGES})`, 400)

  for (const m of messages) {
    if (typeof m !== 'object' || m === null)         return err('Each message must be an object', 400)
    if (m.role !== 'user' && m.role !== 'assistant') return err('Message role must be user or assistant', 400)
    if (typeof m.content !== 'string')               return err('Message content must be a string', 400)
    if (m.content.length === 0)                      return err('Message content must not be empty', 400)
    if (m.content.length > MAX_MSG_LENGTH)           return err(`Message too long (max ${MAX_MSG_LENGTH} chars)`, 400)
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return err('AI assistant not configured', 503)

  // Build context from the latest user message
  const lastUserMsg = [...(messages as Message[])].reverse().find(m => m.role === 'user')
  const context = buildContext(lastUserMsg?.content ?? '')

  const model = process.env.OPENROUTER_MODEL ?? 'meta-llama/llama-3.3-70b-instruct:free'

  let response: Response
  try {
    response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://dwijesh.dev',
        'X-Title': 'Dwijesh Portfolio',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system',    content: AI_SYSTEM_PROMPT },
          { role: 'assistant', content: `CONTEXT:\n${context}` },
          ...(messages as Message[]),
        ],
        max_tokens:  300,
        temperature: 0.3,
        stream: true,
      }),
    })
  } catch {
    return err('Failed to reach AI service', 502)
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => 'no body')
    return err(`AI service error ${response.status}: ${detail}`, 502)
  }

  return new NextResponse(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

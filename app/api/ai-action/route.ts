import { NextRequest, NextResponse } from 'next/server'
import { validateAiAction } from '@/lib/fileSystem'

export const runtime = 'edge'

// Simple per-IP rate limit: max 10 requests per minute (edge-local, resets per instance)
const rateLimitMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT    = 10
const RATE_WINDOW   = 60_000 // 1 minute

function checkRateLimit(ip: string): boolean {
  const now  = Date.now()
  const slot = rateLimitMap.get(ip)
  if (!slot || now > slot.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_WINDOW })
    return true
  }
  if (slot.count >= RATE_LIMIT) return false
  slot.count++
  return true
}

function err(msg: string, status: number) {
  return NextResponse.json({ error: msg }, { status })
}

const AI_ACTION_SYSTEM = `You are an AI coding assistant embedded in a browser-based VSCode-style IDE.
This IDE belongs to Dwijesh Dookraz's portfolio website (Next.js 15, React 19, TypeScript, Tailwind CSS).

You can perform file operations. You MUST respond with valid JSON ONLY.
No markdown, no code fences, no explanations — ONLY the JSON object.

Available actions (choose exactly ONE):
  create_file   — create a new file with full content
  update_file   — overwrite an existing file's content completely
  delete_file   — delete a file by path
  create_folder — create a new empty folder

Response format:
  {"action":"create_file","path":"relative/path/to/file.ext","content":"<complete file content>"}
  {"action":"update_file","path":"relative/path/to/file.ext","content":"<complete file content>"}
  {"action":"delete_file","path":"relative/path/to/file"}
  {"action":"create_folder","path":"relative/folder/name"}

Rules:
  - Exactly ONE action per response
  - path is always relative — no leading "/", no "..", no "//"
  - If updating a file, use update_file (not create_file)
  - If the file doesn't exist yet, use create_file
  - content must be complete and syntactically valid for the file type
  - Match the project's TypeScript/React style when creating .ts/.tsx files
  - For new React components, include 'use client' if needed
  - NEVER output anything outside the JSON object`

export async function POST(req: NextRequest) {
  // Rate limit
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!checkRateLimit(ip)) return err('Rate limit exceeded. Try again in a minute.', 429)

  if (!(req.headers.get('content-type') ?? '').includes('application/json'))
    return err('Content-Type must be application/json', 400)

  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > 8_000) return err('Request body too large', 400)

  let body: { message?: unknown; files?: unknown }
  try {
    body = await req.json()
  } catch {
    return err('Invalid JSON body', 400)
  }

  const { message, files } = body

  if (typeof message !== 'string' || message.trim().length === 0)
    return err('message must be a non-empty string', 400)
  if (message.length > 1_000)
    return err('message too long (max 1000 chars)', 400)

  // Optional list of current file paths for context (validated, max 100 entries)
  const fileList: string[] = []
  if (Array.isArray(files)) {
    for (const f of files.slice(0, 100)) {
      if (typeof f === 'string' && f.length < 200) fileList.push(f)
    }
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return err('AI assistant not configured', 503)

  const model = process.env.OPENROUTER_MODEL ?? 'meta-llama/llama-3.3-70b-instruct:free'

  let upstream: Response
  try {
    upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
          { role: 'system', content: AI_ACTION_SYSTEM },
          {
            role: 'user',
            content: fileList.length > 0
              ? `EXISTING FILES IN WORKSPACE:\n${fileList.map(f => `  - ${f}`).join('\n')}\n\nREQUEST: ${message.trim()}`
              : message.trim(),
          },
        ],
        max_tokens:  2048,
        temperature: 0.2,
        stream:      false,
      }),
    })
  } catch {
    return err('Failed to reach AI service', 502)
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => 'no body')
    return err(`AI service error ${upstream.status}: ${detail}`, 502)
  }

  let rawText: string
  try {
    const data = await upstream.json()
    rawText = data.choices?.[0]?.message?.content ?? ''
  } catch {
    return err('Unexpected response from AI service', 502)
  }

  if (!rawText.trim()) return err('AI returned empty response', 502)

  // Strip any accidental markdown fences
  const cleaned = rawText.trim().replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return err(`AI returned invalid JSON: ${cleaned.slice(0, 120)}`, 422)
  }

  const result = validateAiAction(parsed)
  if (!result.ok) return err(`Invalid action from AI: ${result.error}`, 422)

  return NextResponse.json({ action: result.action }, {
    headers: { 'X-Content-Type-Options': 'nosniff' },
  })
}

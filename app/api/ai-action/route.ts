import { NextRequest, NextResponse } from 'next/server'
import { validateAiAction } from '@/lib/fileSystem'
import { isVpnOrProxy } from '@/lib/rateLimit'

export const runtime = 'edge'

// ── Rate limiting ────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT   = 15
const RATE_WINDOW  = 60_000

function checkRateLimit(ip: string): boolean {
  const now  = Date.now()
  const slot = rateLimitMap.get(ip)
  if (!slot || now > slot.reset) { rateLimitMap.set(ip, { count: 1, reset: now + RATE_WINDOW }); return true }
  if (slot.count >= RATE_LIMIT) return false
  slot.count++
  return true
}

// ── Model fallback chain ─────────────────────────────────────────────────────
// Ordered by quality. If a model is rate-limited (429) or returns bad JSON,
// the next one is tried automatically.
const MODELS = [
  'openrouter/free',
  'openai/gpt-oss-120b:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
]

const MODEL_TIMEOUT_MS = 12_000

// ── System prompt ────────────────────────────────────────────────────────────
const SYSTEM = `You are an AI coding assistant inside a browser-based VSCode-style IDE.
This is a portfolio website for Dwijesh Dookraz (Next.js 15, React 19, TypeScript, Tailwind CSS).

You MUST respond with a single valid JSON object ONLY.
Absolutely NO markdown fences, NO <think> blocks, NO explanations, NO text before or after the JSON.

Available actions:
  create_file   — create a new file
  update_file   — overwrite an existing file completely
  delete_file   — delete a file
  create_folder — create a new folder

Response schema:
  {"action":"create_file","path":"relative/path.ext","content":"<complete file content>"}
  {"action":"update_file","path":"relative/path.ext","content":"<complete file content>"}
  {"action":"delete_file","path":"relative/path"}
  {"action":"create_folder","path":"relative/folder"}

Hard rules:
  - ONE action, ONE JSON object, nothing else
  - path is always relative — no leading "/" or "..", no "//"
  - Use update_file if the file already exists; create_file if it is new
  - content must be syntactically complete and valid for the file type
  - Match TypeScript/React style for .ts/.tsx files; add 'use client' when needed
  - NEVER output anything outside the JSON`

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractJson(text: string): unknown {
  // Strip <think>...</think> reasoning blocks emitted by some models
  let s = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
  // Strip markdown fences
  s = s.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim()
  // Direct parse
  try { return JSON.parse(s) } catch { /* fall through */ }
  // Find last JSON-like {...} block
  const matches = [...s.matchAll(/\{[\s\S]*?\}/g)]
  for (const m of matches.reverse()) {
    try { return JSON.parse(m[0]) } catch { /* next */ }
  }
  // Greedy match
  const greedy = s.match(/\{[\s\S]*\}/)
  if (greedy) try { return JSON.parse(greedy[0]) } catch { /* fall through */ }
  return null
}

function normalizeAction(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return raw
  const obj = { ...(raw as Record<string, unknown>) }

  // Handle 'filename' or 'name' in place of 'path'
  if (!obj.path && obj.filename) { obj.path = obj.filename; delete obj.filename }
  if (!obj.path && obj.name)     { obj.path = obj.name;     delete obj.name     }
  // Handle 'type' in place of 'action'
  if (!obj.action && obj.type)   { obj.action = obj.type;   delete obj.type     }

  // Handle {files:[{path,content},...]} array format
  if (!obj.action && Array.isArray(obj.files) && obj.files.length > 0) {
    const f = obj.files[0] as Record<string, unknown>
    return { action: 'create_file', path: f.path ?? f.filename ?? f.name, content: f.content }
  }

  // Handle {"some/path.ext": "content"} — model returned filename-keyed object
  if (!obj.action && !obj.path) {
    const keys = Object.keys(obj)
    if (keys.length === 1 && typeof obj[keys[0]] === 'string') {
      return { action: 'update_file', path: keys[0], content: obj[keys[0]] }
    }
  }

  return obj
}

async function callModel(model: string, userContent: string): Promise<{ ok: boolean; rateLimit: boolean; json: unknown }> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), MODEL_TIMEOUT_MS)

  try {
    const apiKey = process.env.OPENROUTER_API_KEY!
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://dwijesh.dev', 'X-Title': 'Dwijesh Portfolio' },
      signal:  controller.signal,
      body: JSON.stringify({
        model,
        messages:    [{ role: 'system', content: SYSTEM }, { role: 'user', content: userContent }],
        max_tokens:  2048,
        temperature: 0.15,
        stream:      false,
        thinking: { type: 'disabled' },
        max_tokens_for_reasoning: 0,
      }),
    })

    if (res.status === 429)    return { ok: false, rateLimit: true,  json: null }
    if (res.status === 404)    return { ok: false, rateLimit: false, json: null }
    if (!res.ok)               return { ok: false, rateLimit: false, json: null }

    const data = await res.json()
    const raw  = (data as Record<string, unknown>)
    const choices = raw.choices as Array<{ message: { content: string } }> | undefined
    const content = choices?.[0]?.message?.content ?? ''
    if (!content.trim()) return { ok: false, rateLimit: false, json: null }

    const parsed = extractJson(content)
    if (!parsed)              return { ok: false, rateLimit: false, json: null }

    return { ok: true, rateLimit: false, json: normalizeAction(parsed) }
  } catch {
    return { ok: false, rateLimit: false, json: null }
  } finally {
    clearTimeout(timer)
  }
}

function err(msg: string, status: number) {
  return NextResponse.json({ error: msg }, { status })
}

// ── Origin guard ─────────────────────────────────────────────────────────────
function allowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true
  try {
    const host = req.headers.get('host') ?? ''
    const { hostname } = new URL(origin)
    return hostname === 'localhost' || hostname === host.split(':')[0]
  } catch { return false }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!allowedOrigin(req)) return err('Forbidden', 403)

  // Use proxy-injected headers (non-spoofable): x-real-ip set by Vercel, cf-connecting-ip by Cloudflare
  // Explicitly avoid x-forwarded-for which is fully attacker-controlled
  const ip = req.headers.get('x-real-ip') ?? req.headers.get('cf-connecting-ip') ?? 'unknown'

  const vpn = await isVpnOrProxy(ip)
  if (vpn) return err('Access denied.', 403)

  if (!checkRateLimit(ip)) return err('Rate limit exceeded. Try again in a minute.', 429)

  if (!(req.headers.get('content-type') ?? '').includes('application/json'))
    return err('Content-Type must be application/json', 400)

  // Read raw bytes first — Content-Length is attacker-controlled and can be missing
  let raw: ArrayBuffer
  try { raw = await req.arrayBuffer() } catch { return err('Failed to read body', 400) }
  if (raw.byteLength > 60_000) return err('Request body too large', 400)

  let body: { message?: unknown; files?: unknown; fileContents?: unknown }
  try { body = JSON.parse(new TextDecoder().decode(raw)) }
  catch { return err('Invalid JSON body', 400) }

  const { message, files, fileContents } = body
  if (typeof message !== 'string' || !message.trim()) return err('message must be a non-empty string', 400)
  if (message.length > 1_000) return err('message too long (max 1000 chars)', 400)

  const fileList: string[] = []
  if (Array.isArray(files)) {
    for (const f of (files as unknown[]).slice(0, 100)) {
      if (typeof f === 'string' && f.length < 200) fileList.push(f)
    }
  }

  // Files with content attached — used for update_file edits
  const withContent: Array<{ path: string; content: string }> = []
  if (Array.isArray(fileContents)) {
    for (const f of (fileContents as unknown[]).slice(0, 5)) {
      if (f && typeof f === 'object') {
        const { path, content } = f as Record<string, unknown>
        if (typeof path === 'string' && typeof content === 'string' && content.length > 0)
          withContent.push({ path, content: content.slice(0, 8_000) })
      }
    }
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return err('AI assistant not configured', 503)

  let userContent = `EXISTING FILES IN WORKSPACE:\n${fileList.map(f => `  - ${f}`).join('\n') || '  (none)'}`

  if (withContent.length > 0) {
    userContent += '\n\nFILE CONTENTS (use these as the base for any edits):\n'
    for (const f of withContent) {
      userContent += `\n--- ${f.path} ---\n${f.content}\n`
    }
  }

  userContent += `\n\nREQUEST: ${message.trim()}`

  // Try each model in order until one returns valid JSON
  for (const model of MODELS) {
    const result = await callModel(model, userContent)
    if (result.rateLimit) continue   // rate-limited, try next
    if (!result.ok || !result.json)  continue   // bad response, try next

    const validation = validateAiAction(result.json)
    if (!validation.ok) continue  // invalid action schema, try next

    return NextResponse.json({ action: validation.action, model }, {
      headers: { 'X-Content-Type-Options': 'nosniff' },
    })
  }

  return err('All AI models are currently unavailable. Please try again in a moment.', 503)
}

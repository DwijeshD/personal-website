'use client'

import { useEffect, useRef, useState } from 'react'
import type { AiFileAction } from '@/lib/fileSystem'
import { validateAiAction } from '@/lib/fileSystem'
import { DEFAULT_CONTENT } from '@/lib/defaultContent'

interface Message {
  role: 'user' | 'assistant'
  content: string
  thinking?: string
  action?: AiFileAction
}

const THINKING_WORDS = [
  'Thinking', 'Reasoning', 'Cogitating', 'Computing',
  'Pondering', 'Deliberating', 'Ruminating', 'Considering',
]

function ThinkingIndicator() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % THINKING_WORDS.length), 1500)
    return () => clearInterval(t)
  }, [])
  return <span className="text-vsc-muted/50 text-xs italic">{THINKING_WORDS[idx]}&hellip;</span>
}

function parseThinkBlocks(raw: string): { thinking: string; content: string } {
  let thinking = ''
  let content = ''
  let rest = raw

  while (rest.length > 0) {
    const start = rest.indexOf('<think>')
    if (start === -1) { content += rest; break }
    content += rest.slice(0, start)
    rest = rest.slice(start + 7)
    const end = rest.indexOf('</think>')
    if (end === -1) { thinking += rest; break }
    thinking += rest.slice(0, end)
    rest = rest.slice(end + 8)
  }

  return { thinking: thinking.trimStart(), content: content.trimStart() }
}

// Render assistant markdown: **bold**, `code`, bullet lists, line breaks
function formatModel(raw: string): string | null {
  const model = raw.split('/').pop() ?? raw       // strip provider prefix
  const clean = model.split(':')[0]               // strip :free/:beta/:nitro etc.
  if (!clean || clean === 'free') return null
  return clean
}

function renderMd(text: string): React.ReactNode {
  if (!text) return null

  const inline = (s: string, base: number): React.ReactNode[] => {
    const nodes: React.ReactNode[] = []
    let rem = s
    let k = base * 1000

    while (rem.length > 0) {
      const bi = rem.indexOf('**')
      const ci = rem.indexOf('`')
      const first = Math.min(bi < 0 ? Infinity : bi, ci < 0 ? Infinity : ci)

      if (first === Infinity) { nodes.push(rem); break }
      if (first > 0) nodes.push(rem.slice(0, first))

      if (bi >= 0 && (ci < 0 || bi <= ci)) {
        const end = rem.indexOf('**', bi + 2)
        if (end < 0) { nodes.push(rem.slice(bi)); break }
        nodes.push(
          <strong key={k++} className="font-semibold text-vsc-text">
            {rem.slice(bi + 2, end)}
          </strong>
        )
        rem = rem.slice(end + 2)
      } else {
        const end = rem.indexOf('`', ci + 1)
        if (end < 0) { nodes.push(rem.slice(ci)); break }
        nodes.push(
          <code key={k++} className="px-1 bg-[#1a1a2e] border border-vsc-border/50 rounded text-[#9cdcfe] text-[11px] font-mono">
            {rem.slice(ci + 1, end)}
          </code>
        )
        rem = rem.slice(end + 1)
      }
    }
    return nodes
  }

  const lines = text.split('\n')
  const out: React.ReactNode[] = []

  lines.forEach((line, i) => {
    const t = line.trimStart()
    const isBullet = /^[-•*] /.test(t)
    const isNumbered = /^\d+\. /.test(t)
    const isHeading = t.startsWith('### ') || t.startsWith('## ') || t.startsWith('# ')

    if (isHeading) {
      const content = t.replace(/^#{1,3} /, '')
      out.push(
        <div key={i} className="font-semibold text-vsc-text text-[12px] mt-1.5 mb-0.5">
          {inline(content, i)}
        </div>
      )
    } else if (isBullet) {
      out.push(
        <div key={i} className="flex gap-1.5 items-baseline">
          <span className="text-vsc-accent/60 shrink-0 mt-0.5 text-[10px]">›</span>
          <span>{inline(t.slice(2), i)}</span>
        </div>
      )
    } else if (isNumbered) {
      const match = t.match(/^(\d+)\. (.*)/)
      if (match) {
        out.push(
          <div key={i} className="flex gap-1.5 items-baseline">
            <span className="text-vsc-muted shrink-0 text-[11px] min-w-[14px]">{match[1]}.</span>
            <span>{inline(match[2], i)}</span>
          </div>
        )
      }
    } else if (t === '') {
      if (i > 0 && i < lines.length - 1) out.push(<div key={i} className="h-1.5" />)
    } else {
      out.push(<div key={i}>{inline(line, i)}</div>)
    }
  })

  return <div className="space-y-0.5">{out}</div>
}

interface Props {
  onThinkingChange:  (v: boolean) => void
  onClose:           () => void
  onPendingAction:   (action: AiFileAction, onResult: (applied: boolean) => void) => void
  workspaceFiles?:   string[]
  fileContents?:     Record<string, string>
  triggerBugReport?: number
}

function resolveFileContent(name: string, fileContents: Record<string, string>): string {
  return fileContents[`file:${name}`] ?? fileContents[name] ?? DEFAULT_CONTENT[name] ?? ''
}

function attachedFiles(
  message: string,
  names: string[],
  fileContents: Record<string, string>,
): Array<{ path: string; content: string }> {
  const lower = message.toLowerCase()
  const mentions = [...message.matchAll(/@([\w.\-]+)/g)].map(m => m[1].toLowerCase())
  return names
    .filter(n => {
      const nLower = n.toLowerCase()
      const baseName = nLower.split('.')[0]
      return mentions.some(m => nLower.startsWith(m) || baseName === m)
        || lower.includes(nLower)
    })
    .map(n => ({ path: n, content: resolveFileContent(n, fileContents) }))
    .filter(f => f.content.length > 0)
    .slice(0, 5)
}

function CopilotIcon({ size = 48, muted = false }: { size?: number; muted?: boolean }) {
  return (
    <img
      src="/vscode-copilot.png"
      width={size}
      height={size}
      alt="Copilot"
      style={{
        filter: `invert(1) ${muted ? 'brightness(0.5)' : 'brightness(1)'}`,
        mixBlendMode: 'screen',
        display: 'block',
      }}
    />
  )
}

function detectIntent(text: string): 'action' | 'chat' {
  const lower = text.toLowerCase()
  const verbs = ['create', 'make', 'add', 'write', 'generate', 'update', 'edit', 'modify',
                 'change', 'delete', 'remove', 'rename', 'move', 'rewrite', 'refactor']
  const fileKeys = ['file', 'folder', 'directory', 'component', 'page', 'readme',
                    '.tsx', '.ts', '.js', '.jsx', '.css', '.json', '.md', '.html']
  return verbs.some(v => lower.includes(v)) && fileKeys.some(k => lower.includes(k))
    ? 'action' : 'chat'
}

const SUGGESTED = [
  { label: 'What has he built?',     query: 'What projects has Dwijesh built and what problems do they solve?' },
  { label: 'Tech stack',             query: "What is Dwijesh's full tech stack and what systems has he worked on?" },
  { label: 'rPPG dissertation',      query: 'Tell me about the rPPG heart rate prediction dissertation.' },
  { label: 'Open to work?',          query: 'Is Dwijesh open to new roles? What kind of work is he looking for?' },
]

// All queries worth pre-fetching (suggested + quick prompts, deduplicated)
const PREFETCH_QUERIES = [
  ...SUGGESTED.map(s => s.query),
  "What is Dwijesh's full tech stack and the systems he's built?",
  "What are Dwijesh's main projects and what makes them technically interesting?",
  "What kind of work is Dwijesh looking for and how can I contact him?",
].filter((q, i, a) => a.indexOf(q) === i)

async function fetchFullResponse(query: string): Promise<{ text: string; remaining: number | null }> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Prefetch': '1' },
    body: JSON.stringify({ messages: [{ role: 'user', content: query }] }),
  })
  if (!res.ok) throw new Error('prefetch failed')

  const remaining = res.headers.get('X-RateLimit-Remaining')
  const reader  = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = '', accumulated = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') break
      try {
        const delta = JSON.parse(data).choices?.[0]?.delta?.content
        if (delta) accumulated += delta
      } catch { /* skip */ }
    }
  }
  return { text: accumulated, remaining: remaining !== null ? Number(remaining) : null }
}

// Re-trigger the CSS animation on the same DOM node without remounting.
// Key-based remounting causes a visible flash; this approach doesn't.
function StreamingBubble({
  content,
  isStreaming,
  busy,
}: {
  content: string
  isStreaming: boolean
  busy: boolean
}) {
  if (!content) return busy ? <ThinkingIndicator /> : null
  // During streaming: plain text to avoid renderMd reconciliation flicker.
  // After streaming: full markdown render.
  if (isStreaming) {
    return <span className="whitespace-pre-wrap">{content}</span>
  }
  return <>{renderMd(content)}</>
}

const BUG_KEYWORDS = /\b(bug|broken|error|issue|problem|crash|wrong|not work|doesn't work|doesn't load|fail|glitch|weird|strange|incorrect|missing|stuck)\b/i

type IssueState = { status: 'idle' } | { status: 'form'; title: string; desc: string } | { status: 'submitting' } | { status: 'done'; number: number } | { status: 'error'; msg: string }

interface LogEntry {
  ts: number
  level: 'info' | 'warn' | 'error'
  tag: string
  msg: string
}

function LogsView({ logs, onClear }: { logs: LogEntry[]; onClear: () => void }) {
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => { bottomRef.current?.scrollIntoView() }, [logs.length])

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-vsc-muted text-[11px] gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <span className="opacity-50">No logs — send a message to start</span>
      </div>
    )
  }

  const startTs = logs[0].ts

  return (
    <div className="h-full overflow-y-auto panel-scroll font-mono text-[11px]">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-vsc-border/30 sticky top-0 bg-[#181818]">
        <span className="text-vsc-muted/50">{logs.length} entries</span>
        <button onClick={onClear} className="text-vsc-muted/40 hover:text-vsc-muted transition-colors text-[10px]">Clear</button>
      </div>
      <div className="p-3 space-y-0.5">
        {logs.map((l, i) => (
          <div key={i} className="flex gap-2 leading-5 items-baseline">
            <span className="text-vsc-muted/40 shrink-0 tabular-nums">
              +{((l.ts - startTs) / 1000).toFixed(2)}s
            </span>
            <span className={`shrink-0 font-semibold min-w-[80px] ${
              l.level === 'error' ? 'text-red-400' :
              l.level === 'warn'  ? 'text-yellow-400' :
              'text-[#4ec9b0]/70'
            }`}>
              [{l.tag}]
            </span>
            <span className="text-vsc-text/75 break-all">{l.msg}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

export default function CopilotPanel({ onThinkingChange, onClose, onPendingAction, workspaceFiles = [], fileContents = {}, triggerBugReport }: Props) {
  const [messages, setMessages]           = useState<Message[]>([])
  const [input, setInput]                 = useState('')
  const [streaming, setStreaming]         = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [lastEditMsg, setLastEditMsg]     = useState<string | null>(null)
  const [failedIdx, setFailedIdx]         = useState<number | null>(null)
  const [thinkExpanded, setThinkExpanded] = useState<Record<number, boolean>>({})
  const [msgsLeft, setMsgsLeft]           = useState<number | null>(null)
  const [issueState, setIssueState]       = useState<IssueState>({ status: 'idle' })
  const [pendingBugMsg, setPendingBugMsg] = useState<string | null>(null)
  const [logs, setLogs]                   = useState<LogEntry[]>([])
  const [activeView, setActiveView]       = useState<'chat' | 'logs'>('chat')
  const [activeModel, setActiveModel]     = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('copilot:resolvedModel') : null
  )
  const bottomRef      = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLTextAreaElement>(null)
  const rawAccum       = useRef('')
  const displayIdx     = useRef(0)
  const networkDone    = useRef(false)
  const abortRef       = useRef<AbortController | null>(null)
  const prefetchCache  = useRef<Map<string, string>>(new Map())
  const activeModelRef      = useRef<string | null>(null)
  const pendingChatAction   = useRef<AiFileAction | null>(null)

  // Open bug report form when triggered externally (e.g. Help > Report a Bug)
  useEffect(() => {
    if (!triggerBugReport) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPendingBugMsg('__direct_report__')
    setIssueState({ status: 'form', title: '', desc: '' })
  }, [triggerBugReport])

  // Drain accumulated text at a fixed rate for smooth, uniform display
  const CHARS_PER_TICK = 2   // characters revealed per tick
  const TICK_MS        = 45  // tick interval → ~44 chars/sec

  useEffect(() => {
    if (!streaming) return
    const id = setInterval(() => {
      const total = rawAccum.current.length
      if (displayIdx.current < total) {
        displayIdx.current = Math.min(displayIdx.current + CHARS_PER_TICK, total)
        const slice = rawAccum.current.slice(0, displayIdx.current)
        const { thinking, content } = parseThinkBlocks(slice)
        setMessages(m => {
          const c = [...m]
          if (c.length === 0) return c
          c[c.length - 1] = { role: 'assistant', content, thinking }
          return c
        })
      } else if (networkDone.current) {
        if (pendingChatAction.current) {
          const action = pendingChatAction.current
          pendingChatAction.current = null
          setMessages(m => {
            const c = [...m]
            if (c.length > 0) c[c.length - 1] = { ...c[c.length - 1], action }
            return c
          })
        }
        setStreaming(false)
      }
    }, TICK_MS)
    return () => clearInterval(id)
  }, [streaming])

  function pushLog(level: LogEntry['level'], tag: string, msg: string) {
    setLogs(prev => [...prev, { ts: Date.now(), level, tag, msg }])
  }

  // Pre-fetch suggested answers on mount so first click is instant
  useEffect(() => {
    let cancelled = false
    const controllers: AbortController[] = []

    // Stagger requests to avoid hammering the API
    PREFETCH_QUERIES.forEach((query, i) => {
      setTimeout(() => {
        if (cancelled || prefetchCache.current.has(query)) return
        fetchFullResponse(query)
          .then(({ text, remaining }) => {
            if (!cancelled && text) prefetchCache.current.set(query, text)
            if (!cancelled && remaining !== null && remaining >= 0) setMsgsLeft(remaining)
          })
          .catch(() => { /* prefetch failures are silent */ })
      }, i * 600)
    })

    return () => { cancelled = true; controllers.forEach(c => c.abort()) }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    onThinkingChange(streaming || actionLoading)
  }, [streaming, actionLoading, onThinkingChange])

  useEffect(() => {
    const cached   = localStorage.getItem('copilot:resolvedModel')
    const cachedAt = Number(localStorage.getItem('copilot:resolvedModelAt') ?? 0)
    const stale    = Date.now() - cachedAt > 24 * 60 * 60 * 1000
    if (cached) activeModelRef.current = cached
    if (!cached || stale) {
      fetch('/api/model-info')
        .then(r => r.json())
        .then(({ model }) => {
          if (model && model !== activeModelRef.current) {
            activeModelRef.current = model
            setActiveModel(model)
          }
          if (model) {
            localStorage.setItem('copilot:resolvedModel', model)
            localStorage.setItem('copilot:resolvedModelAt', String(Date.now()))
          }
        })
        .catch(() => {})
    }
  }, [])

  const BUG_PREFILL = 'I encountered a bug with the website: '
  const bugReportRe = /^I encountered a bug with the website:\s*(.+)/i

  async function sendChat(text?: string) {
    const content = (text ?? input).trim()
    if (!content || streaming) return

    // Auto-submit bug report if structured format detected
    let aiContext = content
    const bugMatch = content.match(bugReportRe)
    if (bugMatch) {
      const desc = bugMatch[1].trim()
      try {
        const r = await fetch('/api/report-issue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: desc.slice(0, 100), description: desc }),
        })
        const data = await r.json()
        aiContext = r.ok
          ? `${content}\n\n[SYSTEM: Bug automatically logged as GitHub Issue #${data.number}. Confirm this to the user and tell them it has been logged.]`
          : `${content}\n\n[SYSTEM: Bug logging failed — ${data.error}. Apologise and tell the user to try again.]`
      } catch {
        aiContext = `${content}\n\n[SYSTEM: Bug logging failed — network error.]`
      }
      setPendingBugMsg(null)
    }

    const userMsg: Message = { role: 'user', content }
    const history = [...messages, userMsg]
    const historyForApi = aiContext !== content
      ? [...messages, { role: 'user' as const, content: aiContext }]
      : history
    setMessages([...history, { role: 'assistant', content: '', thinking: '' }])
    setInput('')
    rawAccum.current = ''
    displayIdx.current = 0
    networkDone.current = false
    setStreaming(true)

    pushLog('info', 'REQUEST', `msg #${history.length} — "${content.slice(0, 80)}${content.length > 80 ? '…' : ''}"`)

    const cached = prefetchCache.current.get(content)
    if (cached) {
      prefetchCache.current.delete(content)
      rawAccum.current = cached
      networkDone.current = true
      pushLog('info', 'CACHE', `served from prefetch — ${cached.length} chars buffered`)
      inputRef.current?.focus()
      return  // display interval handles rendering + setStreaming(false)
    }

    const fileCtx = attachedFiles(content, workspaceFiles, fileContents)
    if (fileCtx.length > 0) pushLog('info', 'FILES', `attaching ${fileCtx.length} file(s): ${fileCtx.map(f => f.path).join(', ')}`)

    // eslint-disable-next-line react-hooks/purity
    const requestSentAt = Date.now()
    const controller = new AbortController()
    abortRef.current = controller
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: historyForApi,
          ...(fileCtx.length > 0        ? { fileContext: fileCtx }            : {}),
          ...(workspaceFiles.length > 0 ? { workspaceFiles }                  : {}),
        }),
      })

      const remaining = res.headers.get('X-RateLimit-Remaining')
      if (remaining !== null) setMsgsLeft(Number(remaining))

      pushLog(
        res.ok ? 'info' : 'error',
        'HTTP',
        `${res.status} ${res.statusText || (res.ok ? 'OK' : 'ERR')}${remaining !== null ? ` — ${remaining} msgs left` : ''}`,
      )

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Unknown error' }))
        pushLog('error', 'API', errData.error ?? `HTTP ${res.status}`)
        setMessages((m) => {
          const c = [...m]; c[c.length - 1] = { role: 'assistant', content: `Error: ${errData.error ?? 'Unknown error'}` }; return c
        })
        return
      }

      const reader  = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let firstTokenAt: number | null = null
      let totalChars = 0
      let finishReason: string | null = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') { pushLog('info', 'STREAM', '[DONE] received'); break }
          try {
            const parsed = JSON.parse(data)
            if (parsed.model && parsed.model !== activeModelRef.current) {
              activeModelRef.current = parsed.model
              setActiveModel(parsed.model)
              localStorage.setItem('copilot:resolvedModel', parsed.model)
            }
            const choice = parsed.choices?.[0]
            const delta  = choice?.delta?.content
            const reason = choice?.finish_reason
            if (reason) finishReason = reason
            if (delta) {
              if (!firstTokenAt) {
                // eslint-disable-next-line react-hooks/purity
                firstTokenAt = Date.now()
                pushLog('info', 'STREAM', `first token — latency ${firstTokenAt - requestSentAt}ms`)
              }
              totalChars += delta.length
              rawAccum.current += delta  // buffer only — display interval renders at fixed rate
            }
          } catch { /* skip malformed SSE */ }
        }
      }

      // Strip <file-action> from rawAccum before display interval types it out
      const fileActionMatch = rawAccum.current.match(/<file-action>([\s\S]*?)<\/file-action>/i)
      if (fileActionMatch) {
        try {
          const parsed = JSON.parse(fileActionMatch[1].trim())
          const validation = validateAiAction(parsed)
          if (validation.ok) pendingChatAction.current = validation.action
        } catch { /* malformed JSON — ignore */ }
        rawAccum.current = rawAccum.current.replace(/<file-action>[\s\S]*?<\/file-action>/gi, '').trim()
      }

      networkDone.current = true  // signal display interval to stop after draining

      pushLog(
        totalChars === 0 ? 'warn' : 'info',
        'STREAM',
        `ended — ${totalChars} chars buffered, finish_reason: ${finishReason ?? 'not provided'}`,
      )
      if (totalChars === 0) {
        setStreaming(false)
        pushLog('warn', 'EMPTY', 'stream closed with no content — model may have hit context limit or been filtered')
        const hint = finishReason === 'length'
          ? 'The model hit its context limit — try a shorter message or attach a smaller file.'
          : 'No response received. The model may be unavailable — try again.'
        setMessages((m) => {
          const c = [...m]; c[c.length - 1] = { role: 'assistant', content: `⚠️ ${hint}` }; return c
        })
      }
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') {
        // User stopped — keep whatever was streamed, just stop
        networkDone.current = true
        pushLog('info', 'STOP', 'stopped by user')
      } else {
        const msg = e instanceof Error ? e.message : String(e)
        pushLog('error', 'ERROR', msg)
        networkDone.current = true
        setMessages((m) => {
          const c = [...m]; c[c.length - 1] = { role: 'assistant', content: 'Connection error.' }; return c
        })
        setStreaming(false)
      }
    } finally {
      inputRef.current?.focus()
      const aiMentionedForm = rawAccum.current.toLowerCase().includes('bug report form has appeared')
      if (BUG_KEYWORDS.test(content) || aiMentionedForm) {
        setPendingBugMsg(content)
        setIssueState({ status: 'form', title: '', desc: '' })
      }
    }
  }

  async function sendEditRequest(text?: string) {
    const content = (text ?? input).trim()
    if (!content || actionLoading) return
    setInput('')
    setFailedIdx(null)
    setLastEditMsg(content)
    setActionLoading(true)

    pushLog('info', 'ACTION', `intent detected — "${content.slice(0, 80)}${content.length > 80 ? '…' : ''}"`)

    setMessages(prev => [
      ...prev,
      { role: 'user', content },
      { role: 'assistant', content: '' },
    ])

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/ai-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: content,
          files: workspaceFiles,
          fileContents: attachedFiles(content, workspaceFiles, fileContents),
        }),
      })

      pushLog(res.ok ? 'info' : 'error', 'HTTP', `${res.status} ${res.ok ? 'OK' : 'ERR'} (ai-action)`)

      const data = await res.json()

      if (!res.ok) {
        pushLog('error', 'ACTION', data.error ?? `HTTP ${res.status}`)
        setMessages(prev => {
          const c = [...prev]
          const idx = c.length - 1
          c[idx] = { role: 'assistant', content: `❌ ${data.error ?? 'Unknown error'}` }
          setFailedIdx(idx)
          return c
        })
        return
      }

      const action: AiFileAction = data.action
      pushLog('info', 'ACTION', `${action.action} → ${action.path}`)
      const verb: Record<string, string> = {
        create_file: 'create', update_file: 'update',
        delete_file: 'delete', create_folder: 'create folder',
      }
      const reply = data.reply ?? `Ready to ${verb[action.action] ?? action.action} \`${action.path}\` — confirm in the dialog.`
      setMessages(prev => {
        const c = [...prev]
        c[c.length - 1] = { role: 'assistant', content: reply }
        return c
      })
      setFailedIdx(null)
      onPendingAction(action, (applied) => {
        setMessages(prev => {
          const c = [...prev]
          const last = c[c.length - 1]
          if (!last || last.role !== 'assistant') return prev
          c[c.length - 1] = {
            ...last,
            content: last.content + (applied ? '\n\n✅ Applied.' : '\n\n❌ Cancelled — no changes made.'),
          }
          return c
        })
      })
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') {
        pushLog('info', 'STOP', 'action stopped by user')
        setMessages(prev => {
          const c = [...prev]; c[c.length - 1] = { role: 'assistant', content: '⏹ Stopped.' }; return c
        })
        return
      }
      const msg = e instanceof Error ? e.message : String(e)
      pushLog('error', 'ERROR', msg)
      setMessages(prev => {
        const c = [...prev]
        const idx = c.length - 1
        c[idx] = { role: 'assistant', content: '❌ Connection error. Check OPENROUTER_API_KEY.' }
        setFailedIdx(idx)
        return c
      })
    } finally {
      setActionLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleSend() {
    const text = input.trim()
    if (!text || busy) return
    if (detectIntent(text) === 'action') sendEditRequest(text)
    else sendChat(text)
  }

  const busy    = streaming || actionLoading
  const isEmpty = messages.length === 0

  // @mention autocomplete
  const atMatch      = input.match(/@([\w.\-]*)$/)
  const mentionQuery = atMatch ? atMatch[1].toLowerCase() : null
  const mentionFiles = mentionQuery !== null
    ? workspaceFiles.filter(f => !mentionQuery || f.toLowerCase().includes(mentionQuery)).slice(0, 6)
    : []

  function insertMention(fileName: string) {
    const updated = input.replace(/@([\w.\-]*)$/, `@${fileName} `)
    setInput(updated)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.style.height = 'auto'
        inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px'
        inputRef.current.focus()
      }
    }, 0)
  }

  return (
    <div className="flex flex-col h-full w-[340px] bg-[#181818] border-l border-vsc-border shrink-0 font-sans panel-slide-right">

      {/* ── Tab bar ── */}
      <div className="flex items-center border-b border-vsc-border/60 shrink-0 select-none">
        <button
          onClick={() => setActiveView('chat')}
          className={`relative px-4 py-2 text-[11px] font-semibold tracking-widest uppercase transition-colors ${activeView === 'chat' ? 'text-vsc-text' : 'text-vsc-muted hover:text-vsc-text'}`}
        >
          Chat
          {activeView === 'chat' && <span className="absolute bottom-0 left-2 right-2 h-[1px] bg-vsc-text" />}
        </button>
        <button
          onClick={() => setActiveView('logs')}
          className={`relative px-4 py-2 text-[11px] font-semibold tracking-widest uppercase transition-colors flex items-center gap-1.5 ${activeView === 'logs' ? 'text-vsc-text' : 'text-vsc-muted hover:text-vsc-text'}`}
        >
          Logs
          {logs.length > 0 && (
            <span className={`text-[10px] font-mono ${logs.some(l => l.level === 'error') ? 'text-red-400' : logs.some(l => l.level === 'warn') ? 'text-yellow-400' : 'text-vsc-muted/60'}`}>
              {logs.length}
            </span>
          )}
          {activeView === 'logs' && <span className="absolute bottom-0 left-2 right-2 h-[1px] bg-vsc-text" />}
        </button>
        <div className="flex items-center gap-0.5 ml-auto pr-1">
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              title="New chat"
              className="p-1.5 text-vsc-muted hover:text-vsc-text transition-colors rounded hover:bg-vsc-hover"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            title="Close"
            className="p-1.5 text-vsc-muted hover:text-vsc-text transition-colors rounded hover:bg-vsc-hover"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Logs view ── */}
      {activeView === 'logs' && (
        <div className="flex-1 overflow-hidden">
          <LogsView logs={logs} onClear={() => setLogs([])} />
        </div>
      )}

      {/* ── Chat / Empty state ── */}
      <div className={`flex-1 overflow-y-auto panel-scroll ${activeView !== 'chat' ? 'hidden' : ''}`}>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-5 px-6">
            {/* Logo */}
            <CopilotIcon size={72} />

            {/* Heading + disclaimer */}
            <div className="text-center space-y-2">
              <div className="text-[15px] font-semibold text-vsc-text">Ask Copilot</div>
              <div className="text-[11px] text-vsc-muted leading-[1.6] max-w-[230px]">
                Copilot is powered by AI, so mistakes are possible. Review output carefully before use.
              </div>
            </div>

            {/* Action icon buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => sendChat("What projects has Dwijesh built and what problems do they solve?")}
                title="What has he built?"
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-vsc-border/50 hover:border-vsc-border hover:bg-vsc-hover transition-colors group"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-vsc-muted group-hover:text-vsc-text transition-colors">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
                </svg>
                <span className="text-[10px] text-vsc-muted group-hover:text-vsc-text transition-colors">Projects</span>
              </button>
              <button
                onClick={() => sendChat("What is Dwijesh's full tech stack and what systems has he worked on?")}
                title="Tech stack"
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-vsc-border/50 hover:border-vsc-border hover:bg-vsc-hover transition-colors group"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-vsc-muted group-hover:text-vsc-text transition-colors">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
                <span className="text-[10px] text-vsc-muted group-hover:text-vsc-text transition-colors">Stack</span>
              </button>
              <button
                onClick={() => sendChat("Is Dwijesh open to new roles? What kind of work is he looking for?")}
                title="Open to work?"
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-vsc-border/50 hover:border-vsc-border hover:bg-vsc-hover transition-colors group"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-vsc-muted group-hover:text-vsc-text transition-colors">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="text-[10px] text-vsc-muted group-hover:text-vsc-text transition-colors">Hire</span>
              </button>
              <button
                onClick={() => sendChat("Tell me about the rPPG heart rate prediction dissertation.")}
                title="Dissertation"
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-vsc-border/50 hover:border-vsc-border hover:bg-vsc-hover transition-colors group"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-vsc-muted group-hover:text-vsc-text transition-colors">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <span className="text-[10px] text-vsc-muted group-hover:text-vsc-text transition-colors">Research</span>
              </button>
              <button
                onClick={() => { setInput(BUG_PREFILL); setTimeout(() => inputRef.current?.focus(), 0) }}
                title="Report a bug"
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-vsc-border/50 hover:border-[#f14c4c]/40 hover:bg-vsc-hover transition-colors group"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-vsc-muted group-hover:text-[#f14c4c] transition-colors">
                  <path d="M9 2h6l1 4H8L9 2z"/><path d="M5 8h14l-1 13H6L5 8z"/><line x1="12" y1="12" x2="12" y2="17"/>
                </svg>
                <span className="text-[10px] text-vsc-muted group-hover:text-[#f14c4c] transition-colors">Bug</span>
              </button>
            </div>

            <div className="flex flex-col items-center gap-0.5">
              {activeModel && formatModel(activeModel) && (
                <div className="text-[11px] text-vsc-muted/70 font-mono text-center break-all" title={activeModel}>
                  {formatModel(activeModel)}
                </div>
              )}
              <div className="text-[10px] text-vsc-muted/40 font-mono">
                Powered by OpenRouter
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 px-3 py-4 font-mono text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="shrink-0 mt-0.5"><CopilotIcon size={20} muted /></div>
                )}
                <div className="flex flex-col gap-1 max-w-[88%]">
                  {m.role === 'assistant' && m.thinking && (
                    <div className="rounded-md border border-vsc-border/40 bg-[#1e1e1e] text-[11px] overflow-hidden">
                      <button
                        onClick={() => setThinkExpanded(prev => ({ ...prev, [i]: !prev[i] }))}
                        className="flex items-center gap-1.5 w-full px-2.5 py-1.5 text-vsc-muted/60 hover:text-vsc-muted transition-colors"
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className={`transition-transform ${thinkExpanded[i] ? 'rotate-90' : ''}`}>
                          <path d="M2 1l4 3-4 3V1z" />
                        </svg>
                        <span className="italic">Thinking…</span>
                      </button>
                      {thinkExpanded[i] && (
                        <div className="px-3 pb-2.5 pt-0.5 text-vsc-muted/50 leading-5 whitespace-pre-wrap border-t border-vsc-border/30">
                          {m.thinking}
                        </div>
                      )}
                    </div>
                  )}
                  <div className={`px-3 py-2 rounded-lg text-[12px] leading-5 ${
                    m.role === 'user'
                      ? 'bg-[#094771] border border-[#007acc]/40 text-vsc-text whitespace-pre-wrap'
                      : 'bg-[#252526] border border-vsc-border/60 text-vsc-text/90'
                  }`}>
                    {m.role === 'assistant'
                      ? <StreamingBubble
                          content={m.content}
                          isStreaming={streaming && i === messages.length - 1}
                          busy={busy && i === messages.length - 1}
                        />
                      : m.content}
                  </div>
                  {m.action && !busy && (
                    <button
                      onClick={() => { onPendingAction(m.action!, () => { setMessages(prev => { const c = [...prev]; c[i] = { ...c[i], action: undefined }; return c }) }) }}
                      className="self-start flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-[#4ec9b0] border border-[#4ec9b0]/40 rounded hover:bg-[#4ec9b0]/10 transition-colors font-mono"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Apply {m.action.action.replace('_', ' ')} → {m.action.path}
                    </button>
                  )}
                  {failedIdx === i && lastEditMsg && !busy && (
                    <button
                      onClick={() => sendEditRequest(lastEditMsg)}
                      className="self-start flex items-center gap-1 px-2 py-0.5 text-[11px] text-[#4ec9b0] border border-[#4ec9b0]/40 rounded hover:bg-[#4ec9b0]/10 transition-colors"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
                      </svg>
                      Try again
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Bug report widget (always rendered, outside scroll area) ── */}
      {pendingBugMsg && !busy && (
        <div className="mx-3 mb-2 rounded-md border border-[#f14c4c]/30 bg-[#1e1e1e] overflow-hidden text-[11px]">
          {issueState.status === 'form' && (
            <div className="p-3 space-y-2">
              <div className="text-[11px] font-semibold text-[#f14c4c]/80 mb-1">Report a Bug</div>
              <input
                className="w-full bg-[#2a2a2a] border border-vsc-border/50 rounded px-2 py-1 text-vsc-text outline-none focus:border-vsc-accent/50 text-[11px]"
                placeholder="Issue title"
                maxLength={100}
                value={issueState.title}
                onChange={e => setIssueState({ ...issueState, title: e.target.value })}
              />
              <textarea
                className="w-full bg-[#2a2a2a] border border-vsc-border/50 rounded px-2 py-1 text-vsc-text outline-none focus:border-vsc-accent/50 text-[11px] resize-none"
                placeholder="Describe the issue"
                maxLength={2000}
                rows={3}
                value={issueState.desc}
                onChange={e => setIssueState({ ...issueState, desc: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setPendingBugMsg(null)} className="text-vsc-muted/50 hover:text-vsc-muted transition-colors px-2 py-0.5">Cancel</button>
                <button
                  disabled={!issueState.title.trim()}
                  onClick={async () => {
                    const { title, desc } = issueState as { status: 'form'; title: string; desc: string }
                    setIssueState({ status: 'submitting' })
                    try {
                      const r = await fetch('/api/report-issue', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title, description: desc }),
                      })
                      const data = await r.json()
                      if (!r.ok) setIssueState({ status: 'error', msg: data.error ?? 'Failed.' })
                      else setIssueState({ status: 'done', number: data.number })
                    } catch {
                      setIssueState({ status: 'error', msg: 'Network error.' })
                    }
                  }}
                  className="px-2 py-0.5 rounded bg-[#f14c4c]/20 text-[#f14c4c] hover:bg-[#f14c4c]/30 transition-colors disabled:opacity-40"
                >Submit</button>
              </div>
            </div>
          )}
          {issueState.status === 'submitting' && (
            <div className="px-3 py-2 text-vsc-muted/60 italic">Logging issue…</div>
          )}
          {issueState.status === 'done' && (
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-[#89d185]">✓ Issue #{issueState.number} logged</span>
              <button onClick={() => setPendingBugMsg(null)} className="text-vsc-muted/50 hover:text-vsc-muted transition-colors">✕</button>
            </div>
          )}
          {issueState.status === 'error' && (
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-[#f14c4c]">{issueState.msg}</span>
              <button onClick={() => setIssueState({ status: 'form', title: '', desc: '' })} className="text-vsc-muted/50 hover:text-vsc-muted ml-2 transition-colors">Retry</button>
            </div>
          )}
        </div>
      )}

      {/* ── Bottom input area ── */}
      <div className={`shrink-0 border-t border-vsc-border/60 ${activeView !== 'chat' ? 'hidden' : ''}`}>
        <div className="px-3 pt-2.5 pb-1.5 relative">
          {/* @mention autocomplete dropdown */}
          {mentionFiles.length > 0 && (
            <div className="absolute bottom-full left-3 right-3 mb-1 bg-[#252526] border border-vsc-border rounded-md shadow-lg overflow-hidden z-10">
              {mentionFiles.map(f => (
                <button
                  key={f}
                  onMouseDown={(e) => { e.preventDefault(); insertMention(f) }}
                  className="w-full text-left px-3 py-1.5 text-[11px] text-vsc-text hover:bg-vsc-hover transition-colors flex items-center gap-2"
                >
                  <span className="text-vsc-muted/50">@</span>
                  <span className="font-mono">{f}</span>
                </button>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2 bg-[#2a2a2a] border border-vsc-border/50 rounded-md px-3 py-2.5 focus-within:border-vsc-accent/50 transition-colors">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
              }}
              disabled={busy}
              placeholder="Ask anything — type @ to reference a file"
              className="flex-1 bg-transparent text-[12px] text-vsc-text outline-none resize-none placeholder:text-vsc-muted/40 disabled:opacity-50 leading-5 font-sans"
              style={{ minHeight: '20px', maxHeight: '120px' }}
            />
            {/* Stop (during streaming or action) / Send button */}
            {(streaming || actionLoading) ? (
              <button
                onClick={() => { abortRef.current?.abort(); rawAccum.current = rawAccum.current.slice(0, displayIdx.current); networkDone.current = true }}
                title="Stop generating"
                className="shrink-0 text-vsc-muted hover:text-[#f14c4c] transition-colors pb-0.5"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={busy || !input.trim()}
                className="shrink-0 text-vsc-muted hover:text-vsc-accent transition-colors disabled:opacity-25 disabled:cursor-not-allowed pb-0.5"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Footer: quick action + model badge */}
        <div className="flex items-center justify-between px-3 pb-1 pt-0.5">
          <button
            onClick={() => sendChat("What can you help me with?")}
            disabled={busy}
            className="text-[11px] text-vsc-muted/60 hover:text-vsc-muted transition-colors disabled:opacity-40 underline-offset-2 hover:underline"
          >
            Ask anything — or type @ to reference a file
          </button>
          <span className={`text-[10px] font-mono ${msgsLeft !== null && msgsLeft <= 5 ? 'text-yellow-500/70' : 'text-vsc-muted/40'}`}>
            {msgsLeft !== null ? `${msgsLeft}/25 left` : null}
          </span>
        </div>
      </div>
    </div>
  )
}

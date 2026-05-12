'use client'

import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import type { AiFileAction } from '@/lib/fileSystem'
import { DEFAULT_CONTENT } from '@/lib/defaultContent'

interface Message {
  role: 'user' | 'assistant'
  content: string
  thinking?: string
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

  return { thinking: thinking.trimStart(), content: content.trim() }
}

// Render assistant markdown: **bold**, `code`, bullet lists, line breaks
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
  onThinkingChange: (v: boolean) => void
  onClose:          () => void
  onPendingAction:  (action: AiFileAction) => void
  workspaceFiles?:  string[]
  fileContents?:    Record<string, string>
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
  return names
    .filter(n => lower.includes(n.toLowerCase()))
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

async function fetchFullResponse(query: string): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: query }] }),
  })
  if (!res.ok) throw new Error('prefetch failed')

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
  return accumulated
}

export default function CopilotPanel({ onThinkingChange, onClose, onPendingAction, workspaceFiles = [], fileContents = {} }: Props) {
  const [messages, setMessages]           = useState<Message[]>([])
  const [input, setInput]                 = useState('')
  const [streaming, setStreaming]         = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [lastEditMsg, setLastEditMsg]     = useState<string | null>(null)
  const [failedIdx, setFailedIdx]         = useState<number | null>(null)
  const [thinkExpanded, setThinkExpanded] = useState<Record<number, boolean>>({})
  const [msgsLeft, setMsgsLeft]           = useState<number | null>(null)
  const bottomRef      = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLTextAreaElement>(null)
  const rawAccum       = useRef('')
  const prefetchCache  = useRef<Map<string, string>>(new Map())

  // Pre-fetch suggested answers on mount so first click is instant
  useEffect(() => {
    let cancelled = false
    const controllers: AbortController[] = []

    // Stagger requests to avoid hammering the API
    PREFETCH_QUERIES.forEach((query, i) => {
      setTimeout(() => {
        if (cancelled || prefetchCache.current.has(query)) return
        fetchFullResponse(query)
          .then(text => { if (!cancelled && text) prefetchCache.current.set(query, text) })
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

  async function sendChat(text?: string) {
    const content = (text ?? input).trim()
    if (!content || streaming) return

    const userMsg: Message = { role: 'user', content }
    const history = [...messages, userMsg]
    setMessages([...history, { role: 'assistant', content: '', thinking: '' }])
    setInput('')
    setStreaming(true)
    rawAccum.current = ''

    // Serve from prefetch cache for zero-latency first responses
    const cached = prefetchCache.current.get(content)
    if (cached) {
      prefetchCache.current.delete(content)
      const { thinking, content: parsed } = parseThinkBlocks(cached)
      setMessages(prev => {
        const c = [...prev]
        c[c.length - 1] = { role: 'assistant', content: parsed, thinking }
        return c
      })
      setStreaming(false)
      inputRef.current?.focus()
      return
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })

      if (!res.ok) {
        const err = await res.json()
        setMessages((m) => {
          const c = [...m]; c[c.length - 1] = { role: 'assistant', content: `Error: ${err.error ?? 'Unknown error'}` }; return c
        })
        return
      }

      const remaining = res.headers.get('X-RateLimit-Remaining')
      if (remaining !== null) setMsgsLeft(Number(remaining))

      const reader  = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

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
            if (delta) {
              rawAccum.current += delta
              const { thinking, content } = parseThinkBlocks(rawAccum.current)
              flushSync(() => {
                setMessages((m) => {
                  const c = [...m]
                  c[c.length - 1] = { role: 'assistant', content, thinking }
                  return c
                })
              })
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      setMessages((m) => {
        const c = [...m]; c[c.length - 1] = { role: 'assistant', content: 'Connection error.' }; return c
      })
    } finally {
      setStreaming(false)
      inputRef.current?.focus()
    }
  }

  async function sendEditRequest(text?: string) {
    const content = (text ?? input).trim()
    if (!content || actionLoading) return
    setInput('')
    setFailedIdx(null)
    setLastEditMsg(content)
    setActionLoading(true)

    setMessages(prev => [
      ...prev,
      { role: 'user', content },
      { role: 'assistant', content: '⏳ Trying models…' },
    ])

    try {
      const res = await fetch('/api/ai-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          files: workspaceFiles,
          fileContents: attachedFiles(content, workspaceFiles, fileContents),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
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
      const verb: Record<string, string> = {
        create_file: 'create', update_file: 'update',
        delete_file: 'delete', create_folder: 'create folder',
      }
      setMessages(prev => {
        const c = [...prev]
        c[c.length - 1] = {
          role: 'assistant',
          content: `✅ Ready to **${verb[action.action] ?? action.action}** \`${action.path}\`. Confirm in the dialog.`,
        }
        return c
      })
      setFailedIdx(null)
      onPendingAction(action)
    } catch {
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

  return (
    <div className="flex flex-col h-full w-[340px] bg-[#181818] border-l border-vsc-border shrink-0 font-sans">

      {/* ── Tab bar ── */}
      <div className="flex items-center border-b border-vsc-border/60 shrink-0 select-none">
        <button className="relative px-4 py-2 text-[11px] font-semibold text-vsc-text tracking-widest uppercase">
          Chat
          <span className="absolute bottom-0 left-2 right-2 h-[1px] bg-vsc-text" />
        </button>
        <button className="px-4 py-2 text-[11px] font-semibold text-vsc-muted tracking-widest uppercase hover:text-vsc-text transition-colors">
          Copilot Edits
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

      {/* ── Chat / Empty state ── */}
      <div className="flex-1 overflow-y-auto panel-scroll">
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
            </div>

            <div className="text-[11px] text-vsc-muted/50 italic">Type / to use commands</div>
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
                      ? (m.content
                          ? renderMd(m.content)
                          : (busy && i === messages.length - 1 ? <ThinkingIndicator /> : null))
                      : m.content}
                  </div>
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

      {/* ── Bottom input area ── */}
      <div className="shrink-0 border-t border-vsc-border/60">
        <div className="px-3 pt-2.5 pb-1.5">
          <div className="flex items-end gap-2 bg-[#2a2a2a] border border-vsc-border/50 rounded-md px-3 py-2.5 focus-within:border-vsc-accent/50 transition-colors">
            {/* Attach icon */}
            <button className="shrink-0 text-vsc-muted/50 hover:text-vsc-muted transition-colors pb-0.5" title="Attach context">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>
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
              placeholder="Ask Copilot"
              className="flex-1 bg-transparent text-[12px] text-vsc-text outline-none resize-none placeholder:text-vsc-muted/40 disabled:opacity-50 leading-5 font-sans"
              style={{ minHeight: '20px', maxHeight: '120px' }}
            />
            {/* Send / status icon */}
            <button
              onClick={handleSend}
              disabled={busy || !input.trim()}
              className="shrink-0 text-vsc-muted hover:text-vsc-accent transition-colors disabled:opacity-25 disabled:cursor-not-allowed pb-0.5"
            >
              {busy ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Footer: quick action + model badge */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-0.5">
          <button
            onClick={() => sendChat("What can you tell me about Dwijesh? Give me an overview.")}
            disabled={busy}
            className="text-[11px] text-vsc-muted/60 hover:text-vsc-muted transition-colors disabled:opacity-40 underline-offset-2 hover:underline"
          >
            Help — What can you do?
          </button>
          <span className={`text-[10px] font-mono ${msgsLeft !== null && msgsLeft <= 5 ? 'text-yellow-500/70' : 'text-vsc-muted/40'}`}>
            {msgsLeft !== null ? `${msgsLeft}/25 left` : '25/25 left'}
          </span>
        </div>
      </div>
    </div>
  )
}

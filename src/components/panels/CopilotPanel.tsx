'use client'

import { useEffect, useRef, useState } from 'react'
import type { AiFileAction } from '@/lib/fileSystem'
import { validateAiAction } from '@/lib/fileSystem'
import { DEFAULT_CONTENT } from '@/shared/content'

import type { Message, LogEntry, IssueState } from '@/features/copilot/types'
import { detectIntent, BUG_KEYWORDS } from '@/features/copilot/lib/detectIntent'
import { formatModel } from '@/features/copilot/lib/formatModel'
import { maybeAutoLogBug, streamChatSSE } from '@/features/copilot/lib/streamChat'
import { useStreamingDisplay } from '@/features/copilot/hooks/useStreamingDisplay'
import { LogsView } from '@/features/copilot/components/LogsView'
import { BugReportWidget } from '@/features/copilot/components/BugReportWidget'
import { EmptyState } from '@/features/copilot/components/EmptyState'
import { MessageList } from '@/features/copilot/components/MessageList'

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

const SESSION_KEY = 'copilot:messages'

function loadStoredMessages(): Message[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Message[]) : []
  } catch {
    return []
  }
}

export default function CopilotPanel({ onThinkingChange, onClose, onPendingAction, workspaceFiles = [], fileContents = {}, triggerBugReport }: Props) {
  const [messages, setMessages]           = useState<Message[]>(loadStoredMessages)
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
  const abortRef       = useRef<AbortController | null>(null)
  const activeModelRef = useRef<string | null>(null)

  const { rawAccumRef, displayIdxRef, networkDoneRef, pendingChatActionRef } = useStreamingDisplay(
    streaming,
    setStreaming,
    setMessages,
  )

  // Persist chat history for the lifetime of the tab — survives panel close/reopen, clears on tab/site close.
  useEffect(() => {
    try {
      if (messages.length > 0) sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages))
      else sessionStorage.removeItem(SESSION_KEY)
    } catch { /* storage unavailable — ignore */ }
  }, [messages])

  // Open bug report form when triggered externally (e.g. Help > Report a Bug)
  useEffect(() => {
    if (!triggerBugReport) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPendingBugMsg('__direct_report__')
    setIssueState({ status: 'form', title: '', desc: '' })
  }, [triggerBugReport])

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
          if (model && model !== activeModelRef.current && formatModel(model)) {
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

  function pushLog(level: LogEntry['level'], tag: string, msg: string) {
    setLogs(prev => [...prev, { ts: Date.now(), level, tag, msg }])
  }

  const BUG_PREFILL = 'I encountered a bug with the website: '

  async function sendChat(text?: string) {
    const content = (text ?? input).trim()
    if (!content || streaming) return

    const aiContext = await maybeAutoLogBug(content)
    if (aiContext !== content) setPendingBugMsg(null)

    const userMsg: Message = { role: 'user', content }
    const history = [...messages, userMsg]
    const historyForApi = aiContext !== content
      ? [...messages, { role: 'user' as const, content: aiContext }]
      : history
    setMessages([...history, { role: 'assistant', content: '', thinking: '' }])
    setInput('')
    rawAccumRef.current = ''
    displayIdxRef.current = 0
    networkDoneRef.current = false
    setStreaming(true)

    pushLog('info', 'REQUEST', `msg #${history.length} — "${content.slice(0, 80)}${content.length > 80 ? '…' : ''}"`)

    const fileCtx = attachedFiles(content, workspaceFiles, fileContents)
    if (fileCtx.length > 0) pushLog('info', 'FILES', `attaching ${fileCtx.length} file(s): ${fileCtx.map(f => f.path).join(', ')}`)

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

      const { totalChars, finishReason } = await streamChatSSE(res.body!, {
        onModel: (model) => {
          if (model !== activeModelRef.current && formatModel(model)) {
            activeModelRef.current = model
            setActiveModel(model)
            localStorage.setItem('copilot:resolvedModel', model)
            localStorage.setItem('copilot:resolvedModelAt', String(Date.now()))
          }
        },
        onDelta: (delta) => { rawAccumRef.current += delta }, // buffer only — display interval renders at fixed rate
        onFirstToken: () => {
          pushLog('info', 'STREAM', `first token — latency ${Date.now() - requestSentAt}ms`)
        },
        onLog: pushLog,
      })

      // Strip <file-action> from rawAccum before display interval types it out
      const fileActionMatch = rawAccumRef.current.match(/<file-action>([\s\S]*?)<\/file-action>/i)
      if (fileActionMatch) {
        try {
          const parsed = JSON.parse(fileActionMatch[1].trim())
          const validation = validateAiAction(parsed)
          if (validation.ok) pendingChatActionRef.current = validation.action
        } catch { /* malformed JSON — ignore */ }
        rawAccumRef.current = rawAccumRef.current.replace(/<file-action>[\s\S]*?<\/file-action>/gi, '').trim()
      }

      networkDoneRef.current = true  // signal display interval to stop after draining

      // Some free models leak a bare moderation verdict instead of an actual reply
      const isJunkOnly = /^\s*(user\s+)?safety\s*:\s*\w+\.?\s*$/i.test(rawAccumRef.current)

      pushLog(
        totalChars === 0 || isJunkOnly ? 'warn' : 'info',
        'STREAM',
        `ended — ${totalChars} chars buffered, finish_reason: ${finishReason ?? 'not provided'}`,
      )
      if (totalChars === 0 || isJunkOnly) {
        setStreaming(false)
        pushLog('warn', 'EMPTY', isJunkOnly
          ? 'model returned a moderation tag instead of a reply'
          : 'stream closed with no content — model may have hit context limit or been filtered')
        const hint = isJunkOnly
          ? 'The model returned an empty response — try sending your message again.'
          : finishReason === 'length'
          ? 'The model hit its context limit — try a shorter message or attach a smaller file.'
          : 'No response received. The model may be unavailable — try again.'
        setMessages((m) => {
          const c = [...m]; c[c.length - 1] = { role: 'assistant', content: `⚠️ ${hint}` }; return c
        })
      }
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') {
        // User stopped — keep whatever was streamed, just stop
        networkDoneRef.current = true
        pushLog('info', 'STOP', 'stopped by user')
      } else {
        const msg = e instanceof Error ? e.message : String(e)
        pushLog('error', 'ERROR', msg)
        networkDoneRef.current = true
        setMessages((m) => {
          const c = [...m]; c[c.length - 1] = { role: 'assistant', content: 'Connection error.' }; return c
        })
        setStreaming(false)
      }
    } finally {
      inputRef.current?.focus()
      const aiMentionedForm = rawAccumRef.current.toLowerCase().includes('bug report form has appeared')
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
          <EmptyState
            activeModel={activeModel}
            onQuickAsk={(text) => sendChat(text)}
            onBugPrefill={() => { setInput(BUG_PREFILL); setTimeout(() => inputRef.current?.focus(), 0) }}
          />
        ) : (
          <MessageList
            messages={messages}
            streaming={streaming}
            busy={busy}
            thinkExpanded={thinkExpanded}
            onToggleThink={(idx) => setThinkExpanded(prev => ({ ...prev, [idx]: !prev[idx] }))}
            failedIdx={failedIdx}
            lastEditMsg={lastEditMsg}
            onApplyAction={(idx, action) => {
              onPendingAction(action, () => {
                setMessages(prev => { const c = [...prev]; c[idx] = { ...c[idx], action: undefined }; return c })
              })
            }}
            onRetry={(msg) => sendEditRequest(msg)}
            bottomRef={bottomRef}
          />
        )}
      </div>

      {/* ── Bug report widget (always rendered, outside scroll area) ── */}
      {pendingBugMsg && !busy && (
        <BugReportWidget
          issueState={issueState}
          onStateChange={setIssueState}
          onDismiss={() => setPendingBugMsg(null)}
        />
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
                onClick={() => { abortRef.current?.abort(); rawAccumRef.current = rawAccumRef.current.slice(0, displayIdxRef.current); networkDoneRef.current = true }}
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

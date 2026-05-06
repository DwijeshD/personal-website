'use client'

import { useEffect, useRef, useState } from 'react'
import type { AiFileAction } from '@/lib/fileSystem'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  onThinkingChange: (v: boolean) => void
  onClose:          () => void
  onPendingAction:  (action: AiFileAction) => void
  workspaceFiles?:  string[]  // list of current file paths for AI context
}

function CopilotIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="24" fill="#1f1f2e" />
      <circle cx="24" cy="24" r="20" fill="#252540" />
      <circle cx="24" cy="22" r="11" fill="#3b3b6b" />
      <rect x="15" y="18" width="18" height="9" rx="4.5" fill="#007acc" opacity="0.9" />
      <circle cx="20" cy="22.5" r="2.5" fill="white" />
      <circle cx="28" cy="22.5" r="2.5" fill="white" />
      <circle cx="20.8" cy="22.5" r="1.2" fill="#007acc" />
      <circle cx="28.8" cy="22.5" r="1.2" fill="#007acc" />
      <line x1="24" y1="11" x2="24" y2="7" stroke="#007acc" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="6" r="2" fill="#007acc" />
      <rect x="19" y="31" width="10" height="4" rx="2" fill="#3b3b6b" />
    </svg>
  )
}

type ChatMode = 'chat' | 'edit'

export default function CopilotPanel({ onThinkingChange, onClose, onPendingAction, workspaceFiles = [] }: Props) {
  const [messages, setMessages]   = useState<Message[]>([])
  const [input, setInput]         = useState('')
  const [streaming, setStreaming] = useState(false)
  const [mode, setMode]           = useState<ChatMode>('chat')
  const [actionLoading, setActionLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)

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
    setMessages([...history, { role: 'assistant', content: '' }])
    setInput('')
    setStreaming(true)

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
            if (delta) setMessages((m) => {
              const c = [...m]; c[c.length - 1] = { role: 'assistant', content: c[c.length - 1].content + delta }; return c
            })
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
    setActionLoading(true)

    // Show the request in chat history
    setMessages(prev => [
      ...prev,
      { role: 'user', content },
      { role: 'assistant', content: '⏳ Requesting file action…' },
    ])

    try {
      const res = await fetch('/api/ai-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, files: workspaceFiles }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessages(prev => {
          const c = [...prev]; c[c.length - 1] = { role: 'assistant', content: `❌ ${data.error ?? 'Unknown error'}` }; return c
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
      onPendingAction(action)
    } catch {
      setMessages(prev => {
        const c = [...prev]; c[c.length - 1] = { role: 'assistant', content: '❌ Connection error. Check OPENROUTER_API_KEY.' }; return c
      })
    } finally {
      setActionLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleSend() {
    if (mode === 'edit') sendEditRequest()
    else sendChat()
  }

  const busy    = streaming || actionLoading
  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full w-[340px] bg-[#181818] border-l border-vsc-border shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-vsc-border/60 shrink-0">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#007acc]">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.7" />
          </svg>
          <span className="text-[12px] font-medium text-vsc-text tracking-wide">Copilot</span>
        </div>
        <div className="flex items-center gap-1.5">
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="p-1 text-vsc-muted hover:text-vsc-text transition-colors rounded hover:bg-vsc-hover"
              title="New chat"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-vsc-muted hover:text-vsc-text transition-colors rounded hover:bg-vsc-hover"
            title="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat / Empty state */}
      <div className="flex-1 overflow-y-auto panel-scroll">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 pb-4">
            <CopilotIcon size={64} />
            <div className="text-center">
              <div className="text-[15px] font-semibold text-vsc-text mt-1">Welcome to Copilot</div>
              <div className="text-[12px] text-vsc-muted mt-1">Let&apos;s get started</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 px-3 py-4 font-mono text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="shrink-0 mt-0.5"><CopilotIcon size={20} /></div>
                )}
                <div
                  className={`
                    max-w-[88%] px-3 py-2 rounded-lg text-[12px] leading-5 whitespace-pre-wrap
                    ${m.role === 'user'
                      ? 'bg-[#094771] border border-[#007acc]/40 text-vsc-text'
                      : 'bg-[#252526] border border-vsc-border/60 text-vsc-text/90'}
                  `}
                >
                  {m.content || (busy && i === messages.length - 1
                    ? <span className="cursor-blink">▋</span>
                    : null
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Bottom area */}
      <div className="shrink-0 border-t border-vsc-border/60">
        {/* Mode toggle */}
        <div className="flex gap-1 px-3 pt-2">
          {(['chat', 'edit'] as ChatMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded transition-colors ${
                mode === m
                  ? m === 'edit'
                    ? 'bg-[#4ec9b0]/15 border border-[#4ec9b0]/40 text-[#4ec9b0]'
                    : 'bg-[#007acc]/15 border border-[#007acc]/40 text-[#007acc]'
                  : 'text-vsc-muted hover:text-vsc-text border border-transparent'
              }`}
            >
              {m === 'chat' ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="13" x2="12" y2="19"/>
                  <line x1="9" y1="16" x2="15" y2="16"/>
                </svg>
              )}
              {m === 'chat' ? 'Chat' : 'Edit Files'}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-3 pt-2 pb-1">
          <div className={`flex items-end gap-2 bg-[#252526] border rounded-md px-3 py-2 focus-within:border-[#007acc]/60 transition-colors ${
            mode === 'edit' ? 'border-[#4ec9b0]/30' : 'border-vsc-border/60'
          }`}>
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
              placeholder={mode === 'edit' ? 'Describe a file change…' : 'Ask a question…'}
              className="flex-1 bg-transparent text-[12px] text-vsc-text outline-none resize-none placeholder:text-vsc-muted/60 disabled:opacity-50 leading-5"
              style={{ minHeight: '20px', maxHeight: '120px' }}
            />
            <button
              onClick={handleSend}
              disabled={busy || !input.trim()}
              className="shrink-0 text-vsc-muted hover:text-[#007acc] transition-colors disabled:opacity-25 disabled:cursor-not-allowed pb-0.5"
            >
              {actionLoading ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex gap-2 px-3 pt-1 pb-2">
          <button
            onClick={() => mode === 'edit'
              ? sendEditRequest("What is Dwijesh's full tech stack and the systems he's built?")
              : sendChat("What is Dwijesh's full tech stack and the systems he's built?")
            }
            disabled={busy}
            className="flex items-center gap-1.5 flex-1 px-2.5 py-1.5 text-[11px] text-vsc-muted hover:text-vsc-text bg-[#252526] hover:bg-[#2d2d2d] border border-vsc-border/50 rounded transition-colors disabled:opacity-40"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            Build workspace
          </button>
          <button
            onClick={() => mode === 'edit'
              ? sendEditRequest("Show me Dwijesh's projects and key technical decisions.")
              : sendChat("Show me Dwijesh's projects and key technical decisions.")
            }
            disabled={busy}
            className="flex items-center gap-1.5 flex-1 px-2.5 py-1.5 text-[11px] text-vsc-muted hover:text-vsc-text bg-[#252526] hover:bg-[#2d2d2d] border border-vsc-border/50 rounded transition-colors disabled:opacity-40"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
            </svg>
            Show project config
          </button>
        </div>

        <div className="px-3 pb-2.5 text-[10px] text-vsc-muted/40 text-center">
          Review AI output carefully before use.
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { PERSON, AI_SYSTEM_PROMPT } from '@/lib/data'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  onThinkingChange: (v: boolean) => void
  onClose: () => void
}

const SUGGESTIONS = [
  { label: 'What backend systems has Dwijesh built?' },
  { label: 'What projects has Dwijesh built?' },
  { label: "What's Dwijesh's ML stack?" },
  { label: 'How can I contact Dwijesh?' },
]

export default function CopilotPanel({ onThinkingChange, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    onThinkingChange(streaming)
  }, [streaming, onThinkingChange])

  async function send(text?: string) {
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
          const c = [...m]
          c[c.length - 1] = { role: 'assistant', content: `Error: ${err.error ?? 'Unknown error'}` }
          return c
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
              const c = [...m]
              c[c.length - 1] = { role: 'assistant', content: c[c.length - 1].content + delta }
              return c
            })
          } catch { /* skip */ }
        }
      }
    } catch {
      setMessages((m) => {
        const c = [...m]
        c[c.length - 1] = { role: 'assistant', content: 'Connection error. Check OPENROUTER_API_KEY in .env.local.' }
        return c
      })
    } finally {
      setStreaming(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-full w-[340px] bg-[#1e1e2e] border-l border-vsc-border shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-vsc-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-vsc-text">
            Dwijesh&apos;s AI Assistant
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([])}
            className="text-vsc-muted hover:text-vsc-text transition-colors"
            title="New chat"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="text-vsc-muted hover:text-vsc-text transition-colors"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Workspace badge */}
      <div className="px-4 py-2 flex items-center gap-2 border-b border-vsc-border/50">
        <span className="text-[10px] text-vsc-muted uppercase tracking-widest">Workspace</span>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-vsc-accent/15 border border-vsc-accent/30 text-[11px] text-vsc-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-vsc-accent inline-block" />
          portfolio · dwijesh-dookraz
        </span>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto panel-scroll px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-4 pt-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vsc-accent to-[#a855f7] flex items-center justify-center text-2xl shadow-lg">
              🤖
            </div>

            <div className="text-center space-y-1">
              <div className="text-base font-semibold text-vsc-text">
                Hi! I&apos;m Dwijesh&apos;s Copilot 🔥
              </div>
              <div className="text-xs text-vsc-muted leading-5 max-w-[260px]">
                Ask me anything about his projects, skills, experience, or background.
              </div>
            </div>

            {/* Suggestion chips 2x2 */}
            <div className="grid grid-cols-2 gap-2 w-full mt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => send(s.label)}
                  className="text-left text-xs px-3 py-2.5 rounded-lg border border-vsc-border bg-vsc-sidebar hover:border-vsc-accent/60 hover:bg-vsc-hover transition-all text-vsc-muted hover:text-vsc-text leading-4"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 font-mono text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-vsc-accent to-[#a855f7] flex items-center justify-center text-xs shrink-0 mt-0.5">
                    🤖
                  </div>
                )}
                <div
                  className={`
                    max-w-[85%] px-3 py-2 rounded-lg text-xs leading-5 whitespace-pre-wrap
                    ${m.role === 'user'
                      ? 'bg-vsc-accent/20 border border-vsc-accent/40 text-vsc-text'
                      : 'bg-vsc-sidebar border border-vsc-border text-vsc-text/90'}
                  `}
                >
                  {m.content || (streaming && i === messages.length - 1
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

      {/* Input */}
      <div className="shrink-0 border-t border-vsc-border">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send() }}
            disabled={streaming}
            placeholder="Ask about Dwijesh's projects, skills..."
            className="flex-1 bg-vsc-input border border-vsc-border rounded-lg px-3 py-1.5 text-xs text-vsc-text outline-none focus:border-vsc-accent placeholder:text-vsc-muted disabled:opacity-50 transition-colors"
          />
          <button
            onClick={() => send()}
            disabled={streaming || !input.trim()}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-vsc-accent hover:bg-vsc-accent-hover text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <div className="px-4 pb-2 text-[10px] text-vsc-muted/60 text-center">
          AI can make mistakes. Contact Dwijesh directly for important info.
        </div>
      </div>
    </div>
  )
}

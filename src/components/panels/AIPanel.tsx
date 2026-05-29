'use client'

import { useEffect, useRef, useState } from 'react'

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

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  onThinkingChange: (v: boolean) => void
  onClose: () => void
  hideHeader?: boolean
}

const SUGGESTIONS = [
  "What backend systems has Dwijesh built?",
  "Tell me about the rPPG dissertation project",
  "What's Dwijesh's ML stack?",
  "Is Dwijesh available for work?",
]

export default function AIPanel({ onThinkingChange, onClose, hideHeader }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
    setMessages(history)
    setInput('')
    setStreaming(true)

    // Placeholder for streaming response
    setMessages((m) => [...m, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })

      if (!res.ok) {
        const err = await res.json()
        setMessages((m) => {
          const copy = [...m]
          copy[copy.length - 1] = { role: 'assistant', content: `Error: ${err.error ?? 'Unknown error'}` }
          return copy
        })
        return
      }

      const reader = res.body!.getReader()
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
            const json = JSON.parse(data)
            const delta = json.choices?.[0]?.delta?.content
            if (delta) {
              setMessages((m) => {
                const copy = [...m]
                copy[copy.length - 1] = {
                  role: 'assistant',
                  content: copy[copy.length - 1].content + delta,
                }
                return copy
              })
            }
          } catch {
            // malformed chunk — skip
          }
        }
      }
    } catch (e) {
      setMessages((m) => {
        const copy = [...m]
        copy[copy.length - 1] = {
          role: 'assistant',
          content: 'Connection error. Make sure OPENROUTER_API_KEY is set in .env.local.',
        }
        return copy
      })
    } finally {
      setStreaming(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-full bg-vsc-panel-hdr">
      {/* Panel header — hidden when embedded in BottomPanel */}
      {!hideHeader && <div className="flex items-center justify-between px-4 py-1.5 bg-vsc-panel-hdr border-b border-vsc-border shrink-0">
        <div className="flex items-center gap-3 text-xs text-vsc-muted">
          <button className="text-vsc-text border-b border-vsc-accent pb-0.5">ASSISTANT</button>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="text-vsc-muted hover:text-vsc-text text-xs px-2 py-0.5 rounded hover:bg-vsc-hover transition-colors"
              title="Clear chat"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-vsc-muted hover:text-vsc-text text-xs px-1.5 py-0.5 rounded hover:bg-vsc-hover transition-colors"
            title="Close panel"
          >
            ✕
          </button>
        </div>
      </div>}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto panel-scroll px-4 py-3 space-y-3 font-mono text-sm">
        {messages.length === 0 ? (
          <div className="text-vsc-muted space-y-3">
            <div className="token-comment">{'// AI Assistant — powered by Llama 3.3 70B via OpenRouter'}</div>
            <div className="token-comment">{'// Ask anything about Dwijesh'}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 border border-vsc-border rounded hover:border-vsc-accent hover:text-vsc-text text-vsc-muted transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <span className="text-vsc-accent shrink-0 mt-0.5 text-xs">AI›</span>
              )}
              <div
                className={`
                  max-w-[80%] px-3 py-2 rounded text-sm leading-6 whitespace-pre-wrap
                  ${m.role === 'user'
                    ? 'chat-user text-white'
                    : 'chat-assist text-vsc-text'}
                `}
              >
                {m.content || (streaming && i === messages.length - 1
                  ? <ThinkingIndicator />
                  : null
                )}
              </div>
              {m.role === 'user' && (
                <span className="text-vsc-muted shrink-0 mt-0.5 text-xs">›</span>
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-vsc-border px-3 py-2 flex items-center gap-2">
        <span className="text-vsc-accent text-sm select-none">›</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }}
          disabled={streaming}
          placeholder="Ask about Dwijesh..."
          className="flex-1 bg-transparent text-vsc-text text-sm outline-none placeholder:text-vsc-muted disabled:opacity-50"
        />
        <button
          onClick={() => send()}
          disabled={streaming || !input.trim()}
          className="text-xs px-3 py-1 rounded bg-vsc-accent/20 text-vsc-accent border border-vsc-accent/40 hover:bg-vsc-accent hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {streaming ? '…' : 'Send'}
        </button>
      </div>
    </div>
  )
}

import type { RefObject } from 'react'
import type { AiFileAction } from '@/lib/fileSystem'
import type { Message } from '@/features/copilot/types'
import { CopilotIcon } from '@/features/copilot/components/CopilotIcon'
import { ThinkingIndicator } from '@/features/copilot/components/ThinkingIndicator'
import { CopilotMarkdown } from '@/features/copilot/components/CopilotMarkdown'

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
  // During streaming: plain text to avoid markdown reconciliation flicker.
  // After streaming: full markdown render.
  if (isStreaming) {
    return <span className="whitespace-pre-wrap">{content}</span>
  }
  return <CopilotMarkdown content={content} />
}

interface Props {
  messages:      Message[]
  streaming:     boolean
  busy:          boolean
  thinkExpanded: Record<number, boolean>
  onToggleThink: (idx: number) => void
  failedIdx:     number | null
  lastEditMsg:   string | null
  onApplyAction: (idx: number, action: AiFileAction) => void
  onRetry:       (msg: string) => void
  bottomRef:     RefObject<HTMLDivElement | null>
}

export function MessageList({
  messages, streaming, busy, thinkExpanded, onToggleThink,
  failedIdx, lastEditMsg, onApplyAction, onRetry, bottomRef,
}: Props) {
  return (
    <div className="space-y-4 px-3 py-4 font-mono text-sm">
      {messages.map((m, i) => (
        <div key={i} className={`flex gap-2 items-center ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {m.role === 'assistant' && (
            <div className="shrink-0 self-center"><CopilotIcon size={20} muted /></div>
          )}
          <div className="flex flex-col gap-1 max-w-[88%]">
            {m.role === 'assistant' && m.thinking && (
              <div className="rounded-md border border-vsc-border/40 bg-[#1e1e1e] text-[11px] overflow-hidden">
                <button
                  onClick={() => onToggleThink(i)}
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
                onClick={() => onApplyAction(i, m.action!)}
                className="self-start flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-[#4ec9b0] border border-[#4ec9b0]/40 rounded hover:bg-[#4ec9b0]/10 transition-colors font-mono"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Apply {m.action.action.replace('_', ' ')} → {m.action.path}
              </button>
            )}
            {failedIdx === i && lastEditMsg && !busy && (
              <button
                onClick={() => onRetry(lastEditMsg)}
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
  )
}

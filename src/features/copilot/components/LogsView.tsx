'use client'

import { useEffect, useRef } from 'react'
import type { LogEntry } from '@/features/copilot/types'

export function LogsView({ logs, onClear }: { logs: LogEntry[]; onClear: () => void }) {
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

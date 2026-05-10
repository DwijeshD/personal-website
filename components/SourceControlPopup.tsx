'use client'

import { useEffect, useRef } from 'react'
import { PERSON } from '@/lib/data'

const STATS = [
  { count: 3, label: 'Modified', color: 'text-[#e2c08d]' },
  { count: 1, label: 'Added',    color: 'text-[#89d185]' },
  { count: 0, label: 'Deleted',  color: 'text-[#f14c4c]' },
]

interface Props {
  onClose: () => void
}

export default function SourceControlPopup({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const btn = document.getElementById('source-control-activity-btn')
      if (btn && btn.contains(e.target as Node)) return  // button's own click will toggle
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute z-50 left-12 font-mono"
      style={{ top: '132px' }}
    >
      {/* Arrow pointing left toward activity bar */}
      <div className="absolute -left-[6px] top-5 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-[#252526]" />

      <div className="w-72 bg-[#252526] border border-[#454545] rounded shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-[#454545] flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-[0.2em] text-vsc-muted uppercase">
            Source Control
          </span>
          <button
            onClick={onClose}
            className="text-vsc-muted hover:text-vsc-text transition-colors text-sm leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Branch row */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded bg-vsc-sidebar border border-vsc-border">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-vsc-muted shrink-0">
              <path fillRule="evenodd" d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V7.5a2.5 2.5 0 0 1-2.5 2.5H9a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V9.5a1 1 0 0 0-1-1H4.5A2.5 2.5 0 0 1 2 6V4.372a2.25 2.25 0 1 1 1.5 0V6a1 1 0 0 0 1 1H5a2.5 2.5 0 0 1 2.5-2.5h.25v-.628A2.25 2.25 0 0 1 9.5 1.75zM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z"/>
            </svg>
            <span className="text-vsc-text font-semibold text-sm">main</span>
            <span className="ml-auto flex items-center gap-1.5 text-[#89d185] text-xs">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.47 7.78a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L9 4.81v7.44a.75.75 0 0 1-1.5 0V4.81L4.53 7.78a.75.75 0 0 1-1.06 0z"/>
              </svg>
              1 commit ahead
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center py-3 rounded bg-vsc-sidebar border border-vsc-border"
              >
                <span className={`text-2xl font-bold ${s.color}`}>{s.count}</span>
                <span className="text-[10px] text-vsc-muted mt-0.5 uppercase tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>

          {/* View on GitHub */}
          <a
            href={PERSON.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-vsc-accent hover:text-vsc-accent-hover transition-colors group"
          >
            <span>View on GitHub</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

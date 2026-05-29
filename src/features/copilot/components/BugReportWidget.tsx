'use client'

import type { IssueState } from '@/features/copilot/types'

interface Props {
  issueState: IssueState
  onStateChange: (s: IssueState) => void
  onDismiss: () => void
}

export function BugReportWidget({ issueState, onStateChange, onDismiss }: Props) {
  return (
    <div className="mx-3 mb-2 rounded-md border border-[#f14c4c]/30 bg-[#1e1e1e] overflow-hidden text-[11px]">
      {issueState.status === 'form' && (
        <div className="p-3 space-y-2">
          <div className="text-[11px] font-semibold text-[#f14c4c]/80 mb-1">Report a Bug</div>
          <input
            className="w-full bg-[#2a2a2a] border border-vsc-border/50 rounded px-2 py-1 text-vsc-text outline-none focus:border-vsc-accent/50 text-[11px]"
            placeholder="Issue title"
            maxLength={100}
            value={issueState.title}
            onChange={e => onStateChange({ ...issueState, title: e.target.value })}
          />
          <textarea
            className="w-full bg-[#2a2a2a] border border-vsc-border/50 rounded px-2 py-1 text-vsc-text outline-none focus:border-vsc-accent/50 text-[11px] resize-none"
            placeholder="Describe the issue"
            maxLength={2000}
            rows={3}
            value={issueState.desc}
            onChange={e => onStateChange({ ...issueState, desc: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <button onClick={onDismiss} className="text-vsc-muted/50 hover:text-vsc-muted transition-colors px-2 py-0.5">Cancel</button>
            <button
              disabled={!issueState.title.trim()}
              onClick={async () => {
                const { title, desc } = issueState as { status: 'form'; title: string; desc: string }
                onStateChange({ status: 'submitting' })
                try {
                  const r = await fetch('/api/report-issue', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description: desc }),
                  })
                  const data = await r.json()
                  if (!r.ok) onStateChange({ status: 'error', msg: data.error ?? 'Failed.' })
                  else onStateChange({ status: 'done', number: data.number })
                } catch {
                  onStateChange({ status: 'error', msg: 'Network error.' })
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
          <button onClick={onDismiss} className="text-vsc-muted/50 hover:text-vsc-muted transition-colors">✕</button>
        </div>
      )}
      {issueState.status === 'error' && (
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[#f14c4c]">{issueState.msg}</span>
          <button onClick={() => onStateChange({ status: 'form', title: '', desc: '' })} className="text-vsc-muted/50 hover:text-vsc-muted ml-2 transition-colors">Retry</button>
        </div>
      )}
    </div>
  )
}

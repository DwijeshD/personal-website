'use client'

import type { AiFileAction } from '@/lib/fileSystem'

interface Props {
  action:    AiFileAction
  onApprove: () => void
  onReject:  () => void
}

const ACTION_LABELS: Record<AiFileAction['action'], { verb: string; colour: string }> = {
  create_file:   { verb: 'Create file',   colour: '#4ec9b0' },
  update_file:   { verb: 'Update file',   colour: '#dcdcaa' },
  delete_file:   { verb: 'Delete file',   colour: '#f14c4c' },
  create_folder: { verb: 'Create folder', colour: '#c09553' },
}

export default function AiActionModal({ action, onApprove, onReject }: Props) {
  const meta = ACTION_LABELS[action.action]

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)' }}>
      <div
        className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg shadow-2xl w-[420px] max-w-[90vw] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#3c3c3c] bg-[#252526]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#007acc" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="text-[13px] font-semibold text-vsc-text">AI File Action — Confirm</span>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-3">
          <p className="text-[12px] text-vsc-muted leading-5">
            The AI assistant wants to perform the following action:
          </p>

          {/* Action card */}
          <div className="rounded-md bg-[#0d0d0d] border border-[#3c3c3c] p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded"
                style={{ background: `${meta.colour}22`, color: meta.colour, border: `1px solid ${meta.colour}55` }}
              >
                {meta.verb}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[12px]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#858585" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span className="text-vsc-text">{action.path}</span>
            </div>

            {action.content !== undefined && (
              <div className="mt-1">
                <div className="text-[10px] text-vsc-muted mb-1 uppercase tracking-wider">Content preview</div>
                <pre className="text-[11px] text-[#9cdcfe] bg-[#1a1a2e] rounded p-2 max-h-[140px] overflow-auto leading-5 whitespace-pre-wrap">
                  {action.content.slice(0, 600)}{action.content.length > 600 ? '\n…' : ''}
                </pre>
              </div>
            )}
          </div>

          <p className="text-[11px] text-vsc-muted/70 leading-4">
            Review AI output carefully before approving. This action will modify your file system.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[#3c3c3c] bg-[#252526]">
          <button
            onClick={onReject}
            className="px-4 py-1.5 text-[12px] rounded border border-[#3c3c3c] text-vsc-muted hover:text-vsc-text hover:border-[#555] transition-colors"
          >
            Reject
          </button>
          <button
            onClick={onApprove}
            className={`px-4 py-1.5 text-[12px] rounded text-white font-medium transition-colors ${
              action.action === 'delete_file'
                ? 'bg-[#c72e2e] hover:bg-[#e53535]'
                : 'bg-[#007acc] hover:bg-[#0098ff]'
            }`}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  )
}

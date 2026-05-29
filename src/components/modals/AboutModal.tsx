'use client'

import { useEffect, useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

function formatModel(raw: string): string {
  const model = raw.split('/').pop() ?? raw
  return model.split(':')[0]
}

export default function AboutModal({ open, onClose }: Props) {
  const [model, setModel] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    fetch('/api/model-info')
      .then(r => r.json())
      .then(d => { if (d.model) setModel(formatModel(d.model)) })
      .catch(() => {})
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 palette-backdrop"
      onClick={onClose}
    >
      <div
        className="bg-vsc-sidebar border border-vsc-border rounded shadow-2xl w-[400px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-vsc-border">
          <span className="text-sm font-semibold text-vsc-text">About Portfolio</span>
          <button
            onClick={onClose}
            className="text-vsc-muted hover:text-vsc-text text-xs w-5 h-5 flex items-center justify-center rounded hover:bg-vsc-hover"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 font-mono text-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-vsc-accent/20 border border-vsc-accent/40 flex items-center justify-center text-2xl">
              {'</>'}
            </div>
            <div>
              <div className="text-vsc-text font-semibold text-base">Portfolio IDE</div>
              <div className="text-vsc-muted text-xs">Version 1.0.0 (portfolio build)</div>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="token-prop">Built by</span>
              <span className="token-string">&quot;Dwijesh Dookraz&quot;</span>
            </div>
            <div className="flex justify-between">
              <span className="token-prop">Framework</span>
              <span className="token-string">&quot;Next.js 15 + React 19&quot;</span>
            </div>
            <div className="flex justify-between">
              <span className="token-prop">Styling</span>
              <span className="token-string">&quot;Tailwind CSS&quot;</span>
            </div>
            <div className="flex justify-between">
              <span className="token-prop">AI</span>
              <span className="token-string">&quot;{model ?? 'OpenRouter'}&quot;</span>
            </div>
            <div className="flex justify-between">
              <span className="token-prop">Theme</span>
              <span className="token-string">&quot;VS Code Dark+&quot;</span>
            </div>
          </div>

          <div className="pt-2 border-t border-vsc-border text-xs text-vsc-muted text-center">
            MIT License · github.com/DwijeshD
          </div>
        </div>

        <div className="px-4 pb-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-vsc-accent hover:bg-vsc-accent-hover text-white text-xs rounded transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

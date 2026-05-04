'use client'

import TerminalTab, { TerminalHandle } from './TerminalTab'

interface Props {
  onClose: () => void
  onNavigate: (id: string) => void
  onLastCommandChange: (cmd: string | null) => void
  terminalRef: React.RefObject<TerminalHandle | null>
}

export default function BottomPanel({
  onClose,
  onNavigate,
  onLastCommandChange,
  terminalRef,
}: Props) {
  return (
    <div className="flex flex-col h-full bg-vsc-bg border-t border-vsc-border">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#252526] shrink-0 border-b border-vsc-border">
        <div className="flex items-center gap-1">
          {(['TERMINAL', 'PROBLEMS', 'OUTPUT'] as const).map((t, i) => (
            <button
              key={t}
              className={`
                px-3 py-0.5 text-[11px] font-medium transition-colors rounded-sm
                ${i === 0
                  ? 'text-vsc-text border-b border-vsc-accent'
                  : 'text-vsc-muted hover:text-vsc-text'}
              `}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="text-vsc-muted hover:text-vsc-text text-xs px-1.5 py-0.5 rounded hover:bg-vsc-hover transition-colors"
          title="Close panel"
        >
          ✕
        </button>
      </div>

      {/* Terminal */}
      <div className="flex-1 overflow-hidden">
        <TerminalTab
          ref={terminalRef}
          onNavigate={onNavigate}
          onLastCommandChange={onLastCommandChange}
        />
      </div>
    </div>
  )
}

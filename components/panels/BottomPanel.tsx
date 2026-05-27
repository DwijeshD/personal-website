'use client'

import TerminalTab, { TerminalHandle } from './TerminalTab'
import type { Diagnostic } from '@/lib/diagnostics'

export type BottomTab = 'TERMINAL' | 'PROBLEMS'

interface Props {
  onClose: () => void
  onNavigate: (id: string) => void
  onLastCommandChange: (cmd: string | null) => void
  terminalRef: React.RefObject<TerminalHandle | null>
  diagnostics: Diagnostic[]
  activeTab: BottomTab
  onTabChange: (tab: BottomTab) => void
  onThemeChange?: (theme: string) => void
}

export default function BottomPanel({
  onClose,
  onNavigate,
  onLastCommandChange,
  terminalRef,
  diagnostics,
  activeTab,
  onTabChange,
  onThemeChange,
}: Props) {
  const errorCount   = diagnostics.filter((d) => d.severity === 'error').length
  const warningCount = diagnostics.filter((d) => d.severity === 'warning').length

  return (
    <div className="flex flex-col h-full bg-vsc-bg border-t border-vsc-border">
      <div className="flex items-center justify-between px-3 py-1 bg-[#252526] shrink-0 border-b border-vsc-border">
        <div className="flex items-center gap-1">
          {(['TERMINAL', 'PROBLEMS'] as BottomTab[]).map((t) => (
            <button
              key={t}
              onClick={() => onTabChange(t)}
              className={`
                px-3 py-0.5 text-[11px] font-medium transition-colors rounded-sm flex items-center gap-1.5
                ${activeTab === t
                  ? 'text-vsc-text border-b border-vsc-accent'
                  : 'text-vsc-muted hover:text-vsc-text'}
              `}
            >
              {t}
              {t === 'PROBLEMS' && diagnostics.length > 0 && (
                <span className={`text-[10px] px-1 rounded-sm font-mono ${errorCount > 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                  {errorCount > 0 && `${errorCount}E`}
                  {errorCount > 0 && warningCount > 0 && ' '}
                  {warningCount > 0 && `${warningCount}W`}
                </span>
              )}
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

      <div className="flex-1 overflow-hidden">
        {activeTab === 'TERMINAL' && (
          <TerminalTab
            ref={terminalRef}
            onNavigate={onNavigate}
            onLastCommandChange={onLastCommandChange}
            onThemeChange={onThemeChange}
          />
        )}
        {activeTab === 'PROBLEMS' && (
          <ProblemsPanel diagnostics={diagnostics} onNavigate={onNavigate} />
        )}
      </div>
    </div>
  )
}

function ProblemsPanel({
  diagnostics,
  onNavigate,
}: {
  diagnostics: Diagnostic[]
  onNavigate: (id: string) => void
}) {
  if (diagnostics.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-vsc-muted text-sm gap-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-green-400">
          <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm-.4 10.5L3.9 7.8l1.1-1.1 2.6 2.6 4.3-4.3 1.1 1.1-5.4 5.4z"/>
        </svg>
        No problems detected
      </div>
    )
  }

  const byFile = diagnostics.reduce<Record<string, Diagnostic[]>>((acc, d) => {
    if (!acc[d.fileId]) acc[d.fileId] = []
    acc[d.fileId].push(d)
    return acc
  }, {})

  return (
    <div className="h-full overflow-y-auto panel-scroll font-mono text-[12px]">
      {Object.entries(byFile).map(([fileId, diags]) => (
        <div key={fileId}>
          <div
            className="flex items-center gap-2 px-4 py-1.5 bg-vsc-hover/20 sticky top-0 cursor-pointer hover:bg-vsc-hover/40 border-b border-vsc-border/20"
            onClick={() => onNavigate(fileId)}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" className="text-vsc-muted shrink-0">
              <path d="M13.71 4.29l-3-3L10 1H4L3 2v12l1 1h9l1-1V5l-.29-.71zM13 14H4V2h5v4h4v8z"/>
            </svg>
            <span className="text-vsc-text">{diags[0].fileName}</span>
            <span className="text-vsc-muted ml-auto text-[11px]">
              {diags.filter(d => d.severity === 'error').length > 0 && (
                <span className="text-red-400 mr-2">
                  {diags.filter(d => d.severity === 'error').length} error{diags.filter(d => d.severity === 'error').length !== 1 ? 's' : ''}
                </span>
              )}
              {diags.filter(d => d.severity === 'warning').length > 0 && (
                <span className="text-yellow-400">
                  {diags.filter(d => d.severity === 'warning').length} warning{diags.filter(d => d.severity === 'warning').length !== 1 ? 's' : ''}
                </span>
              )}
            </span>
          </div>
          {diags.map((d, i) => (
            <div
              key={i}
              onClick={() => onNavigate(d.fileId)}
              className="flex items-start gap-2 px-8 py-1.5 hover:bg-vsc-hover/30 cursor-pointer"
            >
              {d.severity === 'error' ? (
                <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" className="text-red-400 shrink-0 mt-0.5">
                  <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm3 9.5L9.5 12 8 10.5 6.5 12 5 10.5 6.5 9 5 7.5 6.5 6 8 7.5 9.5 6l1.5 1.5L9.5 9 11 10.5z"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" className="text-yellow-400 shrink-0 mt-0.5">
                  <path d="M7.56 1h.88l6.54 12.26-.44.74H1.44L1 13.26 7.56 1zM8 2.28L2.28 13H13.72L8 2.28zM8.625 12v-1h-1.25v1h1.25zm-1.25-2V6h1.25v4h-1.25z"/>
                </svg>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-vsc-text/90 break-words">{d.message}</span>
                {d.line !== undefined && (
                  <span className="text-vsc-muted ml-2 text-[11px]">[Ln {d.line}]</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

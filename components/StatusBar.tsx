'use client'

interface Props {
  activeTab: string
  aiThinking: boolean
  onToggleAI: () => void
  zoom: number
  errorCount: number
  warningCount: number
  onShowProblems: () => void
}

export default function StatusBar({ activeTab, aiThinking, onToggleAI, zoom, errorCount, warningCount, onShowProblems }: Props) {
  const filename = activeTab.startsWith('file:') ? activeTab.slice(5) : activeTab
  const lang = filename.split('.').pop()?.toUpperCase() ?? 'TSX'

  return (
    <div className="h-[22px] bg-vsc-statusbar flex items-center px-3 shrink-0 text-white text-[11px] select-none">
      {/* Left */}
      <div className="flex items-center gap-3 flex-1">
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          main
        </span>
        <button
          onClick={onShowProblems}
          className="flex items-center gap-2 hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors"
          title="Show Problems panel"
        >
          <span className="flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" className={errorCount > 0 ? 'text-red-400' : 'text-white/60'}>
              <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm3 9.5L9.5 12 8 10.5 6.5 12 5 10.5 6.5 9 5 7.5 6.5 6 8 7.5 9.5 6l1.5 1.5L9.5 9 11 10.5z"/>
            </svg>
            {errorCount}
          </span>
          <span className="flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" className={warningCount > 0 ? 'text-yellow-400' : 'text-white/60'}>
              <path d="M7.56 1h.88l6.54 12.26-.44.74H1.44L1 13.26 7.56 1zM8 2.28L2.28 13H13.72L8 2.28zM8.625 12v-1h-1.25v1h1.25zm-1.25-2V6h1.25v4h-1.25z"/>
            </svg>
            {warningCount}
          </span>
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {aiThinking && (
          <span className="ai-thinking flex items-center gap-1">
            <span>⚙</span> AI thinking…
          </span>
        )}
        <button
          onClick={onToggleAI}
          className="hover:bg-white/20 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
          title="Toggle AI Assistant"
        >
          AI Assistant
        </button>
        <span>Ln 1, Col 1</span>
        <span>UTF-8</span>
        <span>{lang}</span>
        {zoom !== 1 && <span>{Math.round(zoom * 100)}%</span>}
        <span className="flex items-center gap-1 text-vsc-green">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
          Available
        </span>
      </div>
    </div>
  )
}

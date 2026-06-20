import { formatModel } from '@/features/copilot/lib/formatModel'
import { CopilotIcon } from '@/features/copilot/components/CopilotIcon'

interface Props {
  activeModel:    string | null
  onQuickAsk:     (text: string) => void
  onBugPrefill:   () => void
}

const QUICK_ASKS = [
  {
    label: 'Projects',
    title: 'What has he built?',
    text:  'What projects has Dwijesh built and what problems do they solve?',
    path:  'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18',
  },
  {
    label: 'Stack',
    title: 'Tech stack',
    text:  "What is Dwijesh's full tech stack and what systems has he worked on?",
    path:  null,
  },
  {
    label: 'Hire',
    title: 'Open to work?',
    text:  'Is Dwijesh open to new roles? What kind of work is he looking for?',
    path:  'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
  },
  {
    label: 'Research',
    title: 'Dissertation',
    text:  'Tell me about the rPPG heart rate prediction dissertation.',
    path:  null,
  },
] as const

export function EmptyState({ activeModel, onQuickAsk, onBugPrefill }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 px-6">
      <CopilotIcon size={72} />

      <div className="text-center space-y-2">
        <div className="text-[15px] font-semibold text-vsc-text">Ask Copilot</div>
        <div className="text-[11px] text-vsc-muted leading-[1.6] max-w-[230px]">
          Copilot is powered by AI, so mistakes are possible. Review output carefully before use.
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onQuickAsk(QUICK_ASKS[0].text)}
          title={QUICK_ASKS[0].title}
          className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-vsc-border/50 hover:border-vsc-border hover:bg-vsc-hover transition-colors group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-vsc-muted group-hover:text-vsc-text transition-colors">
            <path d={QUICK_ASKS[0].path!}/>
          </svg>
          <span className="text-[10px] text-vsc-muted group-hover:text-vsc-text transition-colors">{QUICK_ASKS[0].label}</span>
        </button>
        <button
          onClick={() => onQuickAsk(QUICK_ASKS[1].text)}
          title={QUICK_ASKS[1].title}
          className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-vsc-border/50 hover:border-vsc-border hover:bg-vsc-hover transition-colors group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-vsc-muted group-hover:text-vsc-text transition-colors">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
          <span className="text-[10px] text-vsc-muted group-hover:text-vsc-text transition-colors">{QUICK_ASKS[1].label}</span>
        </button>
        <button
          onClick={() => onQuickAsk(QUICK_ASKS[2].text)}
          title={QUICK_ASKS[2].title}
          className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-vsc-border/50 hover:border-vsc-border hover:bg-vsc-hover transition-colors group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-vsc-muted group-hover:text-vsc-text transition-colors">
            <path d={QUICK_ASKS[2].path!}/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span className="text-[10px] text-vsc-muted group-hover:text-vsc-text transition-colors">{QUICK_ASKS[2].label}</span>
        </button>
        <button
          onClick={() => onQuickAsk(QUICK_ASKS[3].text)}
          title={QUICK_ASKS[3].title}
          className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-vsc-border/50 hover:border-vsc-border hover:bg-vsc-hover transition-colors group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-vsc-muted group-hover:text-vsc-text transition-colors">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <span className="text-[10px] text-vsc-muted group-hover:text-vsc-text transition-colors">{QUICK_ASKS[3].label}</span>
        </button>
        <button
          onClick={onBugPrefill}
          title="Report a bug"
          className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-vsc-border/50 hover:border-[#f14c4c]/40 hover:bg-vsc-hover transition-colors group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-vsc-muted group-hover:text-[#f14c4c] transition-colors">
            <path d="M9 2h6l1 4H8L9 2z"/><path d="M5 8h14l-1 13H6L5 8z"/><line x1="12" y1="12" x2="12" y2="17"/>
          </svg>
          <span className="text-[10px] text-vsc-muted group-hover:text-[#f14c4c] transition-colors">Bug</span>
        </button>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        {activeModel && formatModel(activeModel) && (
          <div className="text-[11px] text-vsc-muted/70 font-mono text-center break-all" title={activeModel}>
            {formatModel(activeModel)}
          </div>
        )}
        <div className="text-[10px] text-vsc-muted/40 font-mono">
          Powered by OpenRouter
        </div>
      </div>
    </div>
  )
}

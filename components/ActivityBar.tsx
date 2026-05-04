'use client'

export type SidePanel = 'explorer' | 'search' | null

interface Props {
  activePanel: SidePanel
  onToggle: (panel: SidePanel) => void
  onSourceControl: () => void
  sourceControlOpen: boolean
  onToggleAI: () => void
  aiOpen: boolean
  onSettings: () => void
  settingsOpen: boolean
}

const ExplorerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[22px] h-[22px]">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[22px] h-[22px]">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

// VS Code–style source control icon (git commit graph)
const SourceControlIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[22px] h-[22px]">
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <path d="M6 8.5v7" />
    <path d="M8.5 6h4c1.5 0 2.5 1 2.5 2.5v3c0 1.5 1 2.5 2.5 2.5" />
  </svg>
)

const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[22px] h-[22px]">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M12 2v4M8 15h.01M16 15h.01" />
    <circle cx="12" cy="7" r="1" />
  </svg>
)

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[22px] h-[22px]">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

export default function ActivityBar({ activePanel, onToggle, onSourceControl, sourceControlOpen, onToggleAI, aiOpen, onSettings, settingsOpen }: Props) {
  const btn = (panel: SidePanel, Icon: React.FC, title: string) => (
    <button
      title={title}
      onClick={() => onToggle(panel)}
      className={`
        w-12 h-12 flex items-center justify-center transition-colors relative
        ${activePanel === panel
          ? 'text-vsc-text after:absolute after:left-0 after:top-2 after:bottom-2 after:w-0.5 after:bg-vsc-accent'
          : 'text-vsc-muted hover:text-vsc-text'}
      `}
    >
      <Icon />
    </button>
  )

  return (
    <div className="w-12 bg-vsc-activitybar flex flex-col items-center shrink-0 border-r border-vsc-border/30">
      <div className="flex flex-col flex-1">
        {btn('explorer', ExplorerIcon, 'Explorer')}
        {btn('search',   SearchIcon,  'Search')}

        {/* Source Control — opens floating popup */}
        <button
          title="Source Control"
          onClick={onSourceControl}
          className={`
            w-12 h-12 flex items-center justify-center transition-colors relative
            ${sourceControlOpen
              ? 'text-vsc-text after:absolute after:left-0 after:top-2 after:bottom-2 after:w-0.5 after:bg-vsc-accent'
              : 'text-vsc-muted hover:text-vsc-text'}
          `}
        >
          <SourceControlIcon />
        </button>

        {/* Copilot / AI */}
        <button
          title="Dwijesh's Copilot"
          onClick={onToggleAI}
          className={`
            w-12 h-12 flex items-center justify-center transition-colors relative
            ${aiOpen ? 'text-[#a78bfa] after:absolute after:left-0 after:top-2 after:bottom-2 after:w-0.5 after:bg-[#a78bfa]' : 'text-vsc-muted hover:text-vsc-text'}
          `}
        >
          <BotIcon />
        </button>
      </div>

      <div className="flex flex-col pb-2">
        <a
          href="https://github.com/DwijeshD"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 flex items-center justify-center text-vsc-muted hover:text-vsc-text transition-colors"
          title="GitHub"
        >
          <GithubIcon />
        </a>
        <button
          onClick={onSettings}
          title="Settings"
          className={`
            w-12 h-12 flex items-center justify-center transition-colors relative
            ${settingsOpen
              ? 'text-vsc-text after:absolute after:left-0 after:top-2 after:bottom-2 after:w-0.5 after:bg-vsc-accent'
              : 'text-vsc-muted hover:text-vsc-text'}
          `}
        >
          <SettingsIcon />
        </button>
      </div>
    </div>
  )
}

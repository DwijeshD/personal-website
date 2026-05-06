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

// Two overlapping file pages — VS Code Explorer
const ExplorerIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h8l4 4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" opacity=".5"/>
    <path d="M9 2h8l4 4v12a1 1 0 0 1-1 1h-1"/>
    <polyline points="17 2 17 6 21 6"/>
  </svg>
)

// Magnifying glass
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="11" cy="11" r="7.5"/>
    <line x1="21" y1="21" x2="16.2" y2="16.2"/>
  </svg>
)

// Git fork / branch
const SourceControlIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6"  cy="5"  r="2"/>
    <circle cx="18" cy="5"  r="2"/>
    <circle cx="6"  cy="19" r="2"/>
    <line x1="6" y1="7" x2="6" y2="17"/>
    <path d="M18 7c0 3-3 5-6 6"/>
  </svg>
)

// Copilot star / sparkle
const CopilotIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 2l1.8 5.5H20l-4.9 3.6 1.9 5.9L12 13.4l-5 3.6 1.9-5.9L4 7.5h6.2L12 2z"/>
    <circle cx="5"  cy="19" r="1.2" opacity=".6"/>
    <circle cx="19" cy="19" r="1.2" opacity=".6"/>
  </svg>
)

// GitHub mark
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

// Gear / settings
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

export default function ActivityBar({
  activePanel, onToggle,
  onSourceControl, sourceControlOpen,
  onToggleAI, aiOpen,
  onSettings, settingsOpen,
}: Props) {

  const navBtn = (panel: SidePanel, Icon: React.FC, title: string) => {
    const active = activePanel === panel
    return (
      <button
        title={title}
        onClick={() => onToggle(panel)}
        className={`relative w-12 h-12 flex items-center justify-center transition-colors ${active ? 'text-white' : 'text-[#858585] hover:text-[#cccccc]'}`}
      >
        {active && <span className="absolute left-0 top-3 bottom-3 w-[2px] bg-white rounded-r-sm" />}
        <Icon />
      </button>
    )
  }

  const actionBtn = (active: boolean, Icon: React.FC, title: string, onClick: () => void, id?: string) => (
    <button
      id={id}
      title={title}
      onClick={onClick}
      className={`relative w-12 h-12 flex items-center justify-center transition-colors ${active ? 'text-white' : 'text-[#858585] hover:text-[#cccccc]'}`}
    >
      {active && <span className="absolute left-0 top-3 bottom-3 w-[2px] bg-white rounded-r-sm" />}
      <Icon />
    </button>
  )

  return (
    <div className="w-12 bg-vsc-activitybar flex flex-col items-center shrink-0 border-r border-vsc-border/30">
      <div className="flex flex-col flex-1">
        {navBtn('explorer', ExplorerIcon,     'Explorer')}
        {navBtn('search',   SearchIcon,       'Search')}
        {actionBtn(sourceControlOpen, SourceControlIcon, 'Source Control', onSourceControl)}
        {actionBtn(aiOpen,            CopilotIcon,       "Dwijesh's Copilot", onToggleAI)}
      </div>

      <div className="flex flex-col pb-2">
        <a
          href="https://github.com/DwijeshD"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
          className="w-12 h-12 flex items-center justify-center text-[#858585] hover:text-[#cccccc] transition-colors"
        >
          <GithubIcon />
        </a>
        {actionBtn(settingsOpen, SettingsIcon, 'Settings', onSettings, 'settings-activity-btn')}
      </div>
    </div>
  )
}

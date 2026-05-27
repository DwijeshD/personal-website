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
  isDark: boolean
}

function VscIcon({ name, size = 24, isDark }: { name: string; size?: number; isDark: boolean }) {
  const variant = isDark ? 'dark' : 'light'
  return <img src={`/icons/${variant}/${name}.svg`} width={size} height={size} alt={name} />
}

const CopilotChatIcon = ({ isDark }: { isDark: boolean }) => (
  <img
    src="/vscode-copilot.png"
    width={34}
    height={34}
    alt="Copilot"
    style={{
      filter: isDark
        ? 'invert(1) brightness(0.77)'
        : 'invert(0.74) brightness(0.6)',
      mixBlendMode: 'screen',
      display: 'block',
    }}
  />
)

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

export default function ActivityBar({
  activePanel, onToggle,
  onSourceControl, sourceControlOpen,
  onToggleAI, aiOpen,
  onSettings, settingsOpen,
  isDark,
}: Props) {

  const navBtn = (panel: SidePanel, icon: React.ReactNode, title: string) => {
    const active = activePanel === panel
    return (
      <button
        title={title}
        onClick={() => onToggle(panel)}
        className={`relative w-12 h-12 flex items-center justify-center transition-colors ${active ? 'text-white' : 'text-[#858585] hover:text-[#cccccc]'}`}
      >
        {active && <span className="absolute left-0 top-3 bottom-3 w-[2px] bg-white rounded-r-sm" />}
        {icon}
      </button>
    )
  }

  const actionBtn = (active: boolean, icon: React.ReactNode, title: string, onClick: () => void, id?: string) => (
    <button
      id={id}
      title={title}
      onClick={onClick}
      className={`relative w-12 h-12 flex items-center justify-center transition-colors ${active ? 'text-white' : 'text-[#858585] hover:text-[#cccccc]'}`}
    >
      {active && <span className="absolute left-0 top-3 bottom-3 w-[2px] bg-white rounded-r-sm" />}
      {icon}
    </button>
  )

  return (
    <div className="w-12 bg-vsc-activitybar flex flex-col items-center shrink-0 border-r border-vsc-border/30">
      <div className="flex flex-col flex-1">
        {navBtn('explorer', <VscIcon name="files" isDark={isDark} />, 'Explorer')}
        {navBtn('search', <VscIcon name="search" isDark={isDark} />, 'Search')}
        {actionBtn(sourceControlOpen, <VscIcon name="source-control" isDark={isDark} />, 'Source Control', onSourceControl, 'source-control-activity-btn')}
        {actionBtn(aiOpen, <CopilotChatIcon isDark={isDark} />, "Copilot", onToggleAI)}
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
        {actionBtn(settingsOpen, <VscIcon name="settings-gear" isDark={isDark} />, 'Settings', onSettings, 'settings-activity-btn')}
      </div>
    </div>
  )
}

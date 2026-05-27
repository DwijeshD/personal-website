'use client'

import MenuBar, { MenuDef } from './MenuBar'
import { TABS } from '@/lib/data'

interface Props {
  onCommandPalette: () => void
  onNewTab: () => void
  onOpenFile: () => void
  onCloseTab: () => void
  onCloseAllTabs: () => void
  recentFiles: string[]
  onOpenRecent: (id: string) => void
  onFind: () => void
  onCopy: () => void
  onToggleSidebar: () => void
  onToggleTerminal: () => void
  onToggleCopilot: () => void
  onEnterFullscreen: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
  onGoToFile: () => void
  onNavigate: (id: string) => void
  onStartTerminal: () => void
  onRunLastCommand: () => void
  lastCommand: string | null
  onNewTerminal: () => void
  onClearTerminal: () => void
  onShowShortcuts: () => void
  onAbout: () => void
  onReportBug: () => void
  copilotActive: boolean
}

export default function TitleBar({
  onCommandPalette,
  onNewTab,
  onOpenFile,
  onCloseTab,
  onCloseAllTabs,
  recentFiles,
  onOpenRecent,
  onFind,
  onCopy,
  onToggleSidebar,
  onToggleTerminal,
  onToggleCopilot,
  onEnterFullscreen,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onGoToFile,
  onNavigate,
  onStartTerminal,
  onRunLastCommand,
  lastCommand,
  onNewTerminal,
  onClearTerminal,
  onShowShortcuts,
  onAbout,
  onReportBug,
  copilotActive,
}: Props) {
  const recentSubmenu = recentFiles.length > 0
    ? recentFiles.map((id) => {
      const tab = TABS.find((t) => t.id === id)
      return { label: tab?.label ?? id, action: () => onOpenRecent(id) }
    })
    : [{ label: 'No recent files', disabled: true }]

  const menus: MenuDef[] = [
    {
      label: 'File',
      items: [
        { label: 'New Tab', action: onNewTab, shortcut: 'Ctrl+T' },
        { label: 'Open File...', action: onOpenFile, shortcut: 'Ctrl+O' },
        {},
        { label: 'Close Tab', action: onCloseTab, shortcut: 'Ctrl+W' },
        { label: 'Close All Tabs', action: onCloseAllTabs, shortcut: 'Ctrl+Shift+W' },
        {},
        { label: 'Open Recent', submenu: recentSubmenu },
        {},
        { label: 'Download Resume', disabled: true },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Find...', action: onFind, shortcut: 'Ctrl+F' },
        {},
        { label: 'Copy', action: onCopy, shortcut: 'Ctrl+C' },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Command Palette', action: onCommandPalette, shortcut: 'Ctrl+P' },
        {},
        { label: 'Toggle Sidebar', action: onToggleSidebar, shortcut: 'Ctrl+B' },
        { label: 'Toggle Terminal', action: onToggleTerminal, shortcut: 'Ctrl+`' },
        { label: 'Copilot', action: onToggleCopilot, shortcut: 'Ctrl+Shift+A' },
        {},
        { label: 'Enter Full Screen', action: onEnterFullscreen, shortcut: 'F11' },
        {},
        { label: 'Zoom In', action: onZoomIn, shortcut: 'Ctrl+=' },
        { label: 'Zoom Out', action: onZoomOut, shortcut: 'Ctrl+-' },
        { label: 'Reset Zoom', action: onResetZoom, shortcut: 'Ctrl+0' },
      ],
    },
    {
      label: 'Go',
      items: [
        { label: 'Go to File...', action: onGoToFile, shortcut: 'Ctrl+P' },
        {},
        ...TABS.map((t) => ({ label: t.label, action: () => onNavigate(t.id) })),
      ],
    },
    {
      label: 'Run',
      items: [
        { label: 'Start Terminal', action: onStartTerminal },
        {
          label: lastCommand ? `Run Last: ${lastCommand}` : 'Run Last Command',
          action: onRunLastCommand,
          disabled: !lastCommand,
        },
      ],
    },
    {
      label: 'Terminal',
      items: [
        { label: 'New Terminal', action: onNewTerminal, shortcut: 'Ctrl+`' },
        { label: 'Toggle Terminal', action: onToggleTerminal },
        {},
        { label: 'Clear Terminal', action: onClearTerminal },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'Command Palette', action: onCommandPalette, shortcut: 'Ctrl+P' },
        { label: 'Keyboard Shortcuts', action: onShowShortcuts, shortcut: 'Ctrl+K Ctrl+S' },
        {},
        { label: 'GitHub Profile', action: () => window.open('https://github.com/DwijeshD', '_blank', 'noopener,noreferrer') },
        {},
        { label: 'Report a Bug', action: onReportBug },
        {},
        { label: 'About', action: onAbout },
      ],
    },
  ]

  return (
    <div
      className="h-[32px] flex items-center shrink-0 select-none border-b border-vsc-border/40"
      style={{ backgroundColor: 'var(--vsc-titlebar, #1a1a1a)' }}
    >
      {/* VS Code icon */}
      <div className="w-[46px] h-full flex items-center justify-center shrink-0">
        <img src="/vscode-icon.png" width={16} height={16} alt="VS Code" />
      </div>

      {/* Menu bar */}
      <MenuBar menus={menus} />

      {/* Copilot toggle */}
      <button
        onClick={onToggleCopilot}
        title="Toggle Copilot (Ctrl+Shift+A)"
        className={`hidden sm:block px-2.5 py-0.5 text-xs rounded transition-colors select-none shrink-0 ${
          copilotActive ? 'text-vsc-accent' : 'text-vsc-muted hover:bg-white/10 hover:text-vsc-text'
        }`}
      >
        Copilot
      </button>

      {/* Back / Forward */}
      <div className="hidden sm:flex items-center gap-0.5 px-1.5 shrink-0">
        <button
          onClick={() => window.history.back()}
          title="Go Back"
          className="w-6 h-6 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded hover:bg-white/10 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={() => window.history.forward()}
          title="Go Forward"
          className="w-6 h-6 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded hover:bg-white/10 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Center search capsule */}
      <div className="hidden sm:flex flex-1 justify-center px-2 min-w-0">
        <button
          onClick={onCommandPalette}
          title="Search or type a command (Ctrl+P)"
          className="flex items-center gap-2 h-[22px] px-3 rounded bg-white/[0.07] hover:bg-white/[0.11] border border-white/[0.1] text-vsc-muted hover:text-vsc-text transition-colors w-[240px] max-w-full shrink"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="flex-1 text-left text-[11px] truncate">portfolio</span>
          <kbd className="text-[10px] bg-white/[0.06] px-1 rounded border border-white/[0.1] text-vsc-muted/60 font-mono shrink-0">
            Ctrl+P
          </kbd>
        </button>
      </div>

      {/* Layout toggle icons */}
      <div className="hidden sm:flex items-center px-1 shrink-0 gap-0.5">
        <button
          onClick={onToggleSidebar}
          title="Toggle Primary Sidebar (Ctrl+B)"
          className="w-7 h-7 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded hover:bg-white/10 transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
            <rect x="0" y="0" width="4" height="15" rx="1" opacity=".45" />
            <rect x="5.5" y="0" width="9.5" height="15" rx="1" />
          </svg>
        </button>
        <button
          onClick={onToggleTerminal}
          title="Toggle Panel (Ctrl+`)"
          className="w-7 h-7 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded hover:bg-white/10 transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
            <rect x="0" y="0" width="15" height="9" rx="1" />
            <rect x="0" y="10.5" width="15" height="4.5" rx="1" opacity=".45" />
          </svg>
        </button>
        <button
          onClick={onToggleCopilot}
          title="Toggle Copilot Panel (Ctrl+Shift+A)"
          className="w-7 h-7 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded hover:bg-white/10 transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
            <rect x="0" y="0" width="9" height="15" rx="1" />
            <rect x="10.5" y="0" width="4.5" height="15" rx="1" opacity=".45" />
          </svg>
        </button>
        <button
          onClick={onCommandPalette}
          title="Customize Layout"
          className="w-7 h-7 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded hover:bg-white/10 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="0" y="0" width="6" height="6" rx="1" />
            <rect x="8" y="0" width="6" height="6" rx="1" />
            <rect x="0" y="8" width="6" height="6" rx="1" />
            <rect x="8" y="8" width="6" height="6" rx="1" />
          </svg>
        </button>
      </div>

      {/* Windows window controls */}
      <div className="hidden sm:flex items-stretch shrink-0 h-full">
        <button
          onClick={() => window.blur()}
          title="Minimize"
          className="w-[46px] flex items-center justify-center text-vsc-muted hover:text-vsc-text hover:bg-white/[0.1] transition-colors"
        >
          <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor">
            <rect width="10" height="1" />
          </svg>
        </button>
        <button
          onClick={onEnterFullscreen}
          title="Maximize"
          className="w-[46px] flex items-center justify-center text-vsc-muted hover:text-vsc-text hover:bg-white/[0.1] transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="0.5" y="0.5" width="9" height="9" />
          </svg>
        </button>
        <button
          onClick={() => window.close()}
          title="Close"
          className="w-[46px] flex items-center justify-center text-vsc-muted hover:text-white hover:bg-[#c42b1c] transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
            <line x1="0" y1="0" x2="10" y2="10" />
            <line x1="10" y1="0" x2="0" y2="10" />
          </svg>
        </button>
      </div>
    </div>
  )
}

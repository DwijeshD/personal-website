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
  onSelectAll: () => void
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
  onSelectAll,
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
        { label: 'New Tab',        action: onNewTab,       shortcut: 'Ctrl+T' },
        { label: 'Open File...',   action: onOpenFile,     shortcut: 'Ctrl+O' },
        {},
        { label: 'Close Tab',      action: onCloseTab,     shortcut: 'Ctrl+W' },
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
        { label: 'Find...',    action: onFind,      shortcut: 'Ctrl+F' },
        {},
        { label: 'Select All', action: onSelectAll, shortcut: 'Ctrl+A' },
        { label: 'Copy',       action: onCopy,      shortcut: 'Ctrl+C' },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Command Palette',   action: onCommandPalette, shortcut: 'Ctrl+P' },
        {},
        { label: 'Toggle Sidebar',    action: onToggleSidebar,  shortcut: 'Ctrl+Shift+E' },
        { label: 'Toggle Terminal',   action: onToggleTerminal,  shortcut: 'Ctrl+`' },
        { label: "Dwijesh's Copilot", action: onToggleCopilot,  shortcut: 'Ctrl+Shift+A' },
        {},
        { label: 'Enter Full Screen', action: onEnterFullscreen, shortcut: 'F11' },
        {},
        { label: 'Zoom In',    action: onZoomIn,    shortcut: 'Ctrl+=' },
        { label: 'Zoom Out',   action: onZoomOut,   shortcut: 'Ctrl+-' },
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
          label: lastCommand ? `Run Last Command: ${lastCommand}` : 'Run Last Command',
          action: onRunLastCommand,
          disabled: !lastCommand,
        },
      ],
    },
    {
      label: 'Terminal',
      items: [
        { label: 'New Terminal',    action: onNewTerminal,   shortcut: 'Ctrl+`' },
        { label: 'Toggle Terminal', action: onToggleTerminal },
        {},
        { label: 'Clear Terminal',  action: onClearTerminal },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'Command Palette',    action: onCommandPalette, shortcut: 'Ctrl+P' },
        { label: 'Keyboard Shortcuts', action: onShowShortcuts,  shortcut: 'Ctrl+K Ctrl+S' },
        {},
        { label: 'GitHub Profile', action: () => window.open('https://github.com/DwijeshD', '_blank') },
        {},
        { label: 'About', action: onAbout },
      ],
    },
  ]

  return (
    <div className="flex flex-col select-none shrink-0 border-b border-vsc-border/40" style={{ backgroundColor: 'var(--vsc-titlebar, #1a1a1a)' }}>
      {/* Row 1: traffic lights + center search capsule */}
      <div className="h-9 flex items-center px-3">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 shrink-0 w-[60px]">
          <button
            onClick={() => window.close()}
            title="Close"
            className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-125 transition-all block cursor-pointer"
          />
          <button
            onClick={() => window.blur()}
            title="Minimize"
            className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-125 transition-all block cursor-pointer"
          />
          <button
            onClick={onEnterFullscreen}
            title="Fullscreen"
            className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-125 transition-all block cursor-pointer"
          />
        </div>

        {/* Center search capsule */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={onCommandPalette}
            title="Command Palette (Ctrl+P)"
            className="flex items-center gap-2 px-3 py-1 rounded bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.12] text-xs text-vsc-muted hover:text-vsc-text transition-colors w-[300px]"
          >
            {/* Search icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#519aba] shrink-0">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="flex-1 text-left text-vsc-muted/80">
              dwijesh-dookraz : portfolio
            </span>
            <kbd className="text-[10px] bg-white/[0.07] px-1.5 py-0.5 rounded border border-white/[0.15] text-vsc-muted/60 font-mono shrink-0">
              Ctrl P
            </kbd>
          </button>
        </div>

        {/* Balancing spacer */}
        <div className="w-[60px] shrink-0" />
      </div>

      {/* Row 2: menu bar + Copilot button */}
      <div className="h-[26px] flex items-center px-1 border-t border-vsc-border/20">
        <MenuBar menus={menus} />

        <button
          onClick={onToggleCopilot}
          title="Dwijesh's Copilot (Ctrl+Shift+A)"
          className={`
            ml-1 flex items-center gap-1.5 px-2.5 h-full text-xs transition-colors
            ${copilotActive
              ? 'text-[#a78bfa]'
              : 'text-vsc-muted hover:text-vsc-text'}
          `}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M12 2v4M8 15h.01M16 15h.01" />
            <circle cx="12" cy="7" r="1" />
          </svg>
          Copilot
        </button>
      </div>
    </div>
  )
}

import type { MenuDef } from '@/components/layout/MenuBar'
import { TABS } from '@/lib/tabs'

export interface MenuHandlers {
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
}

export function buildMenus(h: MenuHandlers): MenuDef[] {
  const recentSubmenu = h.recentFiles.length > 0
    ? h.recentFiles.map((id) => {
      const tab = TABS.find((t) => t.id === id)
      return { label: tab?.label ?? id, action: () => h.onOpenRecent(id) }
    })
    : [{ label: 'No recent files', disabled: true }]

  return [
    {
      label: 'File',
      items: [
        { label: 'New Tab', action: h.onNewTab, shortcut: 'Ctrl+T' },
        { label: 'Open File...', action: h.onOpenFile, shortcut: 'Ctrl+O' },
        {},
        { label: 'Close Tab', action: h.onCloseTab, shortcut: 'Ctrl+W' },
        { label: 'Close All Tabs', action: h.onCloseAllTabs, shortcut: 'Ctrl+Shift+W' },
        {},
        { label: 'Open Recent', submenu: recentSubmenu },
        {},
        { label: 'Download Resume', disabled: true },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Find...', action: h.onFind, shortcut: 'Ctrl+F' },
        {},
        { label: 'Copy', action: h.onCopy, shortcut: 'Ctrl+C' },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Command Palette', action: h.onCommandPalette, shortcut: 'Ctrl+P' },
        {},
        { label: 'Toggle Sidebar', action: h.onToggleSidebar, shortcut: 'Ctrl+B' },
        { label: 'Toggle Terminal', action: h.onToggleTerminal, shortcut: 'Ctrl+`' },
        { label: 'Copilot', action: h.onToggleCopilot, shortcut: 'Ctrl+Shift+A' },
        {},
        { label: 'Enter Full Screen', action: h.onEnterFullscreen, shortcut: 'F11' },
        {},
        { label: 'Zoom In', action: h.onZoomIn, shortcut: 'Ctrl+=' },
        { label: 'Zoom Out', action: h.onZoomOut, shortcut: 'Ctrl+-' },
        { label: 'Reset Zoom', action: h.onResetZoom, shortcut: 'Ctrl+0' },
      ],
    },
    {
      label: 'Go',
      items: [
        { label: 'Go to File...', action: h.onGoToFile, shortcut: 'Ctrl+P' },
        {},
        ...TABS.map((t) => ({ label: t.label, action: () => h.onNavigate(t.id) })),
      ],
    },
    {
      label: 'Run',
      items: [
        { label: 'Start Terminal', action: h.onStartTerminal },
        {
          label: h.lastCommand ? `Run Last: ${h.lastCommand}` : 'Run Last Command',
          action: h.onRunLastCommand,
          disabled: !h.lastCommand,
        },
      ],
    },
    {
      label: 'Terminal',
      items: [
        { label: 'New Terminal', action: h.onNewTerminal, shortcut: 'Ctrl+`' },
        { label: 'Toggle Terminal', action: h.onToggleTerminal },
        {},
        { label: 'Clear Terminal', action: h.onClearTerminal },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'Command Palette', action: h.onCommandPalette, shortcut: 'Ctrl+P' },
        { label: 'Keyboard Shortcuts', action: h.onShowShortcuts, shortcut: 'Ctrl+K Ctrl+S' },
        {},
        { label: 'GitHub Profile', action: () => window.open('https://github.com/DwijeshD', '_blank', 'noopener,noreferrer') },
        {},
        { label: 'Report a Bug', action: h.onReportBug },
        {},
        { label: 'About', action: h.onAbout },
      ],
    },
  ]
}

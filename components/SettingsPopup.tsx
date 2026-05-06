'use client'

import { useEffect, useRef } from 'react'

const THEMES = [
  { id: 'default',     name: 'Dwijesh Dark',  color: '#569cd6', emoji: '💙' },
  { id: 'rose-pine',   name: 'Rosé Pine',     color: '#eb6f92', emoji: '🌸' },
  { id: 'tokyo-night', name: 'Tokyo Night',   color: '#7aa2f7', emoji: '🌃' },
  { id: 'catppuccin',  name: 'Catppuccin',    color: '#cba6f7', emoji: '🐱' },
  { id: 'nord',        name: 'Nord',          color: '#88c0d0', emoji: '❄️' },
  { id: 'gruvbox',     name: 'Gruvbox',       color: '#d79921', emoji: '🔥' },
]

const SHORTCUTS = [
  { keys: ['Ctrl', 'P'],  desc: 'Go to file (command palette)' },
  { keys: ['Ctrl', '`'],  desc: 'Toggle terminal' },
  { keys: ['Ctrl', 'B'],  desc: 'Toggle sidebar' },
  { keys: ['Esc'],        desc: 'Close overlay' },
  { keys: ['↑', '↓'],    desc: 'Terminal history' },
]

interface Props {
  onClose: () => void
  onCommandPalette: () => void
  onToggleTerminal: () => void
  onToggleCopilot: () => void
  onEnterFullscreen: () => void
  selectedTheme: string
  onThemeChange: (theme: string) => void
}

export default function SettingsPopup({
  onClose,
  onCommandPalette,
  onToggleTerminal,
  onToggleCopilot,
  onEnterFullscreen,
  selectedTheme,
  onThemeChange,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      const btn = document.getElementById('settings-activity-btn')
      if (btn && btn.contains(e.target as Node)) return
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  function action(fn: () => void) {
    return () => { fn(); onClose() }
  }

  const quickActions = [
    {
      label: 'Command Palette',
      shortcut: 'Ctrl+P',
      onClick: action(onCommandPalette),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      label: 'Toggle Terminal',
      shortcut: 'Ctrl+`',
      onClick: action(onToggleTerminal),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      ),
    },
    {
      label: 'Copilot Chat',
      shortcut: '',
      onClick: action(onToggleCopilot),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
        </svg>
      ),
    },
    {
      label: 'Download Resume',
      shortcut: '',
      onClick: () => {},
      disabled: true,
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" /><line x1="12" y1="12" x2="12" y2="18" />
          <polyline points="9 15 12 18 15 15" />
        </svg>
      ),
    },
    {
      label: 'Toggle Fullscreen',
      shortcut: 'F11',
      onClick: action(onEnterFullscreen),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      ),
    },
  ]

  return (
    <div
      ref={ref}
      className="absolute z-50 bottom-8 left-14 w-72 rounded-lg shadow-2xl overflow-hidden font-mono"
      style={{ background: 'var(--vsc-sidebar, #252526)', border: '1px solid var(--vsc-border, #454545)' }}
    >
      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-vsc-muted uppercase">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Settings
        </div>
      </div>

      <div
        className="h-px mx-4"
        style={{ background: 'var(--vsc-border, #454545)' }}
      />

      {/* COLOR THEME */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] text-vsc-muted uppercase mb-2">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" opacity=".3"/>
            <path d="M12 6a6 6 0 0 0 0 12c.34 0 .5-.16.5-.5s-.13-.4-.3-.55A1 1 0 0 1 12 16a1 1 0 0 1 0-2 1 1 0 0 1 1 1c0 .21.13.5.5.5A3.5 3.5 0 0 0 17 12a5 5 0 0 0-5-6z"/>
          </svg>
          Color Theme
        </div>
        <ul className="space-y-0.5">
          {THEMES.map((t) => {
            const active = selectedTheme === t.id
            return (
              <li
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded cursor-pointer transition-colors"
                style={{
                  background: active ? 'var(--vsc-hover, #2a2d2e)' : undefined,
                  color: 'var(--vsc-text, #d4d4d4)',
                }}
                onMouseEnter={(e) => !active && ((e.currentTarget as HTMLElement).style.background = 'var(--vsc-hover, #2a2d2e)')}
                onMouseLeave={(e) => !active && ((e.currentTarget as HTMLElement).style.background = '')}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: t.color }}
                />
                <span className="text-base leading-none">{t.emoji}</span>
                <span className="flex-1 text-xs">{t.name}</span>
                {active && (
                  <span className="text-vsc-accent text-xs">✓</span>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      <div className="h-px mx-4 my-2" style={{ background: 'var(--vsc-border, #454545)' }} />

      {/* QUICK ACTIONS */}
      <div className="px-4 pb-1">
        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] text-vsc-muted uppercase mb-2">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          Quick Actions
        </div>
        <ul className="space-y-0.5">
          {quickActions.map((a) => (
            <li
              key={a.label}
              onClick={a.disabled ? undefined : a.onClick}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded transition-colors"
              style={{
                cursor: a.disabled ? 'default' : 'pointer',
                opacity: a.disabled ? 0.4 : 1,
                color: 'var(--vsc-text, #d4d4d4)',
              }}
              onMouseEnter={(e) => !a.disabled && ((e.currentTarget as HTMLElement).style.background = 'var(--vsc-hover, #2a2d2e)')}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = ''}
            >
              <span className="text-vsc-muted shrink-0">{a.icon}</span>
              <span className="flex-1 text-xs">{a.label}</span>
              {a.shortcut && (
                <span className="text-[10px] text-vsc-muted shrink-0">{a.shortcut}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px mx-4 my-2" style={{ background: 'var(--vsc-border, #454545)' }} />

      {/* KEYBOARD SHORTCUTS */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] text-vsc-muted uppercase mb-2">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="6" width="20" height="13" rx="2" />
            <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
          </svg>
          Keyboard Shortcuts
        </div>
        <ul className="space-y-1.5">
          {SHORTCUTS.map((s, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="flex items-center gap-1 shrink-0">
                {s.keys.map((k, j) => (
                  <kbd
                    key={j}
                    className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                    style={{
                      background: 'var(--vsc-hover, #2a2d2e)',
                      border: '1px solid var(--vsc-border, #454545)',
                      color: 'var(--vsc-text, #d4d4d4)',
                    }}
                  >
                    {k}
                  </kbd>
                ))}
              </div>
              <span className="text-[11px] text-vsc-muted">{s.desc}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px mx-4" style={{ background: 'var(--vsc-border, #454545)' }} />

      {/* Footer */}
      <div className="px-4 py-3 text-[10px] text-vsc-muted space-y-0.5">
        <div>Portfolio v1.0 · React + Next.js + Tailwind</div>
        <div>Made with 💜 by Dwijesh Dookraz</div>
      </div>
    </div>
  )
}

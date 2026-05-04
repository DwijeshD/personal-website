'use client'

import { TABS } from '@/lib/data'
import type { SidePanel } from './ActivityBar'

interface Props {
  panel: SidePanel
  activeTab: string
  openTabs: string[]
  onNavigate: (id: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  onToggleCopilot: () => void
  copilotOpen: boolean
}

// ─── File icons ───────────────────────────────────────────────────────────────

const ReactIcon = () => (
  <svg viewBox="0 0 32 32" width="20" height="20">
    <circle cx="16" cy="16" r="16" fill="#20232a"/>
    <g fill="none" stroke="#61dafb" strokeWidth="1.4">
      <ellipse cx="16" cy="16" rx="11" ry="4.2"/>
      <ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(60 16 16)"/>
      <ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(120 16 16)"/>
    </g>
    <circle cx="16" cy="16" r="2.2" fill="#61dafb"/>
  </svg>
)

const HtmlIcon = () => (
  <svg viewBox="0 0 32 32" width="20" height="20">
    <rect width="32" height="32" rx="4" fill="#e34c26"/>
    <text x="5" y="22" fontSize="13" fontWeight="900" fill="#fff" fontFamily="monospace">&lt;/&gt;</text>
  </svg>
)

const JsIcon = () => (
  <svg viewBox="0 0 32 32" width="20" height="20">
    <rect width="32" height="32" rx="4" fill="#f7df1e"/>
    <text x="4" y="24" fontSize="14" fontWeight="900" fill="#222" fontFamily="monospace">JS</text>
  </svg>
)

const JsonIcon = () => (
  <svg viewBox="0 0 32 32" width="20" height="20">
    <rect width="32" height="32" rx="4" fill="#f5a623"/>
    <text x="3" y="24" fontSize="16" fontWeight="900" fill="#fff" fontFamily="monospace">{'{}'}</text>
  </svg>
)

const TsIcon = () => (
  <svg viewBox="0 0 32 32" width="20" height="20">
    <rect width="32" height="32" rx="4" fill="#3178c6"/>
    <text x="3" y="24" fontSize="14" fontWeight="900" fill="#fff" fontFamily="monospace">TS</text>
  </svg>
)

const CssIcon = () => (
  <svg viewBox="0 0 32 32" width="20" height="20">
    <rect width="32" height="32" rx="4" fill="#264de4"/>
    {/* CSS3 shield shape */}
    <path d="M8 4l1.6 18L16 24l6.4-2L24 4H8z" fill="#2965f1"/>
    <path d="M16 22.3l5.2-1.4 1.4-15.4H16v16.8z" fill="#ebebeb"/>
    <path d="M16 7.5H11.3l.3 3.5H16V7.5z" fill="#fff"/>
    <path d="M16 17.2l-.1.1-2.6-.7-.2-2H10.5l.4 4.4 5.1 1.4v-3.2z" fill="#fff"/>
    <path d="M16 10.9v3.4h2.4l-.2 2.6-2.2.6v3.2l5.1-1.4.9-10.4H16z" fill="#ebebeb"/>
    <path d="M16 7.5v3.5h4.8l-.3-3.5H16z" fill="#ebebeb"/>
  </svg>
)

const MdIcon = () => (
  <svg viewBox="0 0 32 32" width="20" height="20">
    <rect width="32" height="32" rx="4" fill="#519aba"/>
    <text x="4" y="14" fontSize="9" fontWeight="700" fill="#fff" fontFamily="monospace">MD</text>
    <path d="M6 20v-6l3 4 3-4v6M15 20v-6l4 5M19 14v6M22 14v6" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const FILE_ICON_MAP: Record<string, React.ReactNode> = {
  home:       <ReactIcon />,
  about:      <HtmlIcon />,
  projects:   <JsIcon />,
  skills:     <JsonIcon />,
  experience: <TsIcon />,
  contact:    <CssIcon />,
}

// ─── Bottom git status ────────────────────────────────────────────────────────

function GitStatus() {
  return (
    <div className="flex items-center gap-3 px-3 py-1.5 text-[11px] text-vsc-muted select-none">
      {/* Branch */}
      <span className="flex items-center gap-1">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V7.5a2.5 2.5 0 0 1-2.5 2.5H9a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V9.5a1 1 0 0 0-1-1H4.5A2.5 2.5 0 0 1 2 6V4.372a2.25 2.25 0 1 1 1.5 0V6a1 1 0 0 0 1 1H5a2.5 2.5 0 0 1 2.5-2.5h.25v-.628A2.25 2.25 0 0 1 9.5 1.75zM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z"/>
        </svg>
        main
      </span>
      {/* Ahead — green */}
      <span className="flex items-center gap-0.5 text-[#89d185]">
        <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
          <path d="M3.47 7.78a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L9 4.81v7.44a.75.75 0 0 1-1.5 0V4.81L4.53 7.78a.75.75 0 0 1-1.06 0z"/>
        </svg>
        1
      </span>
      {/* Behind — orange/red */}
      <span className="flex items-center gap-0.5 text-[#f14c4c]">
        <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
          <path d="M12.53 8.22a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L2.97 9.28a.75.75 0 0 1 1.06-1.06L7 11.19V3.75a.75.75 0 0 1 1.5 0v7.44l2.97-2.97a.75.75 0 0 1 1.06 0z"/>
        </svg>
        3
      </span>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar({
  panel,
  activeTab,
  openTabs,
  onNavigate,
  searchQuery,
  onSearchChange,
  onToggleCopilot,
  copilotOpen,
}: Props) {
  if (!panel) return null

  const BottomSection = () => (
    <div className="shrink-0 border-t border-vsc-border/40">
      {/* Copilot button */}
      <div className="px-2 pt-2 pb-1">
        <button
          onClick={onToggleCopilot}
          className={`
            w-full flex items-center gap-2 px-3 py-2 rounded-md text-[12px] font-medium transition-all
            ${copilotOpen
              ? 'bg-[#2d2b55] border border-[#7c6af7]/50 text-[#a78bfa]'
              : 'bg-[#1e1e2e] border border-vsc-border/50 text-vsc-muted hover:text-vsc-text hover:border-vsc-border'}
          `}
        >
          {/* Sparkle */}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className={copilotOpen ? 'text-[#a78bfa]' : 'text-vsc-muted'}>
            <path d="M12 1l2.39 7.26L22 10l-7.61 2.74L12 20l-2.39-7.26L2 10l7.61-2.74L12 1z"/>
          </svg>

          <span className="flex-1 text-left">Dwijesh&apos;s Copilot</span>

          {copilotOpen ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#7c6af7]/20 text-[10px] text-[#a78bfa] border border-[#7c6af7]/30 shrink-0">
              open ✓
            </span>
          ) : null}
        </button>
      </div>

      {/* Git status */}
      <GitStatus />
    </div>
  )

  return (
    <div className="w-[220px] bg-vsc-sidebar shrink-0 flex flex-col border-r border-vsc-border/30 overflow-hidden">
      {panel === 'explorer' && (
        <>
          <div className="px-4 py-2 text-[10px] font-semibold tracking-widest text-vsc-muted uppercase select-none shrink-0">
            Explorer
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 text-xs cursor-pointer select-none shrink-0">
            <span className="text-vsc-muted text-[10px]">▾</span>
            <span className="font-semibold text-vsc-muted tracking-wide text-[11px] uppercase">Portfolio</span>
          </div>

          <ul className="flex-1 overflow-y-auto panel-scroll py-1">
            {TABS.map((tab) => (
              <li
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`
                  flex items-center gap-2 pl-5 pr-3 py-[4px] cursor-pointer transition-colors relative
                  ${activeTab === tab.id
                    ? 'bg-vsc-selection text-vsc-text'
                    : 'text-[#cccccc] hover:bg-vsc-hover'}
                `}
              >
                {activeTab === tab.id && (
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-vsc-accent" />
                )}
                <span className="shrink-0">{FILE_ICON_MAP[tab.id]}</span>
                <span className="truncate text-[13px]">{tab.label}</span>
                {openTabs.includes(tab.id) && activeTab !== tab.id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-vsc-muted/50 shrink-0" />
                )}
              </li>
            ))}
          </ul>

          <BottomSection />
        </>
      )}

      {panel === 'search' && (
        <>
          <div className="px-4 py-2 text-[10px] font-semibold tracking-widest text-vsc-muted uppercase select-none shrink-0">
            Search
          </div>
          <div className="px-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search files..."
              autoFocus
              className="w-full bg-vsc-input border border-vsc-border text-vsc-text text-sm px-3 py-1.5 rounded outline-none focus:border-vsc-accent placeholder:text-vsc-muted"
            />
            {searchQuery && (
              <ul className="mt-2 space-y-0.5">
                {TABS.filter((t) =>
                  t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  t.id.toLowerCase().includes(searchQuery.toLowerCase()),
                ).map((tab) => (
                  <li
                    key={tab.id}
                    onClick={() => { onNavigate(tab.id); onSearchChange('') }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm text-vsc-muted hover:bg-vsc-hover hover:text-vsc-text transition-colors"
                  >
                    <span className="shrink-0">{FILE_ICON_MAP[tab.id]}</span>
                    <span>{tab.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex-1" />
          <BottomSection />
        </>
      )}

    </div>
  )
}

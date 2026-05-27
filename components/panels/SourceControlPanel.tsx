'use client'

import { useEffect, useState } from 'react'
import { PERSON } from '@/lib/profile'

const REPO = 'DwijeshD/personalwebsite'
const API  = `https://api.github.com/repos/${REPO}/commits?per_page=6`

const FALLBACK_COMMITS = [
  { hash: '2c9f21a', message: 'Add Monaco editor with file system',      time: '4m ago'  },
  { hash: 'd4030e0', message: 'Add VS Code layout and sidebar',           time: '21h ago' },
  { hash: '0ed2efb', message: 'Add AI copilot and file navigation',       time: '3d ago'  },
  { hash: '900f597', message: 'Configure gitignore and remove artifacts', time: '5d ago'  },
  { hash: '00ac652', message: 'Initial portfolio setup',                  time: '5d ago'  },
  { hash: 'e88e8ee', message: 'Install project dependencies',             time: '5d ago'  },
]

const STATS = [
  { count: 3, label: 'Modified', color: 'text-[#e2c08d]' },
  { count: 1, label: 'Added',    color: 'text-[#89d185]' },
  { count: 0, label: 'Deleted',  color: 'text-[#f14c4c]' },
]

interface Commit {
  hash: string
  message: string
  time: string
  url: string
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60_000)
  const h = Math.floor(diff / 3_600_000)
  const d = Math.floor(diff / 86_400_000)
  if (m < 60)  return `${m}m ago`
  if (h < 24)  return `${h}h ago`
  if (d < 30)  return `${d}d ago`
  return `${Math.floor(d / 30)}mo ago`
}

function GitBranchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-vsc-muted shrink-0">
      <path fillRule="evenodd" d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V7.5a2.5 2.5 0 0 1-2.5 2.5H9a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V9.5a1 1 0 0 0-1-1H4.5A2.5 2.5 0 0 1 2 6V4.372a2.25 2.25 0 1 1 1.5 0V6a1 1 0 0 0 1 1H5a2.5 2.5 0 0 1 2.5-2.5h.25v-.628A2.25 2.25 0 0 1 9.5 1.75zM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z"/>
    </svg>
  )
}

export default function SourceControlPanel() {
  const [commits, setCommits] = useState<Commit[]>(
    FALLBACK_COMMITS.map(c => ({ ...c, url: `https://github.com/${REPO}/commit/${c.hash}` }))
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchCommits() {
      try {
        const res = await fetch(API, {
          headers: { Accept: 'application/vnd.github+json' },
          next: { revalidate: 60 },
        } as RequestInit)

        if (!res.ok) return

        const data = await res.json()
        if (!Array.isArray(data) || cancelled) return

        const parsed: Commit[] = data.map((item: {
          sha: string
          commit: { message: string; author: { date: string } }
          html_url: string
        }) => ({
          hash:    item.sha.slice(0, 7),
          message: item.commit.message.split('\n')[0],
          time:    relativeTime(item.commit.author.date),
          url:     item.html_url,
        }))

        if (!cancelled) setCommits(parsed)
      } catch { /* keep fallback */ } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCommits()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="panel-fade-in h-full overflow-y-auto panel-scroll">
      <div className="flex">
        {/* Line numbers */}
        <div className="line-numbers pt-4 select-none flex flex-col text-right pr-3 min-w-[48px]">
          {Array.from({ length: 30 }, (_, i) => (
            <span key={i} className="leading-7">{i + 1}</span>
          ))}
        </div>

        <div className="flex-1 font-mono text-sm leading-7 px-4 py-4">
          {/* Header */}
          <div className="text-[10px] font-bold tracking-[0.2em] text-vsc-muted uppercase mb-5 select-none">
            Source Control
          </div>

          {/* Branch row */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-vsc-sidebar border border-vsc-border mb-4">
            <GitBranchIcon />
            <span className="text-vsc-text font-semibold">main</span>
            <span className="ml-auto flex items-center gap-1.5 text-[#89d185] text-xs">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.47 7.78a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L9 4.81v7.44a.75.75 0 0 1-1.5 0V4.81L4.53 7.78a.75.75 0 0 1-1.06 0z"/>
              </svg>
              {commits.length} commits
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-4 rounded-lg bg-vsc-sidebar border border-vsc-border">
                <span className={`text-2xl font-bold font-mono ${s.color}`}>{s.count}</span>
                <span className="text-[11px] text-vsc-muted mt-1 uppercase tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Commit history */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-bold tracking-[0.15em] text-vsc-muted uppercase select-none">
              Recent Commits
            </div>
            {loading && (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin text-vsc-muted/50">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10"/>
              </svg>
            )}
          </div>
          <div className="flex flex-col gap-px mb-6 rounded-lg overflow-hidden border border-vsc-border">
            {commits.map((c, i) => (
              <a
                key={c.hash}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-start gap-3 px-3 py-2.5 hover:bg-vsc-hover transition-colors group ${
                  i === 0 ? 'bg-[#1a2a1a]' : 'bg-vsc-sidebar'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="text-vsc-muted/50 group-hover:text-vsc-muted transition-colors">
                    <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-vsc-text/90 truncate leading-5 group-hover:text-vsc-text transition-colors">
                    {c.message}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <code className="text-[10px] text-[#569cd6] font-mono">{c.hash}</code>
                    <span className="text-[10px] text-vsc-muted/60">{c.time}</span>
                    {i === 0 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#89d185]/15 text-[#89d185] font-semibold uppercase tracking-wide">HEAD</span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* View on GitHub */}
          <a
            href={PERSON.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-vsc-accent hover:text-vsc-accent-hover transition-colors group"
          >
            <span>View on GitHub</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

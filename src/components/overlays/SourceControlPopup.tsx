'use client'

import { useEffect, useRef } from 'react'
import { PERSON } from '@/lib/profile'
import type { GitHubStats, GitHubWeek, GitHubActivity } from '@/hooks/useGitHubStats'

interface GitStatus {
  branch: string
  totalCommits: number
}

interface Props {
  onClose: () => void
  gitStatus: GitStatus | null
  ghStats: GitHubStats | null
}

function cellColor(count: number): string {
  if (count === 0) return '#2a2a2a'
  if (count <= 3)  return '#0e4429'
  if (count <= 6)  return '#006d32'
  if (count <= 9)  return '#26a641'
  return '#39d353'
}

function Heatmap({ weeks }: { weeks: GitHubWeek[] }) {
  const cols = weeks.slice(-22)
  const CELL = 8
  const GAP  = 2
  const step = CELL + GAP
  const DAY_ROWS = [1, 3, 5] as const
  const LABELS = ['M', 'W', 'F']

  return (
    <div className="flex gap-1.5 items-start">
      <div className="flex flex-col gap-[2px] mt-[1px] shrink-0">
        {LABELS.map(l => (
          <div key={l} style={{ height: CELL, fontSize: 8, lineHeight: `${CELL}px` }}
               className="text-vsc-muted/60 select-none w-[8px] text-center">{l}</div>
        ))}
      </div>
      <svg
        width={cols.length * step - GAP}
        height={DAY_ROWS.length * step - GAP}
        className="overflow-visible"
      >
        {cols.map((week, wi) =>
          DAY_ROWS.map((dayIdx, ri) => {
            const day = week.contributionDays[dayIdx]
            if (!day) return null
            return (
              <rect
                key={`${wi}-${ri}`}
                x={wi * step}
                y={ri * step}
                width={CELL}
                height={CELL}
                rx={2}
                fill={cellColor(day.contributionCount)}
              >
                <title>{day.date}: {day.contributionCount} contribution{day.contributionCount !== 1 ? 's' : ''}</title>
              </rect>
            )
          })
        )}
      </svg>
    </div>
  )
}

function RadarChart({ activity }: { activity: GitHubActivity }) {
  const CX = 46; const CY = 46; const R = 36

  const pts: [number, number][] = [
    [CX - (activity.commits  / 100) * R, CY],
    [CX,                                  CY - (activity.reviews / 100) * R],
    [CX + (activity.issues   / 100) * R, CY],
    [CX,                                  CY + (activity.prs     / 100) * R],
  ]
  const poly = pts.map(([x, y]) => `${x},${y}`).join(' ')

  return (
    <svg width={92} height={92} viewBox="0 0 92 92" className="shrink-0">
      {([0, 90, 180, 270] as const).map((deg, i) => {
        const rad = (deg - 90) * (Math.PI / 180)
        return <line key={i} x1={CX} y1={CY} x2={CX + Math.cos(rad) * R} y2={CY + Math.sin(rad) * R} stroke="#3c3c3c" strokeWidth={0.75} />
      })}
      {[R * 0.33, R * 0.66, R].map((r, i) => (
        <circle key={i} cx={CX} cy={CY} r={r} fill="none" stroke="#3c3c3c" strokeWidth={0.5} />
      ))}
      <polygon points={poly} fill="rgba(38,166,65,0.2)" stroke="#26a641" strokeWidth={1.5} />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill="#39d353" />)}
    </svg>
  )
}

export default function SourceControlPopup({ onClose, gitStatus, ghStats: gh }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const btn = document.getElementById('source-control-activity-btn')
      if (btn && btn.contains(e.target as Node)) return
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    function handleKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  const hasHeatmap = (gh?.weeks.length ?? 0) > 0

  return (
    <div ref={ref} className="absolute z-50 left-12 font-mono" style={{ top: '132px' }}>
      <div className="absolute -left-[6px] top-5 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-[#252526]" />

      <div className="w-80 bg-[#252526] border border-[#454545] rounded shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-[#454545] flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-[0.2em] text-vsc-muted uppercase">Source Control</span>
          <button onClick={onClose} className="text-vsc-muted hover:text-vsc-text transition-colors text-sm leading-none">×</button>
        </div>

        <div className="p-4 space-y-3">
          {/* Branch */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded bg-vsc-sidebar border border-vsc-border">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" className="text-vsc-muted shrink-0">
              <path fillRule="evenodd" d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V7.5a2.5 2.5 0 0 1-2.5 2.5H9a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V9.5a1 1 0 0 0-1-1H4.5A2.5 2.5 0 0 1 2 6V4.372a2.25 2.25 0 1 1 1.5 0V6a1 1 0 0 0 1 1H5a2.5 2.5 0 0 1 2.5-2.5h.25v-.628A2.25 2.25 0 0 1 9.5 1.75zM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z"/>
            </svg>
            <span className="text-vsc-text font-semibold text-sm">{gitStatus?.branch ?? '…'}</span>
          </div>

          {/* GitHub Activity header */}
          <div className="flex items-center gap-1.5 pt-1">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="text-vsc-muted shrink-0">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span className="text-[10px] font-bold tracking-[0.15em] text-vsc-muted uppercase">GitHub Activity</span>
          </div>

          {/* Stats row */}
          <div className="flex justify-between items-center px-1">
            {[
              { val: gh ? gh.commits.toLocaleString() : '—', label: 'commits' },
              { val: gh ? gh.repos : '—',                    label: 'repos' },
              { val: gh ? `${gh.streak}d` : '—',             label: gh?.streak && gh.streak >= 3 ? '🔥 streak' : 'streak' },
            ].map(({ val, label }, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="text-[15px] font-bold text-vsc-text tabular-nums leading-none">{val}</span>
                <span className="text-[9px] text-vsc-muted uppercase tracking-wide leading-none">{label}</span>
              </div>
            ))}
          </div>

          {/* Heatmap */}
          <div className="pt-0.5">
            {hasHeatmap ? (
              <Heatmap weeks={gh!.weeks} />
            ) : (
              <div className="h-[26px] rounded bg-vsc-border/10 animate-pulse" />
            )}
          </div>

          {/* Activity overview */}
          {gh?.activity && (
            <div className="pt-1 border-t border-[#3c3c3c]">
              <div className="text-[9px] text-vsc-muted uppercase tracking-[0.15em] mb-2">Activity overview</div>
              <div className="flex items-center justify-between">
                {/* Left labels (Commits / PRs) */}
                <div className="flex flex-col gap-3 text-right" style={{ width: 72 }}>
                  <div>
                    <div className="text-[11px] font-semibold text-[#39d353]">{gh.activity.commits}%</div>
                    <div className="text-[9px] text-vsc-muted">Commits</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-[#569cd6]">{gh.activity.prs}%</div>
                    <div className="text-[9px] text-vsc-muted">Pull requests</div>
                  </div>
                </div>

                {/* Radar */}
                <RadarChart activity={gh.activity} />

                {/* Right labels (Reviews / Issues) */}
                <div className="flex flex-col gap-3 text-left" style={{ width: 72 }}>
                  <div>
                    <div className="text-[11px] font-semibold text-[#4ec9b0]">{gh.activity.reviews}%</div>
                    <div className="text-[9px] text-vsc-muted">Code review</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-[#ce9178]">{gh.activity.issues}%</div>
                    <div className="text-[9px] text-vsc-muted">Issues</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GitHub profile link */}
          <a
            href={PERSON.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-vsc-accent hover:text-vsc-accent-hover transition-colors group pt-1"
          >
            <span>View GitHub Profile</span>
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

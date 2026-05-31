'use client'

import { useEffect, useState } from 'react'

interface Activity { commits: number; issues: number; prs: number; reviews: number }
interface ContribDay { date: string; contributionCount: number }
interface Week { contributionDays: ContribDay[] }

interface GitHubStats {
  weeks: Week[]
  total: number
  commits: number
  repos: number
  streak: number
  activity: Activity | null
}

function cellColor(count: number): string {
  if (count === 0) return '#2a2a2a'
  if (count <= 3)  return '#0e4429'
  if (count <= 6)  return '#006d32'
  if (count <= 9)  return '#26a641'
  return '#39d353'
}

// Mon / Wed / Fri rows only — rows 1, 3, 5 of each week (0 = Sun)
function Heatmap({ weeks }: { weeks: Week[] }) {
  const cols = weeks.slice(-17)
  const CELL = 7
  const GAP  = 2
  const step = CELL + GAP
  const DAY_ROWS = [1, 3, 5] as const
  const LABELS = ['M', 'W', 'F']

  return (
    <div className="flex gap-1 items-start">
      {/* Day labels */}
      <div className="flex flex-col gap-[2px] mt-[1px]">
        {LABELS.map(l => (
          <div key={l} style={{ height: CELL, fontSize: 7, lineHeight: `${CELL}px` }}
               className="text-vsc-muted select-none">{l}</div>
        ))}
      </div>
      {/* Grid */}
      <svg
        width={cols.length * step - GAP}
        height={DAY_ROWS.length * step - GAP}
        className="overflow-visible shrink-0"
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
                rx={1.5}
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

// Radar chart: Commits (left) · Code review (top) · Issues (right) · PRs (bottom)
function RadarChart({ activity }: { activity: Activity }) {
  const CX = 36
  const CY = 36
  const R  = 28

  const pts: [number, number][] = [
    [CX - (activity.commits  / 100) * R, CY],  // left
    [CX,                                  CY - (activity.reviews / 100) * R],  // top
    [CX + (activity.issues   / 100) * R, CY],  // right
    [CX,                                  CY + (activity.prs     / 100) * R],  // bottom
  ]
  const poly = pts.map(([x, y]) => `${x},${y}`).join(' ')

  return (
    <svg width={72} height={72} viewBox="0 0 72 72" className="shrink-0">
      {/* Axis lines */}
      {([0, 90, 180, 270] as const).map((deg, i) => {
        const rad = (deg - 90) * (Math.PI / 180)
        return (
          <line key={i}
            x1={CX} y1={CY}
            x2={CX + Math.cos(rad) * R} y2={CY + Math.sin(rad) * R}
            stroke="#3c3c3c" strokeWidth={0.75}
          />
        )
      })}
      {/* Grid rings at 33 / 66 / 100% */}
      {[R * 0.33, R * 0.66, R].map((r, i) => (
        <circle key={i} cx={CX} cy={CY} r={r} fill="none" stroke="#3c3c3c" strokeWidth={0.5} />
      ))}
      {/* Data polygon */}
      <polygon points={poly} fill="rgba(38,166,65,0.2)" stroke="#26a641" strokeWidth={1.5} />
      {/* Data dots */}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.5} fill="#39d353" />
      ))}
    </svg>
  )
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[13px] font-semibold text-vsc-text tabular-nums leading-none">{value}</span>
      <span className="text-[9px] text-vsc-muted uppercase tracking-wide mt-0.5 leading-none">{label}</span>
    </div>
  )
}

export function GitHubPanel() {
  const [data, setData] = useState<GitHubStats | null>(null)

  useEffect(() => {
    fetch('/api/github-stats')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  const hasHeatmap = (data?.weeks.length ?? 0) > 0

  return (
    <div className="px-3 py-2.5 space-y-2 select-none">
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" className="text-vsc-muted shrink-0">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        <span className="text-[10px] font-semibold tracking-widest text-vsc-muted uppercase">GitHub Activity</span>
      </div>

      {/* Stats row */}
      <div className="flex justify-between items-center px-1">
        <Stat value={data ? data.commits.toLocaleString() : '—'} label="commits" />
        <div className="w-px h-6 bg-vsc-border/30" />
        <Stat value={data ? data.repos : '—'} label="repos" />
        <div className="w-px h-6 bg-vsc-border/30" />
        <Stat
          value={data ? `${data.streak}d` : '—'}
          label={data?.streak && data.streak >= 3 ? '🔥 streak' : 'streak'}
        />
      </div>

      {/* Heatmap */}
      {hasHeatmap && (
        <div className="overflow-hidden">
          <Heatmap weeks={data!.weeks} />
        </div>
      )}
      {!hasHeatmap && data !== null && (
        <div className="h-[23px] rounded bg-vsc-border/10 animate-pulse" />
      )}
      {data === null && (
        <div className="h-[23px] rounded bg-vsc-border/10 animate-pulse" />
      )}

      {/* Activity radar */}
      {data?.activity && (
        <div className="pt-0.5">
          <div className="text-[9px] text-vsc-muted uppercase tracking-wide mb-1">Activity</div>
          <div className="flex items-center gap-1">
            {/* Left labels */}
            <div className="flex flex-col gap-1 text-right min-w-0 shrink-0" style={{ width: 52 }}>
              <span className="text-[9px] text-[#39d353] leading-none">{data.activity.commits}%</span>
              <span className="text-[9px] text-vsc-muted leading-none">commits</span>
              <div className="mt-2" />
              <span className="text-[9px] text-[#569cd6] leading-none">{data.activity.prs}%</span>
              <span className="text-[9px] text-vsc-muted leading-none">prs</span>
            </div>

            {/* Radar */}
            <RadarChart activity={data.activity} />

            {/* Right labels */}
            <div className="flex flex-col gap-1 text-left min-w-0 shrink-0" style={{ width: 50 }}>
              <span className="text-[9px] text-[#4ec9b0] leading-none">{data.activity.reviews}%</span>
              <span className="text-[9px] text-vsc-muted leading-none">reviews</span>
              <div className="mt-2" />
              <span className="text-[9px] text-[#ce9178] leading-none">{data.activity.issues}%</span>
              <span className="text-[9px] text-vsc-muted leading-none">issues</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

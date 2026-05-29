'use client'

import { useEffect, useState } from 'react'

export function GitStatus() {
  const [data, setData] = useState<{ branch: string; ahead: number; behind: number } | null>(null)

  useEffect(() => {
    fetch('/api/git-status')
      .then((r) => r.json())
      .then((d) => setData({ branch: d.branch ?? 'main', ahead: d.ahead ?? 0, behind: d.behind ?? 0 }))
      .catch(() => setData({ branch: 'main', ahead: 0, behind: 0 }))
  }, [])

  const branch = data?.branch ?? 'main'
  const ahead  = data?.ahead  ?? 0
  const behind = data?.behind ?? 0

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 text-[11px] text-vsc-muted select-none">
      <span className="flex items-center gap-1">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V7.5a2.5 2.5 0 0 1-2.5 2.5H9a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V9.5a1 1 0 0 0-1-1H4.5A2.5 2.5 0 0 1 2 6V4.372a2.25 2.25 0 1 1 1.5 0V6a1 1 0 0 0 1 1H5a2.5 2.5 0 0 1 2.5-2.5h.25v-.628A2.25 2.25 0 0 1 9.5 1.75zM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z"/>
        </svg>
        {branch}
      </span>
      {ahead > 0 && (
        <span className="flex items-center gap-0.5 text-[#89d185]">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.47 7.78a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L9 4.81v7.44a.75.75 0 0 1-1.5 0V4.81L4.53 7.78a.75.75 0 0 1-1.06 0z"/>
          </svg>
          {ahead}
        </span>
      )}
      {behind > 0 && (
        <span className="flex items-center gap-0.5 text-[#f14c4c]">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <path d="M12.53 8.22a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L2.97 9.28a.75.75 0 0 1 1.06-1.06L7 11.19V3.75a.75.75 0 0 1 1.5 0v7.44l2.97-2.97a.75.75 0 0 1 1.06 0z"/>
          </svg>
          {behind}
        </span>
      )}
    </div>
  )
}

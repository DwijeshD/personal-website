'use client'

import { startTransition, useEffect, useState } from 'react'

export interface GitStatus {
  branch:       string
  totalCommits: number
}

export function useGitStatus(): GitStatus | null {
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null)

  useEffect(() => {
    fetch('/api/git-status')
      .then(r => r.json())
      .then(d => startTransition(() => setGitStatus({ branch: d.branch, totalCommits: d.totalCommits })))
      .catch(() => {})
  }, [])

  return gitStatus
}

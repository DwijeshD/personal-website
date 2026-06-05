'use client'

import { startTransition, useEffect, useState } from 'react'

export interface GitHubActivity { commits: number; issues: number; prs: number; reviews: number }
export interface GitHubContribDay { date: string; contributionCount: number }
export interface GitHubWeek { contributionDays: GitHubContribDay[] }
export interface GitHubLanguage { name: string; color: string; pct: number }

export interface GitHubStats {
  weeks:     GitHubWeek[]
  total:     number
  commits:   number
  repos:     number
  streak:    number
  languages: GitHubLanguage[]
  activity:  GitHubActivity | null
}

export function useGitHubStats(): GitHubStats | null {
  const [stats, setStats] = useState<GitHubStats | null>(null)

  useEffect(() => {
    fetch('/api/github-stats')
      .then(r => r.json())
      .then(data => startTransition(() => setStats(data)))
      .catch(() => {})
  }, [])

  return stats
}

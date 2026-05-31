'use client'

import { useEffect, useState } from 'react'

export interface GitHubActivity { commits: number; issues: number; prs: number; reviews: number }
export interface GitHubContribDay { date: string; contributionCount: number }
export interface GitHubWeek { contributionDays: GitHubContribDay[] }

export interface GitHubStats {
  weeks:    GitHubWeek[]
  total:    number
  commits:  number
  repos:    number
  streak:   number
  activity: GitHubActivity | null
}

export function useGitHubStats(): GitHubStats | null {
  const [stats, setStats] = useState<GitHubStats | null>(null)

  useEffect(() => {
    fetch('/api/github-stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  return stats
}

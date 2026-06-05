import { NextResponse } from 'next/server'

const OWNER = 'DwijeshD'

export const revalidate = 3600

const QUERY = `
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
    }
    repositories(privacy: PUBLIC, ownerAffiliations: OWNER) {
      totalCount
    }
    topRepos: repositories(first: 20, privacy: PUBLIC, ownerAffiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC}) {
      nodes {
        languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node { name color }
          }
        }
      }
    }
  }
}
`

type ContribDay = { date: string; contributionCount: number }
type Week = { contributionDays: ContribDay[] }
type LangEdge = { size: number; node: { name: string; color: string | null } }

function calcStreak(weeks: Week[]): number {
  const today = new Date().toISOString().split('T')[0]
  const days = weeks.flatMap(w => w.contributionDays).filter(d => d.date <= today).reverse()
  let streak = 0
  for (const day of days) {
    if (day.contributionCount > 0) {
      streak++
    } else {
      if (day.date === today) continue  // no commits yet today — don't break streak
      break
    }
  }
  return streak
}

export async function GET() {
  const token = process.env.GITHUB_ISSUES_TOKEN
  if (!token) {
    return NextResponse.json({ weeks: [], total: 0, commits: 0, repos: 0, streak: 0, languages: [], activity: null })
  }

  const now = new Date()
  const from = new Date(now.getFullYear(), 0, 1).toISOString()
  const to = now.toISOString()

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: QUERY, variables: { login: OWNER, from, to } }),
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`)

    const json = await res.json()
    if (json.errors) throw new Error(json.errors[0]?.message ?? 'GraphQL error')

    const user = json.data?.user
    if (!user) throw new Error('No user data')

    const col = user.contributionsCollection
    const weeks: Week[] = col.contributionCalendar.weeks

    const commits  = col.totalCommitContributions
    const issues   = col.totalIssueContributions
    const prs      = col.totalPullRequestContributions
    const reviews  = col.totalPullRequestReviewContributions
    const actTotal = commits + issues + prs + reviews

    // Aggregate language bytes across 20 most-recently-pushed repos
    const langMap: Record<string, { bytes: number; color: string }> = {}
    for (const repo of user.topRepos?.nodes ?? []) {
      for (const edge of (repo.languages?.edges ?? []) as LangEdge[]) {
        const { name, color } = edge.node
        if (!langMap[name]) langMap[name] = { bytes: 0, color: color ?? '#888' }
        langMap[name].bytes += edge.size
      }
    }
    const totalBytes = Object.values(langMap).reduce((s, v) => s + v.bytes, 0)
    const languages = totalBytes > 0
      ? Object.entries(langMap)
          .sort((a, b) => b[1].bytes - a[1].bytes)
          .slice(0, 6)
          .map(([name, { bytes, color }]) => ({ name, color, pct: Math.round(bytes / totalBytes * 100) }))
      : []

    return NextResponse.json({
      weeks,
      total:  col.contributionCalendar.totalContributions,
      commits,
      repos:  user.repositories.totalCount,
      streak: calcStreak(weeks),
      languages,
      activity: actTotal > 0 ? {
        commits: Math.round(commits  / actTotal * 100),
        issues:  Math.round(issues   / actTotal * 100),
        prs:     Math.round(prs      / actTotal * 100),
        reviews: Math.round(reviews  / actTotal * 100),
      } : null,
    })
  } catch (err) {
    console.error('[github-stats]', err)
    return NextResponse.json({ weeks: [], total: 0, commits: 0, repos: 0, streak: 0, languages: [], activity: null })
  }
}

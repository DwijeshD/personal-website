import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

const OWNER = 'DwijeshD'
const REPO  = 'personalwebsite'

function getLocalGitStatus(): { branch: string; ahead: number; behind: number; localCommits: number } {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()
    const counts = execSync('git rev-list --left-right --count HEAD...@{u}', { encoding: 'utf8' }).trim()
    const [ahead, behind] = counts.split('\t').map(Number)
    const localCommits = parseInt(execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim(), 10)
    return { branch, ahead: ahead ?? 0, behind: behind ?? 0, localCommits }
  } catch {
    return { branch: process.env.VERCEL_GIT_COMMIT_REF ?? process.env.GIT_BRANCH ?? 'main', ahead: 0, behind: 0, localCommits: 0 }
  }
}

export async function GET() {
  const { branch, ahead, behind, localCommits } = getLocalGitStatus()

  try {
    const token = process.env.GITHUB_ISSUES_TOKEN
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        next: { revalidate: 300 },
      }
    )

    if (!res.ok) return NextResponse.json({ branch, ahead, behind, totalCommits: localCommits })

    const link = res.headers.get('link') ?? ''
    const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/)
    const totalCommits = match ? parseInt(match[1], 10) : 1

    return NextResponse.json({ branch, ahead, behind, totalCommits })
  } catch {
    return NextResponse.json({ branch, ahead, behind, totalCommits: localCommits })
  }
}

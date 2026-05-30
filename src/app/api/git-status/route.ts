import { NextResponse } from 'next/server'

const OWNER = 'DwijeshD'
const REPO  = 'personalwebsite'

export const revalidate = 300

export async function GET() {
  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? process.env.GIT_BRANCH ?? 'main'

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

    if (!res.ok) return NextResponse.json({ branch, ahead: 0, behind: 0, totalCommits: 0 })

    const link = res.headers.get('link') ?? ''
    const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/)
    const totalCommits = match ? parseInt(match[1], 10) : 1

    return NextResponse.json({ branch, ahead: 0, behind: 0, totalCommits })
  } catch {
    return NextResponse.json({ branch, ahead: 0, behind: 0, totalCommits: 0 })
  }
}

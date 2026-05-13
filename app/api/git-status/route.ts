import { execFile } from 'child_process'
import { promisify } from 'util'
import { NextResponse } from 'next/server'

const run = promisify(execFile)
const CWD = process.cwd()

async function git(...args: string[]): Promise<string> {
  const { stdout } = await run('git', args, { cwd: CWD })
  return stdout.trim()
}

export async function GET() {
  try {
    const [branch, commitCountRaw] = await Promise.all([
      git('branch', '--show-current'),
      git('rev-list', '--count', 'HEAD'),
    ])

    const totalCommits = parseInt(commitCountRaw, 10)

    return NextResponse.json({ branch, totalCommits })
  } catch {
    return NextResponse.json({ error: 'git unavailable' }, { status: 500 })
  }
}

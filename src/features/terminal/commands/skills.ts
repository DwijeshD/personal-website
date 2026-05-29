import type { CommandContext, CommandResult, TerminalLine } from '../types'
import { SKILLS } from '@/lib/profile'

export default function handler(_args: string, _ctx: CommandContext): CommandResult {
  const o = (t: string): TerminalLine => ({ type: 'output', text: t })
  const i = (t: string): TerminalLine => ({ type: 'info', text: t })
  const lines: TerminalLine[] = [o('')]
  for (const [cat, vals] of Object.entries(SKILLS)) {
    lines.push(i(`  ${cat}`))
    lines.push(o(`    ${(vals as string[]).join('  ·  ')}`))
  }
  lines.push(o(''))
  return { lines }
}

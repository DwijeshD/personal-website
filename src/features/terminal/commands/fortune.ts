import type { CommandContext, CommandResult, TerminalLine } from '../types'
import { FORTUNES } from '../content'

export default function handler(_args: string, _ctx: CommandContext): CommandResult {
  const o = (t: string): TerminalLine => ({ type: 'output', text: t })
  const i = (t: string): TerminalLine => ({ type: 'info', text: t })
  const quote = FORTUNES[Math.floor(Math.random() * FORTUNES.length)]
  return { lines: [o(''), i(`  ${quote}`), o('')] }
}

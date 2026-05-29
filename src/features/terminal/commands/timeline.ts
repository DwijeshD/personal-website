import type { CommandContext, CommandResult, TerminalLine } from '../types'
import { TIMELINE_LINES } from '../content'

export default function handler(_args: string, _ctx: CommandContext): CommandResult {
  return {
    lines: TIMELINE_LINES.map(l =>
      (l.includes('──') || l.includes('Now'))
        ? ({ type: 'info', text: l } as TerminalLine)
        : ({ type: 'output', text: l } as TerminalLine)
    ),
  }
}

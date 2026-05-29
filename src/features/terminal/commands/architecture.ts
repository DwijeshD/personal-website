import type { CommandContext, CommandResult, TerminalLine } from '../types'
import { ARCHITECTURE_LINES } from '../content'

export default function handler(_args: string, _ctx: CommandContext): CommandResult {
  return {
    lines: ARCHITECTURE_LINES.map(l =>
      /[┌┐└┘├┤┬┴┼─│]/.test(l)
        ? ({ type: 'info', text: l } as TerminalLine)
        : ({ type: 'output', text: l } as TerminalLine)
    ),
  }
}

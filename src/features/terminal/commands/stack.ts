import type { CommandContext, CommandResult, TerminalLine } from '../types'
import { STACK_LINES } from '../content'

export default function handler(_args: string, _ctx: CommandContext): CommandResult {
  return {
    lines: STACK_LINES.map(t => ({ type: 'output', text: t } as TerminalLine)),
  }
}

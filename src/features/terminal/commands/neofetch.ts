import type { CommandContext, CommandResult, TerminalLine } from '../types'
import { NEOFETCH } from '../content'

export default function handler(_args: string, _ctx: CommandContext): CommandResult {
  return {
    lines: NEOFETCH.split('\n').map(t => ({ type: 'info', text: t } as TerminalLine)),
  }
}

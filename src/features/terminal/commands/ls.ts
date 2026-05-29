import type { CommandContext, CommandResult, TerminalLine } from '../types'
import { TABS } from '@/lib/tabs'

export default function handler(_args: string, _ctx: CommandContext): CommandResult {
  const o = (t: string): TerminalLine => ({ type: 'output', text: t })
  const i = (t: string): TerminalLine => ({ type: 'info', text: t })
  return {
    lines: [
      o(''),
      o('  ' + TABS.map(t => t.label).join('   ')),
      o(''),
      i(`  ${TABS.length} files`),
      o(''),
    ],
  }
}

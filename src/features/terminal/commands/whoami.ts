import type { CommandContext, CommandResult, TerminalLine } from '../types'
import { PERSON, ABOUT } from '@/lib/profile'

export default function handler(_args: string, _ctx: CommandContext): CommandResult {
  const o = (t: string): TerminalLine => ({ type: 'output', text: t })
  const i = (t: string): TerminalLine => ({ type: 'info', text: t })
  const s = (t: string): TerminalLine => ({ type: 'success', text: t })
  return {
    lines: [
      o(''),
      s(`  ${PERSON.name}`),
      i(`  ${PERSON.headline}`),
      o(''),
      ...ABOUT.split('\n').map(l => o('  ' + l)),
      o(''),
      o(`  github    ${PERSON.github}`),
      o(`  email     ${PERSON.email}`),
      o(`  status    ${PERSON.available ? '● open to opportunities' : '○ not available'}`),
      o(''),
    ],
  }
}

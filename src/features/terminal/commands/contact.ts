import type { CommandContext, CommandResult, TerminalLine } from '../types'
import { PERSON } from '@/lib/profile'

export default function handler(_args: string, _ctx: CommandContext): CommandResult {
  const o = (t: string): TerminalLine => ({ type: 'output', text: t })
  return {
    lines: [
      o(''),
      o(`  github    ${PERSON.github}`),
      o(`  linkedin  ${PERSON.linkedin}`),
      o(`  email     ${PERSON.email}`),
      o(''),
    ],
  }
}

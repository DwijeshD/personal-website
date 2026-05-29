import type { CommandContext, CommandResult, TerminalLine } from '../types'
import { PERSON } from '@/lib/profile'

export default function handler(args: string, _ctx: CommandContext): CommandResult {
  const o = (t: string): TerminalLine => ({ type: 'output', text: t })
  const e = (t: string): TerminalLine => ({ type: 'error', text: t })
  const i = (t: string): TerminalLine => ({ type: 'info', text: t })

  const jokes = [
    'is not in the sudoers file. This incident will be reported.',
    'command not found (and neither is your permission).',
    'Error: universe.exe has insufficient permissions.',
    'Segmentation fault (core dumped).',
    'nice try.',
  ]

  if (args === 'make me a sandwich') return { lines: [o('  Okay.')] }
  return {
    lines: [
      i(`  [sudo] password for ${PERSON.name.split(' ')[0].toLowerCase()}:`),
      e(`  ${PERSON.name.split(' ')[0]} ${jokes[Math.floor(Math.random() * jokes.length)]}`),
    ],
  }
}

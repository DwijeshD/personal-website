import type { CommandContext, CommandResult, TerminalLine } from '../types'
import { PROJECTS } from '@/lib/profile'

export default function handler(args: string, _ctx: CommandContext): CommandResult {
  const o = (t: string): TerminalLine => ({ type: 'output', text: t })
  const e = (t: string): TerminalLine => ({ type: 'error', text: t })
  const i = (t: string): TerminalLine => ({ type: 'info', text: t })
  const s = (t: string): TerminalLine => ({ type: 'success', text: t })

  const parts = args.trim().split(/\s+/)
  const sub = parts[0]?.toLowerCase()
  const projName = parts.slice(1).join(' ')

  if (sub === 'open' && projName) {
    const proj = PROJECTS.find(p =>
      p.id === projName || p.name.toLowerCase().includes(projName.toLowerCase())
    )
    if (!proj) return { lines: [e(`projects: "${projName}" not found`)] }
    return {
      lines: [
        o(''),
        s(`  ${proj.name}`),
        i(`  ${proj.subtitle}`),
        o(''),
        ...proj.description.split('. ').filter(Boolean).map(l => o(`  ${l.trim()}.`)),
        o(''),
        o(`  Tags: ${proj.tags.join(' · ')}`),
        o(''),
      ],
    }
  }

  return {
    lines: [
      o(''),
      ...PROJECTS.flatMap(p => [
        s(`  ${p.name}`),
        i(`    ${p.subtitle}  —  ${p.tags.join(', ')}`),
        o(''),
      ]),
      i('  tip: projects open <name> for full details'),
      o(''),
    ],
  }
}

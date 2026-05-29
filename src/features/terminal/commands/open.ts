import type { CommandContext, CommandResult, TerminalLine } from '../types'
import { TABS } from '@/lib/tabs'

export default function handler(args: string, ctx: CommandContext): CommandResult {
  const e = (t: string): TerminalLine => ({ type: 'error', text: t })
  const i = (t: string): TerminalLine => ({ type: 'info', text: t })

  if (!args) return { lines: [e('open: missing filename')] }
  const tab = TABS.find(t =>
    t.label.toLowerCase() === args.toLowerCase() ||
    t.id.toLowerCase() === args.toLowerCase()
  )
  if (!tab) return { lines: [e(`open: ${args}: No such file`)] }
  ctx.onNavigate(tab.id)
  return { lines: [i(`Opening ${tab.label}...`)] }
}

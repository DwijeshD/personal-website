import type { CommandContext, CommandResult, TerminalLine } from '../types'

const THEMES: Record<string, string> = {
  'default':        'VS Code Dark+',
  'dracula':        'Dracula',
  'night-owl':      'Night Owl',
  'one-dark':       'One Dark Pro',
  'monokai':        'Monokai',
  'solarized-dark': 'Solarized Dark',
}


export default function handler(args: string, ctx: CommandContext): CommandResult {
  const o = (t: string): TerminalLine => ({ type: 'output', text: t })
  const e = (t: string): TerminalLine => ({ type: 'error', text: t })
  const i = (t: string): TerminalLine => ({ type: 'info', text: t })
  const s = (t: string): TerminalLine => ({ type: 'success', text: t })

  if (!args) {
    return {
      lines: [
        o(''),
        i('  Available themes:'),
        ...Object.entries(THEMES).map(([id, label]) => o(`    ${id.padEnd(16)} ${label}`)),
        o(''),
        i('  Usage: theme <id>'),
        o(''),
      ],
    }
  }

  const id = args.toLowerCase().replace(/\s+/g, '-')
  if (!THEMES[id]) return { lines: [e(`theme: "${args}" not found — run "theme" to list`)] }
  ctx.setTheme(id)
  return { lines: [s(`  Theme applied: ${THEMES[id]}`)] }
}

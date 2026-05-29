import type { CommandContext, CommandResult, TerminalLine } from '../types'
import help from './help'
import ls from './ls'
import open from './open'
import whoami from './whoami'
import skills from './skills'
import projects from './projects'
import timeline from './timeline'
import contact from './contact'
import architecture from './architecture'
import stack from './stack'
import neofetch from './neofetch'
import fortune from './fortune'
import theme from './theme'
import sudo from './sudo'

export type { CommandContext, CommandResult }

type Handler = (args: string, ctx: CommandContext) => CommandResult

const e = (text: string): TerminalLine => ({ text, type: 'error' })

const registry: Record<string, Handler> = {
  help, ls, open, cat: open, whoami, skills, projects, timeline,
  contact, architecture, stack, neofetch, fortune, theme, sudo,
  clear: () => ({ lines: [], clear: true }),
  '': () => ({ lines: [] }),
}

export function dispatch(cmd: string, ctx: CommandContext): CommandResult {
  const parts = cmd.trim().split(/\s+/)
  const name = parts[0].toLowerCase()
  const args = parts.slice(1).join(' ')
  const handler = registry[name]
  if (!handler) return { lines: [e(`bash: ${name}: command not found  —  type 'help' for commands`)] }
  return handler(args, ctx)
}

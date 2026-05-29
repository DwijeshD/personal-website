import type { CommandContext, CommandResult, TerminalLine } from '../types'

export default function handler(_args: string, _ctx: CommandContext): CommandResult {
  const h = (t: string): TerminalLine => ({ type: 'info', text: t })
  const o = (t: string): TerminalLine => ({ type: 'output', text: t })
  return {
    lines: [
      h(''),
      h('  PORTFOLIO'),
      o('  whoami          personal intro'),
      o('  skills          technical skills by category'),
      o('  projects        project list  |  projects open <name>'),
      o('  timeline        career & education timeline'),
      o('  contact         GitHub · LinkedIn · email'),
      h(''),
      h('  SYSTEM'),
      o('  ls              list workspace files'),
      o('  open <file>     open file in editor'),
      o('  cat <file>      alias for open'),
      o('  architecture    system architecture diagram'),
      o('  stack           technology stack'),
      o('  logs            live app log stream'),
      o('  deploy          simulate CI/CD pipeline'),
      o('  monitor         live system metrics'),
      o('  theme [name]    list or apply a color theme'),
      o('  clear           clear terminal'),
      h(''),
      h('  EXTRAS'),
      o('  neofetch        system info card'),
      o('  fortune         random dev wisdom'),
      o('  sudo            nice try'),
      o('  donut           3D ASCII rotating donut'),
      o('  dino            chrome dinosaur game'),
      o('  matrix          enter the matrix'),
      h(''),
    ],
  }
}

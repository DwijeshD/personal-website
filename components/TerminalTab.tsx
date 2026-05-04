'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { PERSON, PROJECTS, SKILLS, TABS } from '@/lib/data'

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'info'
  text: string
}

export interface TerminalHandle {
  clear: () => void
  runCommand: (cmd: string) => void
  getLastCommand: () => string | null
}

interface Props {
  onNavigate: (id: string) => void
  onLastCommandChange: (cmd: string | null) => void
}

const PROMPT = 'dwijesh@portfolio:~$'

const EDUCATION_SHORT = 'BSc CS, First Class Honours'

const NEOFETCH = `
         .          ${PERSON.name}
        .o.         ─────────────────────────────────
       .ooo.        OS: Portfolio OS 1.0.0
      .ooooo.       Host: dwijesh.dev
     .oooooooo.     Shell: Next.js 15
    .oooooooooo.    Terminal: VS Code Portfolio
   .oooooooooooo.
  .oooooooooooooo.  Education: ${EDUCATION_SHORT}
                    Role: Backend Engineer · AI/ML
                    GitHub: github.com/DwijeshD
`

function buildHelpText() {
  return [
    '  ls              list portfolio files',
    '  open <file>     open a portfolio file',
    '  cat <file>      alias for open',
    '  whoami          about Dwijesh',
    '  skills          list skills',
    '  projects        list projects',
    '  contact         show contact info',
    '  neofetch        system info',
    '  clear           clear terminal',
    '  help            show this message',
  ]
}

function runCmd(
  cmd: string,
  onNavigate: (id: string) => void,
): { lines: TerminalLine[]; clear?: boolean } {
  const parts = cmd.trim().split(/\s+/)
  const name  = parts[0].toLowerCase()
  const arg   = parts.slice(1).join(' ')

  switch (name) {
    case 'help':
      return {
        lines: [
          { type: 'info', text: 'Available commands:' },
          ...buildHelpText().map((t) => ({ type: 'output' as const, text: t })),
        ],
      }

    case 'ls': {
      const files = TABS.map((t) => t.label)
      return {
        lines: [
          { type: 'output', text: files.join('   ') },
        ],
      }
    }

    case 'cat':
    case 'open': {
      if (!arg) return { lines: [{ type: 'error', text: `${name}: missing filename` }] }
      const tab = TABS.find(
        (t) =>
          t.label.toLowerCase() === arg.toLowerCase() ||
          t.id.toLowerCase() === arg.toLowerCase(),
      )
      if (!tab) return { lines: [{ type: 'error', text: `${name}: ${arg}: No such file` }] }
      onNavigate(tab.id)
      return { lines: [{ type: 'info', text: `Opening ${tab.label}...` }] }
    }

    case 'whoami':
      return {
        lines: [
          { type: 'output', text: `Name:       ${PERSON.name}` },
          { type: 'output', text: `Role:       ${PERSON.headline}` },
          { type: 'output', text: `Education:  BSc CS, First Class Honours — University of Southampton` },
          { type: 'output', text: `GitHub:     ${PERSON.github}` },
          { type: 'output', text: `Email:      ${PERSON.email}` },
          { type: 'output', text: `Available:  yes — open to opportunities` },
        ],
      }

    case 'skills': {
      const entries = Object.entries(SKILLS)
      return {
        lines: entries.map(([k, v]) => ({
          type: 'output' as const,
          text: `  ${k.padEnd(12)} ${v.join(', ')}`,
        })),
      }
    }

    case 'projects':
      return {
        lines: PROJECTS.map((p) => ({
          type: 'output' as const,
          text: `  ${p.name}  —  ${p.tags.join(', ')}`,
        })),
      }

    case 'contact':
      return {
        lines: [
          { type: 'output', text: `GitHub:   ${PERSON.github}` },
          { type: 'output', text: `LinkedIn: ${PERSON.linkedin}` },
          { type: 'output', text: `Email:    ${PERSON.email}` },
        ],
      }

    case 'neofetch':
      return {
        lines: NEOFETCH.split('\n').map((t) => ({ type: 'info' as const, text: t })),
      }

    case 'clear':
      return { lines: [], clear: true }

    case '':
      return { lines: [] }

    default:
      return {
        lines: [
          { type: 'error', text: `bash: ${name}: command not found. Type 'help' for available commands.` },
        ],
      }
  }
}

const TerminalTab = forwardRef<TerminalHandle, Props>(({ onNavigate, onLastCommandChange }, ref) => {
  const [lines, setLines]     = useState<TerminalLine[]>([
    { type: 'info', text: `Welcome to Dwijesh's portfolio terminal. Type 'help' for commands.` },
    { type: 'output', text: '' },
  ])
  const [input, setInput]     = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const bottomRef             = useRef<HTMLDivElement>(null)
  const inputRef              = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  useImperativeHandle(ref, () => ({
    clear: () => setLines([]),
    runCommand: (cmd: string) => execute(cmd),
    getLastCommand: () => history[0] ?? null,
  }))

  function execute(cmd: string) {
    const trimmed = cmd.trim()
    const inputLine: TerminalLine = { type: 'input', text: `${PROMPT} ${trimmed}` }
    const { lines: newLines, clear } = runCmd(trimmed, onNavigate)

    if (clear) {
      setLines([])
    } else {
      setLines((prev) => [...prev, inputLine, ...newLines])
    }

    if (trimmed) {
      setHistory((h) => [trimmed, ...h.slice(0, 49)])
      onLastCommandChange(trimmed)
    }
    setHistIdx(-1)
  }

  function submit() {
    execute(input)
    setInput('')
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      submit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(next)
      setInput(history[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = histIdx - 1
      if (next < 0) { setHistIdx(-1); setInput('') }
      else { setHistIdx(next); setInput(history[next]) }
    }
  }

  return (
    <div
      className="flex flex-col h-full bg-vsc-bg font-mono text-sm cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto panel-scroll px-4 py-2 space-y-0.5">
        {lines.map((l, i) => (
          <div
            key={i}
            className={`
              leading-5 whitespace-pre-wrap break-all
              ${l.type === 'input'  ? 'text-vsc-fn' : ''}
              ${l.type === 'output' ? 'text-vsc-text/90' : ''}
              ${l.type === 'error'  ? 'text-vsc-red' : ''}
              ${l.type === 'info'   ? 'text-vsc-comment' : ''}
            `}
          >
            {l.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input line */}
      <div className="shrink-0 flex items-center px-4 py-1.5 border-t border-vsc-border/30">
        <span className="text-vsc-fn mr-2 shrink-0 select-none">{PROMPT}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          className="flex-1 bg-transparent text-vsc-text outline-none caret-vsc-text"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
    </div>
  )
})

TerminalTab.displayName = 'TerminalTab'
export default TerminalTab

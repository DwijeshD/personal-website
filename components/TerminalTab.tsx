'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { PERSON, ABOUT, PROJECTS, SKILLS } from '@/lib/profile'
import { TABS } from '@/lib/tabs'

// ── Matrix columns (stable, generated once) ───────────────────────────────────
const MATRIX_COLS = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  chars: Array.from({ length: 50 }, () => Math.random() > 0.5 ? '1' : '0').join('\n'),
  left: `${(i / 36) * 100}%`,
  dur: `${4 + (i * 1.3) % 6}s`,
  delay: `-${(i * 0.9) % 7}s`,
  opacity: 0.5 + (i % 4) * 0.12,
}))

// ── Donut algorithm ───────────────────────────────────────────────────────────
function computeDonutFrame(A: number, B: number): string {
  const W = 80, H = 22
  const z = new Float32Array(W * H)
  const b = new Array<string>(W * H).fill(' ')
  const chars = '.,-~:;=!*#$@'
  const sinA = Math.sin(A), cosA = Math.cos(A), sinB = Math.sin(B), cosB = Math.cos(B)
  for (let j = 0; j < Math.PI * 2; j += 0.07) {
    const sinJ = Math.sin(j), cosJ = Math.cos(j)
    for (let i = 0; i < Math.PI * 2; i += 0.02) {
      const sinI = Math.sin(i), cosI = Math.cos(i)
      const h = cosJ + 2, D = 1 / (sinI * h * sinA + sinJ * cosA + 5)
      const t = sinI * h * cosA - sinJ * sinA
      const x = Math.floor(40 + 30 * D * (cosI * h * cosB - t * sinB))
      const y = Math.floor(11 + 15 * D * (cosI * h * sinB + t * cosB))
      const o = x + W * y
      const N = Math.floor(8 * ((sinJ * sinA - sinI * cosJ * cosA) * cosB - sinI * cosJ * sinA - sinJ * cosA - cosI * cosJ * sinB))
      if (y >= 0 && y < H && x >= 0 && x < W && D > z[o]) { z[o] = D; b[o] = chars[Math.max(0, N) % chars.length] }
    }
  }
  const rows: string[] = []
  for (let k = 0; k < H; k++) rows.push(b.slice(k * W, (k + 1) * W).join(''))
  return rows.join('\n')
}

// ── Constants ─────────────────────────────────────────────────────────────────
const THEMES: Record<string, string> = {
  'default':        'VS Code Dark+',
  'dracula':        'Dracula',
  'night-owl':      'Night Owl',
  'one-dark':       'One Dark Pro',
  'monokai':        'Monokai',
  'solarized-dark': 'Solarized Dark',
}

const FORTUNES = [
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"Any fool can write code a computer understands. Good programmers write code humans can understand." — Fowler',
  '"Debugging is twice as hard as writing the code in the first place." — Kernighan',
  '"Make it work, make it right, make it fast." — Kent Beck',
  '"The best code is no code at all." — Jeff Atwood',
  '"Talk is cheap. Show me the code." — Linus Torvalds',
  '"Perfection is achieved not when there is nothing to add, but when there is nothing to take away." — Saint-Exupéry',
  'You are now manually breathing.',
  'Have you tried turning it off and on again?',
  'It works on my machine. Ship the machine.',
  'git blame yourself',
  'The bug is always in the last place you look. Because once you find it, you stop looking.',
  'There is no cloud. Just someone else\'s computer.',
  'Tabs > Spaces. (I said what I said.)',
  'import antigravity',
  '99 little bugs in the code. Take one down, patch it around. 127 little bugs in the code.',
  '"If debugging is the process of removing bugs, then programming must be the process of putting them in." — Dijkstra',
]

const NEOFETCH = `
         .          ${PERSON.name}
        .o.         ─────────────────────────────────
       .ooo.        OS: Portfolio OS 1.0.0
      .ooooo.       Host: dwijesh.dev
     .oooooooo.     Shell: Next.js 15
    .oooooooooo.    Terminal: VS Code Portfolio
   .oooooooooooo.
  .oooooooooooooo.  Education: BSc CS, First Class Honours
                    Role: Backend Engineer · AI/ML
                    GitHub: github.com/DwijeshD
`

const TIMELINE_LINES = [
  '',
  '  2021 ──  University of Southampton',
  '           BSc Computer Science',
  '           Algorithms · Systems · Software Engineering',
  '',
  '  2022 ──  Deeper into CS',
  '           Data structures, networks, compilers',
  '           First real Python projects',
  '',
  '  2023 ──  Machine Learning focus',
  '           Signal processing, PyTorch pipelines',
  '           Started dissertation research',
  '',
  '  2024 ──  Dissertation: rPPG Heart Rate (82%)',
  '           Deep learning + video-based physiology',
  '           ↓',
  '           First Class Honours',
  '           ↓',
  '           Nusmark — Backend Engineer',
  '           Calendar sync · OAuth2 · Webhooks · Firestore',
  '',
  '  2025 ──  AI Tooling & Systems',
  '           OpenRouter, streaming, Monaco editor',
  '           Built this portfolio',
  '',
  '  Now  ──  Open to new opportunities',
  '',
]

const ARCHITECTURE_LINES = [
  '',
  '  ┌───────────────────────────────────────────────┐',
  '  │           dwijesh.dev — Architecture          │',
  '  ├──────────────────────────┬────────────────────┤',
  '  │  BROWSER                 │  API ROUTES         │',
  '  │  ┌──────────────────┐    │  /api/chat          │',
  '  │  │  VSCodeLayout    │    │    → OpenRouter SSE │',
  '  │  │  AB · Side · Ed  │    │  /api/ai-action     │',
  '  │  │  Copilot · Term  │    │    → File CRUD      │',
  '  │  └──────────────────┘    │  /api/git-status    │',
  '  │  Renderers:              │    → GitHub API     │',
  '  │  Monaco · MD · HTML · JS │                     │',
  '  │                          │  INFRA              │',
  '  │                          │  Next.js 15 (Edge)  │',
  '  │                          │  Vercel · dwijesh.dev│',
  '  └──────────────────────────┴────────────────────┘',
  '',
]

const STACK_LINES = [
  '',
  '  Framework   Next.js 15 (App Router) + React 19',
  '  Language    TypeScript (strict mode)',
  '  Styling     Tailwind CSS v4',
  '  Editor      Monaco Editor (@monaco-editor/react)',
  '  AI          OpenRouter → claude-sonnet-4-6',
  '  Streaming   SSE (Server-Sent Events)',
  '  Markdown    react-markdown + remark-gfm + rehype-raw',
  '  Icons       material-icon-theme SVGs (80+ mappings)',
  '  Deployment  Vercel (Edge Functions)',
  '  Domain      dwijesh.dev',
  '',
]


const MUSIC_LINES = [
  '',
  '  ♪  Now Playing                       lo-fi coding vibes',
  '  ────────────────────────────────────────────────────────',
  '  ▶  [══════════════════════░░░░░░░░]  3:14 / 4:52',
  '',
  '  Playlist: Late Night Stack',
  '  ──────────────────────────────────────',
  '    01  Nujabes           — Feather',
  '    02  J Dilla           — Time: The Donut of the Heart',
  '    03  Khruangbin        — Lady and Man',
  '    04  LoFi Girl         — Nightfall Study',
  '    05  Floating Points   — LesAlpx',
  '',
  '  Tip: jam.computer · lofi.cafe · poolsuite.net',
  '',
]

// ── Types ─────────────────────────────────────────────────────────────────────
interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'info' | 'success' | 'warning'
  text: string
}

export interface TerminalHandle {
  clear: () => void
  runCommand: (cmd: string) => void
  getLastCommand: () => string | null
  pushLines: (lines: TerminalLine[]) => void
}

interface Props {
  onNavigate: (id: string) => void
  onLastCommandChange: (cmd: string | null) => void
  onThemeChange?: (theme: string) => void
}

const PROMPT = 'dwijesh@portfolio:~$'

// ── Help text ─────────────────────────────────────────────────────────────────
function buildHelpText(): TerminalLine[] {
  const h = (t: string): TerminalLine => ({ type: 'info', text: t })
  const o = (t: string): TerminalLine => ({ type: 'output', text: t })
  return [
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
    o('  offline         chrome dinosaur game'),
    o('  matrix          enter the matrix'),
    h(''),
  ]
}

// ── Static command runner ─────────────────────────────────────────────────────
function runCmd(
  cmd: string,
  onNavigate: (id: string) => void,
  onThemeChange?: (theme: string) => void,
): { lines: TerminalLine[]; clear?: boolean } {
  const parts = cmd.trim().split(/\s+/)
  const name = parts[0].toLowerCase()
  const arg  = parts.slice(1).join(' ')
  const o = (t: string): TerminalLine => ({ type: 'output',  text: t })
  const e = (t: string): TerminalLine => ({ type: 'error',   text: t })
  const i = (t: string): TerminalLine => ({ type: 'info',    text: t })
  const s = (t: string): TerminalLine => ({ type: 'success', text: t })

  switch (name) {
    case 'help':
      return { lines: buildHelpText() }

    case 'ls':
      return {
        lines: [
          o(''),
          o('  ' + TABS.map(t => t.label).join('   ')),
          o(''),
          i(`  ${TABS.length} files`),
          o(''),
        ],
      }

    case 'cat':
    case 'open': {
      if (!arg) return { lines: [e(`${name}: missing filename`)] }
      const tab = TABS.find(t =>
        t.label.toLowerCase() === arg.toLowerCase() ||
        t.id.toLowerCase() === arg.toLowerCase()
      )
      if (!tab) return { lines: [e(`${name}: ${arg}: No such file`)] }
      onNavigate(tab.id)
      return { lines: [i(`Opening ${tab.label}...`)] }
    }

    case 'whoami':
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

    case 'skills': {
      const lines: TerminalLine[] = [o('')]
      for (const [cat, vals] of Object.entries(SKILLS)) {
        lines.push(i(`  ${cat}`))
        lines.push(o(`    ${(vals as string[]).join('  ·  ')}`))
      }
      lines.push(o(''))
      return { lines }
    }

    case 'projects': {
      const sub = parts[1]?.toLowerCase()
      const projName = parts.slice(2).join(' ')
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

    case 'timeline':
      return {
        lines: TIMELINE_LINES.map(l =>
          l.includes('──') || l.includes('Now') ? i(l) : o(l)
        ),
      }

    case 'contact':
      return {
        lines: [
          o(''),
          o(`  github    ${PERSON.github}`),
          o(`  linkedin  ${PERSON.linkedin}`),
          o(`  email     ${PERSON.email}`),
          o(''),
        ],
      }

    case 'architecture':
      return {
        lines: ARCHITECTURE_LINES.map(l =>
          /[┌┐└┘├┤┬┴┼─│]/.test(l) ? i(l) : o(l)
        ),
      }

    case 'stack':
      return { lines: STACK_LINES.map(o) }

    case 'neofetch':
      return { lines: NEOFETCH.split('\n').map(t => ({ type: 'info' as const, text: t })) }


    case 'fortune': {
      const quote = FORTUNES[Math.floor(Math.random() * FORTUNES.length)]
      return { lines: [o(''), i(`  ${quote}`), o('')] }
    }

    case 'theme': {
      if (!arg) {
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
      const id = arg.toLowerCase().replace(/\s+/g, '-')
      if (!THEMES[id]) return { lines: [e(`theme: "${arg}" not found — run "theme" to list`)] }
      onThemeChange?.(id)
      return { lines: [s(`  Theme applied: ${THEMES[id]}`)] }
    }

    case 'sudo': {
      const jokes = [
        'is not in the sudoers file. This incident will be reported.',
        'command not found (and neither is your permission).',
        'Error: universe.exe has insufficient permissions.',
        'Segmentation fault (core dumped).',
        'nice try.',
      ]
      if (arg === 'make me a sandwich') return { lines: [o('  Okay.')] }
      return {
        lines: [
          i(`  [sudo] password for ${PERSON.name.split(' ')[0].toLowerCase()}:`),
          e(`  ${PERSON.name.split(' ')[0]} ${jokes[Math.floor(Math.random() * jokes.length)]}`),
        ],
      }
    }

    case 'clear':
      return { lines: [], clear: true }

    case '':
      return { lines: [] }

    default:
      return { lines: [e(`bash: ${name}: command not found  —  type 'help' for commands`)] }
  }
}

// ── Monitor helpers ───────────────────────────────────────────────────────────
function bar(pct: number, w = 20): string {
  const f = Math.round(Math.min(100, Math.max(0, pct)) / 100 * w)
  return '█'.repeat(f) + '░'.repeat(w - f)
}
function fmtTime(s: number): string {
  const h = Math.floor(s / 3600).toString().padStart(2, '0')
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${h}:${m}:${sec}`
}
function buildMonitorFrame(cpu: number, mem: number, net: number, uptime: number, fps: number): string {
  const p = (n: number) => String(n).padStart(3)
  return [
    '  ┌─────────────────────────────────────────┐',
    '  │  SYSTEM MONITOR           Ctrl+C to exit│',
    '  ├─────────────────────────────────────────┤',
    `  │  CPU      [${bar(cpu)}]  ${p(cpu)}%    │`,
    `  │  Memory   [${bar(mem)}]  ${p(mem)}%    │`,
    `  │  Network  [${bar(net)}]  ${p(net)} r/s │`,
    '  ├─────────────────────────────────────────┤',
    `  │  Uptime   ${fmtTime(uptime).padEnd(31)}│`,
    `  │  FPS      ${String(fps).padEnd(31)}│`,
    `  │  AI       claude-sonnet-4-6              │`,
    '  ├─────────────────────────────────────────┤',
    '  │  ● monaco    ● terminal   ● diagnostics │',
    '  │  ● sidebar   ● copilot    ● status-bar  │',
    '  └─────────────────────────────────────────┘',
  ].join('\n')
}

// ── Streaming log factories ───────────────────────────────────────────────────
type StreamEntry = { type: TerminalLine['type']; text: string; delay: number }

function makeLogs(): StreamEntry[] {
  const ts = (ms: number) => new Date(Date.now() + ms).toISOString().replace('T', ' ').slice(0, 19)
  return [
    { type: 'info',    text: `  [${ts(0)}]    INFO   renderer     Monaco editor mounted`,            delay: 0   },
    { type: 'info',    text: `  [${ts(100)}]  INFO   tabs         Loaded 6 default files`,           delay: 150 },
    { type: 'info',    text: `  [${ts(250)}]  INFO   api          git-status fetched (main · 47)`,   delay: 200 },
    { type: 'info',    text: `  [${ts(400)}]  INFO   copilot      AI panel initialized`,             delay: 150 },
    { type: 'warning', text: `  [${ts(600)}]  WARN   ai.context   Attachment truncated to 2500c`,    delay: 300 },
    { type: 'info',    text: `  [${ts(700)}]  INFO   api.chat     Stream started — claude-sonnet-4-6`, delay: 200 },
    { type: 'info',    text: `  [${ts(1200)}] INFO   api.chat     Stream done — 847 tokens, 1.2s`,   delay: 500 },
    { type: 'info',    text: `  [${ts(1400)}] INFO   terminal     Command: neofetch`,                delay: 200 },
    { type: 'info',    text: `  [${ts(1600)}] DEBUG  diagnostics  Scanned 2 files, 0 errors`,        delay: 200 },
    { type: 'success', text: `  [${ts(1800)}] INFO   deploy       Build OK — 21.4s`,                 delay: 200 },
  ]
}

function makeDeployLogs(): StreamEntry[] {
  return [
    { type: 'info',    text: '  $ vercel deploy --prod',                                            delay: 0   },
    { type: 'output',  text: '',                                                                    delay: 200 },
    { type: 'info',    text: '  ◆  Inspecting code...',                                            delay: 300 },
    { type: 'success', text: '  ✓  Code inspection passed',                                        delay: 600 },
    { type: 'output',  text: '',                                                                    delay: 100 },
    { type: 'info',    text: '  ◆  Installing dependencies...',                                    delay: 200 },
    { type: 'output',  text: '     ▸ next@15.3.1  ▸ react@19.1.0',                                delay: 400 },
    { type: 'output',  text: '     ▸ @monaco-editor/react@4.7.0  ▸ tailwindcss@4.1.4',            delay: 300 },
    { type: 'success', text: '  ✓  Dependencies installed  [4.2s]',                               delay: 400 },
    { type: 'output',  text: '',                                                                    delay: 100 },
    { type: 'info',    text: '  ◆  Building...',                                                   delay: 200 },
    { type: 'output',  text: '     Compiling TypeScript...',                                       delay: 300 },
    { type: 'success', text: '  ✓  Compiled successfully',                                         delay: 800 },
    { type: 'output',  text: '     Generating static pages (8/8)...',                             delay: 300 },
    { type: 'success', text: '  ✓  Build complete  [12.3s]',                                      delay: 600 },
    { type: 'output',  text: '',                                                                    delay: 100 },
    { type: 'info',    text: '  ◆  Deploying to Vercel...',                                        delay: 200 },
    { type: 'success', text: '  ✓  Edge functions deployed',                                       delay: 800 },
    { type: 'success', text: '  ✓  Static assets uploaded (847 files)',                            delay: 500 },
    { type: 'success', text: '  ✓  DNS assigned',                                                 delay: 300 },
    { type: 'output',  text: '',                                                                    delay: 200 },
    { type: 'success', text: '  🚀 https://dwijesh.dev',                                           delay: 400 },
    { type: 'output',  text: '',                                                                    delay: 100 },
    { type: 'info',    text: '     Commit: 1c54020 — feat: terminal commands, dino, matrix',      delay: 100 },
    { type: 'info',    text: '     Duration: 21.4s',                                               delay: 100 },
    { type: 'output',  text: '',                                                                    delay: 0   },
  ]
}

// ── Component ─────────────────────────────────────────────────────────────────
const TerminalTab = forwardRef<TerminalHandle, Props>(({ onNavigate, onLastCommandChange, onThemeChange }, ref) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'info', text: `  Welcome to Dwijesh's portfolio terminal. Type 'help' for commands.` },
    { type: 'output', text: '' },
  ])
  const [input, setInput]   = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)

  const [donutActive,   setDonutActive]   = useState(false)
  const [donutFrame,    setDonutFrame]    = useState('')
  const [dinoActive,    setDinoActive]    = useState(false)
  const [matrixActive,  setMatrixActive]  = useState(false)
  const [monitorActive, setMonitorActive] = useState(false)
  const [monitorFrame,  setMonitorFrame]  = useState('')

  const donutA     = useRef(1)
  const donutB     = useRef(1)
  const dinoCanvas    = useRef<HTMLCanvasElement>(null)
  const startTime  = useRef(Date.now())
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  // ── Donut ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!donutActive) return
    const id = setInterval(() => {
      donutA.current += 0.04; donutB.current += 0.02
      setDonutFrame(computeDonutFrame(donutA.current, donutB.current))
    }, 50)
    return () => clearInterval(id)
  }, [donutActive])

  // ── Dino (Wikimedia sprites, white on transparent/dark terminal bg) ──
  useEffect(() => {
    if (!dinoActive) return
    const canvas = dinoCanvas.current
    if (!canvas) return
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const cv = canvas as NonNullable<typeof canvas>
    const ctx = cv.getContext('2d')!

    const LH = 150, GY = 127, DX = 80, DW = 44, DH = 43
    const S  = () => cv.height / LH
    const LW = () => cv.width  / S()
    const p  = (n: number) => n * S()

    function resize() {
      cv.width  = cv.clientWidth  || cv.offsetWidth
      cv.height = cv.clientHeight || cv.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    const mkImg = (src: string) => { const i = new Image(); i.src = src; return i }
    const imgRun1  = mkImg('/dino/trex-run1.webp')   // 88×85 VP8X (Wikimedia CC)
    const imgRun2  = mkImg('/dino/trex-run2.webp')   // 88×85
    const imgDead  = mkImg('/dino/trex-dead.webp')   // 88×85
    const imgDuck  = mkImg('/dino/trex-duck1.webp')  // 118×85
    const imgCSm   = mkImg('/dino/cactus-small.webp')
    const imgCLg   = mkImg('/dino/cactus-large.webp')
    const imgCloud = mkImg('/dino/cloud.png')

    // Recolor: tint any transparent-bg sprite to white
    const tintCache = new Map<HTMLImageElement, HTMLCanvasElement>()
    function getTinted(img: HTMLImageElement): HTMLCanvasElement | null {
      if (!img.complete || !img.naturalWidth) return null
      if (!tintCache.has(img)) {
        const off = document.createElement('canvas')
        off.width = img.naturalWidth; off.height = img.naturalHeight
        const c = off.getContext('2d')!
        c.drawImage(img, 0, 0)
        c.globalCompositeOperation = 'source-in'
        c.fillStyle = 'rgba(255,255,255,0.92)'
        c.fillRect(0, 0, off.width, off.height)
        tintCache.set(img, off)
      }
      return tintCache.get(img)!
    }

    function drawSprite(img: HTMLImageElement, lx: number, ly: number, lw: number, lh: number): boolean {
      const t = getTinted(img)
      if (!t) return false
      ctx.drawImage(t, 0, 0, t.width, t.height, p(lx), p(ly), p(lw), p(lh))
      return true
    }

    // Fallback canvas-drawn dino (white) if sprites not yet loaded
    const WHT = 'rgba(255,255,255,0.9)'
    function drawTrex(lx: number, ly: number, runF: number, isDead: boolean, onGround: boolean, isducking: boolean) {
      ctx.fillStyle = WHT
      if (isducking) {
        ctx.fillRect(p(lx+14), p(ly+22), p(25), p(10))
        ctx.fillRect(p(lx+8),  p(ly+22), p(12), p(16))
        ctx.fillRect(p(lx+34), p(ly+27), p(8),  p(5))
        ctx.fillRect(p(lx+10), p(ly+37), p(6),  p(6))
        ctx.fillRect(p(lx+18), p(ly+37), p(6),  p(6))
        return
      }
      ctx.fillRect(p(lx+14), p(ly),    p(25), p(18))
      ctx.fillRect(p(lx+36), p(ly+12), p(8),  p(6))
      ctx.fillRect(p(lx+14), p(ly+16), p(12), p(7))
      ctx.fillRect(p(lx+8),  p(ly+22), p(22), p(16))
      ctx.fillRect(p(lx),    p(ly+23), p(11), p(6))
      ctx.fillRect(p(lx),    p(ly+28), p(7),  p(4))
      ctx.fillRect(p(lx+22), p(ly+26), p(6),  p(4))
      ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(p(lx+32), p(ly+7), p(2), p(2))
      ctx.fillStyle = WHT
      if (isDead) {
        ctx.fillRect(p(lx+27), p(ly+4),  p(10), p(2))
        ctx.fillRect(p(lx+27), p(ly+10), p(10), p(2))
        ctx.fillRect(p(lx+29), p(ly+2),  p(2),  p(12))
        ctx.fillRect(p(lx+35), p(ly+2),  p(2),  p(12))
      }
      if (!onGround) {
        ctx.fillRect(p(lx+10), p(ly+38), p(6), p(8))
        ctx.fillRect(p(lx+18), p(ly+38), p(6), p(8))
      } else {
        const f = runF % 2
        ctx.fillRect(p(lx+10), p(ly+38), p(6), p(f ? 12 : 8))
        ctx.fillRect(p(lx+18), p(ly+38), p(6), p(f ? 8 : 12))
      }
    }

    function drawPtero(lx: number, ly: number, wingsUp: boolean) {
      ctx.fillStyle = WHT
      ctx.fillRect(p(lx+4),  p(ly+12), p(26), p(10))
      ctx.fillRect(p(lx+22), p(ly+9),  p(10), p(6))
      ctx.fillRect(p(lx+30), p(ly+11), p(5),  p(3))
      ctx.fillRect(p(lx+8),  p(ly+20), p(3),  p(8))
      ctx.fillRect(p(lx+14), p(ly+20), p(3),  p(8))
      if (wingsUp) {
        ctx.fillRect(p(lx),    p(ly),    p(28), p(6))
        ctx.fillRect(p(lx+2),  p(ly+4),  p(6),  p(5))
        ctx.fillRect(p(lx+10), p(ly+6),  p(16), p(6))
      } else {
        ctx.fillRect(p(lx+2),  p(ly+20), p(24), p(6))
        ctx.fillRect(p(lx+10), p(ly+24), p(14), p(6))
      }
    }

    let started = false, over = false
    let dy = GY - DH, vy = 0, grounded = true, ducking = false
    let speed = 6, score = 0, hi = 0, tick = 0
    let nextObs = 60 + Math.random() * 60, horizX = 0
    type Obs = { x: number; w: number; h: number; type: 'S'|'L'|'P'; py?: number }
    let obs: Obs[] = []
    let clouds = [{ x: 100, y: 20 }, { x: 280, y: 13 }, { x: 460, y: 28 }]

    function jump() {
      if (!started) { started = true; return }
      if (over)     { doRestart(); return }
      if (grounded) { vy = -8; grounded = false; ducking = false }
    }
    function doRestart() {
      dy = GY - DH; vy = 0; grounded = true; ducking = false
      speed = 6; score = 0; tick = 0; nextObs = 60 + Math.random() * 60
      over = false; started = true; horizX = 0; obs = []
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === ' ' || e.key === 'ArrowUp')  { e.preventDefault(); jump() }
      if (e.key === 'ArrowDown') { e.preventDefault(); if (started && !over && grounded) ducking = true }
    }
    function onKeyUp(e: KeyboardEvent) { if (e.key === 'ArrowDown') ducking = false }
    function onTouch(e: TouchEvent)    { e.preventDefault(); jump() }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup',   onKeyUp)
    cv.addEventListener('touchstart', onTouch, { passive: false })

    let raf: number
    function loop() {
      const lw = LW()

      if (started && !over) {
        tick++
        vy += 0.55; dy += vy
        if (dy >= GY - DH) { dy = GY - DH; vy = 0; grounded = true }
        speed = 6 + Math.floor(score / 200) * 0.5
        score++; horizX += speed
        for (const c of clouds) {
          c.x -= speed * 0.3
          if (c.x + 46 < 0) { c.x = lw + Math.random() * 80; c.y = 8 + Math.random() * 22 }
        }
        if (--nextObs <= 0) {
          const usePtero = score > 4000 && Math.random() < 0.25
          if (usePtero) {
            const yOpts = [GY - 45, GY - 67, GY - 87]
            obs.push({ x: lw + 10, w: 42, h: 30, type: 'P',
                       py: yOpts[Math.floor(Math.random() * yOpts.length)] })
          } else {
            obs.push(Math.random() < 0.45
              ? { x: lw + 10, w: 46, h: 46, type: 'L' }
              : { x: lw + 10, w: 17, h: 35, type: 'S' })
          }
          nextObs = Math.floor(60 + Math.random() * 80)
        }
        obs = obs.filter(o => { o.x -= speed; return o.x + o.w > -10 })
        const dinoTop = ducking ? GY - DH * 0.55 : dy
        const dinoH   = ducking ? DH * 0.55       : DH
        const PAD = 5
        for (const o of obs) {
          const oTop = o.type === 'P' ? o.py! : GY - o.h
          if (DX + DW - PAD > o.x + PAD && DX + PAD < o.x + o.w - PAD &&
              dinoTop + PAD < oTop + o.h - PAD && dinoTop + dinoH - PAD > oTop + PAD) {
            over = true; if (score > hi) hi = score
          }
        }
      } else if (!started) { tick++ }

      // Transparent bg — terminal dark background shows through
      ctx.clearRect(0, 0, cv.width, cv.height)

      // Clouds (white tinted sprites)
      for (const c of clouds) {
        if (!drawSprite(imgCloud, c.x, c.y, 46, 14))
          { ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(p(c.x), p(c.y), p(46), p(14)) }
      }

      // Ground line + scrolling dots
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.fillRect(0, p(GY), cv.width, p(1.5))
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      for (let dx2 = (horizX % 16); dx2 < lw; dx2 += 16) {
        ctx.fillRect(p(dx2),     p(GY + 3), p(3), p(1))
        ctx.fillRect(p(dx2 + 9), p(GY + 5), p(2), p(1))
      }

      // Obstacles
      for (const o of obs) {
        if (o.type === 'S') {
          if (!drawSprite(imgCSm, o.x, GY - o.h, o.w, o.h))
            { ctx.fillStyle = WHT; ctx.fillRect(p(o.x), p(GY - o.h), p(o.w), p(o.h)) }
        } else if (o.type === 'L') {
          if (!drawSprite(imgCLg, o.x, GY - o.h, o.w, o.h))
            { ctx.fillStyle = WHT; ctx.fillRect(p(o.x), p(GY - o.h), p(o.w), p(o.h)) }
        } else {
          drawPtero(o.x, o.py!, Math.floor(tick / 8) % 2 === 0)
        }
      }

      // T-Rex — sprite with white tint, fallback to canvas-drawn
      const runF     = Math.floor(tick / 6) % 2
      const dinoY    = ducking && started ? GY - DH * 0.55 : dy
      const isDucking = ducking && started && !over
      if (isDucking) {
        if (!drawSprite(imgDuck, DX, dinoY, 59, DH)) drawTrex(DX, dinoY, runF, false, grounded, true)
      } else if (over) {
        if (!drawSprite(imgDead, DX, dinoY, DW, DH)) drawTrex(DX, dinoY, runF, true, grounded, false)
      } else {
        const img = runF === 0 ? imgRun1 : imgRun2
        if (!drawSprite(img, DX, dinoY, DW, DH)) drawTrex(DX, dinoY, runF, false, grounded, false)
      }

      // Score
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.font = `bold ${p(12)}px 'Courier New', monospace`
      ctx.textAlign = 'right'
      ctx.fillText(
        `HI ${String(Math.floor(hi / 5)).padStart(5,'0')}  ${String(Math.floor(score / 5)).padStart(5,'0')}`,
        cv.width - p(8), p(18)
      )

      if (!started) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.font = `bold ${p(11)}px 'Courier New', monospace`
        ctx.textAlign = 'center'
        ctx.fillText('Press SPACE or ↑ to start', cv.width / 2, p(GY - 30))
      }
      if (over) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.font = `bold ${p(13)}px 'Courier New', monospace`
        ctx.textAlign = 'center'
        ctx.fillText('G A M E  O V E R', cv.width / 2, p(GY / 2 - 5))
        ctx.font = `${p(9)}px 'Courier New', monospace`
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.fillText('SPACE to restart  ·  Ctrl+C to exit', cv.width / 2, p(GY / 2 + 12))
      }

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup',   onKeyUp)
      cv.removeEventListener('touchstart', onTouch)
    }
  }, [dinoActive])


  // ── Monitor ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!monitorActive) return
    let frame = 0
    const id = setInterval(() => {
      const t = frame * 0.05
      const cpu = Math.min(99, Math.max(10, Math.floor(55 + 28 * Math.sin(t * 0.7) + 12 * Math.sin(t * 1.9))))
      const mem = Math.min(99, Math.max(10, Math.floor(54 + 14 * Math.sin(t * 0.4 + 1))))
      const net = Math.min(99, Math.max(0,  Math.floor(20 + 60 * Math.abs(Math.sin(t * 2.1)))))
      const uptime = Math.floor((Date.now() - startTime.current) / 1000)
      const fps = 58 + Math.floor(Math.random() * 4)
      setMonitorFrame(buildMonitorFrame(cpu, mem, net, uptime, fps))
      frame++
    }, 300)
    return () => clearInterval(id)
  }, [monitorActive])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  useImperativeHandle(ref, () => ({
    clear: () => setLines([]),
    runCommand: (cmd) => execute(cmd),
    getLastCommand: () => history[0] ?? null,
    pushLines: (nl) => setLines(prev => [...prev, ...nl]),
  }))

  function stopMode(setter: (v: boolean) => void) {
    setter(false)
    setLines(prev => [...prev, { type: 'info', text: '^C' }])
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function streamLines(entries: StreamEntry[]) {
    let total = 0
    for (const entry of entries) {
      total += entry.delay
      const t = total
      setTimeout(() => setLines(prev => [...prev, { type: entry.type, text: entry.text }]), t)
    }
  }

  function record(cmd: string) {
    setHistory(h => [cmd, ...h.slice(0, 49)])
    onLastCommandChange(cmd)
    setHistIdx(-1)
  }

  function execute(cmd: string) {
    const trimmed = cmd.trim()
    const nameLow = trimmed.split(/\s+/)[0].toLowerCase()
    const inputLine: TerminalLine = { type: 'input', text: `${PROMPT} ${trimmed}` }

    if (nameLow === 'donut') {
      setLines(prev => [...prev, inputLine])
      donutA.current = 1; donutB.current = 1
      setDonutFrame(computeDonutFrame(1, 1)); setDonutActive(true)
      record(trimmed); return
    }
    if (nameLow === 'offline' || nameLow === 'dino') {
      setLines(prev => [
        ...prev, inputLine,
        ...(nameLow === 'offline' ? [
          { type: 'error' as const,   text: '  ERR_INTERNET_DISCONNECTED' },
          { type: 'info'  as const,   text: '  Launching survival mode...' },
        ] : []),
      ])
      setDinoActive(true); record(trimmed); return
    }
    if (nameLow === 'matrix') {
      setLines(prev => [...prev, inputLine]); setMatrixActive(true); record(trimmed); return
    }
    if (nameLow === 'monitor') {
      setLines(prev => [...prev, inputLine]); setMonitorActive(true); record(trimmed); return
    }
    if (nameLow === 'logs') {
      setLines(prev => [...prev, inputLine]); streamLines(makeLogs()); record(trimmed); return
    }
    if (nameLow === 'deploy') {
      setLines(prev => [...prev, inputLine]); streamLines(makeDeployLogs()); record(trimmed); return
    }

    const { lines: newLines, clear } = runCmd(trimmed, onNavigate, onThemeChange)
    if (clear) setLines([])
    else setLines(prev => [...prev, inputLine, ...newLines])
    if (trimmed) record(trimmed)
  }

  function submit() { execute(input); setInput('') }

  function onKeyDown(e: React.KeyboardEvent) {
    if (donutActive)  {
      if ((e.ctrlKey && e.key === 'c') || e.key === 'Escape') { e.preventDefault(); stopMode(setDonutActive) }
      return
    }
    if (dinoActive)   {
      if ((e.ctrlKey && e.key === 'c') || e.key === 'Escape') { e.preventDefault(); stopMode(setDinoActive) }
      return
    }
    if (matrixActive) { stopMode(setMatrixActive); return }
    if (monitorActive){
      if ((e.ctrlKey && e.key === 'c') || e.key === 'Escape') { e.preventDefault(); stopMode(setMonitorActive) }
      return
    }
    if (e.key === 'Enter') { submit() }
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const nx = Math.min(histIdx + 1, history.length - 1); setHistIdx(nx); setInput(history[nx] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nx = histIdx - 1
      if (nx < 0) { setHistIdx(-1); setInput('') } else { setHistIdx(nx); setInput(history[nx]) }
    }
  }

  return (
    <div
      className="flex flex-col h-full bg-vsc-bg font-mono text-sm cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {dinoActive && <canvas ref={dinoCanvas} className="flex-1 w-full" />}
      <div className={`flex-1 overflow-auto panel-scroll px-4 py-2 space-y-0.5 ${dinoActive ? 'hidden' : ''}`}>
        {donutActive ? (
          <div className="flex flex-col items-center justify-center h-full">
            <pre className="text-vsc-fn text-[9px] leading-[1.15] font-mono select-none">{donutFrame}</pre>
            <div className="text-vsc-muted text-[10px] mt-2">Ctrl+C or Esc to stop</div>
          </div>
        ) : matrixActive ? (
          <div className="relative flex flex-col h-full overflow-hidden">
            <div className="flex-1 relative overflow-hidden select-none pointer-events-none">
              {MATRIX_COLS.map(col => (
                <div
                  key={col.id}
                  className="absolute top-0 font-mono text-[13px] leading-[1.4] text-green-400 whitespace-pre"
                  style={{ left: col.left, opacity: col.opacity, animation: `matrix-fall ${col.dur} linear infinite`, animationDelay: col.delay }}
                >
                  {col.chars}
                </div>
              ))}
            </div>
            <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-green-400/40 pointer-events-none select-none">
              press any key to exit
            </div>
          </div>
        ) : monitorActive ? (
          <div className="flex flex-col items-center justify-center h-full">
            <pre className="text-vsc-fn text-[11px] leading-[1.6] font-mono select-none">{monitorFrame}</pre>
          </div>
        ) : (
          <>
            {lines.map((l, i) => (
              <div
                key={i}
                className={`leading-5 whitespace-pre-wrap break-all
                  ${l.type === 'input'   ? 'text-vsc-fn'      : ''}
                  ${l.type === 'output'  ? 'text-vsc-text/90' : ''}
                  ${l.type === 'error'   ? 'text-red-400'     : ''}
                  ${l.type === 'info'    ? 'text-vsc-comment'  : ''}
                  ${l.type === 'success' ? 'text-green-400'   : ''}
                  ${l.type === 'warning' ? 'text-yellow-400'  : ''}
                `}
              >
                {l.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      <div className="shrink-0 flex items-center px-4 py-1.5 border-t border-vsc-border/30">
        <span className="text-vsc-fn mr-2 shrink-0 select-none">{PROMPT}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
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

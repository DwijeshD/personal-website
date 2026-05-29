# Deep Modularisation — Feature-First Architecture

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor 6 oversized files into a feature-first architecture under `src/features/`, replace custom markdown renderer with react-markdown, add Jest unit tests, and clean up packages — zero functionality changes.

**Architecture:** Domain modules under `src/features/{terminal,copilot,sidebar,titlebar,renderer}` each owning their types, sub-components, hooks, and libs. Coordinator components stay at `src/components/` and import from feature modules. Shared utilities in `src/shared/`. Source code moves to `src/` first (Task 2), then feature extraction runs in parallel (Tasks 3–7 + 9), then content split and cleanup.

**Tech Stack:** Next.js 15, React 19, TypeScript strict, Tailwind CSS v4, react-window, react-markdown + remark-gfm, Jest + ts-jest

---

### Task 1: Package & Tooling Setup

**Files:**
- Modify: `package.json`
- Create: `jest.config.ts`

- [ ] **Step 1: Edit `package.json`**

In `"dependencies"` add `"react-window": "^1.8.10"` and remove `"zod": ...`.

In `"devDependencies"` add:
```json
"@types/react-window": "^1.8.8",
"jest": "^29.7.0",
"@types/jest": "^29.5.0",
"ts-jest": "^29.1.0"
```
Remove `"@typescript-eslint/eslint-plugin": ...` and `"@typescript-eslint/parser": ...`.

In `"scripts"` add `"test": "jest"`.

- [ ] **Step 2: Create `jest.config.ts`**

```ts
import type { Config } from 'jest'
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
}
export default config
```

- [ ] **Step 3: Install / remove packages**

```bash
npm install react-window
npm install --save-dev @types/react-window jest @types/jest ts-jest
npm uninstall zod @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

Expected: no errors, `node_modules/react-window` directory exists.

- [ ] **Step 4: Verify**

```bash
npm run type-check
```

Expected: same result as before this task.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json jest.config.ts
git commit -m "chore: add react-window + jest; remove zod and unused eslint deps"
```

---

### Task 2: src/ Directory Migration

**Files:**
- Move: `app/` `components/` `hooks/` `lib/` into new `src/`
- Modify: `tsconfig.json`, `tailwind.config.ts`

- [ ] **Step 1: Move source directories**

```bash
mkdir src
mv app src/app
mv components src/components
mv hooks src/hooks
mv lib src/lib
```

- [ ] **Step 2: Update `tsconfig.json`**

Change the `paths` block from `"./*"` to `"./src/*"`:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

Change `include` to:
```json
"include": [
  "next-env.d.ts",
  "src/**/*.ts",
  "src/**/*.tsx",
  ".next/types/**/*.ts",
  "*.config.ts"
]
```

- [ ] **Step 3: Update `tailwind.config.ts` content array**

Replace the `content` array:
```ts
content: [
  './src/app/**/*.{ts,tsx}',
  './src/components/**/*.{ts,tsx}',
  './src/hooks/**/*.{ts,tsx}',
  './src/lib/**/*.{ts,tsx}',
],
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: build succeeds — Next.js 15 auto-discovers `src/app/`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: migrate all source into src/ directory"
```

---

### Tasks 3–7 and Task 9 run in parallel — each touches separate files, no conflicts

---

### Task 3: Terminal Feature Module

**Files created:**
- `src/features/terminal/types.ts`
- `src/features/terminal/content.ts`
- `src/features/terminal/monitor.ts`
- `src/features/terminal/commands/types.ts`
- `src/features/terminal/commands/index.ts`
- `src/features/terminal/commands/help.ts`
- `src/features/terminal/commands/ls.ts`
- `src/features/terminal/commands/open.ts`
- `src/features/terminal/commands/whoami.ts`
- `src/features/terminal/commands/skills.ts`
- `src/features/terminal/commands/projects.ts`
- `src/features/terminal/commands/timeline.ts`
- `src/features/terminal/commands/contact.ts`
- `src/features/terminal/commands/architecture.ts`
- `src/features/terminal/commands/stack.ts`
- `src/features/terminal/commands/neofetch.ts`
- `src/features/terminal/commands/fortune.ts`
- `src/features/terminal/commands/theme.ts`
- `src/features/terminal/commands/sudo.ts`
- `src/features/terminal/components/DinoGame.tsx`
- `src/features/terminal/components/MatrixEffect.tsx`

**File modified:**
- `src/components/panels/TerminalTab.tsx` (rewritten as thin coordinator ~140 lines)

- [ ] **Step 1: Create `src/features/terminal/types.ts`**

```ts
export interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'info' | 'success' | 'warning'
  text: string
}

export interface TerminalHandle {
  clear: () => void
  runCommand: (cmd: string) => void
  getLastCommand: () => string | null
  pushLines: (lines: TerminalLine[]) => void
}

export type StreamEntry = { type: TerminalLine['type']; text: string; delay: number }
```

- [ ] **Step 2: Create `src/features/terminal/content.ts`**

Extract constants from `src/components/panels/TerminalTab.tsx:34–158`:

```ts
import { PERSON } from '@/lib/profile'

export const THEMES: Record<string, string> = {
  'default':        'VS Code Dark+',
  'dracula':        'Dracula',
  'night-owl':      'Night Owl',
  'one-dark':       'One Dark Pro',
  'monokai':        'Monokai',
  'solarized-dark': 'Solarized Dark',
}

export const FORTUNES = [
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

export const NEOFETCH = `
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

export const TIMELINE_LINES = [
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

export const ARCHITECTURE_LINES = [
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

export const STACK_LINES = [
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

export const MUSIC_LINES = [
  '',
  '  ♪  Now Playing                       lo-fi coding vibes',
  '  ────────────────────────────────────────────────────────',
  '  ▶  [══════════════════════░░░░░░░░]  3:14 / 4:52',
  '',
  '  Playlist: Late Night Stack',
  '  ──────────────────────────────────────',
  "    01  Nujabes           — Feather",
  "    02  J Dilla           — Time: The Donut of the Heart",
  "    03  Khruangbin        — Lady and Man",
  "    04  LoFi Girl         — Nightfall Study",
  "    05  Floating Points   — LesAlpx",
  '',
  '  Tip: jam.computer · lofi.cafe · poolsuite.net',
  '',
]
```

- [ ] **Step 3: Create `src/features/terminal/monitor.ts`**

Extract from `src/components/panels/TerminalTab.tsx:8–31` (computeDonutFrame) and `:403–481` (bar, fmtTime, buildMonitorFrame, makeLogs, makeDeployLogs):

```ts
import type { StreamEntry } from './types'

export function computeDonutFrame(A: number, B: number): string {
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

export function bar(pct: number, w = 20): string {
  const f = Math.round(Math.min(100, Math.max(0, pct)) / 100 * w)
  return '█'.repeat(f) + '░'.repeat(w - f)
}

export function fmtTime(s: number): string {
  const h = Math.floor(s / 3600).toString().padStart(2, '0')
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${h}:${m}:${sec}`
}

export function buildMonitorFrame(cpu: number, mem: number, net: number, uptime: number, fps: number): string {
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

export function makeLogs(): StreamEntry[] {
  const ts = (ms: number) => new Date(Date.now() + ms).toISOString().replace('T', ' ').slice(0, 19)
  return [
    { type: 'info',    text: `  [${ts(0)}]    INFO   renderer     Monaco editor mounted`,              delay: 0   },
    { type: 'info',    text: `  [${ts(100)}]  INFO   tabs         Loaded 6 default files`,             delay: 150 },
    { type: 'info',    text: `  [${ts(250)}]  INFO   api          git-status fetched (main · 47)`,     delay: 200 },
    { type: 'info',    text: `  [${ts(400)}]  INFO   copilot      AI panel initialized`,               delay: 150 },
    { type: 'warning', text: `  [${ts(600)}]  WARN   ai.context   Attachment truncated to 2500c`,      delay: 300 },
    { type: 'info',    text: `  [${ts(700)}]  INFO   api.chat     Stream started — claude-sonnet-4-6`, delay: 200 },
    { type: 'info',    text: `  [${ts(1200)}] INFO   api.chat     Stream done — 847 tokens, 1.2s`,     delay: 500 },
    { type: 'info',    text: `  [${ts(1400)}] INFO   terminal     Command: neofetch`,                  delay: 200 },
    { type: 'info',    text: `  [${ts(1600)}] DEBUG  diagnostics  Scanned 2 files, 0 errors`,          delay: 200 },
    { type: 'success', text: `  [${ts(1800)}] INFO   deploy       Build OK — 21.4s`,                   delay: 200 },
  ]
}

export function makeDeployLogs(): StreamEntry[] {
  return [
    { type: 'info',    text: '  $ vercel deploy --prod',                                         delay: 0   },
    { type: 'output',  text: '',                                                                  delay: 200 },
    { type: 'info',    text: '  ◆  Inspecting code...',                                          delay: 300 },
    { type: 'success', text: '  ✓  Code inspection passed',                                      delay: 600 },
    { type: 'output',  text: '',                                                                  delay: 100 },
    { type: 'info',    text: '  ◆  Installing dependencies...',                                  delay: 200 },
    { type: 'output',  text: '     ▸ next@15.3.1  ▸ react@19.1.0',                              delay: 400 },
    { type: 'output',  text: '     ▸ @monaco-editor/react@4.7.0  ▸ tailwindcss@4.1.4',          delay: 300 },
    { type: 'success', text: '  ✓  Dependencies installed  [4.2s]',                             delay: 400 },
    { type: 'output',  text: '',                                                                  delay: 100 },
    { type: 'info',    text: '  ◆  Building...',                                                 delay: 200 },
    { type: 'output',  text: '     Compiling TypeScript...',                                     delay: 300 },
    { type: 'success', text: '  ✓  Compiled successfully',                                       delay: 800 },
    { type: 'output',  text: '     Generating static pages (8/8)...',                           delay: 300 },
    { type: 'success', text: '  ✓  Build complete  [12.3s]',                                    delay: 600 },
    { type: 'output',  text: '',                                                                  delay: 100 },
    { type: 'info',    text: '  ◆  Deploying to Vercel...',                                      delay: 200 },
    { type: 'success', text: '  ✓  Edge functions deployed',                                     delay: 800 },
    { type: 'success', text: '  ✓  Static assets uploaded (847 files)',                          delay: 500 },
    { type: 'success', text: '  ✓  DNS assigned',                                               delay: 300 },
    { type: 'output',  text: '',                                                                  delay: 200 },
    { type: 'success', text: '  🚀 https://dwijesh.dev',                                         delay: 400 },
    { type: 'output',  text: '',                                                                  delay: 100 },
    { type: 'info',    text: '     Commit: 1c54020 — feat: terminal commands, dino, matrix',    delay: 100 },
    { type: 'info',    text: '     Duration: 21.4s',                                             delay: 100 },
    { type: 'output',  text: '',                                                                  delay: 0   },
  ]
}
```

- [ ] **Step 4: Create `src/features/terminal/commands/types.ts`**

```ts
import type { TerminalLine } from '../types'

export interface CommandResult { lines: TerminalLine[]; clear?: boolean }
export interface CommandContext {
  onNavigate: (id: string) => void
  onThemeChange?: (theme: string) => void
}
export type CommandHandler = (args: string, ctx: CommandContext) => CommandResult
```

- [ ] **Step 5: Create all command handler files**

**`src/features/terminal/commands/help.ts`** (from TerminalTab.tsx:182–215):
```ts
import type { CommandHandler } from './types'
import type { TerminalLine } from '../types'
const h = (t: string): TerminalLine => ({ type: 'info',   text: t })
const o = (t: string): TerminalLine => ({ type: 'output', text: t })
export const help: CommandHandler = () => ({ lines: [
  h(''), h('  PORTFOLIO'),
  o('  whoami          personal intro'),
  o('  skills          technical skills by category'),
  o('  projects        project list  |  projects open <name>'),
  o('  timeline        career & education timeline'),
  o('  contact         GitHub · LinkedIn · email'),
  h(''), h('  SYSTEM'),
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
  h(''), h('  EXTRAS'),
  o('  neofetch        system info card'),
  o('  fortune         random dev wisdom'),
  o('  sudo            nice try'),
  o('  donut           3D ASCII rotating donut'),
  o('  dino            chrome dinosaur game'),
  o('  matrix          enter the matrix'),
  h(''),
]})
```

**`src/features/terminal/commands/ls.ts`** (from TerminalTab.tsx:236–244):
```ts
import type { CommandHandler } from './types'
import type { TerminalLine } from '../types'
import { TABS } from '@/lib/tabs'
const o = (t: string): TerminalLine => ({ type: 'output', text: t })
const i = (t: string): TerminalLine => ({ type: 'info',   text: t })
export const ls: CommandHandler = () => ({ lines: [
  o(''), o('  ' + TABS.map(t => t.label).join('   ')), o(''), i(`  ${TABS.length} files`), o(''),
]})
```

**`src/features/terminal/commands/open.ts`** (from TerminalTab.tsx:246–256, handles `open` and `cat`):
```ts
import type { CommandHandler } from './types'
import type { TerminalLine } from '../types'
import { TABS } from '@/lib/tabs'
const e = (t: string): TerminalLine => ({ type: 'error', text: t })
const i = (t: string): TerminalLine => ({ type: 'info',  text: t })
export const open: CommandHandler = (args, ctx) => {
  if (!args) return { lines: [e('open: missing filename')] }
  const tab = TABS.find(t => t.label.toLowerCase() === args.toLowerCase() || t.id.toLowerCase() === args.toLowerCase())
  if (!tab) return { lines: [e(`open: ${args}: No such file`)] }
  ctx.onNavigate(tab.id)
  return { lines: [i(`Opening ${tab.label}...`)] }
}
```

**`src/features/terminal/commands/whoami.ts`** (from TerminalTab.tsx:258–272):
```ts
import type { CommandHandler } from './types'
import type { TerminalLine } from '../types'
import { PERSON, ABOUT } from '@/lib/profile'
const o = (t: string): TerminalLine => ({ type: 'output',  text: t })
const i = (t: string): TerminalLine => ({ type: 'info',    text: t })
const s = (t: string): TerminalLine => ({ type: 'success', text: t })
export const whoami: CommandHandler = () => ({ lines: [
  o(''), s(`  ${PERSON.name}`), i(`  ${PERSON.headline}`), o(''),
  ...ABOUT.split('\n').map(l => o('  ' + l)), o(''),
  o(`  github    ${PERSON.github}`), o(`  email     ${PERSON.email}`),
  o(`  status    ${PERSON.available ? '● open to opportunities' : '○ not available'}`), o(''),
]})
```

**`src/features/terminal/commands/skills.ts`** (from TerminalTab.tsx:274–281):
```ts
import type { CommandHandler } from './types'
import type { TerminalLine } from '../types'
import { SKILLS } from '@/lib/profile'
const o = (t: string): TerminalLine => ({ type: 'output', text: t })
const i = (t: string): TerminalLine => ({ type: 'info',   text: t })
export const skills: CommandHandler = () => {
  const lines: TerminalLine[] = [o('')]
  for (const [cat, vals] of Object.entries(SKILLS)) {
    lines.push(i(`  ${cat}`))
    lines.push(o(`    ${(vals as string[]).join('  ·  ')}`))
  }
  lines.push(o(''))
  return { lines }
}
```

**`src/features/terminal/commands/projects.ts`** (from TerminalTab.tsx:283–317):
```ts
import type { CommandHandler } from './types'
import type { TerminalLine } from '../types'
import { PROJECTS } from '@/lib/profile'
const o = (t: string): TerminalLine => ({ type: 'output',  text: t })
const e = (t: string): TerminalLine => ({ type: 'error',   text: t })
const i = (t: string): TerminalLine => ({ type: 'info',    text: t })
const s = (t: string): TerminalLine => ({ type: 'success', text: t })
export const projects: CommandHandler = (args) => {
  const parts = args.split(/\s+/)
  const sub = parts[0]?.toLowerCase()
  const projName = parts.slice(1).join(' ')
  if (sub === 'open' && projName) {
    const proj = PROJECTS.find(p => p.id === projName || p.name.toLowerCase().includes(projName.toLowerCase()))
    if (!proj) return { lines: [e(`projects: "${projName}" not found`)] }
    return { lines: [
      o(''), s(`  ${proj.name}`), i(`  ${proj.subtitle}`), o(''),
      ...proj.description.split('. ').filter(Boolean).map(l => o(`  ${l.trim()}.`)),
      o(''), o(`  Tags: ${proj.tags.join(' · ')}`), o(''),
    ]}
  }
  return { lines: [
    o(''),
    ...PROJECTS.flatMap(p => [s(`  ${p.name}`), i(`    ${p.subtitle}  —  ${p.tags.join(', ')}`), o('')]),
    i('  tip: projects open <name> for full details'), o(''),
  ]}
}
```

**`src/features/terminal/commands/timeline.ts`** (from TerminalTab.tsx:319–323):
```ts
import type { CommandHandler } from './types'
import { TIMELINE_LINES } from '../content'
export const timeline: CommandHandler = () => ({
  lines: TIMELINE_LINES.map(l =>
    l.includes('──') || l.includes('Now')
      ? { type: 'info' as const, text: l }
      : { type: 'output' as const, text: l }
  ),
})
```

**`src/features/terminal/commands/contact.ts`** (from TerminalTab.tsx:325–335):
```ts
import type { CommandHandler } from './types'
import type { TerminalLine } from '../types'
import { PERSON } from '@/lib/profile'
const o = (t: string): TerminalLine => ({ type: 'output', text: t })
export const contact: CommandHandler = () => ({ lines: [
  o(''), o(`  github    ${PERSON.github}`), o(`  linkedin  ${PERSON.linkedin}`), o(`  email     ${PERSON.email}`), o(''),
]})
```

**`src/features/terminal/commands/architecture.ts`** (from TerminalTab.tsx:337–341):
```ts
import type { CommandHandler } from './types'
import { ARCHITECTURE_LINES } from '../content'
export const architecture: CommandHandler = () => ({
  lines: ARCHITECTURE_LINES.map(l =>
    /[┌┐└┘├┤┬┴┼─│]/.test(l) ? { type: 'info' as const, text: l } : { type: 'output' as const, text: l }
  ),
})
```

**`src/features/terminal/commands/stack.ts`** (from TerminalTab.tsx:343–345):
```ts
import type { CommandHandler } from './types'
import { STACK_LINES } from '../content'
export const stack: CommandHandler = () => ({ lines: STACK_LINES.map(t => ({ type: 'output' as const, text: t })) })
```

**`src/features/terminal/commands/neofetch.ts`** (from TerminalTab.tsx:347–348):
```ts
import type { CommandHandler } from './types'
import { NEOFETCH } from '../content'
export const neofetch: CommandHandler = () => ({ lines: NEOFETCH.split('\n').map(t => ({ type: 'info' as const, text: t })) })
```

**`src/features/terminal/commands/fortune.ts`** (from TerminalTab.tsx:350–354):
```ts
import type { CommandHandler } from './types'
import type { TerminalLine } from '../types'
import { FORTUNES } from '../content'
const o = (t: string): TerminalLine => ({ type: 'output', text: t })
const i = (t: string): TerminalLine => ({ type: 'info',   text: t })
export const fortune: CommandHandler = () => {
  const quote = FORTUNES[Math.floor(Math.random() * FORTUNES.length)]
  return { lines: [o(''), i(`  ${quote}`), o('')] }
}
```

**`src/features/terminal/commands/theme.ts`** (from TerminalTab.tsx:355–373):
```ts
import type { CommandHandler } from './types'
import type { TerminalLine } from '../types'
import { THEMES } from '../content'
const o = (t: string): TerminalLine => ({ type: 'output',  text: t })
const e = (t: string): TerminalLine => ({ type: 'error',   text: t })
const i = (t: string): TerminalLine => ({ type: 'info',    text: t })
const s = (t: string): TerminalLine => ({ type: 'success', text: t })
export const theme: CommandHandler = (args, ctx) => {
  if (!args) return { lines: [
    o(''), i('  Available themes:'),
    ...Object.entries(THEMES).map(([id, label]) => o(`    ${id.padEnd(16)} ${label}`)),
    o(''), i('  Usage: theme <id>'), o(''),
  ]}
  const id = args.toLowerCase().replace(/\s+/g, '-')
  if (!THEMES[id]) return { lines: [e(`theme: "${args}" not found — run "theme" to list`)] }
  ctx.onThemeChange?.(id)
  return { lines: [s(`  Theme applied: ${THEMES[id]}`)] }
}
```

**`src/features/terminal/commands/sudo.ts`** (from TerminalTab.tsx:374–390):
```ts
import type { CommandHandler } from './types'
import type { TerminalLine } from '../types'
import { PERSON } from '@/lib/profile'
const o = (t: string): TerminalLine => ({ type: 'output', text: t })
const e = (t: string): TerminalLine => ({ type: 'error',  text: t })
const i = (t: string): TerminalLine => ({ type: 'info',   text: t })
const JOKES = [
  'is not in the sudoers file. This incident will be reported.',
  'command not found (and neither is your permission).',
  'Error: universe.exe has insufficient permissions.',
  'Segmentation fault (core dumped).',
  'nice try.',
]
export const sudo: CommandHandler = (args) => {
  if (args === 'make me a sandwich') return { lines: [o('  Okay.')] }
  return { lines: [
    i(`  [sudo] password for ${PERSON.name.split(' ')[0].toLowerCase()}:`),
    e(`  ${PERSON.name.split(' ')[0]} ${JOKES[Math.floor(Math.random() * JOKES.length)]}`),
  ]}
}
```

- [ ] **Step 6: Create `src/features/terminal/commands/index.ts`**

```ts
import type { CommandContext, CommandResult } from './types'
import type { TerminalLine } from '../types'
import { help }         from './help'
import { ls }           from './ls'
import { open }         from './open'
import { whoami }       from './whoami'
import { skills }       from './skills'
import { projects }     from './projects'
import { timeline }     from './timeline'
import { contact }      from './contact'
import { architecture } from './architecture'
import { stack }        from './stack'
import { neofetch }     from './neofetch'
import { fortune }      from './fortune'
import { theme }        from './theme'
import { sudo }         from './sudo'

type Handler = (args: string, ctx: CommandContext) => CommandResult
const registry: Record<string, Handler> = {
  help, ls, open, cat: open,
  whoami, skills, projects, timeline, contact,
  architecture, stack, neofetch, fortune, theme, sudo,
  clear: () => ({ lines: [], clear: true }),
  '':    () => ({ lines: [] }),
}

const e = (t: string): TerminalLine => ({ type: 'error', text: t })

export function dispatch(cmd: string, ctx: CommandContext): CommandResult {
  const parts = cmd.trim().split(/\s+/)
  const name  = parts[0].toLowerCase()
  const args  = parts.slice(1).join(' ')
  const handler = registry[name]
  if (!handler) return { lines: [e(`bash: ${name}: command not found  —  type 'help' for commands`)] }
  return handler(args, ctx)
}
```

- [ ] **Step 7: Create `src/features/terminal/components/DinoGame.tsx`**

Extract game logic from `src/components/panels/TerminalTab.tsx:519–740`. The component owns its canvas ref and calls `onStop()` on Ctrl+C/Escape (replacing the coordinator's stopMode call):

```tsx
'use client'
import { useEffect, useRef } from 'react'

interface Props { onStop: () => void }

export default function DinoGame({ onStop }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
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
    const imgRun1  = mkImg('/dino/trex-run1.webp')
    const imgRun2  = mkImg('/dino/trex-run2.webp')
    const imgDead  = mkImg('/dino/trex-dead.webp')
    const imgDuck  = mkImg('/dino/trex-duck1.webp')
    const imgCSm   = mkImg('/dino/cactus-small.webp')
    const imgCLg   = mkImg('/dino/cactus-large.webp')
    const imgCloud = mkImg('/dino/cloud.png')

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
      const t = getTinted(img); if (!t) return false
      ctx.drawImage(t, 0, 0, t.width, t.height, p(lx), p(ly), p(lw), p(lh)); return true
    }
    const WHT = 'rgba(255,255,255,0.9)'
    function drawPtero(lx: number, ly: number, wingsUp: boolean) {
      ctx.fillStyle = WHT
      ctx.fillRect(p(lx+4), p(ly+12), p(26), p(10)); ctx.fillRect(p(lx+22), p(ly+9), p(10), p(6))
      ctx.fillRect(p(lx+30), p(ly+11), p(5), p(3));  ctx.fillRect(p(lx+8), p(ly+20), p(3), p(8))
      ctx.fillRect(p(lx+14), p(ly+20), p(3), p(8))
      if (wingsUp) {
        ctx.fillRect(p(lx), p(ly), p(28), p(6)); ctx.fillRect(p(lx+2), p(ly+4), p(6), p(5))
        ctx.fillRect(p(lx+10), p(ly+6), p(16), p(6))
      } else {
        ctx.fillRect(p(lx+2), p(ly+20), p(24), p(6)); ctx.fillRect(p(lx+10), p(ly+24), p(14), p(6))
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
      if (over) { doRestart(); return }
      if (grounded) { vy = -8; grounded = false; ducking = false }
    }
    function doRestart() {
      dy = GY - DH; vy = 0; grounded = true; ducking = false
      speed = 6; score = 0; tick = 0; nextObs = 60 + Math.random() * 60
      over = false; started = true; horizX = 0; obs = []
    }
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey && e.key === 'c') || e.key === 'Escape') { e.preventDefault(); onStop(); return }
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
        tick++; vy += 0.55; dy += vy
        if (dy >= GY - DH) { dy = GY - DH; vy = 0; grounded = true }
        speed = 6 + Math.floor(score / 200) * 0.5; score++; horizX += speed
        for (const c of clouds) {
          c.x -= speed * 0.3
          if (c.x + 46 < 0) { c.x = lw + Math.random() * 80; c.y = 8 + Math.random() * 22 }
        }
        if (--nextObs <= 0) {
          const usePtero = score > 4000 && Math.random() < 0.25
          if (usePtero) {
            const yOpts = [GY - 45, GY - 67, GY - 87]
            obs.push({ x: lw + 10, w: 42, h: 30, type: 'P', py: yOpts[Math.floor(Math.random() * yOpts.length)] })
          } else {
            obs.push(Math.random() < 0.45 ? { x: lw + 10, w: 46, h: 46, type: 'L' } : { x: lw + 10, w: 17, h: 35, type: 'S' })
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

      ctx.clearRect(0, 0, cv.width, cv.height)
      for (const c of clouds) { drawSprite(imgCloud, c.x, c.y, 46, 14) }
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(0, p(GY), cv.width, p(1.5))
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      for (let dx2 = (horizX % 16); dx2 < lw; dx2 += 16) {
        ctx.fillRect(p(dx2), p(GY + 3), p(3), p(1)); ctx.fillRect(p(dx2 + 9), p(GY + 5), p(2), p(1))
      }
      for (const o of obs) {
        if (o.type === 'S') drawSprite(imgCSm, o.x, GY - o.h, o.w, o.h)
        else if (o.type === 'L') drawSprite(imgCLg, o.x, GY - o.h, o.w, o.h)
        else drawPtero(o.x, o.py!, Math.floor(tick / 8) % 2 === 0)
      }
      const runF = Math.floor(tick / 6) % 2
      const dinoY = ducking && started ? GY - DH * 0.55 : dy
      const isDucking = ducking && started && !over
      if (isDucking) drawSprite(imgDuck, DX, dinoY, 59, DH)
      else if (over) drawSprite(imgDead, DX, dinoY, DW, DH)
      else           drawSprite(runF === 0 ? imgRun1 : imgRun2, DX, dinoY, DW, DH)

      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.font = `bold ${p(12)}px 'Courier New', monospace`
      ctx.textAlign = 'right'
      ctx.fillText(`HI ${String(Math.floor(hi / 5)).padStart(5,'0')}  ${String(Math.floor(score / 5)).padStart(5,'0')}`, cv.width - p(8), p(18))
      if (!started) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = `bold ${p(11)}px 'Courier New', monospace`
        ctx.textAlign = 'center'; ctx.fillText('Press SPACE or ↑ to start', cv.width / 2, p(GY - 30))
      }
      if (over) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = `bold ${p(13)}px 'Courier New', monospace`
        ctx.textAlign = 'center'; ctx.fillText('G A M E  O V E R', cv.width / 2, p(GY / 2 - 5))
        ctx.font = `${p(9)}px 'Courier New', monospace`; ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.fillText('SPACE to restart  ·  Ctrl+C to exit', cv.width / 2, p(GY / 2 + 12))
      }
      raf = requestAnimationFrame(loop)
    }

    const allImgs = [imgRun1, imgRun2, imgDead, imgDuck, imgCSm, imgCLg, imgCloud]
    Promise.all(allImgs.map(img =>
      img.complete ? Promise.resolve() : new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res() })
    )).then(() => { raf = requestAnimationFrame(loop) })

    return () => {
      cancelAnimationFrame(raf); ro.disconnect()
      window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKeyUp)
      cv.removeEventListener('touchstart', onTouch)
    }
  }, [onStop])

  return <canvas ref={canvasRef} className="flex-1 w-full" />
}
```

- [ ] **Step 8: Create `src/features/terminal/components/MatrixEffect.tsx`**

Extract from `src/components/panels/TerminalTab.tsx:743–803`. Component owns its canvas ref; any keydown calls `onStop()`:

```tsx
'use client'
import { useEffect, useRef } from 'react'

interface Props { onStop: () => void }

export default function MatrixEffect({ onStop }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const cv  = canvas as NonNullable<typeof canvas>
    const ctx = cv.getContext('2d')!
    const FS    = 14
    const CHARS = 'ｦｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789'
    let cols = 0, drops: number[] = [], bgR = 30, bgG = 30, bgB = 30

    function resize() {
      cv.width  = cv.offsetWidth  || cv.clientWidth
      cv.height = cv.offsetHeight || cv.clientHeight
      const rgb = getComputedStyle(cv.parentElement!).backgroundColor.match(/\d+/g)?.map(Number) ?? [30, 30, 30]
      bgR = rgb[0]; bgG = rgb[1]; bgB = rgb[2]
      const newCols = Math.floor(cv.width / FS)
      if (newCols !== cols) {
        cols = newCols
        drops = Array.from({ length: cols }, (_, i) => -Math.floor(Math.random() * 30 + i % 10))
      }
      ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`; ctx.fillRect(0, 0, cv.width, cv.height)
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(cv)
    const randChar = () => CHARS[Math.floor(Math.random() * CHARS.length)]
    let raf: number, last = 0

    function draw(ts: number) {
      raf = requestAnimationFrame(draw)
      if (ts - last < 40) return; last = ts
      ctx.fillStyle = `rgba(${bgR},${bgG},${bgB},0.07)`; ctx.fillRect(0, 0, cv.width, cv.height)
      ctx.font = `bold ${FS}px monospace`; ctx.textAlign = 'left'
      for (let i = 0; i < cols; i++) {
        const py = drops[i] * FS
        if (py >= 0 && py < cv.height) { ctx.fillStyle = 'rgba(210,255,210,0.98)'; ctx.fillText(randChar(), i * FS, py) }
        drops[i]++
        if (drops[i] * FS > cv.height && Math.random() > 0.975) drops[i] = -Math.floor(Math.random() * 25)
      }
    }
    raf = requestAnimationFrame(draw)

    function onKey() { onStop() }
    window.addEventListener('keydown', onKey)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('keydown', onKey) }
  }, [onStop])

  return (
    <div className="flex-1 relative overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-green-400/40 pointer-events-none select-none">
        press any key to exit
      </div>
    </div>
  )
}
```

- [ ] **Step 9: Rewrite `src/components/panels/TerminalTab.tsx` as coordinator**

Replace the entire file with:

```tsx
'use client'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { TerminalLine, TerminalHandle, StreamEntry } from '@/features/terminal/types'
import { computeDonutFrame, buildMonitorFrame, makeLogs, makeDeployLogs } from '@/features/terminal/monitor'
import { dispatch } from '@/features/terminal/commands'
import DinoGame    from '@/features/terminal/components/DinoGame'
import MatrixEffect from '@/features/terminal/components/MatrixEffect'

export type { TerminalHandle } from '@/features/terminal/types'

interface Props {
  onNavigate: (id: string) => void
  onLastCommandChange: (cmd: string | null) => void
  onThemeChange?: (theme: string) => void
}

const PROMPT = 'dwijesh@portfolio:~$'

const TerminalTab = forwardRef<TerminalHandle, Props>(({ onNavigate, onLastCommandChange, onThemeChange }, ref) => {
  const [lines, setLines]     = useState<TerminalLine[]>([
    { type: 'info',   text: `  Welcome to Dwijesh's portfolio terminal. Type 'help' for commands.` },
    { type: 'output', text: '' },
  ])
  const [input, setInput]     = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)

  const [donutActive,   setDonutActive]   = useState(false)
  const [donutFrame,    setDonutFrame]    = useState('')
  const [dinoActive,    setDinoActive]    = useState(false)
  const [matrixActive,  setMatrixActive]  = useState(false)
  const [monitorActive, setMonitorActive] = useState(false)
  const [monitorFrame,  setMonitorFrame]  = useState('')

  const donutA    = useRef(1)
  const donutB    = useRef(1)
  const startTime = useRef(Date.now())
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!donutActive) return
    const id = setInterval(() => {
      donutA.current += 0.04; donutB.current += 0.02
      setDonutFrame(computeDonutFrame(donutA.current, donutB.current))
    }, 50)
    return () => clearInterval(id)
  }, [donutActive])

  useEffect(() => {
    if (!monitorActive) return
    let frame = 0
    const id = setInterval(() => {
      const t   = frame * 0.05
      const cpu = Math.min(99, Math.max(10, Math.floor(55 + 28 * Math.sin(t * 0.7) + 12 * Math.sin(t * 1.9))))
      const mem = Math.min(99, Math.max(10, Math.floor(54 + 14 * Math.sin(t * 0.4 + 1))))
      const net = Math.min(99, Math.max(0,  Math.floor(20 + 60 * Math.abs(Math.sin(t * 2.1)))))
      const uptime = Math.floor((Date.now() - startTime.current) / 1000)
      setMonitorFrame(buildMonitorFrame(cpu, mem, net, uptime, 58 + Math.floor(Math.random() * 4)))
      frame++
    }, 300)
    return () => clearInterval(id)
  }, [monitorActive])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [lines])

  useImperativeHandle(ref, () => ({
    clear:          () => setLines([]),
    runCommand:     (cmd) => execute(cmd),
    getLastCommand: () => history[0] ?? null,
    pushLines:      (nl) => setLines(prev => [...prev, ...nl]),
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
      setDonutFrame(computeDonutFrame(1, 1)); setDonutActive(true); record(trimmed); return
    }
    if (nameLow === 'dino')    { setLines(prev => [...prev, inputLine]); setDinoActive(true);    record(trimmed); return }
    if (nameLow === 'matrix')  { setLines(prev => [...prev, inputLine]); setMatrixActive(true);  record(trimmed); return }
    if (nameLow === 'monitor') { setLines(prev => [...prev, inputLine]); setMonitorActive(true); record(trimmed); return }
    if (nameLow === 'logs')    { setLines(prev => [...prev, inputLine]); streamLines(makeLogs());       record(trimmed); return }
    if (nameLow === 'deploy')  { setLines(prev => [...prev, inputLine]); streamLines(makeDeployLogs()); record(trimmed); return }

    const { lines: newLines, clear } = dispatch(trimmed, { onNavigate, onThemeChange })
    if (clear) setLines([])
    else setLines(prev => [...prev, inputLine, ...newLines])
    if (trimmed) record(trimmed)
  }

  function submit() { execute(input); setInput('') }

  function onKeyDown(e: React.KeyboardEvent) {
    if (donutActive)  { if ((e.ctrlKey && e.key === 'c') || e.key === 'Escape') { e.preventDefault(); stopMode(setDonutActive) }; return }
    if (dinoActive || matrixActive) return  // game components handle their own Ctrl+C
    if (monitorActive){ if ((e.ctrlKey && e.key === 'c') || e.key === 'Escape') { e.preventDefault(); stopMode(setMonitorActive) }; return }
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
    <div className="flex flex-col h-full bg-vsc-bg font-mono text-sm cursor-text" onClick={() => inputRef.current?.focus()}>
      {dinoActive   && <DinoGame    onStop={() => stopMode(setDinoActive)}   />}
      {matrixActive && <MatrixEffect onStop={() => stopMode(setMatrixActive)} />}
      <div className={`flex-1 overflow-auto panel-scroll px-4 py-2 space-y-0.5 ${dinoActive || matrixActive ? 'hidden' : ''}`}>
        {donutActive ? (
          <div className="flex flex-col items-center justify-center h-full">
            <pre className="text-vsc-fn text-[9px] leading-[1.15] font-mono select-none">{donutFrame}</pre>
            <div className="text-vsc-muted text-[10px] mt-2">Ctrl+C or Esc to stop</div>
          </div>
        ) : monitorActive ? (
          <div className="flex flex-col items-center justify-center h-full">
            <pre className="text-vsc-fn text-[11px] leading-[1.6] font-mono select-none">{monitorFrame}</pre>
          </div>
        ) : (
          <>
            {lines.map((l, i) => (
              <div key={i} className={`leading-5 whitespace-pre-wrap break-all
                ${l.type === 'input'   ? 'text-vsc-fn'      : ''}
                ${l.type === 'output'  ? 'text-vsc-text/90' : ''}
                ${l.type === 'error'   ? 'text-red-400'     : ''}
                ${l.type === 'info'    ? 'text-vsc-comment' : ''}
                ${l.type === 'success' ? 'text-green-400'   : ''}
                ${l.type === 'warning' ? 'text-yellow-400'  : ''}
              `}>{l.text}</div>
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>
      <div className="shrink-0 flex items-center px-4 py-1.5 border-t border-vsc-border/30">
        <span className="text-vsc-fn mr-2 shrink-0 select-none">{PROMPT}</span>
        <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown} autoFocus
          className="flex-1 bg-transparent text-vsc-text outline-none caret-vsc-text"
          spellCheck={false} autoComplete="off" autoCorrect="off" />
      </div>
    </div>
  )
})

TerminalTab.displayName = 'TerminalTab'
export default TerminalTab
```

- [ ] **Step 10: Commit**

```bash
npm run type-check
git add -A
git commit -m "refactor: extract terminal feature — commands registry, DinoGame, MatrixEffect"
```

---

### Task 4: Copilot Feature Module

**Files:**
- Create: `src/features/copilot/types.ts`
- Create: `src/features/copilot/lib/parseThinkBlocks.ts`
- Create: `src/features/copilot/lib/detectIntent.ts`
- Create: `src/features/copilot/lib/fetchChat.ts`
- Create: `src/features/copilot/lib/formatModel.ts`
- Create: `src/features/copilot/hooks/useStreamingDisplay.ts`
- Create: `src/features/copilot/hooks/usePrefetchCache.ts`
- Create: `src/features/copilot/components/ThinkingIndicator.tsx`
- Create: `src/features/copilot/components/CopilotIcon.tsx`
- Create: `src/features/copilot/components/LogsView.tsx`
- Create: `src/features/copilot/components/BugReportWidget.tsx`
- Create: `src/features/copilot/components/CopilotMarkdown.tsx`
- Modify: `src/components/panels/CopilotPanel.tsx`

- [ ] **Step 1: Create `src/features/copilot/types.ts`**

```ts
import type { AiFileAction } from '@/lib/fileSystem'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  thinking?: string
  action?: AiFileAction
}

export interface LogEntry {
  ts: number
  level: 'info' | 'warn' | 'error'
  tag: string
  msg: string
}

export type IssueState =
  | { status: 'idle' }
  | { status: 'form'; title: string; desc: string }
  | { status: 'submitting' }
  | { status: 'done'; number: number }
  | { status: 'error'; msg: string }
```

- [ ] **Step 2: Create `src/features/copilot/lib/parseThinkBlocks.ts`**

```ts
export function parseThinkBlocks(raw: string): { thinking: string; content: string } {
  let thinking = ''
  let content = ''
  let rest = raw
  while (rest.length > 0) {
    const start = rest.indexOf('<think>')
    if (start === -1) { content += rest; break }
    content += rest.slice(0, start)
    rest = rest.slice(start + 7)
    const end = rest.indexOf('</think>')
    if (end === -1) { thinking += rest; break }
    thinking += rest.slice(0, end)
    rest = rest.slice(end + 8)
  }
  return { thinking: thinking.trimStart(), content: content.trimStart() }
}
```

- [ ] **Step 3: Create `src/features/copilot/lib/detectIntent.ts`**

```ts
export const BUG_KEYWORDS = /\b(bug|broken|error|issue|problem|crash|wrong|not work|doesn't work|doesn't load|fail|glitch|weird|strange|incorrect|missing|stuck)\b/i

export function detectIntent(text: string): 'action' | 'chat' {
  const lower = text.toLowerCase()
  const verbs = ['create', 'make', 'add', 'write', 'generate', 'update', 'edit', 'modify',
                 'change', 'delete', 'remove', 'rename', 'move', 'rewrite', 'refactor']
  const fileKeys = ['file', 'folder', 'directory', 'component', 'page', 'readme',
                    '.tsx', '.ts', '.js', '.jsx', '.css', '.json', '.md', '.html']
  return verbs.some(v => lower.includes(v)) && fileKeys.some(k => lower.includes(k))
    ? 'action' : 'chat'
}
```

- [ ] **Step 4: Create `src/features/copilot/lib/fetchChat.ts`**

```ts
export const SUGGESTED = [
  { label: 'What has he built?',  query: 'What projects has Dwijesh built and what problems do they solve?' },
  { label: 'Tech stack',          query: "What is Dwijesh's full tech stack and what systems has he worked on?" },
  { label: 'rPPG dissertation',   query: 'Tell me about the rPPG heart rate prediction dissertation.' },
  { label: 'Open to work?',       query: 'Is Dwijesh open to new roles? What kind of work is he looking for?' },
]

export const PREFETCH_QUERIES = [
  ...SUGGESTED.map(s => s.query),
  "What is Dwijesh's full tech stack and the systems he's built?",
  "What are Dwijesh's main projects and what makes them technically interesting?",
  "What kind of work is Dwijesh looking for and how can I contact him?",
].filter((q, i, a) => a.indexOf(q) === i)

export async function fetchFullResponse(query: string): Promise<{ text: string; remaining: number | null }> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Prefetch': '1' },
    body: JSON.stringify({ messages: [{ role: 'user', content: query }] }),
  })
  if (!res.ok) throw new Error('prefetch failed')
  const remaining = res.headers.get('X-RateLimit-Remaining')
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = '', accumulated = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') break
      try {
        const delta = JSON.parse(data).choices?.[0]?.delta?.content
        if (delta) accumulated += delta
      } catch { /* skip */ }
    }
  }
  return { text: accumulated, remaining: remaining !== null ? Number(remaining) : null }
}
```

- [ ] **Step 5: Create `src/features/copilot/lib/formatModel.ts`**

```ts
export function formatModel(raw: string): string | null {
  const model = raw.split('/').pop() ?? raw
  const clean = model.split(':')[0]
  if (!clean || clean === 'free') return null
  return clean
}
```

- [ ] **Step 6: Create `src/features/copilot/hooks/useStreamingDisplay.ts`**

```ts
'use client'
import { useEffect, useRef } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { AiFileAction } from '@/lib/fileSystem'
import { parseThinkBlocks } from '../lib/parseThinkBlocks'
import type { Message } from '../types'

const CHARS_PER_TICK = 2
const TICK_MS = 45

export function useStreamingDisplay(
  streaming: boolean,
  setStreaming: Dispatch<SetStateAction<boolean>>,
  setMessages: Dispatch<SetStateAction<Message[]>>,
) {
  const rawAccum         = useRef('')
  const displayIdx       = useRef(0)
  const networkDone      = useRef(false)
  const pendingChatAction = useRef<AiFileAction | null>(null)

  useEffect(() => {
    if (!streaming) return
    const id = setInterval(() => {
      const total = rawAccum.current.length
      if (displayIdx.current < total) {
        displayIdx.current = Math.min(displayIdx.current + CHARS_PER_TICK, total)
        const slice = rawAccum.current.slice(0, displayIdx.current)
        const { thinking, content } = parseThinkBlocks(slice)
        setMessages(m => {
          const c = [...m]
          if (c.length === 0) return c
          c[c.length - 1] = { role: 'assistant', content, thinking }
          return c
        })
      } else if (networkDone.current) {
        if (pendingChatAction.current) {
          const action = pendingChatAction.current
          pendingChatAction.current = null
          setMessages(m => {
            const c = [...m]
            if (c.length > 0) c[c.length - 1] = { ...c[c.length - 1], action }
            return c
          })
        }
        setStreaming(false)
      }
    }, TICK_MS)
    return () => clearInterval(id)
  }, [streaming, setStreaming, setMessages])

  return { rawAccum, displayIdx, networkDone, pendingChatAction }
}
```

- [ ] **Step 7: Create `src/features/copilot/hooks/usePrefetchCache.ts`**

```ts
'use client'
import { useEffect, useRef } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { fetchFullResponse, PREFETCH_QUERIES } from '../lib/fetchChat'

export function usePrefetchCache(setMsgsLeft: Dispatch<SetStateAction<number | null>>) {
  const cache = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    let cancelled = false
    PREFETCH_QUERIES.forEach((query, i) => {
      setTimeout(() => {
        if (cancelled || cache.current.has(query)) return
        fetchFullResponse(query)
          .then(({ text, remaining }) => {
            if (!cancelled && text) cache.current.set(query, text)
            if (!cancelled && remaining !== null && remaining >= 0) setMsgsLeft(remaining)
          })
          .catch(() => {})
      }, i * 600)
    })
    return () => { cancelled = true }
  }, [setMsgsLeft])

  return cache
}
```

- [ ] **Step 8: Create `src/features/copilot/components/ThinkingIndicator.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'

const THINKING_WORDS = [
  'Thinking', 'Reasoning', 'Cogitating', 'Computing',
  'Pondering', 'Deliberating', 'Ruminating', 'Considering',
]

export function ThinkingIndicator() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % THINKING_WORDS.length), 1500)
    return () => clearInterval(t)
  }, [])
  return <span className="text-vsc-muted/50 text-xs italic">{THINKING_WORDS[idx]}&hellip;</span>
}
```

- [ ] **Step 9: Create `src/features/copilot/components/CopilotIcon.tsx`**

```tsx
export function CopilotIcon({ size = 48, muted = false }: { size?: number; muted?: boolean }) {
  return (
    <img
      src="/vscode-copilot.png"
      width={size}
      height={size}
      alt="Copilot"
      style={{ filter: `invert(1) ${muted ? 'brightness(0.5)' : 'brightness(1)'}`, mixBlendMode: 'screen', display: 'block' }}
    />
  )
}
```

- [ ] **Step 10: Create `src/features/copilot/components/LogsView.tsx`**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import type { LogEntry } from '../types'

export function LogsView({ logs, onClear }: { logs: LogEntry[]; onClear: () => void }) {
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => { bottomRef.current?.scrollIntoView() }, [logs.length])
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-vsc-muted text-[11px] gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <span className="opacity-50">No logs — send a message to start</span>
      </div>
    )
  }
  const startTs = logs[0].ts
  return (
    <div className="h-full overflow-y-auto panel-scroll font-mono text-[11px]">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-vsc-border/30 sticky top-0 bg-[#181818]">
        <span className="text-vsc-muted/50">{logs.length} entries</span>
        <button onClick={onClear} className="text-vsc-muted/40 hover:text-vsc-muted transition-colors text-[10px]">Clear</button>
      </div>
      <div className="p-3 space-y-0.5">
        {logs.map((l, i) => (
          <div key={i} className="flex gap-2 leading-5 items-baseline">
            <span className="text-vsc-muted/40 shrink-0 tabular-nums">+{((l.ts - startTs) / 1000).toFixed(2)}s</span>
            <span className={`shrink-0 font-semibold min-w-[80px] ${l.level === 'error' ? 'text-red-400' : l.level === 'warn' ? 'text-yellow-400' : 'text-[#4ec9b0]/70'}`}>[{l.tag}]</span>
            <span className="text-vsc-text/75 break-all">{l.msg}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
```

- [ ] **Step 11: Create `src/features/copilot/components/BugReportWidget.tsx`**

```tsx
'use client'
import type { IssueState } from '../types'

interface Props {
  issueState: IssueState
  onStateChange: (s: IssueState) => void
  onDismiss: () => void
}

export function BugReportWidget({ issueState, onStateChange, onDismiss }: Props) {
  return (
    <div className="mx-3 mb-2 rounded-md border border-[#f14c4c]/30 bg-[#1e1e1e] overflow-hidden text-[11px]">
      {issueState.status === 'form' && (
        <div className="p-3 space-y-2">
          <div className="text-[11px] font-semibold text-[#f14c4c]/80 mb-1">Report a Bug</div>
          <input
            className="w-full bg-[#2a2a2a] border border-vsc-border/50 rounded px-2 py-1 text-vsc-text outline-none focus:border-vsc-accent/50 text-[11px]"
            placeholder="Issue title" maxLength={100}
            value={issueState.title}
            onChange={e => onStateChange({ ...issueState, title: e.target.value })}
          />
          <textarea
            className="w-full bg-[#2a2a2a] border border-vsc-border/50 rounded px-2 py-1 text-vsc-text outline-none focus:border-vsc-accent/50 text-[11px] resize-none"
            placeholder="Describe the issue" maxLength={2000} rows={3}
            value={issueState.desc}
            onChange={e => onStateChange({ ...issueState, desc: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <button onClick={onDismiss} className="text-vsc-muted/50 hover:text-vsc-muted transition-colors px-2 py-0.5">Cancel</button>
            <button
              disabled={!issueState.title.trim()}
              onClick={async () => {
                const { title, desc } = issueState as { status: 'form'; title: string; desc: string }
                onStateChange({ status: 'submitting' })
                try {
                  const r = await fetch('/api/report-issue', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description: desc }),
                  })
                  const data = await r.json()
                  if (!r.ok) onStateChange({ status: 'error', msg: data.error ?? 'Failed.' })
                  else onStateChange({ status: 'done', number: data.number })
                } catch { onStateChange({ status: 'error', msg: 'Network error.' }) }
              }}
              className="px-2 py-0.5 rounded bg-[#f14c4c]/20 text-[#f14c4c] hover:bg-[#f14c4c]/30 transition-colors disabled:opacity-40"
            >Submit</button>
          </div>
        </div>
      )}
      {issueState.status === 'submitting' && <div className="px-3 py-2 text-vsc-muted/60 italic">Logging issue…</div>}
      {issueState.status === 'done' && (
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[#89d185]">✓ Issue #{issueState.number} logged</span>
          <button onClick={onDismiss} className="text-vsc-muted/50 hover:text-vsc-muted transition-colors">✕</button>
        </div>
      )}
      {issueState.status === 'error' && (
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[#f14c4c]">{issueState.msg}</span>
          <button onClick={() => onStateChange({ status: 'form', title: '', desc: '' })} className="text-vsc-muted/50 hover:text-vsc-muted ml-2 transition-colors">Retry</button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 12: Create `src/features/copilot/components/CopilotMarkdown.tsx`**

```tsx
'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function CopilotMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        strong: ({ children }) => <strong className="font-semibold text-vsc-text">{children}</strong>,
        code: ({ children }) => <code className="px-1 bg-[#1a1a2e] border border-vsc-border/50 rounded text-[#9cdcfe] text-[11px] font-mono">{children}</code>,
        ul: ({ children }) => <ul className="space-y-0.5">{children}</ul>,
        li: ({ children }) => <li className="flex gap-1.5 items-baseline"><span className="text-vsc-accent/60 shrink-0 mt-0.5 text-[10px]">›</span><span>{children}</span></li>,
        ol: ({ children }) => <ol className="space-y-0.5">{children}</ol>,
        h1: ({ children }) => <div className="font-semibold text-vsc-text text-[12px] mt-1.5 mb-0.5">{children}</div>,
        h2: ({ children }) => <div className="font-semibold text-vsc-text text-[12px] mt-1.5 mb-0.5">{children}</div>,
        h3: ({ children }) => <div className="font-semibold text-vsc-text text-[12px] mt-1.5 mb-0.5">{children}</div>,
        p: ({ children }) => <div>{children}</div>,
      }}
    >{content}</ReactMarkdown>
  )
}
```

- [ ] **Step 13: Rewrite `src/components/panels/CopilotPanel.tsx`**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import type { AiFileAction } from '@/lib/fileSystem'
import { validateAiAction } from '@/lib/fileSystem'
import { DEFAULT_CONTENT } from '@/shared/content'
import type { Message, LogEntry, IssueState } from '@/features/copilot/types'
import { detectIntent, BUG_KEYWORDS } from '@/features/copilot/lib/detectIntent'
import { formatModel } from '@/features/copilot/lib/formatModel'
import { useStreamingDisplay } from '@/features/copilot/hooks/useStreamingDisplay'
import { usePrefetchCache } from '@/features/copilot/hooks/usePrefetchCache'
import { ThinkingIndicator } from '@/features/copilot/components/ThinkingIndicator'
import { BugReportWidget } from '@/features/copilot/components/BugReportWidget'
import { LogsView } from '@/features/copilot/components/LogsView'
import { CopilotMarkdown } from '@/features/copilot/components/CopilotMarkdown'
import { CopilotIcon } from '@/features/copilot/components/CopilotIcon'

interface Props {
  onThinkingChange:  (v: boolean) => void
  onClose:           () => void
  onPendingAction:   (action: AiFileAction, onResult: (applied: boolean) => void) => void
  workspaceFiles?:   string[]
  fileContents?:     Record<string, string>
  triggerBugReport?: number
}

function resolveFileContent(name: string, fileContents: Record<string, string>): string {
  return fileContents[`file:${name}`] ?? fileContents[name] ?? DEFAULT_CONTENT[name] ?? ''
}

function attachedFiles(message: string, names: string[], fileContents: Record<string, string>): Array<{ path: string; content: string }> {
  const lower = message.toLowerCase()
  const mentions = [...message.matchAll(/@([\w.\-]+)/g)].map(m => m[1].toLowerCase())
  return names
    .filter(n => {
      const nLower = n.toLowerCase()
      const baseName = nLower.split('.')[0]
      return mentions.some(m => nLower.startsWith(m) || baseName === m) || lower.includes(nLower)
    })
    .map(n => ({ path: n, content: resolveFileContent(n, fileContents) }))
    .filter(f => f.content.length > 0)
    .slice(0, 5)
}

function StreamingBubble({ content, isStreaming, busy }: { content: string; isStreaming: boolean; busy: boolean }) {
  if (!content) return busy ? <ThinkingIndicator /> : null
  if (isStreaming) return <span className="whitespace-pre-wrap">{content}</span>
  return <CopilotMarkdown content={content} />
}

export default function CopilotPanel({ onThinkingChange, onClose, onPendingAction, workspaceFiles = [], fileContents = {}, triggerBugReport }: Props) {
  const [messages, setMessages]           = useState<Message[]>([])
  const [input, setInput]                 = useState('')
  const [streaming, setStreaming]         = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [lastEditMsg, setLastEditMsg]     = useState<string | null>(null)
  const [failedIdx, setFailedIdx]         = useState<number | null>(null)
  const [thinkExpanded, setThinkExpanded] = useState<Record<number, boolean>>({})
  const [msgsLeft, setMsgsLeft]           = useState<number | null>(null)
  const [issueState, setIssueState]       = useState<IssueState>({ status: 'idle' })
  const [pendingBugMsg, setPendingBugMsg] = useState<string | null>(null)
  const [logs, setLogs]                   = useState<LogEntry[]>([])
  const [activeView, setActiveView]       = useState<'chat' | 'logs'>('chat')
  const [activeModel, setActiveModel]     = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('copilot:resolvedModel') : null
  )
  const bottomRef      = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLTextAreaElement>(null)
  const abortRef       = useRef<AbortController | null>(null)
  const activeModelRef = useRef<string | null>(null)
  const { rawAccum, displayIdx, networkDone, pendingChatAction } =
    useStreamingDisplay(streaming, setStreaming, setMessages)
  const prefetchCache = usePrefetchCache(setMsgsLeft)

  useEffect(() => {
    if (!triggerBugReport) return
    setPendingBugMsg('__direct_report__')
    setIssueState({ status: 'form', title: '', desc: '' })
  }, [triggerBugReport])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { onThinkingChange(streaming || actionLoading) }, [streaming, actionLoading, onThinkingChange])

  useEffect(() => {
    const cached   = localStorage.getItem('copilot:resolvedModel')
    const cachedAt = Number(localStorage.getItem('copilot:resolvedModelAt') ?? 0)
    const stale    = Date.now() - cachedAt > 24 * 60 * 60 * 1000
    if (cached) activeModelRef.current = cached
    if (!cached || stale) {
      fetch('/api/model-info').then(r => r.json()).then(({ model }) => {
        if (model && model !== activeModelRef.current) { activeModelRef.current = model; setActiveModel(model) }
        if (model) {
          localStorage.setItem('copilot:resolvedModel', model)
          localStorage.setItem('copilot:resolvedModelAt', String(Date.now()))
        }
      }).catch(() => {})
    }
  }, [])

  function pushLog(level: LogEntry['level'], tag: string, msg: string) {
    setLogs(prev => [...prev, { ts: Date.now(), level, tag, msg }])
  }

  const BUG_PREFILL = 'I encountered a bug with the website: '
  const bugReportRe = /^I encountered a bug with the website:\s*(.+)/i

  async function sendChat(text?: string) {
    const content = (text ?? input).trim()
    if (!content || streaming) return
    let aiContext = content
    const bugMatch = content.match(bugReportRe)
    if (bugMatch) {
      const desc = bugMatch[1].trim()
      try {
        const r = await fetch('/api/report-issue', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: desc.slice(0, 100), description: desc }),
        })
        const data = await r.json()
        aiContext = r.ok
          ? `${content}\n\n[SYSTEM: Bug automatically logged as GitHub Issue #${data.number}. Confirm this to the user.]`
          : `${content}\n\n[SYSTEM: Bug logging failed — ${data.error}. Apologise.]`
      } catch { aiContext = `${content}\n\n[SYSTEM: Bug logging failed — network error.]` }
      setPendingBugMsg(null)
    }
    const userMsg: Message = { role: 'user', content }
    const history = [...messages, userMsg]
    const historyForApi = aiContext !== content ? [...messages, { role: 'user' as const, content: aiContext }] : history
    setMessages([...history, { role: 'assistant', content: '', thinking: '' }])
    setInput('')
    rawAccum.current = ''; displayIdx.current = 0; networkDone.current = false
    setStreaming(true)
    pushLog('info', 'REQUEST', `msg #${history.length} — "${content.slice(0, 80)}${content.length > 80 ? '…' : ''}"`)
    const cached = prefetchCache.current.get(content)
    if (cached) {
      prefetchCache.current.delete(content)
      rawAccum.current = cached; networkDone.current = true
      pushLog('info', 'CACHE', `served from prefetch — ${cached.length} chars buffered`)
      inputRef.current?.focus(); return
    }
    const fileCtx = attachedFiles(content, workspaceFiles, fileContents)
    if (fileCtx.length > 0) pushLog('info', 'FILES', `attaching ${fileCtx.length} file(s): ${fileCtx.map(f => f.path).join(', ')}`)
    const requestSentAt = Date.now()
    const controller = new AbortController(); abortRef.current = controller
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ messages: historyForApi, ...(fileCtx.length > 0 ? { fileContext: fileCtx } : {}), ...(workspaceFiles.length > 0 ? { workspaceFiles } : {}) }),
      })
      const remaining = res.headers.get('X-RateLimit-Remaining')
      if (remaining !== null) setMsgsLeft(Number(remaining))
      pushLog(res.ok ? 'info' : 'error', 'HTTP', `${res.status} ${res.statusText || (res.ok ? 'OK' : 'ERR')}${remaining !== null ? ` — ${remaining} msgs left` : ''}`)
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Unknown error' }))
        pushLog('error', 'API', errData.error ?? `HTTP ${res.status}`)
        setMessages(m => { const c = [...m]; c[c.length - 1] = { role: 'assistant', content: `Error: ${errData.error ?? 'Unknown error'}` }; return c })
        return
      }
      const reader = res.body!.getReader(); const decoder = new TextDecoder()
      let buffer = '', firstTokenAt: number | null = null, totalChars = 0, finishReason: string | null = null
      while (true) {
        const { done, value } = await reader.read(); if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n'); buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') { pushLog('info', 'STREAM', '[DONE] received'); break }
          try {
            const parsed = JSON.parse(data)
            if (parsed.model && parsed.model !== activeModelRef.current) {
              activeModelRef.current = parsed.model; setActiveModel(parsed.model)
              localStorage.setItem('copilot:resolvedModel', parsed.model)
            }
            const choice = parsed.choices?.[0]; const delta = choice?.delta?.content; const reason = choice?.finish_reason
            if (reason) finishReason = reason
            if (delta) {
              if (!firstTokenAt) { firstTokenAt = Date.now(); pushLog('info', 'STREAM', `first token — latency ${firstTokenAt - requestSentAt}ms`) }
              totalChars += delta.length; rawAccum.current += delta
            }
          } catch { /* skip malformed SSE */ }
        }
      }
      const fileActionMatch = rawAccum.current.match(/<file-action>([\s\S]*?)<\/file-action>/i)
      if (fileActionMatch) {
        try { const validation = validateAiAction(JSON.parse(fileActionMatch[1].trim())); if (validation.ok) pendingChatAction.current = validation.action } catch { /* ignore */ }
        rawAccum.current = rawAccum.current.replace(/<file-action>[\s\S]*?<\/file-action>/gi, '').trim()
      }
      networkDone.current = true
      pushLog(totalChars === 0 ? 'warn' : 'info', 'STREAM', `ended — ${totalChars} chars buffered, finish_reason: ${finishReason ?? 'not provided'}`)
      if (totalChars === 0) {
        setStreaming(false)
        const hint = finishReason === 'length' ? 'The model hit its context limit — try a shorter message.' : 'No response received. The model may be unavailable — try again.'
        setMessages(m => { const c = [...m]; c[c.length - 1] = { role: 'assistant', content: `⚠️ ${hint}` }; return c })
      }
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') { networkDone.current = true; pushLog('info', 'STOP', 'stopped by user') }
      else {
        const msg = e instanceof Error ? e.message : String(e)
        pushLog('error', 'ERROR', msg); networkDone.current = true
        setMessages(m => { const c = [...m]; c[c.length - 1] = { role: 'assistant', content: 'Connection error.' }; return c })
        setStreaming(false)
      }
    } finally {
      inputRef.current?.focus()
      const aiMentionedForm = rawAccum.current.toLowerCase().includes('bug report form has appeared')
      if (BUG_KEYWORDS.test(content) || aiMentionedForm) { setPendingBugMsg(content); setIssueState({ status: 'form', title: '', desc: '' }) }
    }
  }

  async function sendEditRequest(text?: string) {
    const content = (text ?? input).trim()
    if (!content || actionLoading) return
    setInput(''); setFailedIdx(null); setLastEditMsg(content); setActionLoading(true)
    pushLog('info', 'ACTION', `intent detected — "${content.slice(0, 80)}${content.length > 80 ? '…' : ''}"`)
    setMessages(prev => [...prev, { role: 'user', content }, { role: 'assistant', content: '' }])
    const controller = new AbortController(); abortRef.current = controller
    try {
      const res = await fetch('/api/ai-action', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ message: content, files: workspaceFiles, fileContents: attachedFiles(content, workspaceFiles, fileContents) }),
      })
      pushLog(res.ok ? 'info' : 'error', 'HTTP', `${res.status} ${res.ok ? 'OK' : 'ERR'} (ai-action)`)
      const data = await res.json()
      if (!res.ok) {
        pushLog('error', 'ACTION', data.error ?? `HTTP ${res.status}`)
        setMessages(prev => { const c = [...prev]; const idx = c.length - 1; c[idx] = { role: 'assistant', content: `❌ ${data.error ?? 'Unknown error'}` }; setFailedIdx(idx); return c })
        return
      }
      const action: AiFileAction = data.action
      pushLog('info', 'ACTION', `${action.action} → ${action.path}`)
      const verb: Record<string, string> = { create_file: 'create', update_file: 'update', delete_file: 'delete', create_folder: 'create folder' }
      const reply = data.reply ?? `Ready to ${verb[action.action] ?? action.action} \`${action.path}\` — confirm in the dialog.`
      setMessages(prev => { const c = [...prev]; c[c.length - 1] = { role: 'assistant', content: reply }; return c })
      setFailedIdx(null)
      onPendingAction(action, (applied) => {
        setMessages(prev => { const c = [...prev]; const last = c[c.length - 1]; if (!last || last.role !== 'assistant') return prev; c[c.length - 1] = { ...last, content: last.content + (applied ? '\n\n✅ Applied.' : '\n\n❌ Cancelled.') }; return c })
      })
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') {
        pushLog('info', 'STOP', 'action stopped by user')
        setMessages(prev => { const c = [...prev]; c[c.length - 1] = { role: 'assistant', content: '⏹ Stopped.' }; return c })
        return
      }
      const msg = e instanceof Error ? e.message : String(e); pushLog('error', 'ERROR', msg)
      setMessages(prev => { const c = [...prev]; const idx = c.length - 1; c[idx] = { role: 'assistant', content: '❌ Connection error. Check OPENROUTER_API_KEY.' }; setFailedIdx(idx); return c })
    } finally { setActionLoading(false); inputRef.current?.focus() }
  }

  function handleSend() {
    const text = input.trim()
    if (!text || busy) return
    if (detectIntent(text) === 'action') sendEditRequest(text)
    else sendChat(text)
  }

  const busy    = streaming || actionLoading
  const isEmpty = messages.length === 0
  const atMatch = input.match(/@([\w.\-]*)$/)
  const mentionQuery = atMatch ? atMatch[1].toLowerCase() : null
  const mentionFiles = mentionQuery !== null ? workspaceFiles.filter(f => !mentionQuery || f.toLowerCase().includes(mentionQuery)).slice(0, 6) : []

  function insertMention(fileName: string) {
    const updated = input.replace(/@([\w.\-]*)$/, `@${fileName} `)
    setInput(updated)
    setTimeout(() => { if (inputRef.current) { inputRef.current.style.height = 'auto'; inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px'; inputRef.current.focus() } }, 0)
  }

  return (
    <div className="flex flex-col h-full w-[340px] bg-[#181818] border-l border-vsc-border shrink-0 font-sans panel-slide-right">
      <div className="flex items-center border-b border-vsc-border/60 shrink-0 select-none">
        <button onClick={() => setActiveView('chat')} className={`relative px-4 py-2 text-[11px] font-semibold tracking-widest uppercase transition-colors ${activeView === 'chat' ? 'text-vsc-text' : 'text-vsc-muted hover:text-vsc-text'}`}>
          Chat{activeView === 'chat' && <span className="absolute bottom-0 left-2 right-2 h-[1px] bg-vsc-text" />}
        </button>
        <button onClick={() => setActiveView('logs')} className={`relative px-4 py-2 text-[11px] font-semibold tracking-widest uppercase transition-colors flex items-center gap-1.5 ${activeView === 'logs' ? 'text-vsc-text' : 'text-vsc-muted hover:text-vsc-text'}`}>
          Logs
          {logs.length > 0 && <span className={`text-[10px] font-mono ${logs.some(l => l.level === 'error') ? 'text-red-400' : logs.some(l => l.level === 'warn') ? 'text-yellow-400' : 'text-vsc-muted/60'}`}>{logs.length}</span>}
          {activeView === 'logs' && <span className="absolute bottom-0 left-2 right-2 h-[1px] bg-vsc-text" />}
        </button>
        <div className="flex items-center gap-0.5 ml-auto pr-1">
          {messages.length > 0 && <button onClick={() => setMessages([])} title="New chat" className="p-1.5 text-vsc-muted hover:text-vsc-text transition-colors rounded hover:bg-vsc-hover"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></button>}
          <button onClick={onClose} title="Close" className="p-1.5 text-vsc-muted hover:text-vsc-text transition-colors rounded hover:bg-vsc-hover"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
        </div>
      </div>
      {activeView === 'logs' && <div className="flex-1 overflow-hidden"><LogsView logs={logs} onClear={() => setLogs([])} /></div>}
      <div className={`flex-1 overflow-y-auto panel-scroll ${activeView !== 'chat' ? 'hidden' : ''}`}>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-5 px-6">
            <CopilotIcon size={72} />
            <div className="text-center space-y-2">
              <div className="text-[15px] font-semibold text-vsc-text">Ask Copilot</div>
              <div className="text-[11px] text-vsc-muted leading-[1.6] max-w-[230px]">Copilot is powered by AI, so mistakes are possible. Review output carefully before use.</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => sendChat("What projects has Dwijesh built and what problems do they solve?")} title="What has he built?" className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-vsc-border/50 hover:border-vsc-border hover:bg-vsc-hover transition-colors group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-vsc-muted group-hover:text-vsc-text transition-colors"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>
                <span className="text-[10px] text-vsc-muted group-hover:text-vsc-text transition-colors">Projects</span>
              </button>
              <button onClick={() => sendChat("What is Dwijesh's full tech stack and what systems has he worked on?")} title="Tech stack" className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-vsc-border/50 hover:border-vsc-border hover:bg-vsc-hover transition-colors group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-vsc-muted group-hover:text-vsc-text transition-colors"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                <span className="text-[10px] text-vsc-muted group-hover:text-vsc-text transition-colors">Stack</span>
              </button>
              <button onClick={() => sendChat("Is Dwijesh open to new roles? What kind of work is he looking for?")} title="Open to work?" className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-vsc-border/50 hover:border-vsc-border hover:bg-vsc-hover transition-colors group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-vsc-muted group-hover:text-vsc-text transition-colors"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-[10px] text-vsc-muted group-hover:text-vsc-text transition-colors">Hire</span>
              </button>
              <button onClick={() => sendChat("Tell me about the rPPG heart rate prediction dissertation.")} title="Dissertation" className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-vsc-border/50 hover:border-vsc-border hover:bg-vsc-hover transition-colors group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-vsc-muted group-hover:text-vsc-text transition-colors"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <span className="text-[10px] text-vsc-muted group-hover:text-vsc-text transition-colors">Research</span>
              </button>
              <button onClick={() => { setInput(BUG_PREFILL); setTimeout(() => inputRef.current?.focus(), 0) }} title="Report a bug" className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-vsc-border/50 hover:border-[#f14c4c]/40 hover:bg-vsc-hover transition-colors group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-vsc-muted group-hover:text-[#f14c4c] transition-colors"><path d="M9 2h6l1 4H8L9 2z"/><path d="M5 8h14l-1 13H6L5 8z"/><line x1="12" y1="12" x2="12" y2="17"/></svg>
                <span className="text-[10px] text-vsc-muted group-hover:text-[#f14c4c] transition-colors">Bug</span>
              </button>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              {activeModel && formatModel(activeModel) && <div className="text-[11px] text-vsc-muted/70 font-mono text-center break-all" title={activeModel}>{formatModel(activeModel)}</div>}
              <div className="text-[10px] text-vsc-muted/40 font-mono">Powered by OpenRouter</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 px-3 py-4 font-mono text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && <div className="shrink-0 mt-0.5"><CopilotIcon size={20} muted /></div>}
                <div className="flex flex-col gap-1 max-w-[88%]">
                  {m.role === 'assistant' && m.thinking && (
                    <div className="rounded-md border border-vsc-border/40 bg-[#1e1e1e] text-[11px] overflow-hidden">
                      <button onClick={() => setThinkExpanded(prev => ({ ...prev, [i]: !prev[i] }))} className="flex items-center gap-1.5 w-full px-2.5 py-1.5 text-vsc-muted/60 hover:text-vsc-muted transition-colors">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className={`transition-transform ${thinkExpanded[i] ? 'rotate-90' : ''}`}><path d="M2 1l4 3-4 3V1z" /></svg>
                        <span className="italic">Thinking…</span>
                      </button>
                      {thinkExpanded[i] && <div className="px-3 pb-2.5 pt-0.5 text-vsc-muted/50 leading-5 whitespace-pre-wrap border-t border-vsc-border/30">{m.thinking}</div>}
                    </div>
                  )}
                  <div className={`px-3 py-2 rounded-lg text-[12px] leading-5 ${m.role === 'user' ? 'bg-[#094771] border border-[#007acc]/40 text-vsc-text whitespace-pre-wrap' : 'bg-[#252526] border border-vsc-border/60 text-vsc-text/90'}`}>
                    {m.role === 'assistant' ? <StreamingBubble content={m.content} isStreaming={streaming && i === messages.length - 1} busy={busy && i === messages.length - 1} /> : m.content}
                  </div>
                  {m.action && !busy && (
                    <button onClick={() => { onPendingAction(m.action!, () => { setMessages(prev => { const c = [...prev]; c[i] = { ...c[i], action: undefined }; return c }) }) }} className="self-start flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-[#4ec9b0] border border-[#4ec9b0]/40 rounded hover:bg-[#4ec9b0]/10 transition-colors font-mono">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Apply {m.action.action.replace('_', ' ')} → {m.action.path}
                    </button>
                  )}
                  {failedIdx === i && lastEditMsg && !busy && (
                    <button onClick={() => sendEditRequest(lastEditMsg)} className="self-start flex items-center gap-1 px-2 py-0.5 text-[11px] text-[#4ec9b0] border border-[#4ec9b0]/40 rounded hover:bg-[#4ec9b0]/10 transition-colors">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
                      Try again
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
      {pendingBugMsg && !busy && issueState.status !== 'idle' && (
        <BugReportWidget issueState={issueState} onStateChange={setIssueState} onDismiss={() => setPendingBugMsg(null)} />
      )}
      <div className={`shrink-0 border-t border-vsc-border/60 ${activeView !== 'chat' ? 'hidden' : ''}`}>
        <div className="px-3 pt-2.5 pb-1.5 relative">
          {mentionFiles.length > 0 && (
            <div className="absolute bottom-full left-3 right-3 mb-1 bg-[#252526] border border-vsc-border rounded-md shadow-lg overflow-hidden z-10">
              {mentionFiles.map(f => (
                <button key={f} onMouseDown={(e) => { e.preventDefault(); insertMention(f) }} className="w-full text-left px-3 py-1.5 text-[11px] text-vsc-text hover:bg-vsc-hover transition-colors flex items-center gap-2">
                  <span className="text-vsc-muted/50">@</span><span className="font-mono">{f}</span>
                </button>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2 bg-[#2a2a2a] border border-vsc-border/50 rounded-md px-3 py-2.5 focus-within:border-vsc-accent/50 transition-colors">
            <textarea ref={inputRef} rows={1} value={input}
              onChange={(e) => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              disabled={busy} placeholder="Ask anything — type @ to reference a file"
              className="flex-1 bg-transparent text-[12px] text-vsc-text outline-none resize-none placeholder:text-vsc-muted/40 disabled:opacity-50 leading-5 font-sans"
              style={{ minHeight: '20px', maxHeight: '120px' }} />
            {(streaming || actionLoading) ? (
              <button onClick={() => { abortRef.current?.abort(); rawAccum.current = rawAccum.current.slice(0, displayIdx.current); networkDone.current = true }} title="Stop generating" className="shrink-0 text-vsc-muted hover:text-[#f14c4c] transition-colors pb-0.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
              </button>
            ) : (
              <button onClick={handleSend} disabled={busy || !input.trim()} className="shrink-0 text-vsc-muted hover:text-vsc-accent transition-colors disabled:opacity-25 disabled:cursor-not-allowed pb-0.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between px-3 pb-1 pt-0.5">
          <button onClick={() => sendChat("What can you help me with?")} disabled={busy} className="text-[11px] text-vsc-muted/60 hover:text-vsc-muted transition-colors disabled:opacity-40 underline-offset-2 hover:underline">
            Ask anything — or type @ to reference a file
          </button>
          <span className={`text-[10px] font-mono ${msgsLeft !== null && msgsLeft <= 5 ? 'text-yellow-500/70' : 'text-vsc-muted/40'}`}>
            {msgsLeft !== null ? `${msgsLeft}/25 left` : null}
          </span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 14: Commit**

```bash
npm run type-check
git add -A
git commit -m "refactor: extract copilot feature module — hooks, lib, components, react-markdown"
```

---

### Task 5: Sidebar Feature Module

**Files:**
- Create: `src/features/sidebar/types.ts`
- Create: `src/features/sidebar/components/GitStatus.tsx`
- Create: `src/features/sidebar/components/FileRow.tsx`
- Create: `src/features/sidebar/components/ContextMenu.tsx`
- Create: `src/features/sidebar/components/FileTree.tsx`
- Create: `src/features/sidebar/components/SearchPanel.tsx`
- Modify: `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Create `src/features/sidebar/types.ts`**

```ts
export interface CtxTarget {
  x: number
  y: number
  id: string
  name: string
  folderId?: string
  blank?: boolean
}
```

- [ ] **Step 2: Create `src/features/sidebar/components/GitStatus.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'

export function GitStatus() {
  const [data, setData] = useState<{ branch: string; ahead: number; behind: number } | null>(null)
  useEffect(() => {
    fetch('/api/git-status')
      .then(r => r.json())
      .then(d => setData({ branch: d.branch ?? 'main', ahead: d.ahead ?? 0, behind: d.behind ?? 0 }))
      .catch(() => setData({ branch: 'main', ahead: 0, behind: 0 }))
  }, [])
  const branch = data?.branch ?? 'main'
  const ahead  = data?.ahead  ?? 0
  const behind = data?.behind ?? 0
  return (
    <div className="flex items-center gap-3 px-3 py-1.5 text-[11px] text-vsc-muted select-none">
      <span className="flex items-center gap-1">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V7.5a2.5 2.5 0 0 1-2.5 2.5H9a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V9.5a1 1 0 0 0-1-1H4.5A2.5 2.5 0 0 1 2 6V4.372a2.25 2.25 0 1 1 1.5 0V6a1 1 0 0 0 1 1H5a2.5 2.5 0 0 1 2.5-2.5h.25v-.628A2.25 2.25 0 0 1 9.5 1.75zM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z"/>
        </svg>
        {branch}
      </span>
      {ahead > 0 && <span className="flex items-center gap-0.5 text-[#89d185]"><svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M3.47 7.78a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L9 4.81v7.44a.75.75 0 0 1-1.5 0V4.81L4.53 7.78a.75.75 0 0 1-1.06 0z"/></svg>{ahead}</span>}
      {behind > 0 && <span className="flex items-center gap-0.5 text-[#f14c4c]"><svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M12.53 8.22a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L2.97 9.28a.75.75 0 0 1 1.06-1.06L7 11.19V3.75a.75.75 0 0 1 1.5 0v7.44l2.97-2.97a.75.75 0 0 1 1.06 0z"/></svg>{behind}</span>}
    </div>
  )
}
```

- [ ] **Step 3: Create `src/features/sidebar/components/FileRow.tsx`**

```tsx
import React from 'react'

interface Props {
  id: string
  name: string
  icon: React.ReactNode
  depth?: number
  folderId?: string
  activeTab: string
  openTabs: string[]
  onNavigate: (id: string) => void
  onContextMenu: (e: React.MouseEvent, id: string, name: string, folderId?: string) => void
  renamingId: string | null
  renameVal: string
  onRenameChange: (v: string) => void
  onRenameCommit: (id: string) => void
  onRenameCancel: () => void
  renameRef: React.RefObject<HTMLInputElement>
}

const FileRow = React.memo(function FileRow({
  id, name, icon, depth = 0, folderId,
  activeTab, openTabs, onNavigate, onContextMenu,
  renamingId, renameVal, onRenameChange, onRenameCommit, onRenameCancel, renameRef,
}: Props) {
  const isRenaming = renamingId === id
  return (
    <li
      onClick={() => !isRenaming && onNavigate(id)}
      onContextMenu={e => onContextMenu(e, id, name, folderId)}
      className={`flex items-center gap-2 pr-3 py-[4px] cursor-pointer transition-colors relative ${activeTab === id ? 'bg-vsc-selection text-vsc-text' : 'text-[#cccccc] hover:bg-vsc-hover'}`}
      style={{ paddingLeft: `${20 + depth * 12}px` }}
    >
      {activeTab === id && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-vsc-accent" />}
      <span className="shrink-0 flex items-center">{icon}</span>
      {isRenaming ? (
        <input ref={renameRef} value={renameVal} onChange={e => onRenameChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onRenameCommit(id); if (e.key === 'Escape') onRenameCancel() }}
          onBlur={() => onRenameCommit(id)} onClick={e => e.stopPropagation()}
          className="flex-1 bg-transparent text-vsc-text text-[13px] outline-none border border-vsc-accent px-1 min-w-0" />
      ) : (
        <span className="truncate text-[13px]">{name}</span>
      )}
      {!isRenaming && openTabs.includes(id) && activeTab !== id && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-vsc-muted/50 shrink-0" />
      )}
    </li>
  )
})

export { FileRow }
```

- [ ] **Step 4: Create `src/features/sidebar/components/ContextMenu.tsx`**

```tsx
import type { CtxTarget } from '../types'

interface Props {
  ctx: CtxTarget
  clipboard: { id: string; name: string } | null
  onNewFile: () => void
  onNewFolder: () => void
  onCopy: () => void
  onPaste: () => void
  onCopyPath: () => void
  onRename: () => void
  onDelete: () => void
}

export function ContextMenu({ ctx, clipboard, onNewFile, onNewFolder, onCopy, onPaste, onCopyPath, onRename, onDelete }: Props) {
  return (
    <div
      className="fixed z-[1000] bg-[#1f1f1f] border border-[#3c3c3c] rounded shadow-2xl py-1 min-w-[200px] text-[13px]"
      style={{ left: Math.min(ctx.x, window.innerWidth - 210), top: Math.min(ctx.y, window.innerHeight - 290) }}
      onMouseDown={e => e.stopPropagation()}
    >
      <CtxBtn label="New File"   onClick={onNewFile} />
      <CtxBtn label="New Folder" onClick={onNewFolder} />
      {!ctx.blank && (
        <>
          <CtxSep />
          <CtxBtn label="Copy"      shortcut="Ctrl+C" onClick={onCopy} />
          <CtxBtn label="Paste"     shortcut="Ctrl+V" onClick={onPaste} disabled={!clipboard} />
          <CtxBtn label="Copy Path"                   onClick={onCopyPath} />
          <CtxSep />
          <CtxBtn label="Rename"    shortcut="F2"     onClick={onRename} />
          <CtxBtn label="Delete"    shortcut="Del"    onClick={onDelete} danger />
        </>
      )}
    </div>
  )
}

function CtxBtn({ label, shortcut, onClick, disabled, danger }: { label: string; shortcut?: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      onMouseDown={disabled ? undefined : onClick}
      className={`w-full flex items-center justify-between px-3 py-[5px] text-left transition-colors ${disabled ? 'opacity-35 cursor-default text-[#858585]' : danger ? 'text-[#f48771] hover:bg-[#f4877122]' : 'text-[#cccccc] hover:bg-[#094771]'}`}
    >
      <span>{label}</span>
      {shortcut && <span className="text-[11px] text-[#858585] ml-6">{shortcut}</span>}
    </button>
  )
}

function CtxSep() {
  return <div className="my-1 border-t border-[#3c3c3c]" />
}
```

- [ ] **Step 5: Create `src/features/sidebar/components/FileTree.tsx`**

```tsx
'use client'
import { useRef, useState } from 'react'
import type { CustomFile, CustomFolder } from '@/lib/fileSystem'
import { iconSrcForFile } from '@/lib/fileIcons'
import type { CtxTarget } from '../types'
import { FileRow } from './FileRow'
import { ContextMenu } from './ContextMenu'

interface Props {
  portfolioOpen: boolean
  setPortfolioOpen: (v: boolean) => void
  workspaceFiles: CustomFile[]
  workspaceFolders: CustomFolder[]
  onWorkspaceFilesChange: (files: CustomFile[]) => void
  onWorkspaceFoldersChange: (folders: CustomFolder[]) => void
  activeTab: string
  openTabs: string[]
  onNavigate: (id: string) => void
  onFileDeleted: (id: string) => void
}

const FolderIcon = ({ open }: { open: boolean }) => (
  <img src={open ? '/icons/files/folder-open.svg' : '/icons/files/folder.svg'} width={16} height={16} alt="" aria-hidden />
)

function iconForFile(name: string): React.ReactNode {
  return <img src={iconSrcForFile(name)} width={16} height={16} alt="" aria-hidden />
}

export function FileTree({
  portfolioOpen, setPortfolioOpen,
  workspaceFiles, workspaceFolders,
  onWorkspaceFilesChange, onWorkspaceFoldersChange,
  activeTab, openTabs, onNavigate, onFileDeleted,
}: Props) {
  const [newMode, setNewMode]           = useState<'file' | 'folder' | null>(null)
  const [newName, setNewName]           = useState('')
  const [newInFolder, setNewInFolder]   = useState<string | null>(null)
  const [newInFolderName, setNewInFolderName] = useState('')
  const [ctx, setCtx]                   = useState<CtxTarget | null>(null)
  const [renamingId, setRenamingId]     = useState<string | null>(null)
  const [renameVal, setRenameVal]       = useState('')
  const [nameOverrides, setNameOverrides] = useState<Record<string, string>>({})
  const [clipboard, setClipboard]       = useState<{ id: string; name: string } | null>(null)
  const inputRef       = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const renameRef      = useRef<HTMLInputElement>(null)

  function commitNew() {
    const name = newName.trim(); if (!name) { cancelNew(); return }
    if (newMode === 'file') { const id = 'file:' + name; onWorkspaceFilesChange(workspaceFiles.some(f => f.id === id) ? workspaceFiles : [...workspaceFiles, { id, name }]); onNavigate(id) }
    else if (newMode === 'folder') { onWorkspaceFoldersChange([...workspaceFolders, { id: 'folder:' + name, name, open: true, files: [] }]) }
    cancelNew()
  }
  function cancelNew() { setNewMode(null); setNewName('') }
  function startNew(mode: 'file' | 'folder') { setNewMode(mode); setNewName(''); setTimeout(() => inputRef.current?.focus(), 0) }
  function startNewInFolder(folderId: string) {
    onWorkspaceFoldersChange(workspaceFolders.map(f => f.id === folderId ? { ...f, open: true } : f))
    setNewInFolder(folderId); setNewInFolderName(''); setTimeout(() => folderInputRef.current?.focus(), 0)
  }
  function commitFolderFile(folderId: string) {
    const name = newInFolderName.trim(); if (!name) { cancelFolderFile(); return }
    const fileId = 'file:' + name
    onWorkspaceFoldersChange(workspaceFolders.map(f => f.id === folderId ? { ...f, files: [...f.files, { id: fileId, name }] } : f))
    onNavigate(fileId); cancelFolderFile()
  }
  function cancelFolderFile() { setNewInFolder(null); setNewInFolderName('') }

  function openCtx(e: React.MouseEvent, id: string, name: string, folderId?: string) { e.preventDefault(); e.stopPropagation(); setCtx({ x: e.clientX, y: e.clientY, id, name, folderId }) }
  function openBlankCtx(e: React.MouseEvent) { e.preventDefault(); setCtx({ x: e.clientX, y: e.clientY, id: '', name: '', blank: true }) }

  function handleDelete() {
    if (!ctx) return; const { id, folderId } = ctx; setCtx(null)
    if (folderId) { onWorkspaceFoldersChange(workspaceFolders.map(f => f.id === folderId ? { ...f, files: f.files.filter(fi => fi.id !== id) } : f)) }
    else { onWorkspaceFilesChange(workspaceFiles.filter(f => f.id !== id)) }
    onFileDeleted(id)
  }
  function handleRename() {
    if (!ctx) return; const displayName = nameOverrides[ctx.id] ?? ctx.name; setCtx(null)
    setRenamingId(ctx.id); setRenameVal(displayName); setTimeout(() => renameRef.current?.focus(), 0)
  }
  function commitRename(id: string) {
    const name = renameVal.trim()
    if (name) {
      setNameOverrides(prev => ({ ...prev, [id]: name }))
      onWorkspaceFilesChange(workspaceFiles.map(f => f.id === id ? { ...f, name } : f))
      onWorkspaceFoldersChange(workspaceFolders.map(folder => ({ ...folder, files: folder.files.map(f => f.id === id ? { ...f, name } : f) })))
    }
    setRenamingId(null)
  }
  function handleCopy() { if (!ctx) return; setClipboard({ id: ctx.id, name: nameOverrides[ctx.id] ?? ctx.name }); setCtx(null) }
  function handlePaste() {
    if (!clipboard) return
    const base = clipboard.name; const dotIdx = base.lastIndexOf('.')
    const newName = dotIdx > 0 ? base.slice(0, dotIdx) + '_copy' + base.slice(dotIdx) : base + '_copy'
    const newId = 'file:' + newName
    onWorkspaceFilesChange(workspaceFiles.some(f => f.id === newId) ? workspaceFiles : [...workspaceFiles, { id: newId, name: newName }])
    onNavigate(newId); setCtx(null)
  }
  function handleCopyPath() { if (!ctx) return; navigator.clipboard.writeText(ctx.name).catch(() => {}); setCtx(null) }

  return (
    <>
      <div className="group flex items-center gap-1.5 px-2 py-1 select-none shrink-0 hover:bg-vsc-hover/50 transition-colors">
        <button onClick={() => setPortfolioOpen(!portfolioOpen)} className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-vsc-muted text-[10px] w-3 text-center shrink-0">{portfolioOpen ? '▾' : '▸'}</span>
          <span className="font-semibold text-vsc-muted tracking-wide text-[11px] uppercase truncate">Portfolio</span>
        </button>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={() => { setPortfolioOpen(true); startNew('file') }} title="New File" className="w-5 h-5 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="13" x2="12" y2="19"/><line x1="9" y1="16" x2="15" y2="16"/></svg>
          </button>
          <button onClick={() => { setPortfolioOpen(true); startNew('folder') }} title="New Folder" className="w-5 h-5 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
          </button>
        </div>
      </div>
      <ul className="flex-1 overflow-y-auto panel-scroll py-0.5" onContextMenu={openBlankCtx}>
        {portfolioOpen && (
          <>
            {workspaceFolders.map(folder => (
              <li key={folder.id}>
                <div className="group flex items-center gap-2 pr-2 py-[4px] cursor-pointer text-[#cccccc] hover:bg-vsc-hover transition-colors" style={{ paddingLeft: '20px' }} onContextMenu={e => openCtx(e, folder.id, folder.name)}>
                  <button className="flex items-center gap-2 flex-1 min-w-0" onClick={() => onWorkspaceFoldersChange(workspaceFolders.map(f => f.id === folder.id ? { ...f, open: !f.open } : f))}>
                    <span className="text-vsc-muted text-[9px] w-3 text-center shrink-0">{folder.open ? '▾' : '▸'}</span>
                    <span className="flex items-center shrink-0"><FolderIcon open={folder.open} /></span>
                    <span className="truncate text-[13px]">{folder.name}</span>
                  </button>
                  <button onClick={e => { e.stopPropagation(); startNewInFolder(folder.id) }} title="New File in Folder" className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded transition-colors shrink-0">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="13" x2="12" y2="19"/><line x1="9" y1="16" x2="15" y2="16"/></svg>
                  </button>
                </div>
                {folder.open && (
                  <>
                    {folder.files.map(f => (
                      <FileRow key={f.id} id={f.id} name={nameOverrides[f.id] ?? f.name} icon={iconForFile(f.name)} depth={2} folderId={folder.id}
                        activeTab={activeTab} openTabs={openTabs} onNavigate={onNavigate} onContextMenu={openCtx}
                        renamingId={renamingId} renameVal={renameVal} onRenameChange={setRenameVal} onRenameCommit={commitRename} onRenameCancel={() => setRenamingId(null)} renameRef={renameRef} />
                    ))}
                    {newInFolder === folder.id && (
                      <li className="flex items-center gap-2 pr-3 py-[4px]" style={{ paddingLeft: '44px' }}>
                        <span className="shrink-0">{iconForFile(newInFolderName || 'file')}</span>
                        <input ref={folderInputRef} value={newInFolderName} onChange={e => setNewInFolderName(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') commitFolderFile(folder.id); if (e.key === 'Escape') cancelFolderFile() }}
                          onBlur={cancelFolderFile} placeholder="filename.ext"
                          className="flex-1 bg-transparent text-vsc-text text-[13px] outline-none border border-vsc-accent px-1 min-w-0" />
                      </li>
                    )}
                  </>
                )}
              </li>
            ))}
            {workspaceFiles.map(f => (
              <FileRow key={f.id} id={f.id} name={nameOverrides[f.id] ?? f.name} icon={iconForFile(f.name)} depth={1}
                activeTab={activeTab} openTabs={openTabs} onNavigate={onNavigate} onContextMenu={openCtx}
                renamingId={renamingId} renameVal={renameVal} onRenameChange={setRenameVal} onRenameCommit={commitRename} onRenameCancel={() => setRenamingId(null)} renameRef={renameRef} />
            ))}
            {newMode && (
              <li className="flex items-center gap-2 pr-3 py-[4px]" style={{ paddingLeft: '20px' }}>
                <span className="shrink-0 w-3" />
                <span className="shrink-0">{newMode === 'file' ? iconForFile(newName || 'file') : <FolderIcon open={false} />}</span>
                <input ref={inputRef} value={newName} onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') commitNew(); if (e.key === 'Escape') cancelNew() }}
                  onBlur={cancelNew} placeholder={newMode === 'file' ? 'filename.ext' : 'folder name'}
                  className="flex-1 bg-transparent text-vsc-text text-[13px] outline-none border border-vsc-accent px-1 min-w-0" />
              </li>
            )}
          </>
        )}
      </ul>
      {ctx && <ContextMenu ctx={ctx} clipboard={clipboard}
        onNewFile={() => { setCtx(null); setPortfolioOpen(true); startNew('file') }}
        onNewFolder={() => { setCtx(null); setPortfolioOpen(true); startNew('folder') }}
        onCopy={handleCopy} onPaste={handlePaste} onCopyPath={handleCopyPath}
        onRename={handleRename} onDelete={handleDelete} />}
    </>
  )
}
```

- [ ] **Step 6: Create `src/features/sidebar/components/SearchPanel.tsx`**

```tsx
'use client'
import type { CustomFile, CustomFolder } from '@/lib/fileSystem'
import { iconSrcForFile } from '@/lib/fileIcons'

interface Props {
  searchQuery: string
  onSearchChange: (q: string) => void
  workspaceFiles: CustomFile[]
  workspaceFolders: CustomFolder[]
  fileContents: Record<string, string>
  defaultContents: Record<string, string>
  onNavigate: (id: string) => void
}

function iconForFile(name: string): React.ReactNode {
  return <img src={iconSrcForFile(name)} width={16} height={16} alt="" aria-hidden />
}

export function SearchPanel({ searchQuery, onSearchChange, workspaceFiles, workspaceFolders, fileContents, defaultContents, onNavigate }: Props) {
  const q = searchQuery.toLowerCase()
  const allSearchable = [
    ...workspaceFiles.map(f => ({ id: f.id, label: f.name, path: f.name, content: fileContents[f.id] ?? defaultContents[f.name] ?? '' })),
    ...workspaceFolders.flatMap(folder => folder.files.map(f => ({ id: f.id, label: f.name, path: `${folder.name}/${f.name}`, content: fileContents[f.id] ?? '' }))),
  ]
  const results = !q ? [] : allSearchable.flatMap(file => {
    const lines = file.content.split('\n')
    const hits = lines.map((line, i) => ({ line, lineNum: i + 1 })).filter(({ line }) => line.toLowerCase().includes(q)).slice(0, 3)
    const nameMatch = file.path.toLowerCase().includes(q)
    return (hits.length > 0 || nameMatch) ? [{ ...file, hits }] : []
  })

  return (
    <div className="px-3">
      <input type="text" value={searchQuery} onChange={e => onSearchChange(e.target.value)}
        placeholder="Search files..." autoFocus
        className="w-full bg-vsc-input border border-vsc-border text-vsc-text text-sm px-3 py-1.5 rounded outline-none focus:border-vsc-accent placeholder:text-vsc-muted" />
      {q && (
        <ul className="mt-2 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] panel-scroll">
          {results.length === 0 && <li className="px-2 py-2 text-sm text-vsc-muted">No results</li>}
          {results.map(file => (
            <li key={file.id}>
              <div onClick={() => { onNavigate(file.id); onSearchChange('') }} className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-vsc-hover transition-colors">
                <span className="shrink-0">{iconForFile(file.label)}</span>
                <span className="text-sm text-vsc-text font-medium truncate flex-1">{file.path}</span>
                {file.hits.length > 0 && <span className="text-[10px] text-vsc-muted shrink-0">{file.hits.length}</span>}
              </div>
              {file.hits.map(({ line, lineNum }) => (
                <div key={lineNum} onClick={() => { onNavigate(file.id); onSearchChange('') }} className="flex items-start gap-2 pl-8 pr-2 py-0.5 cursor-pointer hover:bg-vsc-hover/50 transition-colors">
                  <span className="text-[10px] text-vsc-muted w-6 text-right shrink-0 pt-px">{lineNum}</span>
                  <span className="text-[11px] font-mono text-vsc-muted truncate">{line.trim()}</span>
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Step 7: Rewrite `src/components/layout/Sidebar.tsx`**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import type { SidePanel } from './ActivityBar'
import type { CustomFile, CustomFolder } from '@/lib/fileSystem'
import { GitStatus } from '@/features/sidebar/components/GitStatus'
import { FileTree } from '@/features/sidebar/components/FileTree'
import { SearchPanel } from '@/features/sidebar/components/SearchPanel'

interface Props {
  panel: SidePanel
  activeTab: string
  openTabs: string[]
  onNavigate: (id: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  onToggleCopilot: () => void
  copilotOpen: boolean
  onFileDeleted: (id: string) => void
  workspaceFiles: CustomFile[]
  workspaceFolders: CustomFolder[]
  onWorkspaceFilesChange: (files: CustomFile[]) => void
  onWorkspaceFoldersChange: (folders: CustomFolder[]) => void
  fileContents: Record<string, string>
  defaultContents: Record<string, string>
}

export default function Sidebar({ panel, activeTab, openTabs, onNavigate, searchQuery, onSearchChange, onToggleCopilot, copilotOpen, onFileDeleted, workspaceFiles, workspaceFolders, onWorkspaceFilesChange, onWorkspaceFoldersChange, fileContents, defaultContents }: Props) {
  const [portfolioOpen, setPortfolioOpen] = useState(true)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sidebarRef.current; if (!el) return
    const block = (e: Event) => e.preventDefault()
    el.addEventListener('contextmenu', block)
    return () => el.removeEventListener('contextmenu', block)
  }, [])

  if (!panel) return null

  return (
    <div ref={sidebarRef} className="w-[220px] bg-vsc-sidebar shrink-0 flex flex-col border-r border-vsc-border/30 overflow-hidden panel-slide-left">
      {panel === 'explorer' && (
        <>
          <div className="px-4 py-2 text-[10px] font-semibold tracking-widest text-vsc-muted uppercase select-none shrink-0">Explorer</div>
          <FileTree portfolioOpen={portfolioOpen} setPortfolioOpen={setPortfolioOpen}
            workspaceFiles={workspaceFiles} workspaceFolders={workspaceFolders}
            onWorkspaceFilesChange={onWorkspaceFilesChange} onWorkspaceFoldersChange={onWorkspaceFoldersChange}
            activeTab={activeTab} openTabs={openTabs} onNavigate={onNavigate} onFileDeleted={onFileDeleted} />
          <div className="shrink-0 px-3 py-2 flex">
            <button onClick={onToggleCopilot} className="copilot-pill flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] whitespace-nowrap" title="Dwijesh's Copilot">
              <span className="copilot-live-dot" />Dwijesh&apos;s Copilot
            </button>
          </div>
          <div className="shrink-0 border-t border-vsc-border/40"><GitStatus /></div>
        </>
      )}
      {panel === 'search' && (
        <>
          <div className="px-4 py-2 text-[10px] font-semibold tracking-widest text-vsc-muted uppercase select-none shrink-0">Search</div>
          <SearchPanel searchQuery={searchQuery} onSearchChange={onSearchChange}
            workspaceFiles={workspaceFiles} workspaceFolders={workspaceFolders}
            fileContents={fileContents} defaultContents={defaultContents} onNavigate={onNavigate} />
          <div className="flex-1" />
          <div className="shrink-0 border-t border-vsc-border/40"><GitStatus /></div>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 8: Commit**

```bash
npm run type-check
git add -A
git commit -m "refactor: extract sidebar feature — FileTree, FileRow, ContextMenu, SearchPanel, GitStatus"
```

---

### Task 6: TitleBar Feature Module

**Files:**
- Create: `src/features/titlebar/lib/menuDefinitions.ts`
- Modify: `src/components/layout/TitleBar.tsx`

- [ ] **Step 1: Create `src/features/titlebar/lib/menuDefinitions.ts`**

```ts
import type { MenuDef } from '@/components/layout/MenuBar'
import { TABS } from '@/lib/tabs'

export interface MenuHandlers {
  onCommandPalette: () => void
  onNewTab: () => void
  onOpenFile: () => void
  onCloseTab: () => void
  onCloseAllTabs: () => void
  recentFiles: string[]
  onOpenRecent: (id: string) => void
  onFind: () => void
  onCopy: () => void
  onToggleSidebar: () => void
  onToggleTerminal: () => void
  onToggleCopilot: () => void
  onEnterFullscreen: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
  onGoToFile: () => void
  onNavigate: (id: string) => void
  onStartTerminal: () => void
  onRunLastCommand: () => void
  lastCommand: string | null
  onNewTerminal: () => void
  onClearTerminal: () => void
  onShowShortcuts: () => void
  onAbout: () => void
  onReportBug: () => void
}

export function buildMenus(h: MenuHandlers): MenuDef[] {
  const recentSubmenu = h.recentFiles.length > 0
    ? h.recentFiles.map(id => { const tab = TABS.find(t => t.id === id); return { label: tab?.label ?? id, action: () => h.onOpenRecent(id) } })
    : [{ label: 'No recent files', disabled: true }]

  return [
    {
      label: 'File',
      items: [
        { label: 'New Tab', action: h.onNewTab, shortcut: 'Ctrl+T' },
        { label: 'Open File...', action: h.onOpenFile, shortcut: 'Ctrl+O' },
        {},
        { label: 'Close Tab', action: h.onCloseTab, shortcut: 'Ctrl+W' },
        { label: 'Close All Tabs', action: h.onCloseAllTabs, shortcut: 'Ctrl+Shift+W' },
        {},
        { label: 'Open Recent', submenu: recentSubmenu },
        {},
        { label: 'Download Resume', disabled: true },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Find...', action: h.onFind, shortcut: 'Ctrl+F' },
        {},
        { label: 'Copy', action: h.onCopy, shortcut: 'Ctrl+C' },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Command Palette', action: h.onCommandPalette, shortcut: 'Ctrl+P' },
        {},
        { label: 'Toggle Sidebar', action: h.onToggleSidebar, shortcut: 'Ctrl+B' },
        { label: 'Toggle Terminal', action: h.onToggleTerminal, shortcut: 'Ctrl+`' },
        { label: 'Copilot', action: h.onToggleCopilot, shortcut: 'Ctrl+Shift+A' },
        {},
        { label: 'Enter Full Screen', action: h.onEnterFullscreen, shortcut: 'F11' },
        {},
        { label: 'Zoom In', action: h.onZoomIn, shortcut: 'Ctrl+=' },
        { label: 'Zoom Out', action: h.onZoomOut, shortcut: 'Ctrl+-' },
        { label: 'Reset Zoom', action: h.onResetZoom, shortcut: 'Ctrl+0' },
      ],
    },
    {
      label: 'Go',
      items: [
        { label: 'Go to File...', action: h.onGoToFile, shortcut: 'Ctrl+P' },
        {},
        ...TABS.map(t => ({ label: t.label, action: () => h.onNavigate(t.id) })),
      ],
    },
    {
      label: 'Run',
      items: [
        { label: 'Start Terminal', action: h.onStartTerminal },
        { label: h.lastCommand ? `Run Last: ${h.lastCommand}` : 'Run Last Command', action: h.onRunLastCommand, disabled: !h.lastCommand },
      ],
    },
    {
      label: 'Terminal',
      items: [
        { label: 'New Terminal', action: h.onNewTerminal, shortcut: 'Ctrl+`' },
        { label: 'Toggle Terminal', action: h.onToggleTerminal },
        {},
        { label: 'Clear Terminal', action: h.onClearTerminal },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'Command Palette', action: h.onCommandPalette, shortcut: 'Ctrl+P' },
        { label: 'Keyboard Shortcuts', action: h.onShowShortcuts, shortcut: 'Ctrl+K Ctrl+S' },
        {},
        { label: 'GitHub Profile', action: () => window.open('https://github.com/DwijeshD', '_blank', 'noopener,noreferrer') },
        {},
        { label: 'Report a Bug', action: h.onReportBug },
        {},
        { label: 'About', action: h.onAbout },
      ],
    },
  ]
}
```

- [ ] **Step 2: Rewrite `src/components/layout/TitleBar.tsx`**

```tsx
'use client'
import MenuBar from './MenuBar'
import { buildMenus } from '@/features/titlebar/lib/menuDefinitions'
import type { MenuHandlers } from '@/features/titlebar/lib/menuDefinitions'

interface Props extends MenuHandlers {
  copilotActive: boolean
}

export default function TitleBar({ copilotActive, ...handlers }: Props) {
  const menus = buildMenus(handlers)

  return (
    <div className="h-[32px] flex items-center shrink-0 select-none border-b border-vsc-border/40" style={{ backgroundColor: 'var(--vsc-titlebar, #1a1a1a)' }}>
      <div className="w-[46px] h-full flex items-center justify-center shrink-0">
        <img src="/vscode-icon.png" width={16} height={16} alt="VS Code" />
      </div>
      <MenuBar menus={menus} />
      <button onClick={handlers.onToggleCopilot} title="Toggle Copilot (Ctrl+Shift+A)"
        className={`hidden sm:block px-2.5 py-0.5 text-xs rounded transition-colors select-none shrink-0 ${copilotActive ? 'text-vsc-accent' : 'text-vsc-muted hover:bg-white/10 hover:text-vsc-text'}`}>
        Copilot
      </button>
      <div className="hidden sm:flex items-center gap-0.5 px-1.5 shrink-0">
        <button onClick={() => window.history.back()} title="Go Back" className="w-6 h-6 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded hover:bg-white/10 transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <button onClick={() => window.history.forward()} title="Go Forward" className="w-6 h-6 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded hover:bg-white/10 transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
      <div className="hidden sm:flex flex-1 justify-center px-2 min-w-0">
        <button onClick={handlers.onCommandPalette} title="Search or type a command (Ctrl+P)"
          className="flex items-center gap-2 h-[22px] px-3 rounded bg-white/[0.07] hover:bg-white/[0.11] border border-white/[0.1] text-vsc-muted hover:text-vsc-text transition-colors w-[240px] max-w-full shrink">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <span className="flex-1 text-left text-[11px] truncate">portfolio</span>
          <kbd className="text-[10px] bg-white/[0.06] px-1 rounded border border-white/[0.1] text-vsc-muted/60 font-mono shrink-0">Ctrl+P</kbd>
        </button>
      </div>
      <div className="hidden sm:flex items-center px-1 shrink-0 gap-0.5">
        <button onClick={handlers.onToggleSidebar} title="Toggle Primary Sidebar (Ctrl+B)" className="w-7 h-7 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded hover:bg-white/10 transition-colors">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><rect x="0" y="0" width="4" height="15" rx="1" opacity=".45" /><rect x="5.5" y="0" width="9.5" height="15" rx="1" /></svg>
        </button>
        <button onClick={handlers.onToggleTerminal} title="Toggle Panel (Ctrl+`)" className="w-7 h-7 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded hover:bg-white/10 transition-colors">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><rect x="0" y="0" width="15" height="9" rx="1" /><rect x="0" y="10.5" width="15" height="4.5" rx="1" opacity=".45" /></svg>
        </button>
        <button onClick={handlers.onToggleCopilot} title="Toggle Copilot Panel (Ctrl+Shift+A)" className="w-7 h-7 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded hover:bg-white/10 transition-colors">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><rect x="0" y="0" width="9" height="15" rx="1" /><rect x="10.5" y="0" width="4.5" height="15" rx="1" opacity=".45" /></svg>
        </button>
        <button onClick={handlers.onCommandPalette} title="Customize Layout" className="w-7 h-7 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded hover:bg-white/10 transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="0" width="6" height="6" rx="1" /><rect x="8" y="0" width="6" height="6" rx="1" /><rect x="0" y="8" width="6" height="6" rx="1" /><rect x="8" y="8" width="6" height="6" rx="1" /></svg>
        </button>
      </div>
      <div className="hidden sm:flex items-stretch shrink-0 h-full">
        <button onClick={() => window.blur()} title="Minimize" className="w-[46px] flex items-center justify-center text-vsc-muted hover:text-vsc-text hover:bg-white/[0.1] transition-colors">
          <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor"><rect width="10" height="1" /></svg>
        </button>
        <button onClick={handlers.onEnterFullscreen} title="Maximize" className="w-[46px] flex items-center justify-center text-vsc-muted hover:text-vsc-text hover:bg-white/[0.1] transition-colors">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1"><rect x="0.5" y="0.5" width="9" height="9" /></svg>
        </button>
        <button onClick={() => window.close()} title="Close" className="w-[46px] flex items-center justify-center text-vsc-muted hover:text-white hover:bg-[#c42b1c] transition-colors">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2"><line x1="0" y1="0" x2="10" y2="10" /><line x1="10" y1="0" x2="0" y2="10" /></svg>
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
npm run type-check
git add -A
git commit -m "refactor: extract TitleBar menus to buildMenus() — coordinator drops to 60 lines"
```

---

### Task 7: Renderer Feature Module

**Files:**
- Create: `src/features/renderer/lib/syntaxHighlight.ts`
- Create: `src/features/renderer/lib/stripTypeScript.ts`
- Modify: `src/components/renderers/LiveCodeRenderer.tsx`

- [ ] **Step 1: Create `src/features/renderer/lib/stripTypeScript.ts`**

```ts
export function stripTs(code: string): string {
  return code
    .replace(/^import\s+type\s+[^\n]+\n/gm, '')
    .replace(/^\s*(?:export\s+)?interface\s+\w[^{]*\{(?:[^{}]|\{[^{}]*\})*\}/gm, '')
    .replace(/^\s*(?:export\s+)?type\s+\w[^\n=]*=[^\n]+\n/gm, '')
    .replace(/:\s*(?:readonly\s+)?[\w[\]{}<>|&?,\s.]+(?=[,)=;\n{])/g, '')
    .replace(/\s+as\s+[\w[\]<>|&, ]+(?=[),;\n.])/g, '')
    .replace(/<[A-Z]\w*(?:,\s*[\w[\]<> ]+)*>/g, '')
}
```

- [ ] **Step 2: Create `src/features/renderer/lib/syntaxHighlight.ts`**

```ts
// No React imports — worker-ready
import { stripTs } from './stripTypeScript'

const DARK_BASE = `*{box-sizing:border-box}body{margin:0;font-family:'Consolas',Consolas,monospace;background:#1e1e1e;color:#d4d4d4;font-size:13px;line-height:1.6;}`

export function jsDoc(code: string): string {
  const safe = code.replace(/<\/script>/gi, '<\\/script>')
  return `<!DOCTYPE html><html><head><style>${DARK_BASE}.ln{padding:2px 14px;white-space:pre-wrap;word-break:break-all;border-bottom:1px solid #ffffff08;}.err{color:#f48771;}.warn{color:#dcdcaa;}.mt{opacity:.35;padding:14px;}</style></head>
<body><script>
var _o=[];
['log','info','warn','error'].forEach(function(m){var orig=console[m].bind(console);console[m]=function(){var s=Array.from(arguments).map(function(x){return typeof x==='object'?JSON.stringify(x,null,2):String(x)}).join(' ');_o.push({t:m,s:s});orig.apply(console,arguments)};});
window.addEventListener('error',function(e){_o.push({t:'error',s:e.message||String(e)})});
try{(function(){'use strict';${safe}})()}catch(e){_o.push({t:'error',s:String(e)})}
if(!_o.length){document.body.innerHTML='<div class="mt">// No console output</div>';}
else{_o.forEach(function(l){var d=document.createElement('div');d.className='ln'+(l.t==='error'?' err':l.t==='warn'?' warn':'');d.textContent=l.s;document.body.appendChild(d);});}
</script></body></html>`
}

export function jsonDoc(content: string): string {
  try {
    const fmt = JSON.stringify(JSON.parse(content), null, 2)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/("(?:[^"\\]|\\.)*")\s*:/g, '<span style="color:#9cdcfe">$1</span>:')
      .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span style="color:#ce9178">$1</span>')
      .replace(/:\s*(-?\d+\.?\d*(?:[eE][+-]?\d+)?)/g, ': <span style="color:#b5cea8">$1</span>')
      .replace(/:\s*(true|false)/g, ': <span style="color:#569cd6">$1</span>')
      .replace(/:\s*(null)/g, ': <span style="color:#569cd6">$1</span>')
    return `<!DOCTYPE html><html><head><style>${DARK_BASE}pre{margin:0;padding:14px;overflow:auto;white-space:pre-wrap;}</style></head><body><pre>${fmt}</pre></body></html>`
  } catch (e) {
    const msg = ((e as Error).message).replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return `<!DOCTYPE html><html><head><style>${DARK_BASE}pre{margin:0;padding:14px;}</style></head><body><pre style="color:#f48771">JSON Error: ${msg}</pre></body></html>`
  }
}

export function cssDoc(content: string): string {
  const safe = content.replace(/<\/style>/gi, '<\\/style>')
  return `<!DOCTYPE html><html><head>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;font-size:13px;line-height:1.6;}</style>
<style>${safe}</style>
</head><body>
<header class="header"><h1>Portfolio</h1><p class="subtitle">Backend Engineer</p></header>
<main class="container">
<section><h2>Featured Projects</h2>
<div class="flex">
  <div class="card"><div class="badge">Python &middot; FastAPI</div><h3>Calendar Sync API</h3><p class="content">Production backend integrating Google &amp; Outlook calendars via OAuth2 and webhooks.</p><button type="button">View</button></div>
  <div class="card"><div class="badge">PyTorch &middot; ML</div><h3>rPPG Heart Rate</h3><p class="content">Deep learning model for heart rate estimation from video. Dissertation: 82%.</p><button type="button">View</button></div>
</div></section>
<section><h2>Stack</h2><ul><li>Python &middot; TypeScript &middot; FastAPI</li><li>PyTorch &middot; scikit-learn &middot; Optuna</li><li>Firestore &middot; OAuth2 &middot; Webhooks</li></ul><div class="item"><input type="text" placeholder="Search technologies..." /></div></section>
</main></body></html>`
}

export function reactDoc(content: string): string {
  const safe = content.replace(/<\/script>/gi, '<\\/script>')
  return `<!DOCTYPE html><html><head>
<style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif;}</style>
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head><body>
<div id="root"></div>
<div id="err" style="display:none;font-family:Consolas,monospace;font-size:13px;color:#f48771;padding:14px;background:#1e1e1e;white-space:pre-wrap;word-break:break-all;"></div>
<script type="text/babel" data-presets="react,typescript">
try { ${safe} } catch(e) { const el=document.getElementById('err');if(el){el.style.display='block';el.textContent=String(e);} }
try {
  const exp=typeof module!=='undefined'&&module.exports&&module.exports.default?module.exports.default:null;
  if(exp&&typeof exp==='function'){const root=document.getElementById('root');if(root)ReactDOM.createRoot(root).render(React.createElement(exp));}
} catch(e2){const el=document.getElementById('err');if(el){el.style.display='block';el.textContent=(el.textContent?el.textContent+'\n':'')+String(e2);}}
</script></body></html>`
}

const KEYWORDS: Record<string, string[]> = {
  py:  ['def','class','if','elif','else','for','while','return','import','from','as','with','try','except','finally','pass','break','continue','and','or','not','in','is','lambda','yield','async','await','None','True','False','raise','global','nonlocal','del','assert'],
  c:   ['int','char','float','double','void','if','else','for','while','do','return','struct','typedef','enum','union','switch','case','break','continue','static','const','extern','include','define','sizeof','NULL','true','false'],
  rs:  ['fn','let','mut','const','if','else','for','while','loop','return','struct','enum','impl','trait','use','mod','pub','crate','self','super','match','break','continue','move','ref','in','where','type','async','await','dyn','Box','Vec','Option','Result','Some','None','Ok','Err'],
  go:  ['func','var','const','if','else','for','range','return','struct','interface','type','package','import','go','chan','select','case','break','continue','defer','map','make','new','nil','true','false','len','cap','append','error'],
}

export function syntaxDoc(lang: string, content: string): string {
  const escaped = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const kws = KEYWORDS[lang] ?? []
  const kwPattern = kws.length ? new RegExp(`\\b(${kws.join('|')})\\b`, 'g') : null
  let highlighted = escaped
    .replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, '<span style="color:#6a9955">$1</span>')
    .replace(/(#[^\n]*)/g, lang === 'py' ? '<span style="color:#6a9955">$1</span>' : '$1')
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span style="color:#ce9178">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#b5cea8">$1</span>')
  if (kwPattern) highlighted = highlighted.replace(kwPattern, '<span style="color:#569cd6;font-weight:600">$1</span>')
  const labels: Record<string, string> = { py: 'Python', c: 'C', rs: 'Rust', go: 'Go' }
  const label = labels[lang] ?? lang.toUpperCase()
  return `<!DOCTYPE html><html><head><style>${DARK_BASE}
pre{margin:0;padding:16px;overflow:auto;white-space:pre-wrap;line-height:1.7;tab-size:4;}
.badge{display:inline-flex;align-items:center;gap:6px;padding:2px 10px;background:#252526;border:1px solid #3c3c3c;border-radius:4px;font-size:11px;color:#858585;margin:10px 14px 0;}
</style></head><body><div class="badge">${label} — syntax highlight</div><pre>${highlighted}</pre></body></html>`
}

export function sqlDoc(content: string): string {
  const escaped = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const highlighted = escaped
    .replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP BY|ORDER BY|HAVING|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|DROP|ALTER|ADD|COLUMN|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|NOT NULL|DEFAULT|AS|AND|OR|NOT|IN|LIKE|IS|NULL|BETWEEN|EXISTS|DISTINCT|LIMIT|OFFSET|UNION|ALL|CASE|WHEN|THEN|ELSE|END|WITH|RETURNING)\b/gi, '<span style="color:#569cd6;font-weight:600">$1</span>')
    .replace(/('(?:[^'\\]|\\.)*')/g, '<span style="color:#ce9178">$1</span>')
    .replace(/(--[^\n]*)/g, '<span style="color:#6a9955">$1</span>')
    .replace(/\b(\d+)\b/g, '<span style="color:#b5cea8">$1</span>')
  return `<!DOCTYPE html><html><head><style>${DARK_BASE}pre{margin:0;padding:16px;overflow:auto;white-space:pre-wrap;line-height:1.7;}.badge{display:inline-block;padding:2px 8px;background:#252526;border:1px solid #3c3c3c;border-radius:4px;font-size:11px;color:#858585;margin:10px 14px 0;}</style></head><body><div class="badge">SQL — read-only</div><pre>${highlighted}</pre></body></html>`
}

export function shellDoc(content: string): string {
  const escaped = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const highlighted = escaped
    .replace(/^(#[^\n]*)/gm, '<span style="color:#6a9955">$1</span>')
    .replace(/\b(if|then|else|elif|fi|for|while|do|done|case|esac|in|function|return|export|local|readonly|echo|cd|ls|mkdir|rm|cp|mv|cat|grep|sed|awk|curl|chmod|chown|source|set|unset)\b/g, '<span style="color:#569cd6">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color:#ce9178">$1</span>')
    .replace(/('(?:[^'\\]|\\.)*')/g, '<span style="color:#ce9178">$1</span>')
    .replace(/(\$\w+|\$\{[^}]+\})/g, '<span style="color:#9cdcfe">$1</span>')
    .replace(/(^\$\s)/gm, '<span style="color:#858585">$1</span>')
  return `<!DOCTYPE html><html><head><style>${DARK_BASE}pre{margin:0;padding:16px;overflow:auto;white-space:pre-wrap;line-height:1.7;}.badge{display:inline-block;padding:2px 8px;background:#252526;border:1px solid #3c3c3c;border-radius:4px;font-size:11px;color:#858585;margin:10px 14px 0;}</style></head><body><div class="badge">Shell — read-only</div><pre>${highlighted}</pre></body></html>`
}

export function yamlDoc(content: string): string {
  const escaped = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const highlighted = escaped
    .replace(/^(\s*#[^\n]*)/gm, '<span style="color:#6a9955">$1</span>')
    .replace(/^(\s*[\w-]+)\s*:/gm, '<span style="color:#9cdcfe">$1</span>:')
    .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span style="color:#ce9178">$1</span>')
    .replace(/:\s*('(?:[^'\\]|\\.)*')/g, ': <span style="color:#ce9178">$1</span>')
    .replace(/:\s*(true|false|null|~)\b/g, ': <span style="color:#569cd6">$1</span>')
    .replace(/:\s*(-?\d+\.?\d*)\b/g, ': <span style="color:#b5cea8">$1</span>')
    .replace(/^(\s*-)\s/gm, '<span style="color:#858585">$1</span> ')
  return `<!DOCTYPE html><html><head><style>${DARK_BASE}pre{margin:0;padding:16px;overflow:auto;white-space:pre-wrap;line-height:1.7;}.badge{display:inline-block;padding:2px 8px;background:#252526;border:1px solid #3c3c3c;border-radius:4px;font-size:11px;color:#858585;margin:10px 14px 0;}</style></head><body><div class="badge">YAML — read-only</div><pre>${highlighted}</pre></body></html>`
}

export function xmlDoc(content: string): string {
  const escaped = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const highlighted = escaped
    .replace(/(&lt;\/?)([\w:-]+)/g, '$1<span style="color:#4ec9b0">$2</span>')
    .replace(/([\w:-]+)(=)("(?:[^"\\]|\\.)*")/g, '<span style="color:#9cdcfe">$1</span>$2<span style="color:#ce9178">$3</span>')
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span style="color:#6a9955">$1</span>')
    .replace(/(&lt;\?[\s\S]*?\?&gt;)/g, '<span style="color:#858585">$1</span>')
  return `<!DOCTYPE html><html><head><style>${DARK_BASE}pre{margin:0;padding:16px;overflow:auto;white-space:pre-wrap;line-height:1.7;}.badge{display:inline-block;padding:2px 8px;background:#252526;border:1px solid #3c3c3c;border-radius:4px;font-size:11px;color:#858585;margin:10px 14px 0;}</style></head><body><div class="badge">XML — read-only</div><pre>${highlighted}</pre></body></html>`
}

export function buildDoc(ext: string, content: string): { html: string; isScript: boolean } {
  switch (ext) {
    case 'json':                         return { html: jsonDoc(content),          isScript: false }
    case 'css': case 'scss':             return { html: cssDoc(content),           isScript: false }
    case 'tsx': case 'jsx':              return { html: reactDoc(content),         isScript: true  }
    case 'ts':                           return { html: jsDoc(stripTs(content)),   isScript: true  }
    case 'sql':                          return { html: sqlDoc(content),           isScript: false }
    case 'sh': case 'bash':             return { html: shellDoc(content),         isScript: false }
    case 'yaml': case 'yml':            return { html: yamlDoc(content),          isScript: false }
    case 'xml':                          return { html: xmlDoc(content),           isScript: false }
    case 'py': case 'c': case 'rs': case 'go': return { html: syntaxDoc(ext, content), isScript: false }
    default:                             return { html: jsDoc(content),            isScript: true  }
  }
}
```

- [ ] **Step 3: Rewrite `src/components/renderers/LiveCodeRenderer.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { buildDoc } from '@/features/renderer/lib/syntaxHighlight'

interface Props {
  filename: string
  content: string
}

export default function LiveCodeRenderer({ filename, content }: Props) {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  const delay = (ext === 'tsx' || ext === 'jsx') ? 800 : 400
  const [debounced, setDebounced] = useState(content)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(content), delay)
    return () => clearTimeout(t)
  }, [content, delay])
  const { html, isScript } = buildDoc(ext, debounced)
  return (
    <iframe
      key={isScript ? debounced : undefined}
      sandbox={isScript ? 'allow-scripts allow-popups' : 'allow-popups'}
      srcDoc={html}
      className="w-full h-full border-0 bg-[#1e1e1e]"
      title="Code Preview"
    />
  )
}
```

- [ ] **Step 4: Commit**

```bash
npm run type-check
git add -A
git commit -m "refactor: extract renderer feature — syntaxHighlight, stripTypeScript, coordinator to 25 lines"
```

---

### Task 8: Content Split

**Files:**
- Create: `src/shared/content/home.ts`, `about.ts`, `styles.ts`, `skills.ts`, `server.ts`, `readme.ts`, `index.ts`
- Modify: `src/components/panels/CopilotPanel.tsx` (1 import line)
- Modify: `src/components/layout/VSCodeLayout.tsx` (1 import line)
- Delete: `src/lib/defaultContent.ts`

- [ ] **Step 1: Read `src/lib/defaultContent.ts`**

Open the file and identify the 6 template string exports: `HOME_HTML`, `ABOUT_MD`, `STYLES_CSS`, `SKILLS_JSON`, `SERVER_TS`, `README_MD`. Each becomes its own file.

- [ ] **Step 2: Create the 6 content files**

For each export in `lib/defaultContent.ts`, create the corresponding file. Example pattern (repeat for each):

`src/shared/content/home.ts`:
```ts
export const HOME_HTML = `<paste the home.html template string here>`
```

`src/shared/content/about.ts`:
```ts
export const ABOUT_MD = `<paste the about.md template string here>`
```

`src/shared/content/styles.ts`:
```ts
export const STYLES_CSS = `<paste the styles.css template string here>`
```

`src/shared/content/skills.ts`:
```ts
export const SKILLS_JSON = `<paste the skills.json template string here>`
```

`src/shared/content/server.ts`:
```ts
export const SERVER_TS = `<paste the server.ts template string here>`
```

`src/shared/content/readme.ts`:
```ts
export const README_MD = `<paste the readme.md template string here>`
```

- [ ] **Step 3: Create `src/shared/content/index.ts`**

```ts
import { HOME_HTML }   from './home'
import { ABOUT_MD }    from './about'
import { STYLES_CSS }  from './styles'
import { SKILLS_JSON } from './skills'
import { SERVER_TS }   from './server'
import { README_MD }   from './readme'

export const DEFAULT_CONTENT: Record<string, string> = {
  'home.html':   HOME_HTML,
  'about.md':    ABOUT_MD,
  'styles.css':  STYLES_CSS,
  'skills.json': SKILLS_JSON,
  'server.ts':   SERVER_TS,
  'readme.md':   README_MD,
}
```

- [ ] **Step 4: Update CopilotPanel import**

In `src/components/panels/CopilotPanel.tsx`, change:
```ts
import { DEFAULT_CONTENT } from '@/lib/defaultContent'
```
to:
```ts
import { DEFAULT_CONTENT } from '@/shared/content'
```

- [ ] **Step 5: Update VSCodeLayout import**

In `src/components/layout/VSCodeLayout.tsx`, find the import of `DEFAULT_CONTENT` from `@/lib/defaultContent` and change it to `@/shared/content`.

Run: `grep -rn "defaultContent" src/` to confirm no remaining references.

- [ ] **Step 6: Delete `src/lib/defaultContent.ts`**

```bash
rm src/lib/defaultContent.ts
```

- [ ] **Step 7: Commit**

```bash
npm run type-check
git add -A
git commit -m "refactor: split defaultContent into src/shared/content — 6 focused modules"
```

---

### Task 9: API Security Utility

**Files:**
- Create: `src/shared/utils/api/security.ts`
- Modify: `src/app/api/chat/route.ts`
- Modify: `src/app/api/ai-action/route.ts`

- [ ] **Step 1: Create `src/shared/utils/api/security.ts`**

```ts
import { NextRequest } from 'next/server'

export function allowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true
  try {
    const host = req.headers.get('host') ?? ''
    const { hostname } = new URL(origin)
    return hostname === 'localhost' || hostname === host.split(':')[0]
  } catch { return false }
}
```

- [ ] **Step 2: Update `src/app/api/chat/route.ts`**

Add at the top of the file (after existing imports):
```ts
import { allowedOrigin } from '@/shared/utils/api/security'
```

Delete the local `allowedOrigin` function definition (lines 32–41 in the original file).

- [ ] **Step 3: Update `src/app/api/ai-action/route.ts`**

Add at the top of the file:
```ts
import { allowedOrigin } from '@/shared/utils/api/security'
```

Delete the local `allowedOrigin` function definition.

- [ ] **Step 4: Commit**

```bash
npm run type-check
git add -A
git commit -m "refactor: extract allowedOrigin into shared/utils/api/security — deduplicate across routes"
```

---

### Task 10: Dead Code Deletion

**Files:**
- Delete: `src/components/panels/AIPanel.tsx`
- Delete: `src/components/panels/SourceControlPanel.tsx`

- [ ] **Step 1: Verify no imports exist**

```bash
grep -rn "AIPanel\|SourceControlPanel" src/
```

Expected: zero results (or only the panel files themselves). If any consumer imports them, remove that import first.

- [ ] **Step 2: Delete the files**

```bash
rm src/components/panels/AIPanel.tsx
rm src/components/panels/SourceControlPanel.tsx
```

- [ ] **Step 3: Commit**

```bash
npm run type-check
git add -A
git commit -m "chore: delete unused AIPanel and SourceControlPanel"
```

---

### Task 11: react-window Virtualization

**Files:**
- Modify: `src/components/panels/TerminalTab.tsx`
- Modify: `src/features/sidebar/components/FileTree.tsx`

- [ ] **Step 1: Virtualise terminal history in `src/components/panels/TerminalTab.tsx`**

Add to imports:
```ts
import { FixedSizeList, type ListChildComponentProps } from 'react-window'
```

Add after state declarations:
```ts
const [listHeight, setListHeight] = useState(400)
const listContainerRef = useRef<HTMLDivElement>(null)
useEffect(() => {
  const el = listContainerRef.current; if (!el) return
  const ro = new ResizeObserver(([entry]) => setListHeight(entry.contentRect.height))
  ro.observe(el)
  return () => ro.disconnect()
}, [])
```

Replace the existing `<div ref={containerRef} className="flex-1 overflow-y-auto...">` scroll area (the one that maps terminal lines) with:

```tsx
<div ref={listContainerRef} className="flex-1 overflow-hidden">
  {dinoActive || matrixActive ? (
    /* game canvas renders here — unchanged */
    null
  ) : (
    <FixedSizeList
      height={listHeight}
      itemCount={lines.length}
      itemSize={20}
      ref={listRef as React.RefObject<FixedSizeList>}
      className="panel-scroll"
    >
      {({ index, style }: ListChildComponentProps) => {
        const l = lines[index]
        return (
          <div style={style} className={`px-2 flex items-baseline gap-2 font-mono text-[13px] leading-5 ${
            l.type === 'input'   ? 'text-vsc-text'     : ''
          } ${
            l.type === 'output'  ? 'text-vsc-text/90'  : ''
          } ${
            l.type === 'error'   ? 'text-red-400'      : ''
          } ${
            l.type === 'info'    ? 'text-vsc-comment'  : ''
          } ${
            l.type === 'success' ? 'text-green-400'    : ''
          } ${
            l.type === 'warning' ? 'text-yellow-400'   : ''
          }`}>
            {l.prompt && <span className="text-vsc-fn shrink-0 select-none">{l.prompt}</span>}
            <span className="whitespace-pre-wrap break-all">{l.text}</span>
          </div>
        )
      }}
    </FixedSizeList>
  )}
</div>
```

Add a `listRef` ref for auto-scrolling to bottom:
```ts
const listRef = useRef<FixedSizeList>(null)
```

Replace the existing `bottomRef` scroll effect with:
```ts
useEffect(() => {
  listRef.current?.scrollToItem(lines.length - 1, 'end')
}, [lines.length])
```

- [ ] **Step 2: Virtualise file list in `src/features/sidebar/components/FileTree.tsx`**

For the file list `<ul>` that renders `workspaceFiles`, wrap the flat file list in a `FixedSizeList` when item count exceeds 50 (below that threshold, the overhead is not worth it):

```tsx
import { FixedSizeList, type ListChildComponentProps } from 'react-window'

// In the render, replace the flat workspaceFiles.map() section:
{workspaceFiles.length > 50 ? (
  <FixedSizeList height={Math.min(workspaceFiles.length * 26, 400)} itemCount={workspaceFiles.length} itemSize={26}>
    {({ index, style }: ListChildComponentProps) => {
      const f = workspaceFiles[index]
      return (
        <div style={style}>
          <FileRow key={f.id} id={f.id} name={nameOverrides[f.id] ?? f.name} icon={iconForFile(f.name)} depth={1}
            activeTab={activeTab} openTabs={openTabs} onNavigate={onNavigate} onContextMenu={openCtx}
            renamingId={renamingId} renameVal={renameVal} onRenameChange={setRenameVal} onRenameCommit={commitRename} onRenameCancel={() => setRenamingId(null)} renameRef={renameRef} />
        </div>
      )
    }}
  </FixedSizeList>
) : (
  workspaceFiles.map(f => (
    <FileRow key={f.id} id={f.id} name={nameOverrides[f.id] ?? f.name} icon={iconForFile(f.name)} depth={1}
      activeTab={activeTab} openTabs={openTabs} onNavigate={onNavigate} onContextMenu={openCtx}
      renamingId={renamingId} renameVal={renameVal} onRenameChange={setRenameVal} onRenameCommit={commitRename} onRenameCancel={() => setRenamingId(null)} renameRef={renameRef} />
  ))
)}
```

- [ ] **Step 3: Commit**

```bash
npm run type-check
git add -A
git commit -m "perf: add react-window FixedSizeList to terminal history and sidebar file tree"
```

---

### Task 12: Jest Unit Tests

**Files:**
- Create: `src/__tests__/copilot/parseThinkBlocks.test.ts`
- Create: `src/__tests__/copilot/detectIntent.test.ts`
- Create: `src/__tests__/renderer/stripTypeScript.test.ts`
- Create: `src/__tests__/renderer/syntaxHighlight.test.ts`
- Create: `src/__tests__/terminal/commands.test.ts`

- [ ] **Step 1: Create `src/__tests__/copilot/parseThinkBlocks.test.ts`**

```ts
import { parseThinkBlocks } from '@/features/copilot/lib/parseThinkBlocks'

describe('parseThinkBlocks', () => {
  it('returns content unchanged when no think tags present', () => {
    const { thinking, content } = parseThinkBlocks('Hello world')
    expect(content).toBe('Hello world')
    expect(thinking).toBe('')
  })

  it('extracts thinking and leaves content', () => {
    const { thinking, content } = parseThinkBlocks('<think>internal</think>response')
    expect(thinking).toBe('internal')
    expect(content).toBe('response')
  })

  it('handles multiple think blocks', () => {
    const { thinking, content } = parseThinkBlocks('a<think>t1</think>b<think>t2</think>c')
    expect(thinking).toBe('t1t2')
    expect(content).toBe('abc')
  })

  it('handles unclosed think tag (streaming mid-block)', () => {
    const { thinking, content } = parseThinkBlocks('before<think>partial')
    expect(thinking).toBe('partial')
    expect(content).toBe('before')
  })

  it('trims leading whitespace from content and thinking', () => {
    const { content, thinking } = parseThinkBlocks('<think>  thought</think>  text')
    expect(content).toBe('text')
    expect(thinking).toBe('  thought')
  })
})
```

- [ ] **Step 2: Create `src/__tests__/copilot/detectIntent.test.ts`**

```ts
import { detectIntent } from '@/features/copilot/lib/detectIntent'

describe('detectIntent', () => {
  it('classifies file creation as action', () => {
    expect(detectIntent('create a new file called test.ts')).toBe('action')
  })

  it('classifies folder creation as action', () => {
    expect(detectIntent('add a folder called utils')).toBe('action')
  })

  it('classifies general question as chat', () => {
    expect(detectIntent('what is your name?')).toBe('chat')
  })

  it('classifies tech stack question as chat', () => {
    expect(detectIntent("what is Dwijesh's tech stack?")).toBe('chat')
  })

  it('requires both verb AND file key for action', () => {
    expect(detectIntent('create something')).toBe('chat')
    expect(detectIntent('update the readme.md')).toBe('action')
  })
})
```

- [ ] **Step 3: Create `src/__tests__/renderer/stripTypeScript.test.ts`**

```ts
import { stripTs } from '@/features/renderer/lib/stripTypeScript'

describe('stripTs', () => {
  it('removes import type statements', () => {
    const result = stripTs('import type { Foo } from "bar"\nconst x = 1\n')
    expect(result).not.toContain('import type')
    expect(result).toContain('const x = 1')
  })

  it('removes interface declarations', () => {
    const result = stripTs('interface Foo { x: number }\nconst y = 2\n')
    expect(result).not.toContain('interface Foo')
    expect(result).toContain('const y = 2')
  })

  it('removes type alias declarations', () => {
    const result = stripTs('type MyType = string | number\nconst z = 3\n')
    expect(result).not.toContain('type MyType')
    expect(result).toContain('const z = 3')
  })

  it('passes plain JS through unchanged', () => {
    const code = 'const add = (a, b) => a + b'
    expect(stripTs(code)).toBe(code)
  })
})
```

- [ ] **Step 4: Create `src/__tests__/renderer/syntaxHighlight.test.ts`**

```ts
import { buildDoc } from '@/features/renderer/lib/syntaxHighlight'

describe('buildDoc', () => {
  it('returns isScript=false for JSON', () => {
    const { isScript } = buildDoc('json', '{"a":1}')
    expect(isScript).toBe(false)
  })

  it('returns isScript=true for tsx', () => {
    const { isScript } = buildDoc('tsx', 'export default () => <div/>')
    expect(isScript).toBe(true)
  })

  it('returns isScript=true for ts (after strip)', () => {
    const { isScript } = buildDoc('ts', 'const x: number = 1')
    expect(isScript).toBe(true)
  })

  it('returns html string for unknown extension', () => {
    const { html } = buildDoc('xyz', 'hello')
    expect(typeof html).toBe('string')
    expect(html).toContain('<!DOCTYPE html>')
  })

  it('handles invalid JSON gracefully', () => {
    const { html } = buildDoc('json', '{bad json}')
    expect(html).toContain('JSON Error')
  })
})
```

- [ ] **Step 5: Create `src/__tests__/terminal/commands.test.ts`**

```ts
import { dispatch } from '@/features/terminal/commands'
import type { CommandContext } from '@/features/terminal/commands'

const ctx: CommandContext = {
  theme: 'dark',
  setTheme: () => {},
  workspaceFiles: [],
  onNavigate: () => {},
}

describe('dispatch', () => {
  it('returns help text for help command', () => {
    const { lines } = dispatch('help', ctx)
    expect(lines.length).toBeGreaterThan(0)
    expect(lines.some(l => l.text.toLowerCase().includes('help'))).toBe(true)
  })

  it('returns error for unknown command', () => {
    const { lines } = dispatch('unknowncmd', ctx)
    expect(lines[0].text).toContain('command not found')
  })

  it('returns empty lines for empty input', () => {
    const { lines } = dispatch('', ctx)
    expect(lines).toHaveLength(0)
  })

  it('clear command sets clear:true', () => {
    const result = dispatch('clear', ctx)
    expect(result.clear).toBe(true)
  })

  it('whoami returns output text', () => {
    const { lines } = dispatch('whoami', ctx)
    expect(lines.length).toBeGreaterThan(0)
  })

  it('fortune returns a string', () => {
    const { lines } = dispatch('fortune', ctx)
    expect(lines.length).toBeGreaterThan(0)
    expect(typeof lines[0].text).toBe('string')
  })
})
```

- [ ] **Step 6: Run tests**

```bash
npm test
```

Expected: all 5 test suites pass, ~25 assertions green.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "test: add Jest unit tests for copilot, renderer, and terminal command modules"
```

---

### Task 13: Final Verification

- [ ] **Step 1: Type check**

```bash
npm run type-check
```

Expected: exit 0, no errors.

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: exit 0. Check build output — no file in `.next` should reference old import paths.

- [ ] **Step 3: Run all tests**

```bash
npm test
```

Expected: all suites pass.

- [ ] **Step 4: File size audit**

```bash
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -rn | head -20
```

Expected: no file exceeds 250 lines (except generated files or vendored code).

- [ ] **Step 5: Verify public/ is at root**

```bash
ls public/
```

Expected: `public/` is present at project root, not inside `src/`.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: final verification — type-check, build, tests pass post-modularisation"
```

---

## Success Criteria

- [ ] `npm run type-check` passes
- [ ] `npm run build` passes
- [ ] `npm test` passes (~25 assertions)
- [ ] No source file exceeds 250 lines
- [ ] All source code lives under `src/`
- [ ] `public/` remains at project root
- [ ] Zero functionality changes (visual output identical)
- [ ] Feature modules: `src/features/{terminal,copilot,sidebar,titlebar,renderer}/`
- [ ] Shared utilities: `src/shared/{content,utils}/`


import type { TerminalLine } from './types'

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

export type StreamEntry = { type: TerminalLine['type']; text: string; delay: number }

export function makeLogs(): StreamEntry[] {
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

export function makeDeployLogs(): StreamEntry[] {
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

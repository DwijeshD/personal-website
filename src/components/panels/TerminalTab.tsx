'use client'

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { dispatch } from '@/features/terminal/commands'
import { makeLogs, makeDeployLogs, buildMonitorFrame, type StreamEntry } from '@/features/terminal/monitor'
import DinoGame from '@/features/terminal/components/DinoGame'
import MatrixEffect from '@/features/terminal/components/MatrixEffect'

export type { TerminalHandle } from '@/features/terminal/types'
import type { TerminalLine, TerminalHandle } from '@/features/terminal/types'

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

const PROMPT = 'dwijesh@portfolio:~$'

interface Props {
  onNavigate: (id: string) => void
  onLastCommandChange: (cmd: string | null) => void
  onThemeChange?: (theme: string) => void
}

// ── Component ─────────────────────────────────────────────────────────────────
const TerminalTab = forwardRef<TerminalHandle, Props>(({ onNavigate, onLastCommandChange, onThemeChange }, ref) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'info', text: `  Welcome to Dwijesh's portfolio terminal. Type 'help' for commands.` },
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

  // ── Donut ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!donutActive) return
    const id = setInterval(() => {
      donutA.current += 0.04; donutB.current += 0.02
      setDonutFrame(computeDonutFrame(donutA.current, donutB.current))
    }, 50)
    return () => clearInterval(id)
  }, [donutActive])

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

  const stopDino   = useCallback(() => stopMode(setDinoActive),   [])
  const stopMatrix = useCallback(() => stopMode(setMatrixActive), [])

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
    const trimmed  = cmd.trim()
    const nameLow  = trimmed.split(/\s+/)[0].toLowerCase()
    const inputLine: TerminalLine = { type: 'input', text: `${PROMPT} ${trimmed}` }

    if (nameLow === 'donut') {
      setLines(prev => [...prev, inputLine])
      donutA.current = 1; donutB.current = 1
      setDonutFrame(computeDonutFrame(1, 1)); setDonutActive(true)
      record(trimmed); return
    }
    if (nameLow === 'dino') {
      setLines(prev => [...prev, inputLine])
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

    const ctx = {
      theme: '',
      setTheme: (t: string) => onThemeChange?.(t),
      workspaceFiles: [],
      onNavigate,
    }
    const { lines: newLines, clear } = dispatch(trimmed, ctx)
    if (clear) setLines([])
    else setLines(prev => [...prev, inputLine, ...newLines])
    if (trimmed) record(trimmed)
  }

  function submit() { execute(input); setInput('') }

  function onKeyDown(e: React.KeyboardEvent) {
    if (donutActive) {
      if ((e.ctrlKey && e.key === 'c') || e.key === 'Escape') { e.preventDefault(); stopMode(setDonutActive) }
      return
    }
    if (dinoActive || matrixActive) return
    if (monitorActive) {
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
      {dinoActive && <DinoGame onStop={stopDino} />}
      {matrixActive && <MatrixEffect onStop={stopMatrix} />}
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

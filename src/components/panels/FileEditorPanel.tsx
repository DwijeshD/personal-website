'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { getLanguage, configureMonaco } from '@/lib/monacoConfig'
import type * as MonacoTypes from 'monaco-editor'

const MonacoEditor     = dynamic(() => import('@monaco-editor/react'),              { ssr: false, loading: () => <EditorSkeleton /> })
const MarkdownRenderer = dynamic(() => import('../renderers/MarkdownRenderer'),      { ssr: false })
const HTMLRenderer     = dynamic(() => import('../renderers/HTMLRenderer'),          { ssr: false })
const SVGRenderer      = dynamic(() => import('../renderers/SVGRenderer'),           { ssr: false })
const TxtRenderer      = dynamic(() => import('../renderers/TxtRenderer'),           { ssr: false })
const LiveCodeRenderer = dynamic(() => import('../renderers/LiveCodeRenderer'),      { ssr: false })

export type ViewMode = 'code' | 'split' | 'preview'

interface Props {
  filename:     string
  content:      string
  onChange:     (v: string) => void
  mode:         ViewMode
  onModeChange: (m: ViewMode) => void
  /** Optional custom preview renderer — used for built-in panels (preview mode only) */
  previewNode?: React.ReactNode
}

function liveRenderer(filename: string, content: string): React.ReactNode {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'md' || ext === 'markdown') return <MarkdownRenderer content={content} />
  if (ext === 'html' || ext === 'htm')    return <HTMLRenderer content={content} />
  if (ext === 'svg')                      return <SVGRenderer content={content} />
  if (ext === 'txt')                      return <TxtRenderer content={content} />
  return <LiveCodeRenderer filename={filename} content={content} />
}

// Shown while Monaco bundle loads
function EditorSkeleton() {
  return (
    <div className="h-full flex overflow-hidden font-mono text-[13px] leading-6">
      <div className="line-numbers select-none text-right pr-3 pt-4 min-w-[48px] shrink-0">
        {Array.from({ length: 10 }, (_, i) => <div key={i}>{i + 1}</div>)}
      </div>
      <div className="flex-1 pt-4 pr-4 text-vsc-muted/30 animate-pulse select-none">
        Loading editor…
      </div>
    </div>
  )
}

// Monaco-backed code editor pane — uncontrolled to preserve cursor/selection.
// External content changes (e.g. AI writes) are pushed imperatively via ref.
function CodePane({ filename, content, onChange }: { filename: string; content: string; onChange: (v: string) => void }) {
  const editorRef     = useRef<MonacoTypes.editor.IStandaloneCodeEditor | null>(null)
  const internalValue = useRef(content)

  useEffect(() => {
    const ed = editorRef.current
    if (!ed || content === internalValue.current) return
    internalValue.current = content
    const model = ed.getModel()
    if (!model || model.getValue() === content) return
    const pos = ed.getPosition()
    model.setValue(content)
    if (pos) ed.setPosition(pos)
  }, [content])

  return (
    <div className="h-full w-full bg-[#1e1e1e]">
    <MonacoEditor
      height="100%"
      language={getLanguage(filename)}
      defaultValue={content}
      path={`file:///${filename}`}
      theme="vs-dark"
      onMount={(ed) => {
        editorRef.current = ed
        internalValue.current = ed.getValue()
        // Monaco's CDN CSS sets !important background on these layers, hiding selection.
        // Inline !important overrides stylesheet !important regardless of specificity.
        const root = ed.getContainerDomNode()
        root?.querySelectorAll<HTMLElement>('.view-lines, .lines-content').forEach(el => {
          el.style.setProperty('background', 'transparent', 'important')
        })
      }}
      onChange={(val) => {
        const v = val ?? ''
        internalValue.current = v
        onChange(v)
      }}
      beforeMount={configureMonaco}
      options={{
        fontSize:             13,
        fontFamily:           "'JetBrains Mono', Consolas, 'Courier New', monospace",
        fontLigatures:        true,
        lineNumbers:          'on',
        minimap:              { enabled: false },
        scrollBeyondLastLine: false,
        renderWhitespace:     'selection',
        tabSize:              2,
        wordWrap:             'off',
        automaticLayout:      true,
        padding:              { top: 16 },
        scrollbar:            { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
        overviewRulerLanes:   0,
        renderLineHighlight:  'line',
        cursorBlinking:       'smooth',
        smoothScrolling:      true,
        contextmenu:          true,
        folding:              true,
        bracketPairColorization: { enabled: true },
        stickyScroll:         { enabled: false },
      }}
    />
    </div>
  )
}

export default function FileEditorPanel({ filename, content, onChange, mode, onModeChange, previewNode }: Props) {
  // All file types support preview — split uses live renderer, preview uses static panel if available
  const splitPane   = liveRenderer(filename, content)
  const previewPane = previewNode ?? liveRenderer(filename, content)

  return (
    <div className="panel-fade-in h-full flex flex-col overflow-hidden">
      {/* Mode toggle — always visible */}
      <div className="flex items-center justify-end gap-1 px-3 py-1 shrink-0 border-b border-vsc-border/20 bg-vsc-bg">
        {(['code', 'split', 'preview'] as ViewMode[]).map(m => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={`px-2.5 py-0.5 text-[11px] rounded transition-colors capitalize ${
              mode === m
                ? 'bg-vsc-accent text-white'
                : 'text-vsc-muted hover:text-vsc-text hover:bg-vsc-hover'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden flex">
        {mode === 'code' && (
          <div className="flex-1 overflow-hidden">
            <CodePane filename={filename} content={content} onChange={onChange} />
          </div>
        )}

        {mode === 'split' && (
          <>
            <div className="flex-1 overflow-hidden border-r border-vsc-border/40">
              <CodePane filename={filename} content={content} onChange={onChange} />
            </div>
            <div className="flex-1 overflow-hidden bg-vsc-bg">
              {splitPane}
            </div>
          </>
        )}

        {mode === 'preview' && (
          <div className="flex-1 overflow-hidden">
            {previewPane}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import dynamic from 'next/dynamic'
import { getLanguage, configureMonaco } from '@/lib/monacoConfig'

const MonacoEditor     = dynamic(() => import('@monaco-editor/react'),              { ssr: false, loading: () => <EditorSkeleton /> })
const MarkdownRenderer = dynamic(() => import('../renderers/MarkdownRenderer'),      { ssr: false })
const HTMLRenderer     = dynamic(() => import('../renderers/HTMLRenderer'),          { ssr: false })

export type ViewMode = 'code' | 'split' | 'preview'

interface Props {
  filename:     string
  content:      string
  onChange:     (v: string) => void
  mode:         ViewMode
  onModeChange: (m: ViewMode) => void
  /** Optional custom preview renderer — used for built-in panels */
  previewNode?: React.ReactNode
}

type FileType = 'markdown' | 'html' | 'json' | 'other'

function fileType(filename: string): FileType {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'md' || ext === 'markdown') return 'markdown'
  if (ext === 'html' || ext === 'htm')    return 'html'
  if (ext === 'json')                     return 'json'
  return 'other'
}

function supportsPreview(t: FileType, hasPreviewNode: boolean) {
  return hasPreviewNode || t === 'markdown' || t === 'html'
}

function createRenderer(type: FileType, content: string, previewNode?: React.ReactNode) {
  if (previewNode)         return previewNode
  if (type === 'markdown') return <MarkdownRenderer content={content} />
  if (type === 'html')     return <HTMLRenderer content={content} />
  return null
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

// Monaco-backed code editor pane
function CodePane({ filename, content, onChange }: { filename: string; content: string; onChange: (v: string) => void }) {
  return (
    <MonacoEditor
      height="100%"
      language={getLanguage(filename)}
      value={content}
      // Each unique path gets its own model → undo history preserved per file
      path={`file:///${filename}`}
      theme="vs-dark"
      onChange={(val) => onChange(val ?? '')}
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
      }}
    />
  )
}

export default function FileEditorPanel({ filename, content, onChange, mode, onModeChange, previewNode }: Props) {
  const type     = fileType(filename)
  const previews = supportsPreview(type, !!previewNode)
  const safeMode = previews ? mode : 'code'
  const renderer = createRenderer(type, content, previewNode)

  return (
    <div className="panel-fade-in h-full flex flex-col overflow-hidden">
      {/* Mode toggle — only for previewable file types */}
      {previews && (
        <div className="flex items-center justify-end gap-1 px-3 py-1 shrink-0 border-b border-vsc-border/20 bg-vsc-bg">
          {(['code', 'split', 'preview'] as ViewMode[]).map(m => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`px-2.5 py-0.5 text-[11px] rounded transition-colors capitalize ${
                safeMode === m
                  ? 'bg-vsc-accent text-white'
                  : 'text-vsc-muted hover:text-vsc-text hover:bg-vsc-hover'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 overflow-hidden flex">
        {safeMode === 'code' && (
          <div className="flex-1 overflow-hidden">
            <CodePane filename={filename} content={content} onChange={onChange} />
          </div>
        )}

        {safeMode === 'split' && (
          <>
            <div className="flex-1 overflow-hidden border-r border-vsc-border/40">
              <CodePane filename={filename} content={content} onChange={onChange} />
            </div>
            <div className="flex-1 overflow-hidden bg-vsc-bg">
              {renderer}
            </div>
          </>
        )}

        {safeMode === 'preview' && (
          <div className="flex-1 overflow-hidden">
            {renderer}
          </div>
        )}
      </div>
    </div>
  )
}

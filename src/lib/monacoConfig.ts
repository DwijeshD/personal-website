import type { Monaco } from '@monaco-editor/react'

const EXT_MAP: Record<string, string> = {
  md:       'markdown',
  markdown: 'markdown',
  html:     'html',
  htm:      'html',
  css:      'css',
  scss:     'scss',
  js:       'javascript',
  jsx:      'javascript',
  ts:       'typescript',
  tsx:      'typescript',
  json:     'json',
  py:       'python',
  yaml:     'yaml',
  yml:      'yaml',
  xml:      'xml',
  svg:      'xml',
  sh:       'shell',
  bash:     'shell',
  sql:      'sql',
}

export function getLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  return EXT_MAP[ext] ?? 'plaintext'
}

// Called once via beforeMount — configure diagnostics + compiler options
export function configureMonaco(monaco: Monaco): void {
  // ── TypeScript ──────────────────────────────────────────────────────────
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  })
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target:              monaco.languages.typescript.ScriptTarget.ES2020,
    module:              monaco.languages.typescript.ModuleKind.ESNext,
    moduleResolution:    monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    jsx:                 monaco.languages.typescript.JsxEmit.React,
    strict:              true,
    allowJs:             true,
    esModuleInterop:     true,
    skipLibCheck:        true,
  })
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    'declare const console: Console; declare const window: Window & typeof globalThis;',
    'ts:global.d.ts'
  )

  // ── JavaScript ──────────────────────────────────────────────────────────
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  })
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target:          monaco.languages.typescript.ScriptTarget.ES2020,
    module:          monaco.languages.typescript.ModuleKind.ESNext,
    allowJs:         true,
    checkJs:         true,
    esModuleInterop: true,
  })

  // ── JSON ────────────────────────────────────────────────────────────────
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate:      true,
    allowComments: true,
  })
}

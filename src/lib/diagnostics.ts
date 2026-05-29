export interface Diagnostic {
  fileId: string
  fileName: string
  severity: 'error' | 'warning'
  message: string
  line?: number
}

// Strip TypeScript-specific syntax so new Function() can do structural checks
function stripTsAnnotations(src: string): string {
  return src
    // interface blocks: interface Foo { ... }
    .replace(/\binterface\s+\w[\w<>, ]*(?:\s+extends\s+[\w<>, .]+)?\s*\{[^{}]*\}/g, '({})')
    // type alias blocks: type Foo = { ... }
    .replace(/\btype\s+\w[\w<>, ]*\s*=\s*\{[^{}]*\}/g, '({})')
    // type alias scalars: type Foo = string | number;
    .replace(/\btype\s+\w[\w<>, ]*\s*=\s*[^{;][^;]*;?/g, '')
    // generic type params <T, U>
    .replace(/<[A-Z][\w,\s|&\[\]<>]*>/g, '')
    // variable/param type annotations: : SomeType  (before = , ) ; \n {)
    .replace(/:\s*[\w][\w<>\[\]|&. ]*(?=\s*[=,);\n{])/g, '')
    // 'as Type' casts
    .replace(/\bas\s+[\w<>\[\]|&. ]+/g, '')
    // access modifiers
    .replace(/\b(public|private|protected|readonly|abstract|override)\s+/g, '')
}

function findSyntaxError(src: string, isTs: boolean): string | null {
  const checkSrc = isTs ? stripTsAnnotations(src) : src
  try {
    // eslint-disable-next-line no-new-func
    new Function(checkSrc)
    return null
  } catch (e) {
    if (e instanceof SyntaxError) return e.message
    return null
  }
}

export function computeDiagnostics(
  fileContents: Record<string, string>,
  workspaceFiles: Array<{ id: string; name: string }>,
  defaultFileIds: Set<string>,
): Diagnostic[] {
  const diags: Diagnostic[] = []

  for (const file of workspaceFiles) {
    const { id: fileId, name: fileName } = file
    const content = fileContents[fileId]
    if (!content?.trim()) continue
    const ext = fileName.split('.').pop()?.toLowerCase() ?? ''

    // ── JSON parse errors ─────────────────────────────────────────────────
    if (ext === 'json') {
      try {
        JSON.parse(content)
      } catch (e) {
        const msg = (e as Error).message
        const lineMatch = msg.match(/line (\d+)/i)
        diags.push({
          fileId, fileName, severity: 'error',
          message: `JSON: ${msg}`,
          line: lineMatch ? parseInt(lineMatch[1]) : undefined,
        })
      }
    }

    // ── JS/TS syntax errors ───────────────────────────────────────────────
    if (['js', 'ts', 'tsx', 'jsx'].includes(ext)) {
      const isTs = ext === 'ts' || ext === 'tsx'
      const errMsg = findSyntaxError(content, isTs)
      if (errMsg) {
        // Try to extract line number from the error message
        const lineMatch = errMsg.match(/line[: ]+(\d+)/i) ?? errMsg.match(/\((\d+):\d+\)/)
        diags.push({
          fileId, fileName, severity: 'error',
          message: `Syntax error: ${errMsg}`,
          line: lineMatch ? parseInt(lineMatch[1]) : undefined,
        })
      }
    }

    // ── Per-line warnings for TS/JS/TSX/JSX (skip demo/default files) ────
    if (['js', 'ts', 'tsx', 'jsx'].includes(ext) && !defaultFileIds.has(fileId)) {
      const lines = content.split('\n')
      let consoleCount = 0
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (consoleCount < 3 && /\bconsole\.(log|warn|debug)\b/.test(line)) {
          consoleCount++
          diags.push({
            fileId, fileName, severity: 'warning',
            message: 'Unexpected console statement',
            line: i + 1,
          })
        }
        const todoMatch = line.match(/\/\/\s*(TODO|FIXME)[:\s]*(.*)/i)
        if (todoMatch) {
          diags.push({
            fileId, fileName, severity: 'warning',
            message: `${todoMatch[1].toUpperCase()}: ${todoMatch[2].trim() || 'no description'}`,
            line: i + 1,
          })
        }
      }
    }
  }

  return diags
}

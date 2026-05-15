export interface Diagnostic {
  fileId: string
  fileName: string
  severity: 'error' | 'warning'
  message: string
  line?: number
}

export function computeDiagnostics(
  fileContents: Record<string, string>,
  workspaceFiles: Array<{ id: string; name: string }>,
  defaultContent: Record<string, string>,
): Diagnostic[] {
  const diags: Diagnostic[] = []

  for (const file of workspaceFiles) {
    const { id: fileId, name: fileName } = file
    const content = fileContents[fileId] ?? defaultContent[fileName] ?? ''
    if (!content.trim()) continue
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

    // ── JS syntax errors (Function constructor catches SyntaxError) ───────
    if (ext === 'js') {
      try {
        // eslint-disable-next-line no-new-func
        new Function(content)
      } catch (e) {
        if (e instanceof SyntaxError) {
          diags.push({ fileId, fileName, severity: 'error', message: e.message })
        }
      }
    }

    // ── Per-line warnings for TS/JS/TSX/JSX ───────────────────────────────
    if (['js', 'ts', 'tsx', 'jsx'].includes(ext)) {
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

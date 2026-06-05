// Minimal TypeScript type-stripping (not a full compiler — handles common cases)

export function stripTs(code: string): string {
  // Protect CSS/HTML string content from type-stripping regexes
  const protected_: string[] = []
  const guarded = code.replace(/<style>([\s\S]*?)<\/style>/g, (m) => {
    protected_.push(m)
    return `<style>/*TS_STRIP_GUARD_${protected_.length - 1}*/</style>`
  })

  const stripped = guarded
    .replace(/^import\s+type\s+[^\n]+\n/gm, '')
    .replace(/^\s*(?:export\s+)?interface\s+\w[^{]*\{(?:[^{}]|\{[^{}]*\})*\}/gm, '')
    .replace(/^\s*(?:export\s+)?type\s+\w[\w\s]*=\s*\{[^}]*\};\s*$/gm, '')
    .replace(/^\s*(?:export\s+)?type\s+\w[^\n=]*=[^\n]+\n/gm, '')
    .replace(/^export\s+(const|let|var|function|class)\b/gm, '$1')
    .replace(/^export\s*\{[^}]*\};\s*$/gm, '')
    .replace(/^\s*declare\b[^\n]*/gm, '')
    .replace(/:\s*(?:readonly\s+)?(?!(?:true|false|null|undefined|new\s|typeof\s|void\s)\b)[A-Za-z_][\w[\]<>|&?,\ \t.]*(?=[,)=;\n{])/g, '')
    .replace(/\s+as\s+[\w[\]<>|&, ]+(?=[),;\n.])/g, '')
    .replace(/<[A-Z]\w*(?:,\s*[\w[\]<> ]+)*>/g, '')

  // Restore protected blocks
  return protected_.reduce(
    (s, block, i) => s.replace(`<style>/*TS_STRIP_GUARD_${i}*/</style>`, block),
    stripped
  )
}

// Minimal TypeScript type-stripping (not a full compiler — handles common cases)

export function stripTs(code: string): string {
  return code
    .replace(/^import\s+type\s+[^\n]+\n/gm, '')
    .replace(/^\s*(?:export\s+)?interface\s+\w[^{]*\{(?:[^{}]|\{[^{}]*\})*\}/gm, '')
    .replace(/^\s*(?:export\s+)?type\s+\w[^\n=]*=[^\n]+\n/gm, '')
    .replace(/:\s*(?:readonly\s+)?[\w[\]{}<>|&?,\s.]+(?=[,)=;\n{])/g, '')
    .replace(/\s+as\s+[\w[\]<>|&, ]+(?=[),;\n.])/g, '')
    .replace(/<[A-Z]\w*(?:,\s*[\w[\]<> ]+)*>/g, '')
}

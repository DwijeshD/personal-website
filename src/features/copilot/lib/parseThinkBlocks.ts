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

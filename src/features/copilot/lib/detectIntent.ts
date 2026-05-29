export const BUG_KEYWORDS = /\b(bug|broken|error|issue|problem|crash|wrong|not work|doesn't work|doesn't load|fail|glitch|weird|strange|incorrect|missing|stuck)\b/i

export function detectIntent(text: string): 'action' | 'chat' {
  const lower = text.toLowerCase()
  const verbs = ['create', 'make', 'add', 'write', 'generate', 'update', 'edit', 'modify',
                 'change', 'delete', 'remove', 'rename', 'move', 'rewrite', 'refactor']
  const fileKeys = ['file', 'folder', 'directory', 'component', 'page', 'readme',
                    '.tsx', '.ts', '.js', '.jsx', '.css', '.json', '.md', '.html']
  return verbs.some(v => lower.includes(v)) && fileKeys.some(k => lower.includes(k))
    ? 'action' : 'chat'
}

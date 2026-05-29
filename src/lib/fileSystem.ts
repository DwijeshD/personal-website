export interface CustomFile {
  id: string
  name: string
}

export interface CustomFolder {
  id: string
  name: string
  open: boolean
  files: CustomFile[]
}

export type AiActionType = 'create_file' | 'update_file' | 'delete_file' | 'create_folder'

export interface AiFileAction {
  action: AiActionType
  path:    string
  content?: string
}

export const ALLOWED_AI_ACTIONS: ReadonlySet<string> = new Set([
  'create_file', 'update_file', 'delete_file', 'create_folder',
])

const MAX_CONTENT_BYTES = 50_000

export function validateAiAction(raw: unknown): { ok: true; action: AiFileAction } | { ok: false; error: string } {
  if (typeof raw !== 'object' || raw === null)
    return { ok: false, error: 'Response is not an object' }

  const obj = raw as Record<string, unknown>

  if (typeof obj.action !== 'string' || !ALLOWED_AI_ACTIONS.has(obj.action))
    return { ok: false, error: `Invalid action type: "${obj.action}"` }

  if (typeof obj.path !== 'string' || obj.path.trim().length === 0)
    return { ok: false, error: 'Path must be a non-empty string' }

  const path = obj.path.trim()

  if (path.includes('..'))   return { ok: false, error: 'Path must not contain ".."' }
  if (path.includes('//'))   return { ok: false, error: 'Path must not contain "//"' }
  if (path.startsWith('/'))  return { ok: false, error: 'Path must be relative (no leading "/")' }
  if (path.startsWith('\\')) return { ok: false, error: 'Path must be relative (no leading backslash)' }

  if (obj.action === 'create_file' || obj.action === 'update_file') {
    if (typeof obj.content !== 'string')
      return { ok: false, error: 'Content must be a string for this action' }
    if (new TextEncoder().encode(obj.content).length > MAX_CONTENT_BYTES)
      return { ok: false, error: 'Content too large (max 50 KB)' }
  }

  return {
    ok: true,
    action: {
      action:  obj.action as AiActionType,
      path,
      content: typeof obj.content === 'string' ? obj.content : undefined,
    },
  }
}

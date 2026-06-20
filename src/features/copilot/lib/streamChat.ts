import type { LogEntry } from '@/features/copilot/types'

const BUG_REPORT_RE = /^I encountered a bug with the website:\s*(.+)/i

type LogFn = (level: LogEntry['level'], tag: string, msg: string) => void

/** Auto-submits a bug report if the message matches the structured prefill format.
 *  Returns the (possibly annotated) content to send to the model — unchanged if no match. */
export async function maybeAutoLogBug(content: string): Promise<string> {
  const bugMatch = content.match(BUG_REPORT_RE)
  if (!bugMatch) return content

  const desc = bugMatch[1].trim()
  try {
    const r = await fetch('/api/report-issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: desc.slice(0, 100), description: desc }),
    })
    const data = await r.json()
    return r.ok
      ? `${content}\n\n[SYSTEM: Bug automatically logged as GitHub Issue #${data.number}. Confirm this to the user and tell them it has been logged.]`
      : `${content}\n\n[SYSTEM: Bug logging failed — ${data.error}. Apologise and tell the user to try again.]`
  } catch {
    return `${content}\n\n[SYSTEM: Bug logging failed — network error.]`
  }
}

interface StreamCallbacks {
  onModel:      (model: string) => void
  onDelta:      (delta: string) => void
  onFirstToken: () => void
  onLog:        LogFn
}

/** Reads an OpenRouter SSE stream, dispatching deltas/model updates via callbacks. */
export async function streamChatSSE(
  body: ReadableStream<Uint8Array>,
  cb: StreamCallbacks,
): Promise<{ totalChars: number; finishReason: string | null }> {
  const reader  = body.getReader()
  const decoder = new TextDecoder()
  let buffer        = ''
  let totalChars     = 0
  let finishReason: string | null = null
  let gotFirstToken  = false

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') { cb.onLog('info', 'STREAM', '[DONE] received'); break }
      try {
        const parsed = JSON.parse(data)
        if (parsed.model) cb.onModel(parsed.model)
        const choice = parsed.choices?.[0]
        const delta  = choice?.delta?.content
        const reason = choice?.finish_reason
        if (reason) finishReason = reason
        if (delta) {
          if (!gotFirstToken) { gotFirstToken = true; cb.onFirstToken() }
          totalChars += delta.length
          cb.onDelta(delta)
        }
      } catch { /* skip malformed SSE */ }
    }
  }
  return { totalChars, finishReason }
}

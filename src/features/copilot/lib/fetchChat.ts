const SUGGESTED = [
  { label: 'What has he built?',     query: 'What projects has Dwijesh built and what problems do they solve?' },
  { label: 'Tech stack',             query: "What is Dwijesh's full tech stack and what systems has he worked on?" },
  { label: 'rPPG dissertation',      query: 'Tell me about the rPPG heart rate prediction dissertation.' },
  { label: 'Open to work?',          query: 'Is Dwijesh open to new roles? What kind of work is he looking for?' },
]

// All queries worth pre-fetching (suggested + quick prompts, deduplicated)
export const PREFETCH_QUERIES = [
  ...SUGGESTED.map(s => s.query),
  "What is Dwijesh's full tech stack and the systems he's built?",
  "What are Dwijesh's main projects and what makes them technically interesting?",
  "What kind of work is Dwijesh looking for and how can I contact him?",
].filter((q, i, a) => a.indexOf(q) === i)

export async function fetchFullResponse(query: string): Promise<{ text: string; remaining: number | null }> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Prefetch': '1' },
    body: JSON.stringify({ messages: [{ role: 'user', content: query }] }),
  })
  if (!res.ok) throw new Error('prefetch failed')

  const remaining = res.headers.get('X-RateLimit-Remaining')
  const reader  = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = '', accumulated = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') break
      try {
        const delta = JSON.parse(data).choices?.[0]?.delta?.content
        if (delta) accumulated += delta
      } catch { /* skip */ }
    }
  }
  return { text: accumulated, remaining: remaining !== null ? Number(remaining) : null }
}

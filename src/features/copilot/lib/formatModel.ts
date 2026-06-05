export function formatModel(raw: string): string | null {
  if (raw === 'openrouter/free') return 'free tier'
  if (raw === 'openrouter/auto') return 'auto'
  const model = raw.split('/').pop() ?? raw       // strip provider prefix
  const clean = model.split(':')[0]               // strip :free/:beta/:nitro etc.
  if (!clean || clean === 'free') return null
  return clean
}

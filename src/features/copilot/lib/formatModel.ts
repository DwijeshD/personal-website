export function formatModel(raw: string): string | null {
  const model = raw.split('/').pop() ?? raw       // strip provider prefix
  const clean = model.split(':')[0]               // strip :free/:beta/:nitro etc.
  if (!clean || clean === 'free') return null
  return clean
}

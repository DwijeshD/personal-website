import { parseThinkBlocks } from '@/features/copilot/lib/parseThinkBlocks'

describe('parseThinkBlocks', () => {
  it('returns content unchanged when no think tags present', () => {
    const { thinking, content } = parseThinkBlocks('Hello world')
    expect(content).toBe('Hello world')
    expect(thinking).toBe('')
  })

  it('extracts thinking and leaves content', () => {
    const { thinking, content } = parseThinkBlocks('<think>internal</think>response')
    expect(thinking).toBe('internal')
    expect(content).toBe('response')
  })

  it('handles multiple think blocks', () => {
    const { thinking, content } = parseThinkBlocks('a<think>t1</think>b<think>t2</think>c')
    expect(thinking).toBe('t1t2')
    expect(content).toBe('abc')
  })

  it('handles unclosed think tag (streaming mid-block)', () => {
    const { thinking, content } = parseThinkBlocks('before<think>partial')
    expect(thinking).toBe('partial')
    expect(content).toBe('before')
  })
})

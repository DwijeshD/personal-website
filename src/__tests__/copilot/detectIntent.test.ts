import { detectIntent } from '@/features/copilot/lib/detectIntent'

describe('detectIntent', () => {
  it('classifies file creation as action', () => {
    expect(detectIntent('create a new file called test.ts')).toBe('action')
  })

  it('classifies folder creation as action', () => {
    expect(detectIntent('add a folder called utils')).toBe('action')
  })

  it('classifies general question as chat', () => {
    expect(detectIntent('what is your name?')).toBe('chat')
  })

  it('requires both verb AND file key for action', () => {
    expect(detectIntent('create something')).toBe('chat')
    expect(detectIntent('update the readme.md')).toBe('action')
  })
})

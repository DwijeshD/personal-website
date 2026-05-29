import { buildDoc } from '@/features/renderer/lib/syntaxHighlight'

describe('buildDoc', () => {
  it('returns isScript=false for JSON', () => {
    const { isScript } = buildDoc('json', '{"a":1}')
    expect(isScript).toBe(false)
  })

  it('returns isScript=true for tsx', () => {
    const { isScript } = buildDoc('tsx', 'export default () => <div/>')
    expect(isScript).toBe(true)
  })

  it('returns isScript=true for ts', () => {
    const { isScript } = buildDoc('ts', 'const x: number = 1')
    expect(isScript).toBe(true)
  })

  it('returns html string for unknown extension', () => {
    const { html } = buildDoc('xyz', 'hello')
    expect(typeof html).toBe('string')
    expect(html).toContain('<!DOCTYPE html>')
  })

  it('handles invalid JSON gracefully', () => {
    const { html } = buildDoc('json', '{bad json}')
    expect(html).toContain('JSON Error')
  })
})

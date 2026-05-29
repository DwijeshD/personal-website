import { stripTs } from '@/features/renderer/lib/stripTypeScript'

describe('stripTs', () => {
  it('removes import type statements', () => {
    const result = stripTs('import type { Foo } from "bar"\nconst x = 1\n')
    expect(result).not.toContain('import type')
    expect(result).toContain('const x = 1')
  })

  it('removes interface declarations', () => {
    const result = stripTs('interface Foo { x: number }\nconst y = 2\n')
    expect(result).not.toContain('interface Foo')
    expect(result).toContain('const y = 2')
  })

  it('removes type alias declarations', () => {
    const result = stripTs('type MyType = string | number\nconst z = 3\n')
    expect(result).not.toContain('type MyType')
    expect(result).toContain('const z = 3')
  })

  it('passes plain JS through unchanged', () => {
    const code = 'const add = (a, b) => a + b'
    expect(stripTs(code)).toBe(code)
  })
})

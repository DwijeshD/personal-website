import { dispatch } from '@/features/terminal/commands'
import type { CommandContext } from '@/features/terminal/commands'

const ctx: CommandContext = {
  theme: 'dark',
  setTheme: () => {},
  workspaceFiles: [],
  onNavigate: () => {},
}

describe('dispatch', () => {
  it('returns help text for help command', () => {
    const { lines } = dispatch('help', ctx)
    expect(lines.length).toBeGreaterThan(0)
  })

  it('returns error for unknown command', () => {
    const { lines } = dispatch('unknowncmd', ctx)
    expect(lines[0].text).toContain('command not found')
  })

  it('returns empty lines for empty input', () => {
    const { lines } = dispatch('', ctx)
    expect(lines).toHaveLength(0)
  })

  it('clear command sets clear:true', () => {
    const result = dispatch('clear', ctx)
    expect(result.clear).toBe(true)
  })

  it('whoami returns output', () => {
    const { lines } = dispatch('whoami', ctx)
    expect(lines.length).toBeGreaterThan(0)
  })

  it('fortune returns a string', () => {
    const { lines } = dispatch('fortune', ctx)
    expect(lines.length).toBeGreaterThan(0)
    expect(typeof lines[0].text).toBe('string')
  })
})

export interface TerminalLine {
  text: string
  type: 'input' | 'output' | 'error' | 'info' | 'success' | 'warning'
  prompt?: string
}

export interface TerminalHandle {
  clear: () => void
  runCommand: (cmd: string) => void
  getLastCommand: () => string | null
  pushLines: (lines: TerminalLine[]) => void
}

export interface CommandContext {
  theme: string
  setTheme: (t: string) => void
  workspaceFiles: string[]
  onNavigate: (id: string) => void
}

export interface CommandResult {
  lines: TerminalLine[]
  clear?: boolean
}

'use client'

interface Props {
  open: boolean
  onClose: () => void
}

const SHORTCUTS = [
  { category: 'Navigation', items: [
    { keys: 'Ctrl+P',       desc: 'Command Palette / Go to File' },
    { keys: 'Ctrl+Shift+E', desc: 'Toggle Explorer Sidebar' },
    { keys: 'Ctrl+`',       desc: 'Toggle Terminal' },
    { keys: 'Ctrl+Shift+A', desc: 'Toggle AI Copilot' },
    { keys: 'F11',          desc: 'Enter Full Screen' },
  ]},
  { category: 'Editor', items: [
    { keys: 'Ctrl+F',       desc: 'Find in File' },
    { keys: 'Ctrl+A',       desc: 'Select All' },
    { keys: 'Ctrl+C',       desc: 'Copy' },
    { keys: 'Ctrl+W',       desc: 'Close Tab' },
    { keys: 'Ctrl+Shift+W', desc: 'Close All Tabs' },
  ]},
  { category: 'View', items: [
    { keys: 'Ctrl+=',       desc: 'Zoom In' },
    { keys: 'Ctrl+-',       desc: 'Zoom Out' },
    { keys: 'Ctrl+0',       desc: 'Reset Zoom' },
  ]},
]

export default function KeyboardShortcutsModal({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 palette-backdrop"
      onClick={onClose}
    >
      <div
        className="bg-vsc-sidebar border border-vsc-border rounded shadow-2xl w-[520px] max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-vsc-border shrink-0">
          <span className="text-sm font-semibold text-vsc-text">Keyboard Shortcuts</span>
          <button
            onClick={onClose}
            className="text-vsc-muted hover:text-vsc-text text-xs w-5 h-5 flex items-center justify-center rounded hover:bg-vsc-hover"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto panel-scroll p-4 space-y-5 text-sm font-mono">
          {SHORTCUTS.map((section) => (
            <div key={section.category}>
              <div className="text-[10px] font-semibold tracking-widest text-vsc-muted uppercase mb-2">
                {section.category}
              </div>
              <div className="space-y-1">
                {section.items.map((s) => (
                  <div key={s.keys} className="flex items-center justify-between py-1 border-b border-vsc-border/30">
                    <span className="text-vsc-text/80 text-xs">{s.desc}</span>
                    <kbd className="px-2 py-0.5 text-[10px] bg-vsc-titlebar border border-vsc-border rounded text-vsc-fn font-mono">
                      {s.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-vsc-border flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-vsc-accent hover:bg-vsc-accent-hover text-white text-xs rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

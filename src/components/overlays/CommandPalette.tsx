'use client'

import { useEffect, useRef, useState } from 'react'
import type { CustomFile, CustomFolder } from '@/lib/fileSystem'
import { iconSrcForFile } from '@/lib/fileIcons'

interface Props {
  open: boolean
  onClose: () => void
  onNavigate: (id: string) => void
  workspaceFiles: CustomFile[]
  workspaceFolders: CustomFolder[]
}

export default function CommandPalette({ open, onClose, onNavigate, workspaceFiles, workspaceFolders }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const allFiles = [
    ...workspaceFiles.map(f => ({
      id: f.id, label: f.name, path: 'portfolio/src', iconSrc: iconSrcForFile(f.name),
    })),
    ...workspaceFolders.flatMap(folder => folder.files.map(f => ({
      id: f.id, label: f.name, path: `portfolio/src/${folder.name}`, iconSrc: iconSrcForFile(f.name),
    }))),
  ]

  const filtered = allFiles.filter(
    (t) =>
      t.label.toLowerCase().includes(query.toLowerCase()) ||
      t.id.toLowerCase().includes(query.toLowerCase()),
  )

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 palette-backdrop bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-vsc-sidebar border border-vsc-border rounded shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-vsc-border">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-vsc-muted shrink-0">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Go to file..."
            className="flex-1 bg-transparent text-vsc-text text-sm outline-none placeholder:text-vsc-muted"
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose()
              if (e.key === 'Enter' && filtered[0]) {
                onNavigate(filtered[0].id)
                onClose()
              }
            }}
          />
        </div>
        <ul className="max-h-64 overflow-y-auto py-1">
          {filtered.map((tab) => (
            <li
              key={tab.id}
              onClick={() => { onNavigate(tab.id); onClose() }}
              className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-vsc-selection transition-colors"
            >
              <img src={tab.iconSrc} width={16} height={16} alt="" aria-hidden />
              <span className="text-sm text-vsc-text">{tab.label}</span>
              <span className="ml-auto text-xs text-vsc-muted">{tab.path}</span>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-sm text-vsc-muted">No results found</li>
          )}
        </ul>
      </div>
    </div>
  )
}

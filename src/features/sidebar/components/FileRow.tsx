'use client'

import React from 'react'

interface Props {
  id: string
  name: string
  icon: React.ReactNode
  depth?: number
  folderId?: string
  activeTab: string
  openTabs: string[]
  onNavigate: (id: string) => void
  onContextMenu: (e: React.MouseEvent, id: string, name: string, folderId?: string) => void
  renamingId: string | null
  renameVal: string
  onRenameChange: (v: string) => void
  onRenameCommit: (id: string) => void
  onRenameCancel: () => void
  renameRef: React.RefObject<HTMLInputElement | null>
}

export const FileRow = React.memo(function FileRow({
  id,
  name,
  icon,
  depth = 0,
  folderId,
  activeTab,
  openTabs,
  onNavigate,
  onContextMenu,
  renamingId,
  renameVal,
  onRenameChange,
  onRenameCommit,
  onRenameCancel,
  renameRef,
}: Props) {
  const isRenaming = renamingId === id
  return (
    <li
      onClick={() => !isRenaming && onNavigate(id)}
      onContextMenu={(e) => onContextMenu(e, id, name, folderId)}
      className={`
        flex items-center gap-2 pr-3 py-[4px] cursor-pointer transition-colors relative
        ${activeTab === id ? 'bg-vsc-selection text-vsc-text' : 'text-[#cccccc] hover:bg-vsc-hover'}
      `}
      style={{ paddingLeft: `${20 + depth * 12}px` }}
    >
      {activeTab === id && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-vsc-accent" />}
      <span className="shrink-0 flex items-center">{icon}</span>
      {isRenaming ? (
        <input
          ref={renameRef}
          value={renameVal}
          onChange={e => onRenameChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onRenameCommit(id); if (e.key === 'Escape') onRenameCancel() }}
          onBlur={() => onRenameCommit(id)}
          onClick={e => e.stopPropagation()}
          className="flex-1 bg-transparent text-vsc-text text-[13px] outline-none border border-vsc-accent px-1 min-w-0"
        />
      ) : (
        <span className="truncate text-[13px]">{name}</span>
      )}
      {!isRenaming && openTabs.includes(id) && activeTab !== id && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-vsc-muted/50 shrink-0" />
      )}
    </li>
  )
})

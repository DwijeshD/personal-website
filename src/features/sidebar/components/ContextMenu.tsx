'use client'

import type { CtxTarget } from '../types'

interface Props {
  ctx: CtxTarget
  clipboard: { id: string; name: string } | null
  onNewFile: () => void
  onNewFolder: () => void
  onCopy: () => void
  onPaste: () => void
  onCopyPath: () => void
  onRename: () => void
  onDelete: () => void
}

export function ContextMenu({
  ctx,
  clipboard,
  onNewFile,
  onNewFolder,
  onCopy,
  onPaste,
  onCopyPath,
  onRename,
  onDelete,
}: Props) {
  return (
    <div
      className="fixed z-[1000] bg-[#1f1f1f] border border-[#3c3c3c] rounded shadow-2xl py-1 min-w-[200px] text-[13px]"
      style={{
        left: Math.min(ctx.x, window.innerWidth  - 210),
        top:  Math.min(ctx.y, window.innerHeight - 290),
      }}
      onMouseDown={e => e.stopPropagation()}
    >
      <CtxBtn label="New File"   onClick={onNewFile} />
      <CtxBtn label="New Folder" onClick={onNewFolder} />
      {!ctx.blank && (
        <>
          <CtxSep />
          <CtxBtn label="Copy"      shortcut="Ctrl+C" onClick={onCopy} />
          <CtxBtn label="Paste"     shortcut="Ctrl+V" onClick={onPaste}    disabled={!clipboard} />
          <CtxBtn label="Copy Path"                   onClick={onCopyPath} />
          <CtxSep />
          <CtxBtn label="Rename"    shortcut="F2"     onClick={onRename} />
          <CtxBtn label="Delete"    shortcut="Del"    onClick={onDelete} danger />
        </>
      )}
    </div>
  )
}

function CtxBtn({ label, shortcut, onClick, disabled, danger }: {
  label: string; shortcut?: string; onClick: () => void; disabled?: boolean; danger?: boolean
}) {
  return (
    <button
      onMouseDown={disabled ? undefined : onClick}
      className={`w-full flex items-center justify-between px-3 py-[5px] text-left transition-colors ${
        disabled ? 'opacity-35 cursor-default text-[#858585]' :
        danger   ? 'text-[#f48771] hover:bg-[#f4877122]' :
                   'text-[#cccccc] hover:bg-[#094771]'
      }`}
    >
      <span>{label}</span>
      {shortcut && <span className="text-[11px] text-[#858585] ml-6">{shortcut}</span>}
    </button>
  )
}

function CtxSep() {
  return <div className="my-1 border-t border-[#3c3c3c]" />
}

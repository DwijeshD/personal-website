'use client'

import { useEffect, useRef, useState } from 'react'
import type { CustomFile, CustomFolder } from '@/lib/fileSystem'
import { iconSrcForFile } from '@/lib/fileIcons'
import type { CtxTarget } from '../types'
import { FileRow } from './FileRow'
import { ContextMenu } from './ContextMenu'

// ─── Icons ────────────────────────────────────────────────────────────────────

const FolderIcon = ({ open }: { open: boolean }) => (
  <img src={open ? '/icons/files/folder-open.svg' : '/icons/files/folder.svg'} width={16} height={16} alt="" aria-hidden />
)

function iconForFile(name: string): React.ReactNode {
  return <img src={iconSrcForFile(name)} width={16} height={16} alt="" aria-hidden />
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  portfolioOpen: boolean
  setPortfolioOpen: (v: boolean) => void
  workspaceFiles: CustomFile[]
  workspaceFolders: CustomFolder[]
  onWorkspaceFilesChange: (files: CustomFile[]) => void
  onWorkspaceFoldersChange: (folders: CustomFolder[]) => void
  activeTab: string
  openTabs: string[]
  onNavigate: (id: string) => void
  onFileDeleted: (id: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FileTree({
  portfolioOpen,
  setPortfolioOpen,
  workspaceFiles,
  workspaceFolders,
  onWorkspaceFilesChange,
  onWorkspaceFoldersChange,
  activeTab,
  openTabs,
  onNavigate,
  onFileDeleted,
}: Props) {
  const setWorkspaceFiles   = onWorkspaceFilesChange
  const setWorkspaceFolders = onWorkspaceFoldersChange

  const [newMode, setNewMode]                 = useState<'file' | 'folder' | null>(null)
  const [newName, setNewName]                 = useState('')
  const [newInFolder, setNewInFolder]         = useState<string | null>(null)
  const [newInFolderName, setNewInFolderName] = useState('')
  const [ctx, setCtx]                         = useState<CtxTarget | null>(null)
  const [renamingId, setRenamingId]           = useState<string | null>(null)
  const [renameVal, setRenameVal]             = useState('')
  const [nameOverrides, setNameOverrides]     = useState<Record<string, string>>({})
  const [clipboard, setClipboard]             = useState<{ id: string; name: string } | null>(null)

  const inputRef       = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const renameRef      = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!ctx) return
    const close = () => setCtx(null)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [ctx])

  // ── New file/folder ────────────────────────────────────────────────────────

  function commitNew() {
    const name = newName.trim()
    if (!name) { cancelNew(); return }
    if (newMode === 'file') {
      const id = 'file:' + name
      setWorkspaceFiles(workspaceFiles.some(f => f.id === id) ? workspaceFiles : [...workspaceFiles, { id, name }])
      onNavigate(id)
    } else if (newMode === 'folder') {
      setWorkspaceFolders([...workspaceFolders, { id: 'folder:' + name, name, open: true, files: [] }])
    }
    cancelNew()
  }

  function cancelNew() {
    setNewMode(null)
    setNewName('')
  }

  function startNew(mode: 'file' | 'folder') {
    setNewMode(mode)
    setNewName('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function startNewInFolder(folderId: string) {
    setWorkspaceFolders(workspaceFolders.map(f => f.id === folderId ? { ...f, open: true } : f))
    setNewInFolder(folderId)
    setNewInFolderName('')
    setTimeout(() => folderInputRef.current?.focus(), 0)
  }

  function commitFolderFile(folderId: string) {
    const name = newInFolderName.trim()
    if (!name) { cancelFolderFile(); return }
    const fileId = 'file:' + name
    setWorkspaceFolders(workspaceFolders.map(f =>
      f.id === folderId ? { ...f, files: [...f.files, { id: fileId, name }] } : f
    ))
    onNavigate(fileId)
    cancelFolderFile()
  }

  function cancelFolderFile() {
    setNewInFolder(null)
    setNewInFolderName('')
  }

  // ── Context menu ───────────────────────────────────────────────────────────

  function openCtx(e: React.MouseEvent, id: string, name: string, folderId?: string) {
    e.preventDefault()
    e.stopPropagation()
    setCtx({ x: e.clientX, y: e.clientY, id, name, folderId })
  }

  function openBlankCtx(e: React.MouseEvent) {
    e.preventDefault()
    setCtx({ x: e.clientX, y: e.clientY, id: '', name: '', blank: true })
  }

  function handleDelete() {
    if (!ctx) return
    const { id, folderId } = ctx
    setCtx(null)
    if (folderId) {
      setWorkspaceFolders(workspaceFolders.map((f: CustomFolder) =>
        f.id === folderId ? { ...f, files: f.files.filter((fi: CustomFile) => fi.id !== id) } : f
      ))
    } else {
      setWorkspaceFiles(workspaceFiles.filter((f: CustomFile) => f.id !== id))
    }
    onFileDeleted(id)
  }

  function handleRename() {
    if (!ctx) return
    const displayName = nameOverrides[ctx.id] ?? ctx.name
    setCtx(null)
    setRenamingId(ctx.id)
    setRenameVal(displayName)
    setTimeout(() => renameRef.current?.focus(), 0)
  }

  function commitRename(id: string) {
    const name = renameVal.trim()
    if (name) {
      setNameOverrides(prev => ({ ...prev, [id]: name }))
      setWorkspaceFiles(workspaceFiles.map(f => f.id === id ? { ...f, name } : f))
      setWorkspaceFolders(workspaceFolders.map(folder => ({
        ...folder,
        files: folder.files.map(f => f.id === id ? { ...f, name } : f),
      })))
    }
    setRenamingId(null)
  }

  function handleCopy() {
    if (!ctx) return
    setClipboard({ id: ctx.id, name: nameOverrides[ctx.id] ?? ctx.name })
    setCtx(null)
  }

  function handlePaste() {
    if (!clipboard) return
    const base = clipboard.name
    const dotIdx = base.lastIndexOf('.')
    const newFileName = dotIdx > 0
      ? base.slice(0, dotIdx) + '_copy' + base.slice(dotIdx)
      : base + '_copy'
    const newId = 'file:' + newFileName
    setWorkspaceFiles(workspaceFiles.some(f => f.id === newId) ? workspaceFiles : [...workspaceFiles, { id: newId, name: newFileName }])
    onNavigate(newId)
    setCtx(null)
  }

  function handleCopyPath() {
    if (!ctx) return
    navigator.clipboard.writeText(ctx.name).catch(() => {})
    setCtx(null)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* PORTFOLIO folder header */}
      <div className="group flex items-center gap-1.5 px-2 py-1 select-none shrink-0 hover:bg-vsc-hover/50 transition-colors">
        <button
          onClick={() => setPortfolioOpen(!portfolioOpen)}
          className="flex items-center gap-1.5 flex-1 min-w-0"
        >
          <span className="text-vsc-muted text-[10px] w-3 text-center shrink-0">
            {portfolioOpen ? '▾' : '▸'}
          </span>
          <span className="font-semibold text-vsc-muted tracking-wide text-[11px] uppercase truncate">
            Portfolio
          </span>
        </button>

        {/* New file / new folder buttons — show on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => { setPortfolioOpen(true); startNew('file') }}
            title="New File"
            className="w-5 h-5 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="13" x2="12" y2="19"/>
              <line x1="9" y1="16" x2="15" y2="16"/>
            </svg>
          </button>
          <button
            onClick={() => { setPortfolioOpen(true); startNew('folder') }}
            title="New Folder"
            className="w-5 h-5 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              <line x1="12" y1="11" x2="12" y2="17"/>
              <line x1="9" y1="14" x2="15" y2="14"/>
            </svg>
          </button>
        </div>
      </div>

      {/* File list */}
      <ul className="flex-1 overflow-y-auto panel-scroll py-0.5" onContextMenu={openBlankCtx}>
        {portfolioOpen && (
          <>
            {/* Folders */}
            {workspaceFolders.map((folder) => (
              <li key={folder.id}>
                <div
                  className="group flex items-center gap-2 pr-2 py-[4px] cursor-pointer text-[#cccccc] hover:bg-vsc-hover transition-colors"
                  style={{ paddingLeft: '20px' }}
                  onContextMenu={(e) => openCtx(e, folder.id, folder.name)}
                >
                  <button
                    className="flex items-center gap-2 flex-1 min-w-0"
                    onClick={() => setWorkspaceFolders(
                      workspaceFolders.map(f => f.id === folder.id ? { ...f, open: !f.open } : f)
                    )}
                  >
                    <span className="text-vsc-muted text-[9px] w-3 text-center shrink-0">{folder.open ? '▾' : '▸'}</span>
                    <span className="flex items-center shrink-0"><FolderIcon open={folder.open} /></span>
                    <span className="truncate text-[13px]">{folder.name}</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); startNewInFolder(folder.id) }}
                    title="New File in Folder"
                    className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center text-vsc-muted hover:text-vsc-text rounded transition-colors shrink-0"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="12" y1="13" x2="12" y2="19"/>
                      <line x1="9" y1="16" x2="15" y2="16"/>
                    </svg>
                  </button>
                </div>
                {folder.open && (
                  <>
                    {folder.files.map(f => (
                      <FileRow
                        key={f.id}
                        id={f.id}
                        name={nameOverrides[f.id] ?? f.name}
                        icon={iconForFile(nameOverrides[f.id] ?? f.name)}
                        depth={2}
                        folderId={folder.id}
                        activeTab={activeTab}
                        openTabs={openTabs}
                        onNavigate={onNavigate}
                        onContextMenu={openCtx}
                        renamingId={renamingId}
                        renameVal={renameVal}
                        onRenameChange={setRenameVal}
                        onRenameCommit={commitRename}
                        onRenameCancel={() => setRenamingId(null)}
                        renameRef={renameRef}
                      />
                    ))}
                    {newInFolder === folder.id && (
                      <li className="flex items-center gap-2 pr-3 py-[4px]" style={{ paddingLeft: '44px' }}>
                        <span className="shrink-0">{iconForFile(newInFolderName || 'file')}</span>
                        <input
                          ref={folderInputRef}
                          value={newInFolderName}
                          onChange={e => setNewInFolderName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') commitFolderFile(folder.id)
                            if (e.key === 'Escape') cancelFolderFile()
                          }}
                          onBlur={cancelFolderFile}
                          placeholder="filename.ext"
                          className="flex-1 bg-transparent text-vsc-text text-[13px] outline-none border border-vsc-accent px-1 min-w-0"
                        />
                      </li>
                    )}
                  </>
                )}
              </li>
            ))}

            {/* All files */}
            {workspaceFiles.map((f: CustomFile) => (
              <FileRow
                key={f.id}
                id={f.id}
                name={nameOverrides[f.id] ?? f.name}
                icon={iconForFile(nameOverrides[f.id] ?? f.name)}
                depth={1}
                activeTab={activeTab}
                openTabs={openTabs}
                onNavigate={onNavigate}
                onContextMenu={openCtx}
                renamingId={renamingId}
                renameVal={renameVal}
                onRenameChange={setRenameVal}
                onRenameCommit={commitRename}
                onRenameCancel={() => setRenamingId(null)}
                renameRef={renameRef}
              />
            ))}

            {/* Inline input for new file/folder */}
            {newMode && (
              <li className="flex items-center gap-2 pr-3 py-[4px]" style={{ paddingLeft: '20px' }}>
                <span className="shrink-0 w-3" />
                <span className="shrink-0">
                  {newMode === 'file' ? iconForFile(newName || 'file') : <FolderIcon open={false} />}
                </span>
                <input
                  ref={inputRef}
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') commitNew()
                    if (e.key === 'Escape') cancelNew()
                  }}
                  onBlur={cancelNew}
                  placeholder={newMode === 'file' ? 'filename.ext' : 'folder name'}
                  className="flex-1 bg-transparent text-vsc-text text-[13px] outline-none border border-vsc-accent px-1 min-w-0"
                />
              </li>
            )}
          </>
        )}
      </ul>

      {/* Context menu */}
      {ctx && (
        <ContextMenu
          ctx={ctx}
          clipboard={clipboard}
          onNewFile={() => { setCtx(null); setPortfolioOpen(true); startNew('file') }}
          onNewFolder={() => { setCtx(null); setPortfolioOpen(true); startNew('folder') }}
          onCopy={handleCopy}
          onPaste={handlePaste}
          onCopyPath={handleCopyPath}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      )}
    </>
  )
}

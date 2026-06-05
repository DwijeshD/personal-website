'use client'

import { useCallback, useMemo, useState } from 'react'
import { TABS } from '@/lib/tabs'
import { DEFAULT_CONTENT } from '@/shared/content'
import type { CustomFile, CustomFolder, AiFileAction } from '@/lib/fileSystem'

export type ViewMode = 'code' | 'preview' | 'split'

export function idToFilename(id: string): string {
  return id.startsWith('file:') ? id.slice(5) : id
}

export function defaultMode(filename: string): ViewMode {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'md' || ext === 'markdown' || ext === 'svg' || ext === 'txt') return 'preview'
  const splitExts = new Set(['html', 'htm', 'tsx', 'jsx', 'css', 'scss'])
  return splitExts.has(ext) ? 'split' : 'code'
}

export function useEditorState() {
  const [openTabs, setOpenTabs]           = useState<string[]>(['file:home.html'])
  const [activeTab, setActiveTab]         = useState('file:home.html')
  const [fileContents, setFileContents]   = useState<Record<string, string>>({})
  const [fileModes, setFileModes]         = useState<Record<string, ViewMode>>({ 'file:home.html': 'preview', 'file:about.svg': 'preview' })
  const [workspaceFiles, setWorkspaceFiles]     = useState<CustomFile[]>(() => TABS.map(t => ({ id: t.id, name: t.label })))
  const [workspaceFolders, setWorkspaceFolders] = useState<CustomFolder[]>([])
  const [recentFiles, setRecentFiles]     = useState<string[]>([])

  const defaultFileIds = useMemo(() => new Set(TABS.map(t => t.id)), [])

  const navigate = useCallback((id: string) => {
    setOpenTabs(prev => prev.includes(id) ? prev : [...prev, id])
    setActiveTab(id)
    setRecentFiles(prev => [id, ...prev.filter(r => r !== id)].slice(0, 8))
  }, [])

  const closeTab = useCallback((id: string) => {
    setOpenTabs(prev => {
      const next = prev.filter(t => t !== id)
      if (activeTab === id && next.length > 0) setActiveTab(next[next.length - 1])
      return next
    })
  }, [activeTab])

  const executeAiAction = useCallback((action: AiFileAction) => {
    const { path, content = '' } = action
    const id = 'file:' + path
    switch (action.action) {
      case 'create_file':
      case 'update_file':
        setWorkspaceFiles(prev => prev.some(f => f.id === id) ? prev : [...prev, { id, name: path }])
        setFileContents(prev => ({ ...prev, [id]: content }))
        navigate(id)
        break
      case 'delete_file':
        setWorkspaceFiles(prev => prev.filter(f => f.id !== id))
        setWorkspaceFolders(prev => prev.map(folder => ({
          ...folder, files: folder.files.filter(f => f.id !== id),
        })))
        closeTab(id)
        setFileContents(prev => { const n = { ...prev }; delete n[id]; return n })
        setFileModes(prev => { const n = { ...prev }; delete n[id]; return n })
        break
      case 'create_folder': {
        const folderId = 'folder:' + path
        setWorkspaceFolders(prev =>
          prev.some(f => f.id === folderId) ? prev : [...prev, { id: folderId, name: path, open: true, files: [] }]
        )
        break
      }
    }
  }, [navigate, closeTab])

  function updateFileContent(id: string, v: string, filename: string) {
    setFileContents(prev => {
      if (v === (DEFAULT_CONTENT[filename] ?? '')) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: v }
    })
  }

  function deleteFileFromState(id: string) {
    closeTab(id)
    setFileContents(prev => { const n = { ...prev }; delete n[id]; return n })
    setFileModes(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  function renameFileInState(oldId: string, newId: string, newName: string) {
    setOpenTabs(prev => prev.map(t => t === oldId ? newId : t))
    setActiveTab(prev => prev === oldId ? newId : prev)
    setFileContents(prev => {
      const oldContent = oldId in prev ? prev[oldId] : DEFAULT_CONTENT[idToFilename(oldId)]
      if (oldContent === undefined) return prev
      const n = { ...prev, [newId]: oldContent }
      delete n[oldId]
      return n
    })
    setFileModes(prev => {
      if (!(oldId in prev)) return prev
      const n = { ...prev, [newId]: prev[oldId] }
      delete n[oldId]
      return n
    })
    setRecentFiles(prev => prev.map(r => r === oldId ? newId : r))
    setWorkspaceFiles(prev => prev.map(f => f.id === oldId ? { id: newId, name: newName } : f))
    setWorkspaceFolders(prev => prev.map(folder => ({
      ...folder,
      files: folder.files.map(f => f.id === oldId ? { id: newId, name: newName } : f),
    })))
  }

  return {
    openTabs, setOpenTabs,
    activeTab, setActiveTab,
    fileContents,
    fileModes, setFileModes,
    workspaceFiles, setWorkspaceFiles,
    workspaceFolders, setWorkspaceFolders,
    recentFiles,
    defaultFileIds,
    navigate,
    closeTab,
    executeAiAction,
    updateFileContent,
    deleteFileFromState,
    renameFileInState,
  }
}

'use client'

import Image from 'next/image'
import type { CustomFile, CustomFolder } from '@/lib/fileSystem'
import { iconSrcForFile } from '@/lib/fileIcons'

function iconForFile(name: string): React.ReactNode {
  return <Image src={iconSrcForFile(name)} width={16} height={16} alt="" aria-hidden />
}

interface Props {
  searchQuery: string
  onSearchChange: (q: string) => void
  workspaceFiles: CustomFile[]
  workspaceFolders: CustomFolder[]
  fileContents: Record<string, string>
  defaultContents: Record<string, string>
  onNavigate: (id: string) => void
}

export function SearchPanel({
  searchQuery,
  onSearchChange,
  workspaceFiles,
  workspaceFolders,
  fileContents,
  defaultContents,
  onNavigate,
}: Props) {
  return (
    <>
      <div className="px-3">
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search files..."
          autoFocus
          className="w-full bg-vsc-input border border-vsc-border text-vsc-text text-sm px-3 py-1.5 rounded outline-none focus:border-vsc-accent placeholder:text-vsc-muted"
        />
        {searchQuery && (() => {
          const q = searchQuery.toLowerCase()
          const allSearchable = [
            ...workspaceFiles.map((f: CustomFile) => ({
              id: f.id, label: f.name, path: f.name,
              content: fileContents[f.id] ?? defaultContents[f.name] ?? '',
            })),
            ...workspaceFolders.flatMap((folder: CustomFolder) =>
              folder.files.map((f: CustomFile) => ({
                id: f.id, label: f.name, path: `${folder.name}/${f.name}`,
                content: fileContents[f.id] ?? '',
              }))
            ),
          ]
          const results = allSearchable.flatMap((file: { id: string; label: string; path: string; content: string }) => {
            const lines = file.content.split('\n')
            const hits = lines
              .map((line: string, i: number) => ({ line, lineNum: i + 1 }))
              .filter(({ line }: { line: string; lineNum: number }) => line.toLowerCase().includes(q))
              .slice(0, 3)
            const nameMatch = file.path.toLowerCase().includes(q)
            return (hits.length > 0 || nameMatch) ? [{ ...file, hits }] : []
          })
          return (
            <ul className="mt-2 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] panel-scroll">
              {results.length === 0 && (
                <li className="px-2 py-2 text-sm text-vsc-muted">No results</li>
              )}
              {results.map((file: { id: string; label: string; path: string; hits: { line: string; lineNum: number }[] }) => (
                <li key={file.id}>
                  <div
                    onClick={() => { onNavigate(file.id); onSearchChange('') }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-vsc-hover transition-colors"
                  >
                    <span className="shrink-0">{iconForFile(file.label)}</span>
                    <span className="text-sm text-vsc-text font-medium truncate flex-1">{file.path}</span>
                    {file.hits.length > 0 && (
                      <span className="text-[10px] text-vsc-muted shrink-0">{file.hits.length}</span>
                    )}
                  </div>
                  {file.hits.map(({ line, lineNum }) => (
                    <div
                      key={lineNum}
                      onClick={() => { onNavigate(file.id); onSearchChange('') }}
                      className="flex items-start gap-2 pl-8 pr-2 py-0.5 cursor-pointer hover:bg-vsc-hover/50 transition-colors"
                    >
                      <span className="text-[10px] text-vsc-muted w-6 text-right shrink-0 pt-px">{lineNum}</span>
                      <span className="text-[11px] font-mono text-vsc-muted truncate">{line.trim()}</span>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          )
        })()}
      </div>
    </>
  )
}

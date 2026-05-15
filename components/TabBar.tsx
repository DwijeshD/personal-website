'use client'

import { TABS } from '@/lib/data'
import { iconSrcForFile } from '@/lib/fileIcons'

interface Props {
  openTabs: string[]
  activeTab: string
  onSelect: (id: string) => void
  onClose: (id: string) => void
}

function tabMeta(id: string) {
  const known = TABS.find(t => t.id === id)
  if (known) return { ...known, iconSrc: iconSrcForFile(known.label) }
  if (id.startsWith('file:')) {
    const name = id.slice(5)
    return { id, label: name, icon: '·', iconClass: 'text-vsc-muted', iconSrc: iconSrcForFile(name) }
  }
  return { id, label: id, icon: '·', iconClass: 'text-vsc-muted', iconSrc: null }
}

export default function TabBar({ openTabs, activeTab, onSelect, onClose }: Props) {
  return (
    <div className="h-[35px] bg-vsc-tab-inactive flex items-end shrink-0 overflow-x-auto overflow-y-hidden border-b border-vsc-border/40">
      {openTabs.map((id) => {
        const tab = tabMeta(id)
        const isActive = id === activeTab
        return (
          <div
            key={id}
            onClick={() => onSelect(id)}
            className={`
              group flex items-center gap-1.5 px-3 h-full cursor-pointer shrink-0 select-none
              border-r border-vsc-border/30 text-sm transition-colors relative
              ${isActive
                ? 'bg-vsc-tab-active text-vsc-text border-t-2 border-t-vsc-accent'
                : 'bg-vsc-tab-inactive text-vsc-muted hover:bg-vsc-hover hover:text-vsc-text border-t-2 border-t-transparent'}
            `}
          >
            {tab.iconSrc
              ? <img src={tab.iconSrc} width={14} height={14} alt="" className="shrink-0" />
              : <span className={`text-[11px] ${tab.iconClass}`}>{tab.icon}</span>
            }
            <span className="text-xs">{tab.label}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(id) }}
              className="ml-1 w-4 h-4 flex items-center justify-center rounded text-vsc-muted hover:text-vsc-text hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        )
      })}
    </div>
  )
}

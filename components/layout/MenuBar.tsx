'use client'

import { useEffect, useRef, useState } from 'react'

export interface MenuItemDef {
  label?: string        // undefined = separator
  shortcut?: string
  disabled?: boolean
  danger?: boolean
  action?: () => void
  submenu?: MenuItemDef[]
}

export interface MenuDef {
  label: string
  items: MenuItemDef[]
}

interface Props {
  menus: MenuDef[]
}

export default function MenuBar({ menus }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [submenuIdx, setSubmenuIdx] = useState<number | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenIdx(null)
        setSubmenuIdx(null)
      }
    }
    if (openIdx !== null) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [openIdx])

  // Close on Escape
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpenIdx(null); setSubmenuIdx(null) }
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [])

  function toggleMenu(idx: number) {
    setOpenIdx((prev) => (prev === idx ? null : idx))
    setSubmenuIdx(null)
  }

  function hoverMenu(idx: number) {
    if (openIdx !== null) { setOpenIdx(idx); setSubmenuIdx(null) }
  }

  function clickItem(item: MenuItemDef) {
    if (item.disabled || !item.action) return
    item.action()
    setOpenIdx(null)
    setSubmenuIdx(null)
  }

  return (
    <div ref={barRef} className="flex items-center gap-0.5 relative">
      {menus.map((menu, i) => (
        <div key={menu.label} className="relative">
          <button
            onMouseDown={() => toggleMenu(i)}
            onMouseEnter={() => hoverMenu(i)}
            className={`
              px-2.5 py-0.5 text-xs rounded transition-colors select-none
              ${openIdx === i
                ? 'bg-vsc-selection text-vsc-text'
                : 'text-vsc-muted hover:bg-white/10 hover:text-vsc-text'}
            `}
          >
            {menu.label}
          </button>

          {openIdx === i && (
            <div className="absolute top-full left-0 z-50 mt-0.5 min-w-[200px] bg-vsc-sidebar border border-vsc-border shadow-2xl rounded-sm py-1">
              {menu.items.map((item, j) => {
                if (!item.label) {
                  return <div key={j} className="my-1 border-t border-vsc-border" />
                }

                const hasSubmenu = item.submenu && item.submenu.length > 0

                return (
                  <div
                    key={j}
                    className="relative"
                    onMouseEnter={() => hasSubmenu ? setSubmenuIdx(j) : setSubmenuIdx(null)}
                  >
                    <button
                      onClick={() => !hasSubmenu && clickItem(item)}
                      disabled={item.disabled}
                      className={`
                        w-full flex items-center justify-between px-4 py-1 text-xs text-left
                        transition-colors
                        ${item.disabled
                          ? 'text-vsc-muted cursor-default opacity-50'
                          : item.danger
                            ? 'text-vsc-red hover:bg-vsc-selection'
                            : 'text-vsc-text hover:bg-vsc-selection cursor-pointer'}
                      `}
                    >
                      <span>{item.label}</span>
                      <span className="flex items-center gap-2 ml-6">
                        {item.shortcut && (
                          <span className="text-vsc-muted text-[10px]">{item.shortcut}</span>
                        )}
                        {hasSubmenu && <span className="text-vsc-muted">›</span>}
                      </span>
                    </button>

                    {/* Submenu */}
                    {hasSubmenu && submenuIdx === j && (
                      <div className="absolute left-full top-0 ml-0.5 min-w-[180px] bg-vsc-sidebar border border-vsc-border shadow-2xl rounded-sm py-1 z-50">
                        {item.submenu!.map((sub, k) => {
                          if (!sub.label) return <div key={k} className="my-1 border-t border-vsc-border" />
                          return (
                            <button
                              key={k}
                              onClick={() => clickItem(sub)}
                              disabled={sub.disabled}
                              className={`
                                w-full flex items-center justify-between px-4 py-1 text-xs text-left
                                transition-colors
                                ${sub.disabled
                                  ? 'text-vsc-muted cursor-default opacity-50'
                                  : 'text-vsc-text hover:bg-vsc-selection cursor-pointer'}
                              `}
                            >
                              <span>{sub.label}</span>
                              {sub.shortcut && (
                                <span className="text-vsc-muted text-[10px] ml-6">{sub.shortcut}</span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

interface Props {
  activeTab: string
  navigate: (id: string) => void
}

export default function UrlSync({ activeTab, navigate }: Props) {
  const params = useSearchParams()
  const initialised = useRef(false)

  // On mount: read ?file= and open the requested file
  useEffect(() => {
    const file = params.get('file')
    if (file) navigate(`file:${file}`)
    initialised.current = true
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync active tab → URL. Use the History API, not router.replace: this only
  // needs the address bar updated. router.replace triggers a Next navigation
  // (RSC refetch + useSearchParams update) which can remount the tree and
  // feed back into this effect — a loop the PDF iframe makes visible/heavy.
  useEffect(() => {
    if (!initialised.current) return
    const filename = activeTab.startsWith('file:') ? activeTab.slice(5) : null
    if (!filename) return
    const url = new URL(window.location.href)
    url.searchParams.set('file', filename)
    window.history.replaceState(null, '', url.pathname + url.search)
  }, [activeTab])

  return null
}

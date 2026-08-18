'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

interface Props {
  activeTab: string
  navigate: (id: string) => void
}

export default function UrlSync({ activeTab, navigate }: Props) {
  const params = useSearchParams()
  // The file from the incoming URL that the active tab must reach before we
  // start syncing tab → URL. Without this gate, the first render (activeTab
  // still the default home.html) writes ?file=home.html and clobbers the
  // incoming ?file=resume.pdf before navigate() lands — the two effects race
  // and the tab flips home ⇄ resume, remounting the heavy PDF iframe each time.
  // undefined = not yet read (set in the mount effect below, which runs before
  // the sync effect in the same commit). Read here in a ref init would capture
  // an empty value during SSR/hydration and never open the deep-linked file.
  const pending = useRef<string | null | undefined>(undefined)

  // On mount: open the file from ?file=
  useEffect(() => {
    const file = params.get('file')
    pending.current = file || null
    if (file) navigate(`file:${file}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync active tab → URL via the History API (address bar only; router.replace
  // would trigger a Next navigation + RSC refetch and feed back here).
  useEffect(() => {
    const filename = activeTab.startsWith('file:') ? activeTab.slice(5) : null
    if (!filename) return
    if (pending.current === undefined) return  // mount effect not run yet
    // Still reconciling the incoming URL — don't write until the tab reaches it.
    if (pending.current) {
      if (filename !== pending.current) return
      pending.current = null
    }
    const url = new URL(window.location.href)
    url.searchParams.set('file', filename)
    window.history.replaceState(null, '', url.pathname + url.search)
  }, [activeTab])

  return null
}

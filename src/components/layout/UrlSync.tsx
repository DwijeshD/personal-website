'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  activeTab: string
  navigate: (id: string) => void
}

export default function UrlSync({ activeTab, navigate }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const initialised = useRef(false)

  // On mount: read ?file= and open the requested file
  useEffect(() => {
    const file = params.get('file')
    if (file) navigate(`file:${file}`)
    initialised.current = true
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync active tab → URL
  useEffect(() => {
    if (!initialised.current) return
    const filename = activeTab.startsWith('file:') ? activeTab.slice(5) : null
    if (!filename) return
    const url = new URL(window.location.href)
    url.searchParams.set('file', filename)
    router.replace(url.pathname + url.search, { scroll: false })
  }, [activeTab, router])

  return null
}

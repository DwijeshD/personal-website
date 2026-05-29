import { useEffect, useRef } from 'react'
import type { Dispatch, MutableRefObject, SetStateAction } from 'react'
import type { AiFileAction } from '@/lib/fileSystem'
import type { Message } from '@/features/copilot/types'
import { parseThinkBlocks } from '@/features/copilot/lib/parseThinkBlocks'

const CHARS_PER_TICK = 2   // characters revealed per tick
const TICK_MS        = 45  // tick interval → ~44 chars/sec

export function useStreamingDisplay(
  streaming: boolean,
  setStreaming: Dispatch<SetStateAction<boolean>>,
  setMessages: Dispatch<SetStateAction<Message[]>>,
): {
  rawAccumRef: MutableRefObject<string>
  displayIdxRef: MutableRefObject<number>
  networkDoneRef: MutableRefObject<boolean>
  pendingChatActionRef: MutableRefObject<AiFileAction | null>
} {
  const rawAccumRef         = useRef('')
  const displayIdxRef       = useRef(0)
  const networkDoneRef      = useRef(false)
  const pendingChatActionRef = useRef<AiFileAction | null>(null)

  useEffect(() => {
    if (!streaming) return
    const id = setInterval(() => {
      const total = rawAccumRef.current.length
      if (displayIdxRef.current < total) {
        displayIdxRef.current = Math.min(displayIdxRef.current + CHARS_PER_TICK, total)
        const slice = rawAccumRef.current.slice(0, displayIdxRef.current)
        const { thinking, content } = parseThinkBlocks(slice)
        setMessages(m => {
          const c = [...m]
          if (c.length === 0) return c
          c[c.length - 1] = { role: 'assistant', content, thinking }
          return c
        })
      } else if (networkDoneRef.current) {
        if (pendingChatActionRef.current) {
          const action = pendingChatActionRef.current
          pendingChatActionRef.current = null
          setMessages(m => {
            const c = [...m]
            if (c.length > 0) c[c.length - 1] = { ...c[c.length - 1], action }
            return c
          })
        }
        setStreaming(false)
      }
    }, TICK_MS)
    return () => clearInterval(id)
  }, [streaming, setStreaming, setMessages])

  return { rawAccumRef, displayIdxRef, networkDoneRef, pendingChatActionRef }
}

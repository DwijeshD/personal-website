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
  rawAccum: MutableRefObject<string>
  displayIdx: MutableRefObject<number>
  networkDone: MutableRefObject<boolean>
  pendingChatAction: MutableRefObject<AiFileAction | null>
} {
  const rawAccum         = useRef('')
  const displayIdx       = useRef(0)
  const networkDone      = useRef(false)
  const pendingChatAction = useRef<AiFileAction | null>(null)

  useEffect(() => {
    if (!streaming) return
    const id = setInterval(() => {
      const total = rawAccum.current.length
      if (displayIdx.current < total) {
        displayIdx.current = Math.min(displayIdx.current + CHARS_PER_TICK, total)
        const slice = rawAccum.current.slice(0, displayIdx.current)
        const { thinking, content } = parseThinkBlocks(slice)
        setMessages(m => {
          const c = [...m]
          if (c.length === 0) return c
          c[c.length - 1] = { role: 'assistant', content, thinking }
          return c
        })
      } else if (networkDone.current) {
        if (pendingChatAction.current) {
          const action = pendingChatAction.current
          pendingChatAction.current = null
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

  return { rawAccum, displayIdx, networkDone, pendingChatAction }
}

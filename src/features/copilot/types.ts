import type { AiFileAction } from '@/lib/fileSystem'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  thinking?: string
  action?: AiFileAction
}

export interface LogEntry {
  ts: number
  level: 'info' | 'warn' | 'error'
  tag: string
  msg: string
}

export type IssueState =
  | { status: 'idle' }
  | { status: 'form'; title: string; desc: string }
  | { status: 'submitting' }
  | { status: 'done'; number: number }
  | { status: 'error'; msg: string }

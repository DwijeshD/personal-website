'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function CopilotMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        strong: ({ children }) => <strong className="font-semibold text-vsc-text">{children}</strong>,
        code: ({ children }) => <code className="px-1 bg-[#1a1a2e] border border-vsc-border/50 rounded text-[#9cdcfe] text-[11px] font-mono">{children}</code>,
        ul: ({ children }) => <ul className="space-y-0.5">{children}</ul>,
        li: ({ children }) => <li className="flex gap-1.5 items-baseline"><span className="text-vsc-accent/60 shrink-0 mt-0.5 text-[10px]">›</span><span>{children}</span></li>,
        ol: ({ children }) => <ol className="space-y-0.5">{children}</ol>,
        h1: ({ children }) => <div className="font-semibold text-vsc-text text-[12px] mt-1.5 mb-0.5">{children}</div>,
        h2: ({ children }) => <div className="font-semibold text-vsc-text text-[12px] mt-1.5 mb-0.5">{children}</div>,
        h3: ({ children }) => <div className="font-semibold text-vsc-text text-[12px] mt-1.5 mb-0.5">{children}</div>,
        p: ({ children }) => <div>{children}</div>,
      }}
    >{content}</ReactMarkdown>
  )
}

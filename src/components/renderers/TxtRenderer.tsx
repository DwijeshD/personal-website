'use client'

interface Props {
  content: string
}

export default function TxtRenderer({ content }: Props) {
  return (
    <div className="h-full overflow-auto panel-scroll px-8 py-6">
      <pre className="font-mono text-[13px] leading-6 text-vsc-fg whitespace-pre-wrap break-words m-0">
        {content}
      </pre>
    </div>
  )
}

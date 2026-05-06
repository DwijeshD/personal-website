import { PERSON } from '@/lib/data'

export default function ReadmePanel() {
  return (
    <div className="panel-fade-in h-full overflow-y-auto panel-scroll">
      <div className="flex">
        <div className="line-numbers pt-4 select-none flex flex-col text-right pr-3 min-w-[48px]">
          {Array.from({ length: 36 }, (_, i) => (
            <span key={i} className="leading-7">{i + 1}</span>
          ))}
        </div>
        <div className="flex-1 font-mono text-sm leading-7 px-4 py-4 space-y-4">

          <div>
            <span className="token-comment"># </span>
            <span className="token-fn text-lg font-bold">{PERSON.name}</span>
          </div>

          <div className="token-comment">
            {PERSON.headline}
          </div>

          <div className="h-px bg-vsc-border/30" />

          <div>
            <span className="token-keyword">## </span>
            <span className="token-fn">About</span>
          </div>
          <div className="text-vsc-text/80 text-[13px] leading-6 whitespace-pre-line">
            {`Computer Science graduate (First Class Honours) from the University of Southampton.
Focused on backend engineering and applied machine learning.`}
          </div>

          <div>
            <span className="token-keyword">## </span>
            <span className="token-fn">Getting Started</span>
          </div>
          <div className="bg-vsc-hover rounded px-3 py-2 text-sm">
            <div><span className="token-comment"># Install dependencies</span></div>
            <div><span className="token-keyword">npm</span> <span className="token-string">install</span></div>
            <div className="mt-1"><span className="token-comment"># Run dev server</span></div>
            <div><span className="token-keyword">npm</span> <span className="token-string">run dev</span></div>
          </div>

          <div>
            <span className="token-keyword">## </span>
            <span className="token-fn">Stack</span>
          </div>
          <div className="space-y-1 text-vsc-text/80 text-[13px]">
            <div>- <span className="token-keyword">Next.js 15</span> · App Router · Edge Runtime</div>
            <div>- <span className="token-keyword">React 19</span> · TypeScript · Tailwind CSS</div>
            <div>- <span className="token-keyword">OpenRouter</span> · llama-3.3-70b · SSE streaming</div>
          </div>

          <div>
            <span className="token-keyword">## </span>
            <span className="token-fn">Contact</span>
          </div>
          <div className="space-y-1 text-[13px]">
            <div>
              <span className="token-keyword">GitHub: </span>
              <a href={PERSON.github} target="_blank" rel="noopener noreferrer" className="text-vsc-accent hover:underline">
                {PERSON.github}
              </a>
            </div>
            <div>
              <span className="token-keyword">Email:  </span>
              <span className="token-string">{PERSON.email}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

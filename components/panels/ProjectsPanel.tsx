import { PROJECTS } from '@/lib/data'

export default function ProjectsPanel() {
  const lineCount = PROJECTS.length * 14 + 6

  return (
    <div className="panel-fade-in h-full overflow-y-auto panel-scroll">
      <div className="flex">
        <div className="line-numbers pt-4 select-none flex flex-col text-right pr-3 min-w-[48px]">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i} className="leading-7">{i + 1}</span>
          ))}
        </div>

        <div className="flex-1 font-mono text-base leading-7 px-4 py-4">
          <div className="token-comment mb-1">{'// projects.ts'}</div>
          <div className="mb-2">&nbsp;</div>
          <div>
            <span className="token-keyword">const</span>{' '}
            <span className="token-var">projects</span>{' '}
            <span className="token-operator">=</span>{' '}
            <span className="token-punc">[</span>
          </div>

          <div className="mt-3 mb-4 space-y-4 pl-4">
            {PROJECTS.map((p) => (
              <div
                key={p.id}
                className={`
                  border rounded p-4 transition-all hover:border-vsc-accent/50
                  ${p.highlight
                    ? 'border-vsc-accent/30 bg-vsc-sidebar'
                    : 'border-vsc-border bg-vsc-sidebar/50'}
                `}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="token-fn font-semibold">{p.name}</span>
                    {p.highlight && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-vsc-accent/20 text-vsc-accent border border-vsc-accent/30">
                        featured
                      </span>
                    )}
                  </div>
                  <span className="text-vsc-muted text-sm shrink-0">{p.subtitle}</span>
                </div>

                <p className="text-vsc-text/80 text-sm mb-3 leading-6">{p.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => (
                    <span key={tag} className="skill-pill text-[10px] text-vsc-type border-vsc-type/30">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="token-punc">]</div>
        </div>
      </div>
    </div>
  )
}

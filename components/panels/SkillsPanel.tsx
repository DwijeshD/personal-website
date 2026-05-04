import { SKILLS } from '@/lib/data'

const CATEGORY_COLORS: Record<string, string> = {
  languages:  'text-vsc-keyword border-vsc-keyword/30',
  backend:    'text-vsc-fn border-vsc-fn/30',
  systems:    'text-vsc-type border-vsc-type/30',
  databases:  'text-vsc-number border-vsc-number/30',
  cloud:      'text-vsc-accent border-vsc-accent/30',
  aiml:       'text-vsc-string border-vsc-string/30',
  data:       'text-vsc-comment border-vsc-comment/30',
  tools:      'text-vsc-muted border-vsc-border',
}

export default function SkillsPanel() {
  const entries = Object.entries(SKILLS) as [keyof typeof SKILLS, string[]][]

  return (
    <div className="panel-fade-in h-full overflow-y-auto panel-scroll">
      <div className="flex">
        <div className="line-numbers pt-4 select-none flex flex-col text-right pr-3 min-w-[48px]">
          {Array.from({ length: 60 }, (_, i) => (
            <span key={i} className="leading-7">{i + 1}</span>
          ))}
        </div>

        <div className="flex-1 font-mono text-base leading-7 px-4 py-4">
          <div className="token-comment mb-1">{'// skills.json'}</div>
          <div className="mb-2">&nbsp;</div>
          <div className="token-punc">{'{'}</div>

          <div className="pl-4 mt-2 space-y-4">
            {entries.map(([key, values]) => (
              <div key={key}>
                <div className="flex items-start gap-2 mb-1.5">
                  <span className="token-prop">&quot;{key}&quot;</span>
                  <span className="token-operator">:</span>
                  <span className="token-punc">[</span>
                </div>
                <div className="pl-4 flex flex-wrap items-center pb-1">
                  {values.map((v, i) => (
                    <span key={v}>
                      <span className={`skill-pill ${CATEGORY_COLORS[key] ?? 'text-vsc-text'}`}>
                        {v}
                      </span>
                      {i < values.length - 1 && <span className="token-punc">,</span>}
                    </span>
                  ))}
                </div>
                <div className="token-punc pl-4">]</div>
              </div>
            ))}
          </div>

          <div className="token-punc mt-2">{'}'}</div>
        </div>
      </div>
    </div>
  )
}

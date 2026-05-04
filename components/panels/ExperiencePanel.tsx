import { EXPERIENCE } from '@/lib/data'

export default function ExperiencePanel() {
  return (
    <div className="panel-fade-in h-full overflow-y-auto panel-scroll">
      <div className="flex">
        <div className="line-numbers pt-4 select-none flex flex-col text-right pr-3 min-w-[48px]">
          {Array.from({ length: 60 }, (_, i) => (
            <span key={i} className="leading-7">{i + 1}</span>
          ))}
        </div>

        <div className="flex-1 font-mono text-base leading-7 px-4 py-4">
          <div className="token-comment mb-1">{'// experience.ts'}</div>
          <div className="mb-2">&nbsp;</div>

          <div>
            <span className="token-keyword">export interface</span>{' '}
            <span className="token-type">Role</span>{' '}
            <span className="token-punc">{'{'}</span>
          </div>
          <div className="pl-6 token-comment">{'  company: string'}</div>
          <div className="pl-6 token-comment">{'  role: string'}</div>
          <div className="pl-6 token-comment">{'  period: string'}</div>
          <div className="pl-6 token-comment">{'  bullets: string[]'}</div>
          <div className="token-punc">{'}'}</div>

          <div className="mt-4 mb-2">&nbsp;</div>

          <div>
            <span className="token-keyword">const</span>{' '}
            <span className="token-var">experience</span>
            <span className="token-operator">: </span>
            <span className="token-type">Role</span>
            <span className="token-punc">[]</span>
            <span className="token-operator"> = </span>
            <span className="token-punc">[</span>
          </div>

          <div className="pl-4 mt-3 space-y-6">
            {EXPERIENCE.map((job) => (
              <div key={job.company} className="bg-vsc-sidebar border border-vsc-border rounded p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="token-fn font-bold text-lg">{job.company}</div>
                    <div className="token-type">{job.role}</div>
                  </div>
                  <div className="text-vsc-muted text-sm shrink-0">{job.period}</div>
                </div>

                <div className="space-y-1.5">
                  {job.bullets.map((b, i) => (
                    <div key={i} className="flex gap-2 text-sm text-vsc-text/90 leading-6">
                      <span className="token-accent text-vsc-accent shrink-0">→</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 token-punc">]</div>

          <div className="mt-6 p-4 border border-dashed border-vsc-border rounded text-center">
            <span className="token-comment">
              {'// More roles in development. Currently open to opportunities.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

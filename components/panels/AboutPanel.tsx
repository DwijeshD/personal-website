import { PERSON, ABOUT, EDUCATION } from '@/lib/data'

export default function AboutPanel() {
  const paragraphs = ABOUT.trim().split('\n\n')

  return (
    <div className="panel-fade-in h-full overflow-y-auto panel-scroll">
      <div className="flex">
        {/* Line numbers */}
        <div className="line-numbers pt-4 select-none flex flex-col text-right pr-3 min-w-[48px]">
          {Array.from({ length: 60 }, (_, i) => (
            <span key={i} className="leading-7">{i + 1}</span>
          ))}
        </div>

        <div className="flex-1 font-mono text-base leading-7 px-4 py-4 overflow-x-hidden">
          <div className="token-comment mb-1"># about.md</div>
          <div className="mb-4">&nbsp;</div>

          {/* Heading */}
          <div className="text-xl font-bold text-vsc-text mb-1">
            <span className="text-vsc-keyword"># </span>{PERSON.name}
          </div>
          <div className="text-vsc-muted mb-4">
            <span className="text-vsc-keyword">## </span>
            <span className="text-vsc-fn">{PERSON.headline}</span>
          </div>

          {/* Tagline */}
          <div className="bg-vsc-sidebar border-l-2 border-vsc-accent pl-4 py-2 mb-6 text-vsc-text/80 italic text-sm">
            {PERSON.tagline}
          </div>

          {/* About paragraphs */}
          <div className="text-vsc-keyword mb-2">### About</div>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-vsc-text/90 mb-3 leading-7">{p.trim()}</p>
          ))}

          <div className="mt-6">&nbsp;</div>

          {/* Education */}
          <div className="text-vsc-keyword mb-3">### Education</div>
          <div className="bg-vsc-sidebar border border-vsc-border rounded p-4 mb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-vsc-fn font-semibold">{EDUCATION.institution}</div>
                <div className="text-vsc-text">{EDUCATION.degree}</div>
                <div className="text-vsc-green text-sm mt-1">{EDUCATION.grade}</div>
              </div>
              <div className="text-vsc-muted text-sm shrink-0">{EDUCATION.period}</div>
            </div>

            <div className="mt-3 border-t border-vsc-border pt-3">
              <div className="text-xs text-vsc-muted mb-2">Dissertation</div>
              <div className="text-sm text-vsc-text">
                {EDUCATION.dissertation.title}
                <span className="ml-2 text-vsc-accent font-semibold">{EDUCATION.dissertation.grade}%</span>
              </div>
            </div>

            <div className="mt-3 border-t border-vsc-border pt-3">
              <div className="text-xs text-vsc-muted mb-2">Notable Modules</div>
              <div className="grid grid-cols-2 gap-1.5">
                {EDUCATION.modules.map((m) => (
                  <div key={m.name} className="flex items-center justify-between text-sm gap-2">
                    <span className="text-vsc-text/80 truncate">{m.name}</span>
                    <span className="text-vsc-number shrink-0">{m.grade}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="text-vsc-keyword mb-2 mt-4">### Interests</div>
          <ul className="space-y-1">
            {[
              'AI systems and automation',
              'Backend architecture and distributed systems',
              'Applied machine learning on real-world data',
              'Startups and building scalable products',
            ].map((item) => (
              <li key={item} className="text-vsc-text/90">
                <span className="text-vsc-accent">- </span>{item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

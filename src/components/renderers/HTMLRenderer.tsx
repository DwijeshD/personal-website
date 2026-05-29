'use client'

import { useEffect, useState } from 'react'

const SCROLLBAR_CSS = `<style>
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #424242; border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: #555; }
</style>`

const LINK_INTERCEPTOR = `<script>
document.addEventListener('click', function(e) {
  var a = e.target.closest('a');
  if (!a) return;
  var href = a.getAttribute('href') || '';

  // plain anchor or empty — block navigation
  if (!href || href === '#') { e.preventDefault(); return; }

  // in-page anchor scroll — prevent iframe navigation, scroll manually
  if (href.charAt(0) === '#') {
    e.preventDefault();
    var el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  // mailto — sandbox blocks direct navigation; use window.open via allow-popups
  if (href.indexOf('mailto:') === 0) {
    e.preventDefault();
    window.open(href, '_blank');
    return;
  }

  // external http(s) — let native target="_blank" handle (allow-popups-to-escape-sandbox)
});
</script>`

function inject(html: string): string {
  const headTag = '</head>'
  const hi = html.lastIndexOf(headTag)
  const withCss = hi !== -1 ? html.slice(0, hi) + SCROLLBAR_CSS + html.slice(hi) : SCROLLBAR_CSS + html

  const bodyTag = '</body>'
  const bi = withCss.lastIndexOf(bodyTag)
  return bi !== -1 ? withCss.slice(0, bi) + LINK_INTERCEPTOR + withCss.slice(bi) : withCss + LINK_INTERCEPTOR
}

interface Props {
  content: string
}

export default function HTMLRenderer({ content }: Props) {
  const [debounced, setDebounced] = useState(() => inject(content))

  useEffect(() => {
    const t = setTimeout(() => setDebounced(inject(content)), 300)
    return () => clearTimeout(t)
  }, [content])

  return (
    <iframe
      sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      srcDoc={debounced}
      className="w-full h-full border-0 bg-[#1e1e1e]"
      title="HTML Preview"
    />
  )
}

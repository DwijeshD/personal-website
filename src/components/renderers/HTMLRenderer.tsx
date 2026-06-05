'use client'

import { useEffect, useState } from 'react'

const SCROLLBAR_CSS = `<style>
html, body { height: 100%; }
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

  // all external links (mailto, http, https) — delegate to parent via postMessage
  // so the parent opens them natively without needing allow-popups-to-escape-sandbox
  if (href.indexOf('mailto:') === 0 || href.indexOf('http') === 0 || href.indexOf('//') === 0) {
    e.preventDefault();
    window.parent.postMessage({ type: 'open-url', url: href }, '*');
    return;
  }
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

const ALLOWED_SCHEMES = /^(https?:|mailto:)\/?\//i

export default function HTMLRenderer({ content }: Props) {
  const [debounced, setDebounced] = useState(() => inject(content))

  useEffect(() => {
    const t = setTimeout(() => setDebounced(inject(content)), 300)
    return () => clearTimeout(t)
  }, [content])

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!e.data || e.data.type !== 'open-url') return
      const url: unknown = e.data.url
      if (typeof url !== 'string') return
      // only allow http, https, mailto — block data:, javascript:, blob: etc.
      if (!ALLOWED_SCHEMES.test(url)) return
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <iframe
      sandbox="allow-scripts allow-forms"
      srcDoc={debounced}
      className="w-full h-full border-0 bg-[#1e1e1e]"
      title="HTML Preview"
    />
  )
}

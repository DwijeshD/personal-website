'use client'

import { useEffect, useState } from 'react'

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
  const tag = '</body>'
  const i = html.lastIndexOf(tag)
  return i !== -1 ? html.slice(0, i) + LINK_INTERCEPTOR + html.slice(i) : html + LINK_INTERCEPTOR
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

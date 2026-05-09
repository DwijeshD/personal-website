'use client'

import { useEffect, useState } from 'react'

interface Props {
  filename: string
  content: string
}

// ── Minimal TypeScript type-stripping (not a full compiler — handles common cases) ──

function stripTs(code: string): string {
  return code
    .replace(/^import\s+type\s+[^\n]+\n/gm, '')
    .replace(/^\s*(?:export\s+)?interface\s+\w[^{]*\{(?:[^{}]|\{[^{}]*\})*\}/gm, '')
    .replace(/^\s*(?:export\s+)?type\s+\w[^\n=]*=[^\n]+\n/gm, '')
    .replace(/:\s*(?:readonly\s+)?[\w[\]{}<>|&?,\s.]+(?=[,)=;\n{])/g, '')
    .replace(/\s+as\s+[\w[\]<>|&, ]+(?=[),;\n.])/g, '')
    .replace(/<[A-Z]\w*(?:,\s*[\w[\]<> ]+)*>/g, '')
}

// ── HTML builders ─────────────────────────────────────────────────────────────

const DARK_BASE = `*{box-sizing:border-box}body{margin:0;font-family:'Consolas',Consolas,monospace;background:#1e1e1e;color:#d4d4d4;font-size:13px;line-height:1.6;}`

function jsDoc(code: string): string {
  const safe = code.replace(/<\/script>/gi, '<\\/script>')
  return `<!DOCTYPE html><html><head><style>${DARK_BASE}.ln{padding:2px 14px;white-space:pre-wrap;word-break:break-all;border-bottom:1px solid #ffffff08;}.err{color:#f48771;}.warn{color:#dcdcaa;}.mt{opacity:.35;padding:14px;}</style></head>
<body><script>
var _o=[];
['log','info','warn','error'].forEach(function(m){var orig=console[m].bind(console);console[m]=function(){var s=Array.from(arguments).map(function(x){return typeof x==='object'?JSON.stringify(x,null,2):String(x)}).join(' ');_o.push({t:m,s:s});orig.apply(console,arguments)};});
window.addEventListener('error',function(e){_o.push({t:'error',s:e.message||String(e)})});
try{(function(){'use strict';${safe}})()}catch(e){_o.push({t:'error',s:String(e)})}
if(!_o.length){document.body.innerHTML='<div class="mt">// No console output</div>';}
else{_o.forEach(function(l){var d=document.createElement('div');d.className='ln'+(l.t==='error'?' err':l.t==='warn'?' warn':'');d.textContent=l.s;document.body.appendChild(d);});}
</script></body></html>`
}

function jsonDoc(content: string): string {
  try {
    const fmt = JSON.stringify(JSON.parse(content), null, 2)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/("(?:[^"\\]|\\.)*")\s*:/g, '<span style="color:#9cdcfe">$1</span>:')
      .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span style="color:#ce9178">$1</span>')
      .replace(/:\s*(-?\d+\.?\d*(?:[eE][+-]?\d+)?)/g, ': <span style="color:#b5cea8">$1</span>')
      .replace(/:\s*(true|false)/g, ': <span style="color:#569cd6">$1</span>')
      .replace(/:\s*(null)/g, ': <span style="color:#569cd6">$1</span>')
    return `<!DOCTYPE html><html><head><style>${DARK_BASE}pre{margin:0;padding:14px;overflow:auto;white-space:pre-wrap;}</style></head><body><pre>${fmt}</pre></body></html>`
  } catch (e) {
    const msg = ((e as Error).message).replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return `<!DOCTYPE html><html><head><style>${DARK_BASE}pre{margin:0;padding:14px;}</style></head><body><pre style="color:#f48771">JSON Error: ${msg}</pre></body></html>`
  }
}

function cssDoc(content: string): string {
  const safe = content.replace(/<\/style>/gi, '<\\/style>')
  return `<!DOCTYPE html><html><head>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;font-size:13px;line-height:1.6;}</style>
<style>${safe}</style>
</head><body>
<header class="header"><h1>Portfolio</h1><p class="subtitle">Backend Engineer</p></header>
<main class="container">
<section>
  <h2>Featured Projects</h2>
  <div class="flex">
    <div class="card"><div class="badge">Python &middot; FastAPI</div><h3>Calendar Sync API</h3><p class="content">Production backend integrating Google &amp; Outlook calendars via OAuth2 and webhooks.</p><button type="button">View</button></div>
    <div class="card"><div class="badge">PyTorch &middot; ML</div><h3>rPPG Heart Rate</h3><p class="content">Deep learning model for heart rate estimation from video. Dissertation: 82%.</p><button type="button">View</button></div>
  </div>
</section>
<section>
  <h2>Stack</h2>
  <ul><li>Python &middot; TypeScript &middot; FastAPI</li><li>PyTorch &middot; scikit-learn &middot; Optuna</li><li>Firestore &middot; OAuth2 &middot; Webhooks</li></ul>
  <div class="item"><input type="text" placeholder="Search technologies..." /></div>
</section>
</main>
</body></html>`
}

function reactDoc(content: string): string {
  const safe = content.replace(/<\/script>/gi, '<\\/script>')
  return `<!DOCTYPE html><html><head>
<style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif;}</style>
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head><body>
<div id="root"></div>
<div id="err" style="display:none;font-family:Consolas,monospace;font-size:13px;color:#f48771;padding:14px;background:#1e1e1e;white-space:pre-wrap;word-break:break-all;"></div>
<script type="text/babel" data-presets="react,typescript">
try {
  ${safe}
} catch(e) {
  const el = document.getElementById('err'); if(el){el.style.display='block';el.textContent=String(e);}
}
try {
  const exp = typeof module!=='undefined' && module.exports && module.exports.default ? module.exports.default : null;
  if (exp && typeof exp === 'function') {
    const root = document.getElementById('root');
    if(root) ReactDOM.createRoot(root).render(React.createElement(exp));
  }
} catch(e2) {
  const el=document.getElementById('err');if(el){el.style.display='block';el.textContent=(el.textContent?el.textContent+'\n':'')+String(e2);}
}
</script>
</body></html>`
}

// ── Main renderer ──────────────────────────────────────────────────────────────

function buildDoc(ext: string, content: string): { html: string; isScript: boolean } {
  switch (ext) {
    case 'json':              return { html: jsonDoc(content), isScript: false }
    case 'css': case 'scss': return { html: cssDoc(content), isScript: false }
    case 'tsx': case 'jsx':  return { html: reactDoc(content), isScript: true }
    case 'ts':               return { html: jsDoc(stripTs(content)), isScript: true }
    default:                 return { html: jsDoc(content), isScript: true }
  }
}

export default function LiveCodeRenderer({ filename, content }: Props) {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  const delay = (ext === 'tsx' || ext === 'jsx') ? 800 : 400

  const [debounced, setDebounced] = useState(content)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(content), delay)
    return () => clearTimeout(t)
  }, [content, delay])

  const { html, isScript } = buildDoc(ext, debounced)

  return (
    <iframe
      key={isScript ? debounced : undefined}
      sandbox={isScript ? 'allow-scripts allow-popups' : 'allow-popups'}
      srcDoc={html}
      className="w-full h-full border-0 bg-[#1e1e1e]"
      title="Code Preview"
    />
  )
}

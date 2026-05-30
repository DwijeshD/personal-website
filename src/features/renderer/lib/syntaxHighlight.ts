// HTML builders for syntax-highlighted code documentation
// Pure TypeScript — no React imports

import { stripTs } from './stripTypeScript'

const DARK_BASE = `*{box-sizing:border-box}body{margin:0;font-family:'Consolas',Consolas,monospace;background:#1e1e1e;color:#d4d4d4;font-size:13px;line-height:1.6;}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#424242;border-radius:2px}::-webkit-scrollbar-thumb:hover{background:#555}`

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
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
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

const KEYWORDS: Record<string, string[]> = {
  py:   ['def','class','if','elif','else','for','while','return','import','from','as','with','try','except','finally','pass','break','continue','and','or','not','in','is','lambda','yield','async','await','None','True','False','raise','global','nonlocal','del','assert'],
  c:    ['int','char','float','double','void','if','else','for','while','do','return','struct','typedef','enum','union','switch','case','break','continue','static','const','extern','include','define','sizeof','NULL','true','false'],
  rs:   ['fn','let','mut','const','if','else','for','while','loop','return','struct','enum','impl','trait','use','mod','pub','crate','self','super','match','break','continue','move','ref','in','where','type','async','await','dyn','Box','Vec','Option','Result','Some','None','Ok','Err'],
  go:   ['func','var','const','if','else','for','range','return','struct','interface','type','package','import','go','chan','select','case','break','continue','defer','map','make','new','nil','true','false','len','cap','append','error'],
}

function syntaxDoc(lang: string, content: string): string {
  const escaped = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const kws = KEYWORDS[lang] ?? []
  const kwPattern = kws.length ? new RegExp(`\\b(${kws.join('|')})\\b`, 'g') : null

  let highlighted = escaped
    .replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, '<span style="color:#6a9955">$1</span>')
    .replace(/(#[^\n]*)/g, lang === 'py' ? '<span style="color:#6a9955">$1</span>' : '$1')
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span style="color:#ce9178">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#b5cea8">$1</span>')
  if (kwPattern) {
    highlighted = highlighted.replace(kwPattern, '<span style="color:#569cd6;font-weight:600">$1</span>')
  }

  const labels: Record<string, string> = { py: 'Python', c: 'C', rs: 'Rust', go: 'Go' }
  const label = labels[lang] ?? lang.toUpperCase()

  return `<!DOCTYPE html><html><head><style>${DARK_BASE}
pre{margin:0;padding:16px;overflow:auto;white-space:pre-wrap;line-height:1.7;tab-size:4;}
.badge{display:inline-flex;align-items:center;gap:6px;padding:2px 10px;background:#252526;border:1px solid #3c3c3c;border-radius:4px;font-size:11px;color:#858585;margin:10px 14px 0;}
</style></head><body>
<div class="badge">${label} — syntax highlight</div>
<pre>${highlighted}</pre>
</body></html>`
}

function sqlDoc(content: string): string {
  const escaped = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const highlighted = escaped
    .replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP BY|ORDER BY|HAVING|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|DROP|ALTER|ADD|COLUMN|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|NOT NULL|DEFAULT|AS|AND|OR|NOT|IN|LIKE|IS|NULL|BETWEEN|EXISTS|DISTINCT|LIMIT|OFFSET|UNION|ALL|CASE|WHEN|THEN|ELSE|END|WITH|RETURNING)\b/gi,
      '<span style="color:#569cd6;font-weight:600">$1</span>')
    .replace(/('(?:[^'\\]|\\.)*')/g, '<span style="color:#ce9178">$1</span>')
    .replace(/(--[^\n]*)/g, '<span style="color:#6a9955">$1</span>')
    .replace(/\b(\d+)\b/g, '<span style="color:#b5cea8">$1</span>')
  return `<!DOCTYPE html><html><head><style>${DARK_BASE}
pre{margin:0;padding:16px;overflow:auto;white-space:pre-wrap;line-height:1.7;}
.badge{display:inline-block;padding:2px 8px;background:#252526;border:1px solid #3c3c3c;border-radius:4px;font-size:11px;color:#858585;margin:10px 14px 0;}
</style></head><body>
<div class="badge">SQL — read-only</div>
<pre>${highlighted}</pre>
</body></html>`
}

function shellDoc(content: string): string {
  const escaped = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const highlighted = escaped
    .replace(/^(#[^\n]*)/gm, '<span style="color:#6a9955">$1</span>')
    .replace(/\b(if|then|else|elif|fi|for|while|do|done|case|esac|in|function|return|export|local|readonly|echo|cd|ls|mkdir|rm|cp|mv|cat|grep|sed|awk|curl|chmod|chown|source|set|unset)\b/g,
      '<span style="color:#569cd6">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color:#ce9178">$1</span>')
    .replace(/('(?:[^'\\]|\\.)*')/g, '<span style="color:#ce9178">$1</span>')
    .replace(/(\$\w+|\$\{[^}]+\})/g, '<span style="color:#9cdcfe">$1</span>')
    .replace(/(^\$\s)/gm, '<span style="color:#858585">$1</span>')
  return `<!DOCTYPE html><html><head><style>${DARK_BASE}
pre{margin:0;padding:16px;overflow:auto;white-space:pre-wrap;line-height:1.7;}
.badge{display:inline-block;padding:2px 8px;background:#252526;border:1px solid #3c3c3c;border-radius:4px;font-size:11px;color:#858585;margin:10px 14px 0;}
</style></head><body>
<div class="badge">Shell — read-only</div>
<pre>${highlighted}</pre>
</body></html>`
}

function yamlDoc(content: string): string {
  const escaped = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const highlighted = escaped
    .replace(/^(\s*#[^\n]*)/gm, '<span style="color:#6a9955">$1</span>')
    .replace(/^(\s*[\w-]+)\s*:/gm, '<span style="color:#9cdcfe">$1</span>:')
    .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span style="color:#ce9178">$1</span>')
    .replace(/:\s*('(?:[^'\\]|\\.)*')/g, ': <span style="color:#ce9178">$1</span>')
    .replace(/:\s*(true|false|null|~)\b/g, ': <span style="color:#569cd6">$1</span>')
    .replace(/:\s*(-?\d+\.?\d*)\b/g, ': <span style="color:#b5cea8">$1</span>')
    .replace(/^(\s*-)\s/gm, '<span style="color:#858585">$1</span> ')
  return `<!DOCTYPE html><html><head><style>${DARK_BASE}
pre{margin:0;padding:16px;overflow:auto;white-space:pre-wrap;line-height:1.7;}
.badge{display:inline-block;padding:2px 8px;background:#252526;border:1px solid #3c3c3c;border-radius:4px;font-size:11px;color:#858585;margin:10px 14px 0;}
</style></head><body>
<div class="badge">YAML — read-only</div>
<pre>${highlighted}</pre>
</body></html>`
}

function xmlDoc(content: string): string {
  const escaped = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const highlighted = escaped
    .replace(/(&lt;\/?)([\w:-]+)/g, '$1<span style="color:#4ec9b0">$2</span>')
    .replace(/([\w:-]+)(=)("(?:[^"\\]|\\.)*")/g,
      '<span style="color:#9cdcfe">$1</span>$2<span style="color:#ce9178">$3</span>')
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span style="color:#6a9955">$1</span>')
    .replace(/(&lt;\?[\s\S]*?\?&gt;)/g, '<span style="color:#858585">$1</span>')
  return `<!DOCTYPE html><html><head><style>${DARK_BASE}
pre{margin:0;padding:16px;overflow:auto;white-space:pre-wrap;line-height:1.7;}
.badge{display:inline-block;padding:2px 8px;background:#252526;border:1px solid #3c3c3c;border-radius:4px;font-size:11px;color:#858585;margin:10px 14px 0;}
</style></head><body>
<div class="badge">XML — read-only</div>
<pre>${highlighted}</pre>
</body></html>`
}

export function buildDoc(ext: string, content: string): { html: string; isScript: boolean } {
  switch (ext) {
    case 'json':                    return { html: jsonDoc(content),          isScript: false }
    case 'css': case 'scss':        return { html: cssDoc(content),           isScript: false }
    case 'tsx': case 'jsx':         return { html: reactDoc(content),         isScript: true  }
    case 'ts':                      return { html: jsDoc(stripTs(content)),   isScript: true  }
    case 'sql':                     return { html: sqlDoc(content),           isScript: false }
    case 'sh': case 'bash':         return { html: shellDoc(content),         isScript: false }
    case 'yaml': case 'yml':        return { html: yamlDoc(content),          isScript: false }
    case 'xml':                     return { html: xmlDoc(content),           isScript: false }
    case 'py': case 'c': case 'rs': case 'go':
                                    return { html: syntaxDoc(ext, content),   isScript: false }
    default:                        return { html: syntaxDoc('txt', content), isScript: false }
  }
}

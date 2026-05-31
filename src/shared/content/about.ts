export const ABOUT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" font-family="'Courier New', Courier, monospace">

  <!-- BACKGROUND -->
  <rect width="900" height="600" fill="#1e1e1e"/>

  <!-- HEADER -->
  <rect width="900" height="70" fill="#252526"/>
  <rect y="70" width="900" height="2" fill="#007acc"/>

  <text x="24" y="27" fill="#569cd6" font-size="10" letter-spacing="4">DWIJESH.DEV</text>
  <text x="24" y="56" fill="#d4d4d4" font-size="22" font-weight="bold">Portfolio Architecture</text>
  <text x="876" y="34" text-anchor="end" fill="#6a9955" font-size="10">// VS Code replica — browser-native</text>
  <text x="876" y="57" text-anchor="end" fill="#4ec9b0" font-size="12">personalwebsite-six-olive.vercel.app</text>

  <!-- ─── FOUNDATION (full width) ─── -->
  <rect x="20" y="83" width="860" height="76" fill="#252526" rx="5" stroke="#3c3c3c" stroke-width="1"/>
  <text x="34" y="104" fill="#dcdcaa" font-size="9" letter-spacing="3" font-weight="bold">FOUNDATION</text>

  <rect x="34" y="113" width="118" height="28" fill="#1a1a1a" rx="3" stroke="#3c3c3c" stroke-width="1"/>
  <circle cx="47" cy="127" r="3.5" fill="#ffffff"/>
  <text x="57" y="131" fill="#d4d4d4" font-size="11">Next.js 15</text>

  <rect x="160" y="113" width="100" height="28" fill="#1a1a1a" rx="3" stroke="#3c3c3c" stroke-width="1"/>
  <circle cx="173" cy="127" r="3.5" fill="#61dafb"/>
  <text x="183" y="131" fill="#d4d4d4" font-size="11">React 19</text>

  <rect x="268" y="113" width="116" height="28" fill="#1a1a1a" rx="3" stroke="#3c3c3c" stroke-width="1"/>
  <circle cx="281" cy="127" r="3.5" fill="#3178c6"/>
  <text x="291" y="131" fill="#d4d4d4" font-size="11">TypeScript</text>

  <rect x="392" y="113" width="127" height="28" fill="#1a1a1a" rx="3" stroke="#3c3c3c" stroke-width="1"/>
  <circle cx="405" cy="127" r="3.5" fill="#38bdf8"/>
  <text x="415" y="131" fill="#d4d4d4" font-size="11">Tailwind CSS</text>

  <rect x="527" y="113" width="92" height="28" fill="#1a1a1a" rx="3" stroke="#3c3c3c" stroke-width="1"/>
  <circle cx="540" cy="127" r="3.5" fill="#ffffff"/>
  <text x="550" y="131" fill="#d4d4d4" font-size="11">Vercel</text>

  <rect x="627" y="113" width="130" height="28" fill="#1a1a1a" rx="3" stroke="#3c3c3c" stroke-width="1"/>
  <circle cx="640" cy="127" r="3.5" fill="#ff4c8b"/>
  <text x="650" y="131" fill="#d4d4d4" font-size="11">Edge Runtime</text>


  <!-- ─── ROW 2 ─── -->

  <!-- EDITOR -->
  <rect x="20" y="171" width="420" height="124" fill="#252526" rx="5" stroke="#4ec9b0" stroke-width="1" stroke-opacity="0.4"/>
  <text x="34" y="192" fill="#4ec9b0" font-size="9" letter-spacing="3" font-weight="bold">EDITOR</text>
  <text x="103" y="192" fill="#6a9955" font-size="10">// @monaco-editor/react</text>

  <circle cx="40" cy="213" r="3" fill="#4ec9b0"/>
  <text x="50" y="217" fill="#9cdcfe" font-size="11">Live preview — HTML · SVG · Markdown · TXT</text>
  <circle cx="40" cy="232" r="3" fill="#4ec9b0"/>
  <text x="50" y="236" fill="#9cdcfe" font-size="11">Syntax highlighting — 12+ languages</text>
  <circle cx="40" cy="251" r="3" fill="#4ec9b0"/>
  <text x="50" y="255" fill="#9cdcfe" font-size="11">6 themes — Dracula, Night Owl, Monokai…</text>
  <circle cx="40" cy="270" r="3" fill="#4ec9b0"/>
  <text x="50" y="274" fill="#9cdcfe" font-size="11">Command palette · Ctrl+P · keyboard nav</text>

  <!-- AI COPILOT -->
  <rect x="460" y="171" width="420" height="124" fill="#252526" rx="5" stroke="#c586c0" stroke-width="1" stroke-opacity="0.4"/>
  <text x="474" y="192" fill="#c586c0" font-size="9" letter-spacing="3" font-weight="bold">AI COPILOT</text>
  <text x="561" y="192" fill="#6a9955" font-size="10">// OpenRouter API</text>

  <circle cx="480" cy="213" r="3" fill="#c586c0"/>
  <text x="490" y="217" fill="#ce9178" font-size="11">SSE streaming — real-time token output</text>
  <circle cx="480" cy="232" r="3" fill="#c586c0"/>
  <text x="490" y="236" fill="#ce9178" font-size="11">Claude 4 · GPT-4o · Gemini 2.5 Pro</text>
  <circle cx="480" cy="251" r="3" fill="#c586c0"/>
  <text x="490" y="255" fill="#ce9178" font-size="11">File create / edit / delete actions</text>
  <circle cx="480" cy="270" r="3" fill="#c586c0"/>
  <text x="490" y="274" fill="#ce9178" font-size="11">Thinking indicator + bug report widget</text>


  <!-- ─── ROW 3 ─── -->

  <!-- SENTRY -->
  <rect x="20" y="307" width="420" height="124" fill="#252526" rx="5" stroke="#f44747" stroke-width="1" stroke-opacity="0.4"/>
  <text x="34" y="328" fill="#f44747" font-size="9" letter-spacing="3" font-weight="bold">ERROR MONITORING</text>
  <text x="210" y="328" fill="#6a9955" font-size="10">// Sentry v10</text>

  <circle cx="40" cy="349" r="3" fill="#f44747"/>
  <text x="50" y="353" fill="#f48771" font-size="11">Client · server · edge runtime capture</text>
  <circle cx="40" cy="368" r="3" fill="#f44747"/>
  <text x="50" y="372" fill="#f48771" font-size="11">onRequestError via instrumentation.ts</text>
  <circle cx="40" cy="387" r="3" fill="#f44747"/>
  <text x="50" y="391" fill="#f48771" font-size="11">Source maps uploaded on CI build</text>
  <circle cx="40" cy="406" r="3" fill="#f44747"/>
  <text x="50" y="410" fill="#f48771" font-size="11">DSN-gated — zero overhead when unset</text>

  <!-- CLARITY -->
  <rect x="460" y="307" width="420" height="124" fill="#252526" rx="5" stroke="#0078d4" stroke-width="1" stroke-opacity="0.4"/>
  <text x="474" y="328" fill="#0078d4" font-size="9" letter-spacing="3" font-weight="bold">ANALYTICS</text>
  <text x="548" y="328" fill="#6a9955" font-size="10">// Microsoft Clarity</text>

  <circle cx="480" cy="349" r="3" fill="#0078d4"/>
  <text x="490" y="353" fill="#569cd6" font-size="11">Session replay + heatmaps</text>
  <circle cx="480" cy="368" r="3" fill="#0078d4"/>
  <text x="490" y="372" fill="#569cd6" font-size="11">Script in &lt;head&gt; — visible to crawlers</text>
  <circle cx="480" cy="387" r="3" fill="#0078d4"/>
  <text x="490" y="391" fill="#569cd6" font-size="11">Clarity Copilot AI insights + funnels</text>
  <circle cx="480" cy="406" r="3" fill="#0078d4"/>
  <text x="490" y="410" fill="#569cd6" font-size="11">Project-ID env-gated — free tier</text>


  <!-- ─── ROW 4 ─── -->

  <!-- SECURITY -->
  <rect x="20" y="443" width="420" height="124" fill="#252526" rx="5" stroke="#d7ff38" stroke-width="1" stroke-opacity="0.35"/>
  <text x="34" y="464" fill="#d7ff38" font-size="9" letter-spacing="3" font-weight="bold">SECURITY</text>
  <text x="112" y="464" fill="#6a9955" font-size="10">// Production-grade</text>

  <circle cx="40" cy="485" r="3" fill="#d7ff38"/>
  <text x="50" y="489" fill="#b5cea8" font-size="11">CSP · HSTS · X-Frame-Options · nosniff</text>
  <circle cx="40" cy="504" r="3" fill="#d7ff38"/>
  <text x="50" y="508" fill="#b5cea8" font-size="11">Rate limiting — 25 msg/day per IP</text>
  <circle cx="40" cy="523" r="3" fill="#d7ff38"/>
  <text x="50" y="527" fill="#b5cea8" font-size="11">VPN / proxy detection on AI endpoints</text>
  <circle cx="40" cy="542" r="3" fill="#d7ff38"/>
  <text x="50" y="546" fill="#b5cea8" font-size="11">security.txt — /.well-known/</text>

  <!-- DISCOVERY -->
  <rect x="460" y="443" width="420" height="124" fill="#252526" rx="5" stroke="#4ec9b0" stroke-width="1" stroke-opacity="0.4"/>
  <text x="474" y="464" fill="#4ec9b0" font-size="9" letter-spacing="3" font-weight="bold">DISCOVERY &amp; SEO</text>
  <text x="617" y="464" fill="#6a9955" font-size="10">// Lighthouse 90+</text>

  <circle cx="480" cy="485" r="3" fill="#4ec9b0"/>
  <text x="490" y="489" fill="#9cdcfe" font-size="11">Schema.org — Person · WebSite · App</text>
  <circle cx="480" cy="504" r="3" fill="#4ec9b0"/>
  <text x="490" y="508" fill="#9cdcfe" font-size="11">PWA — manifest.webmanifest + sw.js</text>
  <circle cx="480" cy="523" r="3" fill="#4ec9b0"/>
  <text x="490" y="527" fill="#9cdcfe" font-size="11">Deep linking — ?file=about.svg</text>
  <circle cx="480" cy="542" r="3" fill="#4ec9b0"/>
  <text x="490" y="546" fill="#9cdcfe" font-size="11">RSS feed · OG tags · sitemap.xml</text>


  <!-- FOOTER -->
  <rect y="579" width="900" height="21" fill="#007acc"/>
  <text x="20" y="594" fill="#ffffff" font-size="10" font-weight="bold">Dwijesh Dookraz</text>
  <text x="450" y="594" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-size="10">Backend Engineer · AI Systems · BSc Computer Science — First Class Honours, University of Southampton</text>
  <text x="880" y="594" text-anchor="end" fill="rgba(255,255,255,0.75)" font-size="10">github.com/DwijeshD</text>

</svg>`

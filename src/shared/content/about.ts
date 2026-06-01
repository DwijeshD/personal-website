export const ABOUT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900" font-family="'Courier New', Consolas, monospace">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e1e1e"/>
      <stop offset="55%" stop-color="#202124"/>
      <stop offset="100%" stop-color="#151515"/>
    </linearGradient>

    <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#007acc"/>
      <stop offset="100%" stop-color="#0e639c"/>
    </linearGradient>

    <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.32"/>
    </filter>

    <filter id="glowBlue" x="-30%" y="-30%" width="160%" height="180%">
      <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#007acc" flood-opacity="0.45"/>
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000000" flood-opacity="0.42"/>
    </filter>

    <filter id="glowTeal" x="-30%" y="-30%" width="160%" height="180%">
      <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#4ec9b0" flood-opacity="0.45"/>
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000000" flood-opacity="0.42"/>
    </filter>

    <filter id="glowGreen" x="-30%" y="-30%" width="160%" height="180%">
      <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#6a9955" flood-opacity="0.45"/>
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000000" flood-opacity="0.42"/>
    </filter>

    <filter id="glowOrange" x="-30%" y="-30%" width="160%" height="180%">
      <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#ce9178" flood-opacity="0.45"/>
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000000" flood-opacity="0.42"/>
    </filter>

    <filter id="glowLime" x="-30%" y="-30%" width="160%" height="180%">
      <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#b5cea8" flood-opacity="0.45"/>
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000000" flood-opacity="0.42"/>
    </filter>

    <style>
      .panel {
        fill: #252526;
        stroke: #3c3c3c;
        stroke-width: 1.2;
        filter: url(#shadow);
        transition: stroke 180ms ease, stroke-width 180ms ease, filter 180ms ease;
      }

      .hero {
        fill: #252526;
        stroke: #3c3c3c;
        stroke-width: 1.2;
        filter: url(#shadow);
        transition: stroke 180ms ease, stroke-width 180ms ease, filter 180ms ease;
      }

      .chip {
        fill: #1e1e1e;
        stroke: #3c3c3c;
        stroke-width: 1;
        transition: fill 180ms ease, stroke 180ms ease;
      }

      .hero-wrap,
      .card,
      .controls {
        cursor: default;
      }

      .hero-wrap:hover .hero {
        stroke: #007acc;
        stroke-width: 1.8;
        filter: url(#glowBlue);
      }

      .frontend:hover .panel {
        stroke: #007acc;
        stroke-width: 1.8;
        filter: url(#glowBlue);
      }

      .api:hover .panel {
        stroke: #4ec9b0;
        stroke-width: 1.8;
        filter: url(#glowTeal);
      }

      .integrations:hover .panel {
        stroke: #6a9955;
        stroke-width: 1.8;
        filter: url(#glowGreen);
      }

      .operations:hover .panel {
        stroke: #ce9178;
        stroke-width: 1.8;
        filter: url(#glowOrange);
      }

      .controls:hover .panel {
        stroke: #b5cea8;
        stroke-width: 1.8;
        filter: url(#glowLime);
      }

      .hero-wrap:hover .chip,
      .frontend:hover .chip {
        fill: #202a33;
        stroke: #007acc;
      }

      .api:hover .chip {
        fill: #1f2d2a;
        stroke: #4ec9b0;
      }

      .integrations:hover .chip {
        fill: #222b20;
        stroke: #6a9955;
      }

      .operations:hover .chip {
        fill: #302522;
        stroke: #ce9178;
      }

      .controls:hover .chip {
        fill: #2b2f24;
        stroke: #b5cea8;
      }

      .eyebrow {
        fill: #569cd6;
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 3px;
      }

      .title {
        fill: #d4d4d4;
        font-size: 18px;
        font-weight: bold;
      }

      .hero-title {
        fill: #d4d4d4;
        font-size: 25px;
        font-weight: bold;
      }

      .body {
        fill: #d4d4d4;
        font-size: 14px;
      }

      .muted {
        fill: #6c6c6c;
        font-size: 12px;
      }

      .chip-text {
        fill: #d4d4d4;
        font-size: 12px;
        font-weight: bold;
      }

      .footer {
        fill: #6c6c6c;
        font-size: 12px;
      }
    </style>
  </defs>

  <!-- BACKGROUND -->
  <rect width="1400" height="900" fill="url(#bg)"/>

  <!-- SUBTLE GRID -->
  <g opacity="0.045">
    <path d="M0 100 H1400 M0 200 H1400 M0 300 H1400 M0 400 H1400 M0 500 H1400 M0 600 H1400 M0 700 H1400 M0 800 H1400" stroke="#d4d4d4"/>
    <path d="M100 0 V900 M200 0 V900 M300 0 V900 M400 0 V900 M500 0 V900 M600 0 V900 M700 0 V900 M800 0 V900 M900 0 V900 M1000 0 V900 M1100 0 V900 M1200 0 V900 M1300 0 V900" stroke="#d4d4d4"/>
  </g>

  <!-- HEADER -->
  <rect x="40" y="34" width="1320" height="76" rx="12" fill="#252526" stroke="#3c3c3c"/>

  <text x="70" y="68" fill="#569cd6" font-size="15" font-weight="bold" letter-spacing="3">DWIJESH.DEV</text>
  <text x="70" y="94" fill="#d4d4d4" font-size="23" font-weight="bold">Production Portfolio Architecture</text>

  <text x="1330" y="69" text-anchor="end" fill="#6c6c6c" font-size="12">Next.js 15 · React 19 · TypeScript · Vercel</text>
  <text x="1330" y="93" text-anchor="end" fill="#4ec9b0" font-size="12">AI Copilot · APIs · Monitoring · PWA</text>

  <!-- HERO -->
  <g class="hero-wrap">
    <rect x="250" y="145" width="900" height="170" rx="18" class="hero"/>

    <circle cx="335" cy="230" r="38" fill="url(#blue)"/>
    <text x="335" y="241" text-anchor="middle" fill="#ffffff" font-size="32" font-weight="bold">W</text>

    <text x="410" y="195" class="hero-title">Full-Stack Portfolio System</text>

    <text x="410" y="228" class="body">Production-grade portfolio built as a real web app.</text>
    <text x="410" y="251" class="body">Includes AI features, API routes, GitHub integrations,</text>
    <text x="410" y="274" class="body">monitoring, caching, security, analytics, and SEO.</text>

    <rect x="410" y="290" width="90" height="28" rx="6" class="chip"/>
    <text x="455" y="309" text-anchor="middle" class="chip-text">Next.js</text>

    <rect x="512" y="290" width="88" height="28" rx="6" class="chip"/>
    <text x="556" y="309" text-anchor="middle" class="chip-text">React</text>

    <rect x="612" y="290" width="88" height="28" rx="6" class="chip"/>
    <text x="656" y="309" text-anchor="middle" class="chip-text">Vercel</text>

    <rect x="712" y="290" width="120" height="28" rx="6" class="chip"/>
    <text x="772" y="309" text-anchor="middle" class="chip-text">OpenRouter</text>

    <rect x="844" y="290" width="92" height="28" rx="6" class="chip"/>
    <text x="890" y="309" text-anchor="middle" class="chip-text">Sentry</text>

    <rect x="948" y="290" width="92" height="28" rx="6" class="chip"/>
    <text x="994" y="309" text-anchor="middle" class="chip-text">Clarity</text>
  </g>

  <!-- SIMPLE SYSTEM LINE -->
  <line x1="220" y1="365" x2="1180" y2="365" stroke="#3c3c3c" stroke-width="2"/>
  <circle cx="220" cy="365" r="6" fill="#007acc"/>
  <circle cx="540" cy="365" r="6" fill="#4ec9b0"/>
  <circle cx="860" cy="365" r="6" fill="#6a9955"/>
  <circle cx="1180" cy="365" r="6" fill="#ce9178"/>

  <text x="220" y="390" text-anchor="middle" fill="#6c6c6c" font-size="11">Frontend</text>
  <text x="540" y="390" text-anchor="middle" fill="#6c6c6c" font-size="11">APIs</text>
  <text x="860" y="390" text-anchor="middle" fill="#6c6c6c" font-size="11">Services</text>
  <text x="1180" y="390" text-anchor="middle" fill="#6c6c6c" font-size="11">Monitoring</text>

  <!-- FRONTEND -->
  <g class="card frontend">
    <rect x="75" y="425" width="285" height="225" rx="16" class="panel"/>

    <text x="105" y="465" class="eyebrow">FRONTEND</text>
    <text x="105" y="501" class="title">Browser App</text>

    <text x="105" y="537" class="body">Next.js App Router</text>
    <text x="105" y="563" class="body">React 19 components</text>
    <text x="105" y="589" class="body">Monaco editor preview</text>
    <text x="105" y="615" class="body">PWA install support</text>

    <rect x="105" y="630" width="92" height="28" rx="6" class="chip"/>
    <text x="151" y="649" text-anchor="middle" class="chip-text">zero CLS</text>

    <rect x="207" y="630" width="106" height="28" rx="6" class="chip"/>
    <text x="260" y="649" text-anchor="middle" class="chip-text">responsive</text>
  </g>

  <!-- API -->
  <g class="card api">
    <rect x="395" y="425" width="285" height="225" rx="16" class="panel"/>

    <text x="425" y="465" class="eyebrow">API LAYER</text>
    <text x="425" y="501" class="title">Edge + Server Routes</text>

    <text x="425" y="537" class="body">/api/chat SSE stream</text>
    <text x="425" y="563" class="body">/api/ai-action tools</text>
    <text x="425" y="589" class="body">/api/github-stats ISR</text>
    <text x="425" y="615" class="body">/api/report-issue</text>

    <rect x="425" y="630" width="92" height="28" rx="6" class="chip"/>
    <text x="471" y="649" text-anchor="middle" class="chip-text">Edge</text>

    <rect x="527" y="630" width="100" height="28" rx="6" class="chip"/>
    <text x="577" y="649" text-anchor="middle" class="chip-text">ISR cache</text>
  </g>

  <!-- INTEGRATIONS -->
  <g class="card integrations">
    <rect x="715" y="425" width="285" height="225" rx="16" class="panel"/>

    <text x="745" y="465" class="eyebrow">INTEGRATIONS</text>
    <text x="745" y="501" class="title">External Services</text>

    <text x="745" y="537" class="body">OpenRouter LLM gateway</text>
    <text x="745" y="563" class="body">GitHub GraphQL API</text>
    <text x="745" y="589" class="body">GitHub REST API</text>
    <text x="745" y="615" class="body">RSS feed + OG image</text>

    <rect x="745" y="630" width="90" height="28" rx="6" class="chip"/>
    <text x="790" y="649" text-anchor="middle" class="chip-text">AI</text>

    <rect x="845" y="630" width="100" height="28" rx="6" class="chip"/>
    <text x="895" y="649" text-anchor="middle" class="chip-text">GitHub</text>
  </g>

  <!-- OPERATIONS -->
  <g class="card operations">
    <rect x="1035" y="425" width="285" height="225" rx="16" class="panel"/>

    <text x="1065" y="465" class="eyebrow">OPERATIONS</text>
    <text x="1065" y="501" class="title">Monitoring + Analytics</text>

    <text x="1065" y="537" class="body">Sentry error tracking</text>
    <text x="1065" y="563" class="body">Microsoft Clarity</text>
    <text x="1065" y="589" class="body">Vercel Speed Insights</text>
    <text x="1065" y="615" class="body">Vercel Analytics</text>

    <rect x="1065" y="630" width="108" height="28" rx="6" class="chip"/>
    <text x="1119" y="649" text-anchor="middle" class="chip-text">Web Vitals</text>

    <rect x="1183" y="630" width="88" height="28" rx="6" class="chip"/>
    <text x="1227" y="649" text-anchor="middle" class="chip-text">Tracing</text>
  </g>

  <!-- PRODUCTION CONTROLS -->
  <g class="controls">
    <rect x="75" y="700" width="1245" height="112" rx="16" class="panel"/>

    <text x="105" y="739" class="eyebrow">PRODUCTION CONTROLS</text>
    <text x="105" y="768" fill="#d4d4d4" font-size="16" font-weight="bold">
      Security, performance, reliability, and discoverability are built in.
    </text>

    <rect x="105" y="786" width="125" height="34" rx="7" class="chip"/>
    <text x="167" y="808" text-anchor="middle" fill="#b5cea8" font-size="12" font-weight="bold">CSP Headers</text>

    <rect x="245" y="786" width="125" height="34" rx="7" class="chip"/>
    <text x="307" y="808" text-anchor="middle" fill="#b5cea8" font-size="12" font-weight="bold">Rate Limits</text>

    <rect x="385" y="786" width="145" height="34" rx="7" class="chip"/>
    <text x="457" y="808" text-anchor="middle" fill="#b5cea8" font-size="12" font-weight="bold">Origin Allowlist</text>

    <rect x="545" y="786" width="145" height="34" rx="7" class="chip"/>
    <text x="617" y="808" text-anchor="middle" fill="#b5cea8" font-size="12" font-weight="bold">Input Validation</text>

    <rect x="705" y="786" width="170" height="34" rx="7" class="chip"/>
    <text x="790" y="808" text-anchor="middle" fill="#b5cea8" font-size="12" font-weight="bold">Service Worker Cache</text>

    <rect x="890" y="786" width="95" height="34" rx="7" class="chip"/>
    <text x="937" y="808" text-anchor="middle" fill="#b5cea8" font-size="12" font-weight="bold">ISR</text>

    <rect x="1000" y="786" width="125" height="34" rx="7" class="chip"/>
    <text x="1062" y="808" text-anchor="middle" fill="#b5cea8" font-size="12" font-weight="bold">PWA Offline</text>

    <rect x="1140" y="786" width="95" height="34" rx="7" class="chip"/>
    <text x="1187" y="808" text-anchor="middle" fill="#b5cea8" font-size="12" font-weight="bold">SEO</text>
  </g>

  <!-- FOOTER -->
  <line x1="40" y1="850" x2="1360" y2="850" stroke="#3c3c3c"/>
  <text x="70" y="878" class="footer">
    Signal: modern frontend, API design, edge runtime, AI integration, observability, caching, security, and production awareness.
  </text>
  <text x="1330" y="878" text-anchor="end" fill="#569cd6" font-size="12" font-weight="bold">dwijesh.dev</text>
</svg>`

export const SKILLS_CSS = `/* VS Code Dark+ — Elevated Design System
   skills.css — edit this file to see the preview update live */

@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,600;0,700;1,400&display=swap');

/* ── Tokens ──────────────────────── */
:root {
  --bg:        #1e1e1e;
  --bg-deep:   #141414;
  --surface:   #252526;
  --surface-2: #2d2d2d;
  --border:    #3c3c3c;
  --border-hi: #555;
  --accent:    #007acc;
  --accent-lo: rgba(0, 122, 204, 0.14);
  --accent-hi: #1f9cf0;
  --teal:      #4ec9b0;
  --teal-lo:   rgba(78, 201, 176, 0.12);
  --green:     #6a9955;
  --yellow:    #dcdcaa;
  --yellow-lo: rgba(220, 220, 170, 0.09);
  --blue:      #9cdcfe;
  --purple:    #c586c0;
  --text:      #d4d4d4;
  --text-lo:   rgba(212, 212, 212, 0.52);
  --muted:     #6c6c6c;
  --radius:    10px;
  --ease:      cubic-bezier(0.4, 0, 0.2, 1);
  --t:         220ms;
}

/* ── Reset ───────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Body ────────────────────────── */
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'JetBrains Mono', Consolas, 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.7;
  min-height: 100vh;
}

/* ── Header ──────────────────────── */
.header {
  padding: 24px 32px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}

/* scanline texture */
.header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(255,255,255,0.013) 2px,
    rgba(255,255,255,0.013) 4px
  );
  pointer-events: none;
}

/* gradient rule at bottom */
.header::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    var(--accent) 30%,
    var(--teal) 70%,
    transparent 100%
  );
  opacity: 0.55;
}

h1 {
  font-size: 22px;
  font-weight: 700;
  color: var(--blue);
  letter-spacing: -0.01em;
}

.subtitle {
  font-size: 11px;
  color: var(--muted);
  margin-top: 3px;
  letter-spacing: 0.06em;
}

/* ── Layout ──────────────────────── */
.container {
  padding: 36px 32px;
  max-width: 820px;
}

section { margin-bottom: 44px; }

h2 {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--green);
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* fade-out rule after heading */
h2::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--border) 0%, transparent 100%);
}

h3 {
  font-size: 14px;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 6px;
}

/* ── Cards ───────────────────────── */
.flex { display: flex; gap: 14px; }

.card {
  flex: 1;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 22px;
  position: relative;
  overflow: hidden;
  transition:
    border-color var(--t) var(--ease),
    transform    var(--t) var(--ease),
    box-shadow   var(--t) var(--ease);
}

/* radial glow revealed on hover */
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% -10%,
    rgba(0, 122, 204, 0.1) 0%,
    transparent 65%
  );
  opacity: 0;
  transition: opacity var(--t) var(--ease);
  pointer-events: none;
}

/* top-edge accent line */
.card::after {
  content: '';
  position: absolute;
  top: 0; left: 12%; right: 12%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0;
  transition: opacity var(--t) var(--ease);
}

.card:hover {
  border-color: rgba(0, 122, 204, 0.5);
  transform: translateY(-4px);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(0, 122, 204, 0.08);
}

.card:hover::before,
.card:hover::after { opacity: 1; }

/* ── Badge ───────────────────────── */
.badge {
  display: inline-block;
  font-size: 10px;
  color: var(--yellow);
  background: var(--yellow-lo);
  border: 1px solid rgba(220, 220, 170, 0.2);
  border-radius: 4px;
  padding: 2px 9px;
  margin-bottom: 10px;
  letter-spacing: 0.04em;
  transition:
    background     var(--t) var(--ease),
    border-color   var(--t) var(--ease);
}

.card:hover .badge {
  background: rgba(220, 220, 170, 0.17);
  border-color: rgba(220, 220, 170, 0.42);
}

/* ── Content ─────────────────────── */
.content {
  font-size: 12px;
  color: var(--text-lo);
  line-height: 1.78;
  margin-bottom: 14px;
}

/* ── Lists ───────────────────────── */
ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 14px;
}

li {
  padding-left: 20px;
  position: relative;
  font-size: 13px;
  color: rgba(212, 212, 212, 0.7);
  transition:
    color        var(--t) var(--ease),
    padding-left var(--t) var(--ease);
}

li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #569cd6;
  transition:
    color     var(--t) var(--ease),
    transform var(--t) var(--ease);
}

li:hover { color: var(--text); padding-left: 26px; }
li:hover::before { color: var(--accent-hi); transform: translateX(4px); }

/* ── Links ───────────────────────── */
a {
  color: var(--teal);
  text-decoration: none;
  position: relative;
}

/* underline draw-in */
a::after {
  content: '';
  position: absolute;
  bottom: -1px; left: 0;
  width: 0;
  height: 1px;
  background: var(--teal);
  transition: width var(--t) var(--ease);
}

a:hover { color: #6ef0d8; }
a:hover::after { width: 100%; }

/* ── Buttons ─────────────────────── */
@keyframes shimmer {
  0%   { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(250%)  skewX(-15deg); }
}

button {
  padding: 8px 17px;
  background: var(--accent);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px;
  font: 600 12px 'JetBrains Mono', Consolas, monospace;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition:
    background  var(--t) var(--ease),
    transform   var(--t) var(--ease),
    box-shadow  var(--t) var(--ease);
}

/* shimmer sweep */
button::before {
  content: '';
  position: absolute;
  top: 0; bottom: 0;
  left: -60%;
  width: 40%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.18),
    transparent
  );
  transform: skewX(-15deg);
  opacity: 0;
  transition: opacity 0ms;
}

button:hover {
  background: var(--accent-hi);
  transform: translateY(-2px);
  box-shadow:
    0 6px 20px rgba(0, 122, 204, 0.45),
    0 1px 0 rgba(255,255,255,0.12) inset;
}

button:hover::before {
  opacity: 1;
  animation: shimmer 0.65s ease forwards;
}

button:active { transform: translateY(0); box-shadow: none; }

/* ── Inputs ──────────────────────── */
input[type="text"] {
  padding: 9px 13px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 7px;
  color: var(--text);
  font: 13px 'JetBrains Mono', Consolas, monospace;
  outline: none;
  width: 100%;
  transition:
    border-color var(--t) var(--ease),
    background   var(--t) var(--ease),
    box-shadow   var(--t) var(--ease);
}

input[type="text"]:focus {
  border-color: var(--accent);
  background: var(--bg-deep);
  box-shadow: 0 0 0 3px rgba(0, 122, 204, 0.18);
}

input[type="text"]::placeholder { color: var(--muted); }

/* ── Misc ────────────────────────── */
.item  { margin-top: 12px; }
strong { color: var(--text); font-weight: 600; }`

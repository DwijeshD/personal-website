export const STYLES_CSS = `/* VS Code Dark — Design System
   Edit this file to see the preview update live. */

:root {
  --bg:      #1e1e1e;
  --surface: #252526;
  --border:  #3c3c3c;
  --accent:  #0e639c;
  --accent2: #1177bb;
  --text:    #d4d4d4;
  --muted:   #6c6c6c;
  --green:   #6a9955;
  --teal:    #4ec9b0;
  --blue:    #9cdcfe;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: Consolas, 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.7;
}

/* ── Header ─────────────────────── */
.header {
  padding: 20px 32px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

h1 {
  font-size: 22px;
  font-weight: 900;
  color: var(--blue);
  letter-spacing: -.01em;
}

.subtitle {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}

/* ── Layout ─────────────────────── */
.container {
  padding: 32px;
  max-width: 800px;
}

section { margin-bottom: 40px; }

h2 {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: var(--green);
  margin-bottom: 16px;
}

h3 {
  font-size: 14px;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 6px;
}

/* ── Cards ──────────────────────── */
.flex { display: flex; gap: 12px; }

.card {
  flex: 1;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 18px 20px;
  transition: border-color .15s, transform .15s;
}

.card:hover {
  border-color: rgba(14, 99, 156, .5);
  transform: translateY(-1px);
}

.badge {
  display: inline-block;
  font-size: 10px;
  color: #dcdcaa;
  background: rgba(220, 220, 170, .1);
  border: 1px solid rgba(220, 220, 170, .25);
  border-radius: 4px;
  padding: 2px 8px;
  margin-bottom: 10px;
}

.content {
  font-size: 12px;
  color: rgba(212, 212, 212, .6);
  line-height: 1.7;
  margin-bottom: 14px;
}

/* ── Lists ──────────────────────── */
ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

li {
  padding-left: 18px;
  position: relative;
  font-size: 13px;
  color: rgba(212, 212, 212, .75);
}

li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #569cd6;
}

/* ── Interactive ─────────────────── */
a { color: var(--teal); text-decoration: none; }
a:hover { text-decoration: underline; }

button {
  padding: 7px 14px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 5px;
  font: 12px Consolas, monospace;
  cursor: pointer;
  transition: background .15s;
}

button:hover { background: var(--accent2); }

input[type="text"] {
  padding: 8px 12px;
  background: #2d2d2d;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  font: 13px Consolas, monospace;
  outline: none;
  width: 100%;
  transition: border-color .15s;
}

input[type="text"]:focus { border-color: var(--accent); }
input[type="text"]::placeholder { color: var(--muted); }

.item { margin-top: 12px; }

strong { color: var(--text); font-weight: 600; }`

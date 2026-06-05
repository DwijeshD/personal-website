export const SERVER_TS = `/* eslint-disable no-console */
// portfolio.ts — typed site brain + browser renderer

type Status = "active" | "completed" | "prototype" | "research" | "archived";
type ProjectType = "product" | "research" | "cloud" | "frontend" | "backend" | "data" | "platform";
type SkillLevel = "working" | "strong" | "advanced";
type FileType = "html" | "css" | "ts" | "svg" | "yaml" | "json" | "md";
type RouteKind = "page" | "file" | "external" | "action";
type LinkMap = { github?: string; demo?: string; docs?: string; paper?: string; website?: string; };

type PortfolioProject = {
  readonly id: string;
  readonly title: string;
  readonly type: ProjectType;
  readonly status: Status;
  readonly featured: boolean;
  readonly summary: string;
  readonly problem: string;
  readonly solution: string;
  readonly impact: string;
  readonly stack: readonly string[];
  readonly highlights: readonly string[];
  readonly links?: LinkMap;
};

type SkillGroup = {
  readonly title: string;
  readonly level: SkillLevel;
  readonly tools: readonly string[];
  readonly proof: readonly string[];
};

type PortfolioFile = {
  readonly name: string;
  readonly type: FileType;
  readonly role: string;
  readonly reasonItExists: string;
};

type Command = {
  readonly command: string;
  readonly label: string;
  readonly shortcut: string;
  readonly kind: RouteKind;
  readonly target: string;
};

type TimelineEvent = {
  readonly period: string;
  readonly title: string;
  readonly category: string;
  readonly detail: string;
};

type SiteConfig = {
  readonly owner: string;
  readonly role: string;
  readonly domain: string;
  readonly tagline: string;
  readonly primaryFocus: readonly string[];
};

const site: SiteConfig = {
  owner: "Dwijesh Dookraz",
  role: "Software Engineer",
  domain: "dwijesh.dev",
  tagline: "Full-stack, cloud, AI systems, and applied ML — built like real product infrastructure.",
  primaryFocus: ["AI-assisted product systems", "Calendar automation", "Cloud-backed APIs", "Applied ML", "Developer-facing interfaces"],
};

const projects: readonly PortfolioProject[] = [
  {
    id: "nusmark-calendar-assistant",
    title: "Nusmark Calendar Assistant",
    type: "product",
    status: "active",
    featured: true,
    summary: "AI-powered calendar assistant that turns natural language into real calendar actions across WhatsApp, Google Calendar, Outlook, and Firestore.",
    problem: "Calendar apps are still manual. Users want to say what they need, then have the system create, edit, sync, and remind.",
    solution: "Built backend workflows for natural-language item handling, Google/Outlook calendar sync, notification logic, and a shared item abstraction.",
    impact: "Messages become events, events stay synced, and reminders actually reach the user.",
    stack: ["Python", "Flask", "Firestore", "Google Calendar API", "Microsoft Graph", "WhatsApp API", "OAuth", "Webhooks"],
    highlights: ["Webhook-driven Google Calendar sync using sync tokens.", "Outlook-style integration through Microsoft Graph.", "Unified item abstraction for DB and calendar entities.", "Notification service for WhatsApp and mobile push."],
  },
  {
    id: "rppg-heart-rate-estimation",
    title: "rPPG Heart Rate Estimation",
    type: "research",
    status: "completed",
    featured: true,
    summary: "DeepPhys-style heart-rate prediction from facial video using PyTorch, OpenCV, signal processing baselines, and fairness-focused dataset analysis.",
    problem: "Remote photoplethysmography works well in controlled datasets but fails when lighting, motion, and skin-tone diversity change signal quality.",
    solution: "Built a preprocessing and training pipeline around facial ROI extraction, motion tensors, DeepPhys-style dual streams, and custom dataset collection.",
    impact: "Shows that benchmark accuracy is not enough. Robust rPPG needs diverse data and explicit generalisation testing.",
    stack: ["PyTorch", "OpenCV", "DeepPhys", "Optuna", "NumPy", "Signal Processing"],
    highlights: ["Subject-aware train/validation/test splitting.", "Compared deep learning against ICA/PCA baselines.", "Evaluated generalisation across UBFC-rPPG and custom data.", "Focused on skin-tone robustness beyond headline error metrics."],
  },
  {
    id: "calendar-webhook-sync",
    title: "Google / Outlook Calendar Webhook Sync",
    type: "backend",
    status: "active",
    featured: true,
    summary: "Backend service logic for keeping external calendar events and internal Firestore items aligned without producing duplicate or stale state.",
    problem: "Calendar platforms emit partial, asynchronous updates. Naive syncing creates duplicates, stale items, and broken reminders.",
    solution: "Used subscription metadata, sync tokens, event IDs, and Firestore transactions to keep state consistent.",
    impact: "Improves reliability of calendar automation, especially when users edit events outside the app.",
    stack: ["Python", "Google APIs", "Microsoft Graph", "Firestore", "Cloud Run", "OAuth"],
    highlights: ["Processed Google push notifications safely.", "Handled subscription renewal and sync token lifecycle.", "Prevented duplicate DB entries from inconsistent calendar IDs."],
  },
  {
    id: "vscode-portfolio",
    title: "VS Code-Style Portfolio Website",
    type: "platform",
    status: "active",
    featured: true,
    summary: "Personal website designed like a developer workspace using file previews, Monaco-style presentation, SVG diagrams, and typed config files.",
    problem: "Most portfolios look identical and fail to show how the engineer thinks about files, systems, and product structure.",
    solution: "Model the portfolio as an interactive code workspace: files have purpose, previews have content, each format demonstrates a capability.",
    impact: "Turns the website itself into evidence of frontend taste, product thinking, and system organisation.",
    stack: ["Next.js", "TypeScript", "CSS", "SVG", "Monaco Editor", "Vercel"],
    highlights: ["Multiple file types as portfolio artifacts.", "Separates content, styling, diagrams, typed data, and architecture.", "Optimised for recruiters scanning technical credibility."],
  },
  {
    id: "azure-quiplash-api",
    title: "Azure Quiplash API",
    type: "cloud",
    status: "completed",
    featured: false,
    summary: "Serverless coursework backend using Azure Functions and CosmosDB for players, prompts, validation, scoring, and utility endpoints.",
    problem: "The game backend needed reliable CRUD, strict validation, and deployable serverless functions.",
    solution: "Implemented endpoints for registration, login, player updates, prompt CRUD, utilities, and podium calculations.",
    impact: "Demonstrates practical cloud API design and persistence using managed services.",
    stack: ["Azure Functions", "Python", "CosmosDB", "REST"],
    highlights: ["Built player and prompt endpoints.", "Handled boundary and interval validation cases.", "Tested deployed functions with request-based scripts."],
  },
];

const skills: readonly SkillGroup[] = [
  { title: "Frontend",         level: "strong",   tools: ["React", "Next.js", "TypeScript", "CSS", "SVG", "Monaco Editor"],                       proof: ["VS Code-style portfolio", "React dashboard work", "Animated file previews"] },
  { title: "Backend",          level: "strong",   tools: ["Python", "Flask", "FastAPI", "REST", "Webhooks", "OAuth"],                              proof: ["Calendar sync services", "WhatsApp flows", "Notification modules"] },
  { title: "Cloud",            level: "working",  tools: ["Google Cloud", "Cloud Run", "Azure Functions", "Firestore", "CosmosDB", "Vercel"],       proof: ["Azure coursework", "Cloud Run webhooks", "Firestore product state"] },
  { title: "AI / ML",          level: "strong",   tools: ["PyTorch", "OpenCV", "Optuna", "NumPy", "scikit-learn", "Signal Processing"],             proof: ["DeepPhys rPPG pipeline", "MovieLens recommender", "GSE1000 analysis"] },
  { title: "Product Systems",  level: "advanced", tools: ["Calendar automation", "Notification systems", "WhatsApp bots", "Agent workflows"],       proof: ["Nusmark assistant", "Unified item abstraction", "Reminder delivery"] },
];

const timeline: readonly TimelineEvent[] = [
  { period: "2024", title: "Cloud API development",          category: "Azure / Backend",    detail: "Serverless endpoints, validation, and CosmosDB-backed persistence." },
  { period: "2025", title: "DeepPhys rPPG dissertation",     category: "Machine Learning",   detail: "Heart-rate estimation pipeline: facial video, PyTorch, signal processing, fairness evaluation." },
  { period: "2025", title: "Calendar sync engineering",      category: "Product Backend",    detail: "Google/Outlook integrations, webhook handling, OAuth lifecycle, Firestore item state." },
  { period: "2026", title: "Developer portfolio as product", category: "Frontend / Brand",   detail: "VS Code-inspired portfolio where every file format demonstrates an engineering capability." },
];

function getFeaturedProjects(limit = 4): readonly PortfolioProject[] {
  return projects.filter((p) => p.featured).slice(0, limit);
}

function getAllTechnologies(): readonly string[] {
  return Array.from(new Set(projects.flatMap((p) => p.stack))).sort((a, b) => a.localeCompare(b));
}

function getSkillCoverage(): Record<string, number> {
  return Object.fromEntries(skills.map((g) => [g.title, g.tools.length]));
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function statusBadge(status: Status): string {
  const colours: Record<Status, string> = { active: "#4ec9b0", completed: "#6a9955", prototype: "#9cdcfe", research: "#c586c0", archived: "#858585" };
  return \`<span style="color:\${colours[status] || "#d4d4d4"};font-size:11px;text-transform:uppercase;letter-spacing:.1em">\${status}</span>\`;
}

function renderPills(items: readonly string[]): string {
  return items.map((v) => \`<span style="display:inline-block;border:1px solid rgba(78,201,176,.24);background:rgba(78,201,176,.08);color:#4ec9b0;border-radius:999px;padding:3px 8px;font-size:11px;margin:2px">\${escapeHtml(v)}</span>\`).join("");
}

function renderProjectCard(p: PortfolioProject): string {
  const icons: Record<ProjectType, string> = { product:"◈", research:"◇", cloud:"☁", frontend:"▣", backend:"◆", data:"◎", platform:"▤" };
  return \`<article style="border:1px solid #3c3c3c;border-radius:14px;padding:18px;background:#252526;transition:transform .2s,border-color .2s" onmouseover="this.style.transform='translateY(-4px)';this.style.borderColor='rgba(14,99,156,.7)'" onmouseout="this.style.transform='';this.style.borderColor='#3c3c3c'">
    <div style="display:flex;justify-content:space-between;margin-bottom:10px">
      <span style="color:#4ec9b0;font-size:20px">\${icons[p.type]}</span>
      \${statusBadge(p.status)}
    </div>
    <h3 style="color:#9cdcfe;font-size:15px;margin:0 0 8px">\${escapeHtml(p.title)}</h3>
    <p style="color:rgba(212,212,212,.7);font-size:13px;margin:0 0 12px">\${escapeHtml(p.summary)}</p>
    <div>\${renderPills(p.stack)}</div>
  </article>\`;
}

function renderSkillCard(g: SkillGroup): string {
  const levelColour: Record<SkillLevel, string> = { working:"#dcdcaa", strong:"#9cdcfe", advanced:"#4ec9b0" };
  return \`<article style="border:1px solid #3c3c3c;border-radius:14px;padding:16px;background:#252526">
    <div style="color:\${levelColour[g.level]};font-size:11px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">\${g.level}</div>
    <h3 style="color:#9cdcfe;font-size:14px;margin:0 0 10px">\${escapeHtml(g.title)}</h3>
    <div>\${renderPills(g.tools)}</div>
  </article>\`;
}

function renderPage(): string {
  const featured = getFeaturedProjects();
  const tech = getAllTechnologies();
  const coverage = getSkillCoverage();
  const active = projects.filter((p) => p.status === "active").length;

  return \`<!DOCTYPE html><html><head><style>
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;background:radial-gradient(circle at top left,rgba(14,99,156,.2),transparent 360px),radial-gradient(circle at bottom right,rgba(78,201,176,.1),transparent 420px),#1e1e1e;color:#d4d4d4;font-family:Consolas,"Courier New",monospace;line-height:1.65}
    .page{width:min(1100px,100%);padding:32px}
    .hero{border:1px solid #3c3c3c;border-radius:22px;padding:32px;background:linear-gradient(135deg,rgba(37,37,38,.98),rgba(30,30,30,.96));position:relative;overflow:hidden}
    .hero::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(14,99,156,.14),transparent);transform:translateX(-100%);animation:scan 5.5s ease-in-out infinite}
    .hero>*{position:relative}
    h1{color:#9cdcfe;font-size:clamp(28px,4vw,52px);line-height:1.02;letter-spacing:-.05em;margin:0 0 12px}
    h2{color:#6a9955;font-size:11px;text-transform:uppercase;letter-spacing:.16em;margin:36px 0 14px}
    h2::before{content:"// ";color:#555}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    .grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
    .metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:20px}
    .metric{border:1px solid #3c3c3c;border-radius:14px;padding:14px;background:rgba(255,255,255,.02)}
    .metric strong{display:block;color:#9cdcfe;font-size:20px}
    .metric span{color:#858585;font-size:11px}
    .terminal{white-space:pre-wrap;border:1px solid rgba(78,201,176,.24);border-radius:14px;background:#111;color:#4ec9b0;padding:16px;overflow:auto;font-size:12px}
    .timeline-item{display:grid;grid-template-columns:80px 1fr;gap:16px;border:1px solid #3c3c3c;border-radius:12px;padding:14px;background:#252526;margin-bottom:10px}
    @keyframes scan{0%{transform:translateX(-100%);opacity:0}35%{opacity:1}70%{transform:translateX(100%);opacity:0}100%{transform:translateX(100%);opacity:0}}
    @media(max-width:800px){.grid,.grid3{grid-template-columns:1fr}.metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.timeline-item{grid-template-columns:1fr}}
  </style></head><body><div class="page">
    <section class="hero">
      <div style="color:#6a9955;font-size:11px;text-transform:uppercase;letter-spacing:.16em;margin-bottom:8px">portfolio.ts</div>
      <h1>\${escapeHtml(site.owner)}</h1>
      <div style="color:#4ec9b0;font-size:15px;margin-bottom:10px">\${escapeHtml(site.role)} · \${escapeHtml(site.domain)}</div>
      <p style="color:rgba(212,212,212,.7);font-size:14px;max-width:800px;margin:0">\${escapeHtml(site.tagline)}</p>
      <div class="metrics">
        <div class="metric"><strong>\${projects.length}</strong><span>tracked projects</span></div>
        <div class="metric"><strong>\${tech.length}</strong><span>technologies</span></div>
        <div class="metric"><strong>\${active}</strong><span>active now</span></div>
        <div class="metric"><strong>\${skills.length}</strong><span>skill groups</span></div>
      </div>
    </section>
    <h2>Featured Projects</h2>
    <div class="grid">\${featured.map(renderProjectCard).join("")}</div>
    <h2>Skill System</h2>
    <div class="grid3">\${skills.map(renderSkillCard).join("")}</div>
    <h2>Timeline</h2>
    \${timeline.map((t) => \`<div class="timeline-item"><span style="color:#dcdcaa">\${escapeHtml(t.period)}</span><div><strong style="color:#9cdcfe">\${escapeHtml(t.title)}</strong><div style="color:#4ec9b0;font-size:11px;margin-bottom:4px">\${escapeHtml(t.category)}</div><p style="color:rgba(212,212,212,.7);font-size:13px;margin:0">\${escapeHtml(t.detail)}</p></div></div>\`).join("")}
    <h2>Runtime Summary</h2>
    <pre class="terminal">\${escapeHtml(
      "portfolio.inspect()\\n" +
      "├─ owner:        " + site.owner + "\\n" +
      "├─ role:         " + site.role + "\\n" +
      "├─ domain:       " + site.domain + "\\n" +
      "├─ projects:     " + projects.length + " total / " + active + " active\\n" +
      "├─ technologies: " + tech.length + " tracked\\n" +
      "└─ skillCoverage: " + JSON.stringify(coverage)
    )}</pre>
  </div></body></html>\`;
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { document.body.innerHTML = renderPage(); });
  } else {
    document.body.innerHTML = renderPage();
  }
}
`

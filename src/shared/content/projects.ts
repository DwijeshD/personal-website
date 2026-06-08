export const PROJECTS_TS = `/* eslint-disable no-console */
// projects.ts — GitHub public projects, detailed

type Status = "active" | "completed" | "prototype" | "research" | "archived";
type ProjectType = "product" | "research" | "cloud" | "frontend" | "backend" | "data" | "platform";
type FileType = "html" | "css" | "ts" | "svg" | "yaml" | "json" | "md";
type LinkMap = { github?: string; demo?: string; docs?: string; paper?: string; website?: string; };

type GithubProject = {
  readonly id: string;
  readonly title: string;
  readonly repo: string;
  readonly type: ProjectType;
  readonly status: Status;
  readonly featured: boolean;
  readonly year: string;
  readonly language: string;
  readonly summary: string;
  readonly problem: string;
  readonly solution: string;
  readonly impact: string;
  readonly stack: readonly string[];
  readonly highlights: readonly string[];
  readonly links: LinkMap;
};

type TechGroup = {
  readonly category: string;
  readonly tools: readonly string[];
};

type TimelineEvent = {
  readonly period: string;
  readonly title: string;
  readonly category: string;
  readonly detail: string;
};

const projects: readonly GithubProject[] = [
  {
    id: "portfolio-website",
    title: "VS Code Portfolio",
    repo: "DwijeshD/PortfolioWebsite",
    type: "frontend",
    status: "active",
    featured: true,
    year: "2024–2026",
    language: "TypeScript · Next.js · React",
    summary: "Personal portfolio built as an interactive VS Code environment running in the browser — full editor shell, file tree, live previews, Monaco editor, integrated terminal, GitHub integration, and an AI copilot.",
    problem: "Static portfolio pages don't demonstrate frontend engineering depth. Building one that replicates a real development environment requires non-trivial decisions: Monaco Editor integration, tab/editor state management, Content Security Policy for external assets, real-time GitHub data, server-side rendering, and a functioning terminal command interpreter.",
    solution: "Next.js 15 App Router with TypeScript throughout. Monaco Editor for syntax-highlighted code viewing. File-system state with tab management, split views, and URL-synced editor state. GitHub API proxied through Next.js route handlers. Image proxy API route for shields.io and skillicons.dev to bypass CSP restrictions. Sentry for error monitoring with source maps. Vercel Analytics, Speed Insights, and Microsoft Clarity for layered observability. Playwright for UI testing and screenshot verification.",
    impact: "Production deployment at dwijesh.dev. Full VS Code shell with keyboard shortcuts, command palette, quick open, file tree, split editor, and integrated terminal. Mermaid diagram rendering in the Markdown preview. Shields.io badges with logos rendered server-side through a proxy.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Monaco Editor", "GitHub API", "Sentry", "Vercel Analytics", "Vercel Speed Insights", "Microsoft Clarity", "Jest", "ESLint", "Playwright", "Mermaid", "react-markdown", "Vercel"],
    highlights: [
      "Monaco Editor: same engine as VS Code — syntax highlighting for TypeScript, HTML, SVG, Markdown, JSON with full language intelligence.",
      "GitHub API proxied through Next.js route handlers: live repo metadata, commits, and contribution data without exposing tokens to the browser.",
      "Image proxy API (/api/proxy-image): server-side fetch for shields.io and skillicons.dev badges, bypassing CSP restrictions and browser-level network filters.",
      "Sentry error monitoring: production errors captured with source maps, session replay, and stack traces via @sentry/nextjs.",
      "Layered observability: Vercel Analytics (pageviews), Vercel Speed Insights (Web Vitals), Microsoft Clarity (heatmaps and session recordings).",
      "Playwright test suite: headless Chromium UI verification and screenshot-based regression testing via the MCP Playwright plugin.",
      "Mermaid diagram rendering: architecture diagrams in the Markdown preview via dynamic import to avoid SSR hydration issues.",
      "URL sync: open tabs, active file, and view mode serialised to query params — editor state fully shareable via URL.",
    ],
    links: { github: "https://github.com/DwijeshD/PortfolioWebsite", website: "https://dwijesh.dev" },
  },
  {
    id: "nusmark",
    title: "Nusmark — AI Productivity Platform",
    repo: "private · commercial",
    type: "platform",
    status: "completed",
    featured: true,
    year: "2024-2026",
    language: "Python · TypeScript · React",
    summary: "AI-powered productivity platform combining calendar management, reminders, notifications, scheduling, messaging, and analytics. Integrated with WhatsApp, Google Calendar, Outlook, and mobile apps.",
    problem: "Unified productivity platforms require deep third-party integrations across calendar providers, communication channels, and mobile surfaces — with real-time sync, conflict handling, and consistent state across all of them.",
    solution: "Built calendar sync with OAuth2 + webhooks for both Google and Outlook, a multi-channel notification service (push + WhatsApp), an AI assistant on WhatsApp with NLP-driven task extraction, and an internal analytics dashboard. Designed a unified abstraction layer treating calendar and database items identically.",
    impact: "Production system serving real users. Bidirectional sync, cross-provider consistency, and WhatsApp AI onboarding deployed on GCP Cloud Run. Internal dashboard with cohort analysis tracking user behaviour at scale.",
    stack: ["Python", "Flask", "FastAPI", "Firestore", "Google Calendar API", "Microsoft Graph API", "WhatsApp Cloud API", "React", "GCP", "Cloud Run"],
    highlights: [
      "Google Calendar + Outlook bidirectional sync: OAuth2, webhook subscriptions, token refresh, conflict handling, and a unified calendar/DB abstraction layer.",
      "Notification service routing across calendar events, reminders, scheduled notifications, mobile push, and WhatsApp — refactored into modular service-oriented architecture.",
      "AI assistant on WhatsApp: text / audio / image / interactive message pipelines, NLP task extraction, event creation, and account onboarding flows.",
      "Internal insights dashboard: cohort analysis, user analytics, pagination and filtering across large datasets, large component refactors into maintainable modules.",
      "Internal APIs supporting mobile applications: user profile management, scalable service separation, production deployments on GCP Cloud Run.",
      "Engineering challenges: real-time sync, duplicate event prevention, transaction-safe Firestore updates, cross-provider consistency, high-volume analytics.",
    ],
    links: {},
  },
  {
    id: "rppg-heartrate",
    title: "Heart Rate Estimation via rPPG",
    repo: "private · dissertation",
    type: "research",
    status: "completed",
    featured: true,
    year: "2025",
    language: "Python · PyTorch",
    summary: "Final-year dissertation implementing DeepPhys for non-contact heart rate estimation from facial video, focusing on fairness across diverse skin tones by combining UBFC-rPPG with a custom-collected dataset.",
    problem: "Benchmark rPPG datasets (UBFC-rPPG, COHFACE) are demographically narrow — zero Fitzpatrick Type V–VI subjects. Models trained on them exhibit systematic accuracy drops for darker skin tones, a hidden failure mode in deployed systems.",
    solution: "Implemented DeepPhys (dual-stream attention CNN) with full training, subject-aware cross-validation, and inference pipelines. Collected 15-subject custom dataset spanning Fitzpatrick II–VI. Applied Optuna hyperparameter search. Benchmarked against signal-processing baselines: ICA, PCA, frequency-domain estimation, and band-pass filtering.",
    impact: "UBFC-trained model: MAE 8.85 BPM, Pearson r = 0.87. Skin-tone generalisation: r = −0.23, R² = −0.35 (UBFC-only) → r = +0.59 (combined dataset). Demonstrated that diverse training data is necessary and sufficient to recover cross-population correlation.",
    stack: ["Python", "PyTorch", "OpenCV", "NumPy", "Optuna", "Jupyter", "Signal Processing", "UBFC-rPPG", "COHFACE"],
    highlights: [
      "Implemented DeepPhys architecture from literature: dual-stream attention CNN with appearance and motion pathways.",
      "Custom dataset: 15 subjects spanning Fitzpatrick skin types II–VI — purpose-built to address the demographic gap in public benchmarks.",
      "Subject-aware cross-validation to prevent data leakage; Optuna search over network depth, LR, augmentation, and training configurations.",
      "Signal-processing baselines: ICA, PCA, frequency-domain heart-rate estimation, band-pass filtering — all implemented as independent benchmarks.",
      "UBFC-only model collapses on diverse skin (r = −0.23, R² = −0.35); combined-dataset training recovers correlation (r = +0.59, p = 0.043).",
      "Investigated real-time inference pipelines and deployment constraints for mobile and embedded rPPG systems.",
    ],
    links: {},
  },
  {
    id: "hybrid-recommender",
    title: "Hybrid Recommender System",
    repo: "DwijeshD/hybrid-recommender",
    type: "data",
    status: "completed",
    featured: true,
    year: "2026",
    language: "Python",
    summary: "Two-approach recommender built from scratch in pure Python + NumPy — no ML frameworks. Scales from 100k to 20M ratings with streaming SGD.",
    problem: "Most recommender tutorials rely on surprise or sklearn. The goal was to build one that exposes what actually happens inside: how similarity is computed, how latent factors are learned, how cold-start degrades prediction.",
    solution: "Implemented hybrid collaborative filtering (user-CF + item-CF + content signals, staged k-fold hyperparameter search) and matrix factorisation (P·Qᵀ + per-user/item bias, Huber-smoothed L1, Nesterov momentum, adaptive LR decay, Bayesian tuning via Optuna). Streaming line-by-line data loading handles 20M ratings without loading the full dataset into RAM.",
    impact: "Matrix factorisation hits MAE 0.587 on 20M MovieLens ratings. Hybrid CF reaches MAE ~0.78 on 100k. Cold-start users fall back to content signal automatically.",
    stack: ["Python", "NumPy", "Optuna", "scikit-learn", "Bayesian optimisation", "SGD"],
    highlights: [
      "Hybrid CF: user-CF + item-CF + content-based signals blended with dynamic cold-start fallback.",
      "Shrinkage-weighted cosine similarity (Koren 2009) for both user and item axes.",
      "Matrix factorisation: Huber-smoothed L1 loss, Nesterov momentum, per-user/item bias regularisation.",
      "Streaming SGD — runs on 20M MovieLens ratings without full dataset in RAM.",
      "Optuna Bayesian hyperparameter search for latent dimension, LR, regularisation, and momentum.",
      "Staged k-fold CV tuning respects parameter dependencies to avoid combinatorial explosion.",
    ],
    links: { github: "https://github.com/DwijeshD/hybrid-recommender" },
  },
  {
    id: "computational-biology",
    title: "Gene Expression Analysis — Osteosarcoma",
    repo: "DwijeshD/computational-biology",
    type: "research",
    status: "completed",
    featured: true,
    year: "2025",
    language: "Python / Jupyter",
    summary: "ML and statistical genomics on the GSE1000 microarray dataset — do amino acid-conjugated surfaces alter osteosarcoma gene expression, and which genes drive the signal?",
    problem: "Surface chemistry is hypothesised to influence cell behaviour, but isolating transcriptional signal from 22,283 probes across 10 samples requires careful feature selection, robust classification, and cluster validation.",
    solution: "Pipeline: log2 transform → z-score normalisation → ANOVA feature selection (top 500 probes) → Shrinkage LDA with LOOCV + permutation test (n=2000) → Random Forest feature importance → K-means (k=3, silhouette-optimised) + GO enrichment → two-factor differential expression (FDR < 0.05, |log2FC| ≥ 1).",
    impact: "Surface chemistry induces systematic transcriptional differences: LDA balanced accuracy 0.80 (permutation p=0.071). 26 ECM genes significantly downregulated at 32h — collagen fibrillar genes dominate (COL1A2, COL3A1, COL5A1, COL11A1). RF and DE converge on the same ECM regulatory signature.",
    stack: ["Python", "scikit-learn", "NumPy", "Jupyter", "Affymetrix", "GEO / GSE1000"],
    highlights: [
      "Dataset: GSE1000 — 10 samples (5 surfaces × 2 timepoints), 22,283 Affymetrix HG-U133A probes.",
      "Shrinkage LDA with LOOCV: balanced accuracy 0.80, permutation test p = 0.071 (n=2000).",
      "Random Forest (2000 trees, LOOCV) and differential expression converge on the same ECM signature.",
      "26 ECM genes downregulated at 32h vs 6h — collagen fibrillar genes dominate.",
      "K-means k=3 (silhouette-optimised): cell cycle / ECM remodelling / neuronal signalling modules.",
      "Two-factor DE model isolates timepoint effect while controlling for surface chemistry covariate.",
    ],
    links: { github: "https://github.com/DwijeshD/computational-biology" },
  },
  {
    id: "kmeans-clustering",
    title: "Semantic Word Cluster Discovery",
    repo: "DwijeshD/kmeans-clustering",
    type: "research",
    status: "completed",
    featured: true,
    year: "2024",
    language: "Python / Jupyter",
    summary: "Discovers optimal semantic word clusters in a 17M-token Wikipedia corpus using co-occurrence embeddings, UMAP reduction, and silhouette-guided K-means — without ground-truth labels.",
    problem: "Choosing k in K-means is unsupervised. Standard elbow/silhouette methods overfit if evaluated only on training data. Need a principled, validated approach that generalises.",
    solution: "Text8 corpus → NLTK tokenisation + stopword removal + lemmatisation + POS-aware synonym mapping + frequency filter → 9,265 unique words. Co-occurrence matrix (window=5) + L2-normalisation → PCA(20D) → UMAP(5D). K-means sweep (k=2–19) evaluated by Silhouette Score on held-out validation set; Occam's Razor applied at plateau.",
    impact: "Optimal k=7. Validation silhouette 0.698, test silhouette 0.633 — minimal degradation confirms generalisation. 3D UMAP visualisation shows spatially well-separated semantic clusters.",
    stack: ["Python", "scikit-learn", "UMAP", "NLTK", "NumPy", "Jupyter"],
    highlights: [
      "9,265-word vocabulary after POS-aware lemmatisation, synonym mapping, and frequency filtering (50–5,000 occ).",
      "Co-occurrence matrix (window=5) + L2-normalisation → PCA(20D) → UMAP(n_neighbors=10, min_dist=0.1, 5D).",
      "Silhouette score evaluated on validation split — not training — to avoid overfitting k selection.",
      "Occam's Razor: k=7 selected at plateau; further splits add complexity without interpretability gain.",
      "Test silhouette 0.633 vs validation 0.698 — robust generalisation to unseen data.",
      "3D UMAP visualisation confirms spatially separated semantic groupings across seven clusters.",
    ],
    links: { github: "https://github.com/DwijeshD/kmeans-clustering" },
  },
  {
    id: "tetrecs",
    title: "Tetrecs — Block Placement Game",
    repo: "DwijeshD/Tetrecs",
    type: "frontend",
    status: "completed",
    featured: true,
    year: "2023",
    language: "Java",
    summary: "Fast-paced Tetris-inspired block placement game on a 5×5 grid. Clear lines, rack up score multipliers, and survive escalating speed — three lives stand between you and game over.",
    problem: "Build a complete game with real-time mechanics, a satisfying difficulty curve, a strategic storage mechanic, and a persistent score/lives system — all within a full Java + JavaFX architecture.",
    solution: "JavaFX application with piece rotation, horizontal/vertical line clearing, a piece-store mechanic for strategic comebacks, score multiplier chained to multi-line clears, and speed escalation as score climbs. Maven build with modular JavaFX dependencies.",
    impact: "Full game lifecycle from main menu to game-over screen. Score multiplier and decreasing block time create natural flow state. Piece store adds tactical depth absent from vanilla Tetris.",
    stack: ["Java", "JavaFX", "Maven"],
    highlights: [
      "5×5 grid with independent horizontal and vertical line clearing.",
      "Piece store mechanic — bank a piece for a strategic comeback.",
      "Score multiplier tied to simultaneous multi-line clears.",
      "Difficulty ramps by reducing time per block as score increases.",
      "Three-life system with game-over state and menu flow.",
      "Full Maven build with modular JavaFX classpath configuration.",
    ],
    links: { github: "https://github.com/DwijeshD/Tetrecs" },
  },
  {
    id: "2d-space-invader",
    title: "2D Space Invader Game",
    repo: "DwijeshD/2DSpaceInvaderGame",
    type: "frontend",
    status: "completed",
    featured: false,
    year: "2019",
    language: "Python",
    summary: "Classic 2D space shooter built with Python and Pygame. Dual WASD + mouse control scheme, real-time collision detection, and enemy wave progression.",
    problem: "Learn game loop architecture, event-driven input handling, sprite management, and collision detection from first principles — before any framework abstraction.",
    solution: "Pygame game loop with fixed-rate update cycle, sprite-based player and enemy entities, WASD keyboard + mouse dual control, projectile physics, and progressive enemy waves.",
    impact: "Solid foundation in game loop design, real-time input handling, and spatial collision logic — principles that transfer directly to UI event systems and animation loops.",
    stack: ["Python", "Pygame"],
    highlights: [
      "Dual control scheme: WASD keys and mouse movement for player navigation.",
      "Real-time collision detection between projectiles, player, and enemy sprites.",
      "Progressive enemy waves with increasing difficulty.",
      "Fixed-rate game loop decoupled from render cycle.",
    ],
    links: { github: "https://github.com/DwijeshD/2DSpaceInvaderGame" },
  },
];

const techGroups: readonly TechGroup[] = [
  { category: "Frontend & Platform", tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Monaco Editor", "react-markdown", "Mermaid"] },
  { category: "Observability",        tools: ["Sentry", "Vercel Analytics", "Vercel Speed Insights", "Microsoft Clarity"] },
  { category: "Testing & Tooling",    tools: ["Jest", "Playwright", "ESLint", "TypeScript"] },
  { category: "Machine Learning",     tools: ["PyTorch", "scikit-learn", "NumPy", "Optuna", "SGD", "UMAP", "LDA", "Random Forest", "K-means", "OpenCV", "Signal Processing"] },
  { category: "Backend & Cloud",      tools: ["Python", "Flask", "FastAPI", "Firestore", "GCP", "Cloud Run", "Node.js"] },
  { category: "APIs & Integrations",  tools: ["GitHub API", "Google Calendar API", "Microsoft Graph API", "WhatsApp Cloud API", "OAuth2", "Webhooks"] },
  { category: "Data & NLP",           tools: ["NLTK", "Affymetrix", "GEO / GSE1000", "Co-occurrence matrices", "Dimensionality reduction"] },
  { category: "Languages",            tools: ["Python", "Java", "TypeScript", "SQL"] },
  { category: "Tools & Frameworks",   tools: ["React", "Pygame", "JavaFX", "Maven", "Jupyter", "Bash"] },
];

const timeline: readonly TimelineEvent[] = [
  { period: "2019", title: "2D Space Invader",          category: "Game Dev / Python",   detail: "First full project — game loop, sprite collision, dual input scheme in Pygame." },
  { period: "2023", title: "Tetrecs block game",        category: "Java / JavaFX",       detail: "Full game with line clearing, piece store, score multiplier, and difficulty escalation." },
  { period: "2024", title: "K-means cluster discovery", category: "NLP / ML",            detail: "Semantic word clusters in 17M-token corpus — UMAP pipeline, validated k-selection." },
  { period: "2024", title: "Nusmark platform",          category: "Backend / Cloud",     detail: "Calendar sync, WhatsApp AI assistant, notification service, and analytics dashboard on GCP." },
  { period: "2025", title: "Osteosarcoma gene ML",      category: "Computational Bio",   detail: "LDA + RF + DE pipeline on GSE1000 microarray. ECM regulatory signature confirmed." },
  { period: "2025", title: "rPPG heart-rate estimation",category: "ML / Computer Vision",detail: "DeepPhys on UBFC + custom dataset. r = +0.59 with diverse skin-tone training." },
  { period: "2026", title: "Hybrid recommender",        category: "ML / Data Eng",       detail: "CF + matrix factorisation from scratch. MAE 0.587 on 20M ratings via streaming SGD." },
  { period: "2026", title: "VS Code Portfolio",          category: "Next.js / TypeScript", detail: "Full VS Code shell in the browser — Monaco, GitHub API, Sentry, Vercel Analytics, Playwright, Mermaid." },
];

function getAllTechnologies(): readonly string[] {
  return Array.from(new Set(projects.flatMap((p) => p.stack))).sort((a, b) => a.localeCompare(b));
}

function getFeatured(): readonly GithubProject[] {
  return projects.filter((p) => p.featured);
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

function renderProjectCard(p: GithubProject): string {
  const icons: Record<ProjectType, string> = { product:"◈", research:"◇", cloud:"☁", frontend:"▣", backend:"◆", data:"◎", platform:"▤" };
  return \`<article style="border:1px solid #3c3c3c;border-radius:14px;padding:18px;background:#252526;transition:transform .2s,border-color .2s" onmouseover="this.style.transform='translateY(-4px)';this.style.borderColor='rgba(14,99,156,.7)'" onmouseout="this.style.transform='';this.style.borderColor='#3c3c3c'">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <span style="color:#4ec9b0;font-size:20px">\${icons[p.type]}</span>
      <div style="display:flex;gap:8px;align-items:center">
        <span style="color:#858585;font-size:11px">\${escapeHtml(p.year)}</span>
        \${statusBadge(p.status)}
      </div>
    </div>
    <h3 style="color:#9cdcfe;font-size:15px;margin:0 0 4px">\${escapeHtml(p.title)}</h3>
    <div style="color:#858585;font-size:11px;margin-bottom:8px;font-family:monospace">\${escapeHtml(p.repo)}</div>
    <p style="color:rgba(212,212,212,.7);font-size:13px;margin:0 0 10px;line-height:1.55">\${escapeHtml(p.summary)}</p>
    <div style="border-top:1px solid #3c3c3c;padding-top:10px;margin-top:4px">
      <div style="color:#6a9955;font-size:11px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">stack</div>
      <div>\${renderPills(p.stack)}</div>
    </div>
    <div style="border-top:1px solid #3c3c3c;padding-top:10px;margin-top:10px">
      <div style="color:#6a9955;font-size:11px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">highlights</div>
      <ul style="margin:0;padding-left:16px;color:rgba(212,212,212,.65);font-size:12px;line-height:1.7">
        \${p.highlights.map((h) => \`<li>\${escapeHtml(h)}</li>\`).join("")}
      </ul>
    </div>
    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
      \${p.links.github ? \`<a href="\${p.links.github}" target="_blank" style="color:#4ec9b0;font-size:12px;text-decoration:none;border:1px solid rgba(78,201,176,.3);border-radius:6px;padding:4px 10px">↗ GitHub</a>\` : ""}
      \${p.links.demo ? \`<a href="\${p.links.demo}" target="_blank" style="color:#9cdcfe;font-size:12px;text-decoration:none;border:1px solid rgba(156,220,254,.3);border-radius:6px;padding:4px 10px">↗ Demo</a>\` : ""}
      \${p.links.docs ? \`<a href="\${p.links.docs}" target="_blank" style="color:#dcdcaa;font-size:12px;text-decoration:none;border:1px solid rgba(220,220,170,.3);border-radius:6px;padding:4px 10px">↗ Docs</a>\` : ""}
    </div>
  </article>\`;
}

function renderTechCard(g: TechGroup): string {
  return \`<article style="border:1px solid #3c3c3c;border-radius:14px;padding:16px;background:#252526">
    <h3 style="color:#9cdcfe;font-size:13px;margin:0 0 10px">\${escapeHtml(g.category)}</h3>
    <div>\${renderPills(g.tools)}</div>
  </article>\`;
}

function renderPage(): string {
  const featured = getFeatured();
  const tech = getAllTechnologies();
  const allProjects = projects;

  return \`<!DOCTYPE html><html><head><style>
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;background:radial-gradient(circle at top left,rgba(14,99,156,.2),transparent 55vmax),radial-gradient(circle at bottom right,rgba(78,201,176,.1),transparent 55vmax),#1e1e1e;background-attachment:fixed;color:#d4d4d4;font-family:Consolas,"Courier New",monospace;line-height:1.65}
    .page{width:min(1100px,100%);padding:32px}
    .hero{border:1px solid #3c3c3c;border-radius:22px;padding:32px;background:linear-gradient(135deg,rgba(37,37,38,.98),rgba(30,30,30,.96));position:relative;overflow:hidden}
    .hero::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(14,99,156,.14),transparent);transform:translateX(-100%);animation:scan 5.5s ease-in-out infinite}
    .hero>*{position:relative}
    h1{color:#9cdcfe;font-size:clamp(28px,4vw,52px);line-height:1.02;letter-spacing:-.05em;margin:0 0 12px}
    h2{color:#6a9955;font-size:11px;text-transform:uppercase;letter-spacing:.16em;margin:36px 0 14px}
    h2::before{content:"// ";color:#555}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    .grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
    .metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:20px}
    .metric{border:1px solid #3c3c3c;border-radius:14px;padding:14px;background:rgba(255,255,255,.02)}
    .metric strong{display:block;color:#9cdcfe;font-size:20px}
    .metric span{color:#858585;font-size:11px}
    .terminal{white-space:pre-wrap;border:1px solid rgba(78,201,176,.24);border-radius:14px;background:#111;color:#4ec9b0;padding:16px;overflow:auto;font-size:12px}
    .timeline-item{display:grid;grid-template-columns:80px 1fr;gap:16px;border:1px solid #3c3c3c;border-radius:12px;padding:14px;background:#252526;margin-bottom:10px}
    @keyframes scan{0%{transform:translateX(-100%);opacity:0}35%{opacity:1}70%{transform:translateX(100%);opacity:0}100%{transform:translateX(100%);opacity:0}}
    @media(max-width:800px){.grid,.grid3{grid-template-columns:1fr}.metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.timeline-item{grid-template-columns:1fr}}
  </style></head><body><div class="page">
    <section class="hero">
      <div style="color:#6a9955;font-size:11px;text-transform:uppercase;letter-spacing:.16em;margin-bottom:8px">projects.ts</div>
      <h1>GitHub Projects</h1>
      <div style="color:#4ec9b0;font-size:15px;margin-bottom:10px">Dwijesh Dookraz · github.com/DwijeshD</div>
      <p style="color:rgba(212,212,212,.7);font-size:14px;max-width:800px;margin:0">Selected projects — production platforms, ML research, NLP experiments, and game development. From professional backend work to academic research and open-source side projects.</p>
      <div class="metrics">
        <div class="metric"><strong>\${allProjects.length}</strong><span>projects</span></div>
        <div class="metric"><strong>\${tech.length}</strong><span>technologies</span></div>
        <div class="metric"><strong>2019</strong><span>first project</span></div>
        <div class="metric"><strong>2026</strong><span>latest work</span></div>
      </div>
    </section>
    <h2>Featured Projects</h2>
    <div class="grid">\${featured.map(renderProjectCard).join("")}</div>
    <h2>Technologies Used</h2>
    <div class="grid3">\${techGroups.map(renderTechCard).join("")}</div>
    <h2>Timeline</h2>
    \${timeline.map((t) => \`<div class="timeline-item"><span style="color:#dcdcaa">\${escapeHtml(t.period)}</span><div><strong style="color:#9cdcfe">\${escapeHtml(t.title)}</strong><div style="color:#4ec9b0;font-size:11px;margin-bottom:4px">\${escapeHtml(t.category)}</div><p style="color:rgba(212,212,212,.7);font-size:13px;margin:0">\${escapeHtml(t.detail)}</p></div></div>\`).join("")}
    <h2>Runtime Summary</h2>
    <pre class="terminal">\${escapeHtml(
      "projects.inspect()\\n" +
      "├─ owner:        Dwijesh Dookraz\\n" +
      "├─ github:       github.com/DwijeshD\\n" +
      "├─ public repos: " + allProjects.length + "\\n" +
      "├─ technologies: " + tech.length + " tracked\\n" +
      "├─ languages:    Python, TypeScript, Java, Jupyter\\n" +
      "├─ portfolio:    dwijesh.dev — Next.js, Monaco, Sentry, Vercel, Playwright\\n" +
      "├─ domains:      Platform Eng / ML / NLP / Computer Vision / Game Dev\\n" +
      "└─ span:         2019 – 2026"
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

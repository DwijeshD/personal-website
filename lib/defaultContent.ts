export const DEFAULT_CONTENT: Record<string, string> = {
  home: `'use client'

import { useState, useEffect } from 'react'

const PERSON = {
  name:     'Dwijesh Dookraz',
  headline: 'Software Engineer — Backend, AI Systems, Applied ML',
  tagline:  'I build production-grade backend systems, AI pipelines, and automation tools.',
  github:   'https://github.com/DwijeshD',
  linkedin: 'https://linkedin.com/in/dwijesh-dookraz',
  email:    'dwijeshdookraz1@gmail.com',
}

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-full gap-6 px-8">
      <h1 className="text-7xl font-black tracking-tight">{PERSON.name}</h1>
      <p className="text-xl text-blue-400">{PERSON.headline}</p>
      <p className="max-w-xl text-center opacity-60">{PERSON.tagline}</p>
      <div className="flex gap-3 mt-4">
        <a href={PERSON.github}   target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={PERSON.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={\`mailto:\${PERSON.email}\`}>Email</a>
      </div>
    </main>
  )
}`,

  about: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>About — Dwijesh Dookraz</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 720px;
      margin: 40px auto;
      padding: 0 24px;
      background: #1e1e1e;
      color: #d4d4d4;
      line-height: 1.7;
    }
    h1 { color: #9cdcfe; font-size: 2em; margin-bottom: 0; }
    h2 { color: #dcdcaa; border-bottom: 1px solid #454545; padding-bottom: 8px; margin-top: 2em; }
    blockquote {
      border-left: 3px solid #007acc;
      margin: 1.5em 0;
      padding: 0.5em 1em;
      color: #858585;
      font-style: italic;
    }
    .tag {
      display: inline-block;
      padding: 2px 10px;
      background: #007acc22;
      border: 1px solid #007acc55;
      border-radius: 3px;
      font-size: 0.85em;
      margin: 2px;
      color: #9cdcfe;
    }
    .grade { color: #4ec9b0; font-weight: 600; }
  </style>
</head>
<body>
  <h1>Dwijesh Dookraz</h1>
  <p style="color:#858585">Software Engineer — Backend · AI Systems · Applied ML</p>

  <blockquote>
    I build production-grade backend systems, AI pipelines, and automation tools
    that operate on real data, real users, and real constraints.
  </blockquote>

  <h2>About</h2>
  <p>
    Computer Science graduate (<span class="grade">First Class Honours</span>) from the
    University of Southampton. Focused on backend engineering and applied machine learning.
    I work on systems where theory meets reality — APIs, webhooks, OAuth flows, distributed
    data handling, and ML models deployed on imperfect data.
  </p>
  <p>
    I've built calendar-integrated systems, AI-driven automation pipelines, and deep learning
    models for physiological signal estimation. I care about correctness, scalability, and
    building systems that don't break under real-world conditions.
  </p>

  <h2>Education</h2>
  <p>
    <strong>University of Southampton</strong> — BSc Computer Science,
    <span class="grade"> First Class Honours</span> (2021–2024)
  </p>
  <p>Dissertation: <em>ML-Based Heart Rate Measurement Using rPPG</em> —
    <span class="grade">82%</span>
  </p>

  <h2>Interests</h2>
  <ul>
    <li>AI systems and automation</li>
    <li>Backend architecture and distributed systems</li>
    <li>Applied machine learning on real-world data</li>
    <li>Startups and building scalable products</li>
  </ul>
</body>
</html>`,

  projects: `// projects.js
// All projects by Dwijesh Dookraz

const projects = [
  {
    id: 'calendar',
    name: 'AI Calendar Integration System',
    subtitle: 'Nusmark',
    description:
      'Full backend system syncing Google & Outlook calendars. Handles event creation, ' +
      'updates, and deletion via webhooks. Solves duplication and consistency issues using ' +
      'transactional logic. Designed for real-world usage, not demo.',
    tags: ['Python', 'FastAPI', 'OAuth2', 'Webhooks', 'Firestore'],
    highlight: true,
  },
  {
    id: 'rppg',
    name: 'rPPG Heart Rate Prediction',
    subtitle: 'Dissertation — 82%',
    description:
      'Deep learning model (OptimisedDeepPhys) for heart rate estimation from video. ' +
      'Combined UBFC dataset with self-collected dataset for diverse skin tones. ' +
      'Full pipeline: preprocessing, training, evaluation, inference.',
    tags: ['PyTorch', 'Deep Learning', 'Signal Processing', 'Python'],
    highlight: true,
  },
  {
    id: 'ml-pipelines',
    name: 'Machine Learning Pipelines',
    subtitle: 'Various',
    description:
      'Training pipelines with PyTorch and Optuna hyperparameter tuning. ' +
      'Subject-aware k-fold validation. Memory-efficient chunked datasets.',
    tags: ['PyTorch', 'Optuna', 'Python', 'k-Fold CV'],
    highlight: false,
  },
  {
    id: 'recommender',
    name: 'Recommender System',
    subtitle: 'Matrix Factorization',
    description:
      'Large-scale recommender using MovieLens dataset. Optimized via SGD. ' +
      'Focus on minimizing validation MAE.',
    tags: ['Python', 'Matrix Factorization', 'SGD'],
    highlight: false,
  },
  {
    id: 'gene',
    name: 'Gene Expression Analysis',
    subtitle: 'Computational Biology',
    description:
      'End-to-end ML pipeline on GSE1000 dataset. Feature selection, clustering, ' +
      'PCA, differential expression, GO enrichment analysis.',
    tags: ['Python', 'scikit-learn', 'PCA', 'k-means'],
    highlight: false,
  },
]

export default projects`,

  skills: `{
  "languages": [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "Haskell",
    "C"
  ],
  "backend": [
    "Flask",
    "FastAPI",
    "REST API Design"
  ],
  "systems": [
    "Webhooks",
    "OAuth2",
    "Event-Driven Architecture"
  ],
  "databases": [
    "Firestore",
    "NoSQL Patterns"
  ],
  "cloud": [
    "Azure Functions",
    "Serverless Architecture"
  ],
  "aiml": [
    "PyTorch",
    "Deep Learning",
    "Signal Processing (rPPG)",
    "Model Training Pipelines",
    "Optuna",
    "scikit-learn"
  ],
  "data": [
    "Feature Engineering",
    "Preprocessing",
    "MAE Evaluation",
    "k-Fold Cross-Validation"
  ],
  "tools": [
    "Git",
    "Docker",
    "API Integrations",
    "Automation Systems"
  ]
}`,

  experience: `// experience.ts

interface Role {
  company: string
  role:    string
  period:  string
  bullets: string[]
}

const experience: Role[] = [
  {
    company: 'Nusmark',
    role:    'Backend Engineer',
    period:  '2024 — Present',
    bullets: [
      'Built backend systems for an AI-powered event platform integrating Google and Outlook calendars',
      'Developed APIs using Python (Flask/FastAPI) with Firestore as persistence layer',
      'Implemented OAuth2 and webhook pipelines for real-time calendar event syncing',
      'Designed transactional logic to ensure data consistency and prevent duplicate entries',
      'Engineered notification systems for WhatsApp and mobile push delivery',
      'Handled third-party API constraints, sync tokens, and event lifecycle management',
    ],
  },
]

export default experience`,

  contact: `/* contact.css */
/* How to reach Dwijesh Dookraz */

/* Note: no recruiters offering "exciting opportunities" */

:root {
  --bg:      #1e1e1e;
  --surface: #252526;
  --border:  #454545;
  --accent:  #007acc;
  --text:    #d4d4d4;
  --muted:   #858585;
}

.contact-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, sans-serif;
  gap: 12px;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  min-width: 320px;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  text-decoration: none;
  transition: border-color 0.15s, background 0.15s;
  background: var(--surface);
}

.contact-link:hover {
  border-color: var(--accent);
  background: #094771;
}

/* Available links:                                   */
/* GitHub:   https://github.com/DwijeshD             */
/* LinkedIn: https://linkedin.com/in/dwijesh-dookraz */
/* Email:    dwijeshdookraz1@gmail.com                */`,

  readme: `# Dwijesh Dookraz

**Software Engineer — Backend, AI Systems, Applied Machine Learning**

---

## About

Computer Science graduate (First Class Honours) from the University of Southampton.
Focused on backend engineering and applied machine learning. I work on systems where theory meets
reality — APIs, webhooks, OAuth flows, distributed data handling, and ML models deployed on
imperfect data.

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run dev server
npm run dev
\`\`\`

## Stack

- **Next.js 15** · App Router · Edge Runtime
- **React 19** · TypeScript · Tailwind CSS
- **OpenRouter** · llama-3.3-70b · SSE streaming
- **Monaco Editor** · Syntax highlighting · Type checking

## Projects

| Project | Stack | Grade |
|---------|-------|-------|
| AI Calendar Integration | Python, FastAPI, OAuth2, Webhooks | Production |
| rPPG Heart Rate Prediction | PyTorch, Deep Learning | 82% |
| ML Pipelines | PyTorch, Optuna, k-Fold CV | — |
| Recommender System | Matrix Factorization, SGD | — |
| Gene Expression Analysis | scikit-learn, PCA | — |

## Contact

- **GitHub:** https://github.com/DwijeshD
- **Email:** dwijeshdookraz1@gmail.com
- **LinkedIn:** https://linkedin.com/in/dwijesh-dookraz

> Currently open to backend / ML engineer roles.
`,
}

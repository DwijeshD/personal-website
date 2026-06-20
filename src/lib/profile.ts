// ─────────────────────────────────────────────────────────────────────────────
// lib/profile.ts — single source of truth for all portfolio data
//
// Exports two representations:
//   profile       — structured object used by lib/contextBuilder.ts
//   PERSON, ABOUT, SKILLS, PROJECTS
//                 — flat constants used by components
// ─────────────────────────────────────────────────────────────────────────────

// ── Structured profile (used by contextBuilder) ───────────────────────────────

export const profile = {
  identity: {
    name: 'Dwijesh Dookraz',
    role: 'Software Engineer — Backend & Machine Learning Systems',
    summary: `Performance-driven Software Engineer with proven expertise building scalable backend
architectures, high-throughput APIs, and applied machine learning pipelines. Adept at transforming
complex algorithmic models into production-grade systems using Python, FastAPI, and cloud frameworks.
Strong background designing low-latency cloud workflows, data pipelines, and responsive full-stack
interfaces.`,
    available: true,
  },

  contact: {
    email:    'dwijeshdookraz1@gmail.com',
    github:   'https://github.com/DwijeshD',
    linkedin: 'https://linkedin.com/in/dwijesh-dookraz',
  },

  skills: {
    languages: ['Python', 'TypeScript', 'JavaScript', 'SQL'],
    backend:   ['FastAPI', 'Flask', 'RESTful APIs', 'Webhooks', 'OAuth2', 'Microservices', 'Multi-channel Systems'],
    databases: ['Firestore'],
    cloud:     ['Google Cloud Platform (GCP)', 'GCP Cloud Run', 'Sentry', 'Git', 'CI/CD pipelines'],
    aiml:      ['PyTorch', 'scikit-learn', 'OpenCV', 'NumPy', 'Optuna'],
    data:      ['Feature Engineering', 'MAE Evaluation', 'k-Fold Cross-Validation'],
    tools:     ['React', 'Next.js 15', 'Monaco Editor', 'Playwright', 'Git'],
  },

  experience: [
    {
      company: 'Nusmark',
      role:    'Backend Engineer',
      period:  '2024 — 2026',
      bullets: [
        'Engineered a resilient bidirectional sync system for Google Calendar and Outlook using Python, FastAPI, and OAuth2, eliminating duplicate event creation via transactional Firestore writes and webhook lifecycle management',
        'Architected and deployed a multi-modal WhatsApp AI Assistant using Python and Flask on GCP Cloud Run, parsing text, audio, and image intent via custom NLP models to automate calendar onboarding and event generation',
        'Designed an enterprise-grade multi-channel notification engine using Firestore and Microsoft Graph APIs, orchestrating reliable real-time push reminders and lifecycle synchronization across cross-provider ecosystems',
      ],
    },
  ],

  projects: [
    {
      name:        'rPPG Heart Rate Estimation',
      context:     'Final-Year Dissertation — 2024–2025',
      description: 'Developed a DeepPhys dual-stream attention CNN using PyTorch and OpenCV for sensorless heart rate extraction from facial videos, achieving Pearson r = 0.87 and MAE 8.85 BPM on the UBFC-rPPG benchmark. Mitigated demographic bias across cross-population data via localized Python and NumPy pipelines, reversing negative baseline correlations from r = -0.23 to r = +0.59. Optimized hyperparameters using an Optuna Bayesian framework backed by subject-aware k-fold cross-validation, outperforming traditional ICA, PCA, and frequency band-pass baselines.',
      stack:       ['PyTorch', 'OpenCV', 'NumPy', 'Optuna', 'Python'],
    },
    {
      name:        'VS Code Portfolio',
      context:     'dwijesh.dev — 2026',
      description: 'Built a responsive browser development shell using Next.js 15, TypeScript, and React, securely routing live repository insights via server-side Next.js route handlers and the official GitHub API. Enforced code quality pipelines with Sentry runtime error monitoring, Vercel analytics tracking, and automated Playwright UI end-to-end testing suites. Structured a backend proxy engine to securely fetch and dynamically inject visual badge streams into the Monaco Editor workspace, bypassing browser Content Security Policy (CSP) restrictions.',
      stack:       ['Next.js 15', 'TypeScript', 'React', 'Sentry', 'Playwright', 'Monaco Editor'],
    },
  ],

  education: {
    institution:  'University of Southampton',
    degree:       'BSc Computer Science',
    grade:        'First Class Honours',
    period:       '2022 — 2025',
    dissertation: {
      title: 'Final Dissertation',
      grade: '82%',
    },
    modules: [
      { name: 'Social Computing Techniques',        grade: '83%' },
      { name: 'Machine Learning Technologies',      grade: '80%' },
      { name: 'Cloud Application Development',      grade: '79%' },
      { name: 'Software Engineering Group Project', grade: '73%' },
    ],
  },
}

// ── Flat constants (used by components) ───────────────────────────────────────

export const PERSON = {
  name:      'Dwijesh Dookraz',
  headline:  'Software Engineer — Backend, AI Systems, Applied Machine Learning',
  tagline:
    'I build production-grade backend systems, AI pipelines, and automation tools that operate on real data, real users, and real constraints.',
  available: true,
  github:    'https://github.com/DwijeshD',
  linkedin:  'https://linkedin.com/in/dwijesh-dookraz',
  email:     'dwijeshdookraz1@gmail.com',
}

export const ABOUT = `Performance-driven Software Engineer (First Class Honours, University of Southampton) with proven
expertise building scalable backend architectures, high-throughput APIs, and applied machine learning
pipelines. Adept at transforming complex algorithmic models into production-grade systems using Python,
FastAPI, and cloud frameworks.

Strong background designing low-latency cloud workflows, data pipelines, and responsive full-stack
interfaces. I care about correctness, scalability, and building systems that don't break under
real-world conditions.`

export const SKILLS = {
  languages: ['Python', 'TypeScript', 'JavaScript', 'SQL'],
  backend:   ['FastAPI', 'Flask', 'RESTful APIs'],
  systems:   ['Webhooks', 'OAuth2', 'Microservices', 'Multi-channel Systems'],
  databases: ['Firestore'],
  cloud:     ['Google Cloud Platform (GCP)', 'GCP Cloud Run', 'Sentry', 'CI/CD pipelines'],
  aiml:      ['PyTorch', 'scikit-learn', 'OpenCV', 'NumPy', 'Optuna'],
  data:      ['Feature Engineering', 'MAE Evaluation', 'k-Fold Cross-Validation'],
  tools:     ['React', 'Next.js 15', 'Monaco Editor', 'Playwright', 'Git'],
}

export const PROJECTS = [
  {
    id:          'rppg',
    name:        'rPPG Heart Rate Estimation',
    subtitle:    'Final-Year Dissertation — 2024–2025',
    description: 'DeepPhys dual-stream attention CNN (PyTorch, OpenCV) for sensorless heart rate extraction from facial video. Pearson r = 0.87, MAE 8.85 BPM on UBFC-rPPG. Mitigated demographic bias, reversing baseline correlation from r = -0.23 to r = +0.59. Optuna Bayesian hyperparameter tuning with subject-aware k-fold CV, outperforming ICA, PCA, and frequency band-pass baselines.',
    tags:        ['PyTorch', 'OpenCV', 'NumPy', 'Optuna', 'Python'],
    highlight:   true,
  },
  {
    id:          'portfolio',
    name:        'VS Code Portfolio',
    subtitle:    'dwijesh.dev — 2026',
    description: 'Responsive browser development shell (Next.js 15, TypeScript, React) routing live repository insights via server-side route handlers and the GitHub API. Sentry runtime error monitoring, Vercel analytics, and automated Playwright UI e2e tests. Backend proxy engine injects visual badge streams into the Monaco Editor workspace, bypassing CSP restrictions.',
    tags:        ['Next.js 15', 'TypeScript', 'React', 'Sentry', 'Playwright', 'Monaco Editor'],
    highlight:   true,
  },
]


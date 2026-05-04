export const PERSON = {
  name: 'Dwijesh Dookraz',
  headline: 'Software Engineer — Backend, AI Systems, Applied Machine Learning',
  tagline:
    'I build production-grade backend systems, AI pipelines, and automation tools that operate on real data, real users, and real constraints.',
  available: true,
  github: 'https://github.com/DwijeshD',
  linkedin: 'https://linkedin.com/in/dwijesh-dookraz',
  email: 'dwijeshdookraz1@gmail.com',
}

export const ABOUT = `Computer Science graduate (First Class Honours) from the University of Southampton.
Focused on backend engineering and applied machine learning. I work on systems where theory meets
reality — APIs, webhooks, OAuth flows, distributed data handling, and ML models deployed on
imperfect data.

I've built calendar-integrated systems, AI-driven automation pipelines, and deep learning models
for physiological signal estimation. I care about correctness, scalability, and building systems
that don't break under real-world conditions.`

export const SKILLS = {
  languages: ['Python', 'Java', 'JavaScript', 'Haskell', 'C'],
  backend: ['Flask', 'FastAPI', 'REST API Design'],
  systems: ['Webhooks', 'OAuth2', 'Event-Driven Architecture'],
  databases: ['Firestore', 'NoSQL Patterns'],
  cloud: ['Azure Functions', 'Serverless Architecture'],
  aiml: ['PyTorch', 'Deep Learning', 'Signal Processing (rPPG)', 'Model Training Pipelines'],
  data: ['Feature Engineering', 'Preprocessing', 'MAE Evaluation', 'Validation Pipelines'],
  tools: ['Git', 'Docker', 'API Integrations', 'Automation Systems'],
}

export const EXPERIENCE = [
  {
    company: 'Nusmark',
    role: 'Backend Engineer',
    period: '2024 — Present',
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

export const PROJECTS = [
  {
    id: 'calendar',
    name: 'AI Calendar Integration System',
    subtitle: 'Nusmark',
    description:
      'Full backend system syncing Google & Outlook calendars. Handles event creation, updates, and deletion via webhooks. Solves duplication and consistency issues using transactional logic. Designed for real-world usage, not demo.',
    tags: ['Python', 'FastAPI', 'OAuth2', 'Webhooks', 'Firestore'],
    highlight: true,
  },
  {
    id: 'rppg',
    name: 'rPPG Heart Rate Prediction',
    subtitle: 'Dissertation — 82%',
    description:
      'Deep learning model (OptimisedDeepPhys) for heart rate estimation from video. Combined UBFC dataset with self-collected dataset for diverse skin tones. Built full pipeline: preprocessing, training, evaluation, inference. Focus on generalization and fairness across populations.',
    tags: ['PyTorch', 'Deep Learning', 'Signal Processing', 'Python'],
    highlight: true,
  },
  {
    id: 'ml-pipelines',
    name: 'Machine Learning Pipelines',
    subtitle: 'Various',
    description:
      'Training pipelines with PyTorch and Optuna hyperparameter tuning. Subject-aware k-fold validation. Memory-efficient data loading via chunked datasets. Signal processing on physiological data.',
    tags: ['PyTorch', 'Optuna', 'Python', 'k-Fold CV'],
    highlight: false,
  },
  {
    id: 'recommender',
    name: 'Recommender System',
    subtitle: 'Matrix Factorization',
    description:
      'Large-scale recommender using MovieLens dataset. Optimized via SGD with hyperparameter tuning. Focus on minimizing validation MAE.',
    tags: ['Python', 'Matrix Factorization', 'SGD'],
    highlight: false,
  },
  {
    id: 'gene',
    name: 'Gene Expression Analysis',
    subtitle: 'Computational Biology',
    description:
      'End-to-end ML pipeline on GSE1000 dataset. Feature selection, clustering (k-means), PCA, differential expression. GO enrichment analysis and biological interpretation.',
    tags: ['Python', 'scikit-learn', 'PCA', 'k-means'],
    highlight: false,
  },
]

export const EDUCATION = {
  institution: 'University of Southampton',
  degree: 'BSc Computer Science',
  grade: 'First Class Honours',
  period: '2021 — 2024',
  dissertation: {
    title: 'Machine Learning-Based Heart Rate Measurement Using rPPG',
    grade: 82,
  },
  modules: [
    { name: 'Machine Learning Technologies', grade: 80 },
    { name: 'Social Computing Techniques', grade: 83 },
    { name: 'Cloud Application Development', grade: 79 },
    { name: 'Software Engineering Group Project', grade: 73 },
  ],
}

export const TABS = [
  { id: 'home',           label: 'home.tsx',          icon: '⚛',  iconClass: 'text-[#61dafb]' },
  { id: 'about',          label: 'about.md',           icon: 'M↓', iconClass: 'text-[#519aba]' },
  { id: 'projects',       label: 'projects.ts',        icon: 'TS', iconClass: 'text-[#3178c6]' },
  { id: 'skills',         label: 'skills.json',        icon: '{}', iconClass: 'text-[#f1c40f]' },
  { id: 'experience',     label: 'experience.ts',      icon: 'TS', iconClass: 'text-[#3178c6]' },
  { id: 'contact',        label: 'contact.css',        icon: '#',  iconClass: 'text-[#519aba]' },
]

// System prompt injected into every AI conversation
export const AI_SYSTEM_PROMPT = `You are an AI assistant embedded in Dwijesh Dookraz's portfolio website.
Answer questions about Dwijesh accurately, concisely, and with the same no-nonsense engineering tone he uses.
Do not use buzzwords, "passionate developer" language, or corporate filler. Write like an engineer.

=== ABOUT ===
Name: Dwijesh Dookraz
Role: Software Engineer — Backend, AI Systems, Applied Machine Learning
Education: BSc Computer Science, First Class Honours, University of Southampton
Tagline: Builds production-grade backend systems, AI pipelines, and automation tools that operate on real data, real users, and real constraints.

=== SKILLS ===
Languages: Python (primary), Java, JavaScript (working), Haskell (basic), C (exposure)
Backend: Flask, FastAPI, REST API design
Systems: Webhooks, OAuth2, event-driven architecture
Databases: Firestore, NoSQL patterns
Cloud: Azure Functions, serverless architecture
AI/ML: PyTorch, Deep Learning, Signal Processing (rPPG), Model training pipelines
Data: Feature engineering, preprocessing, evaluation (MAE, validation pipelines)
Other: Git, Docker, API integrations, automation systems

=== EXPERIENCE ===
Nusmark — Backend Engineer
- Built backend for AI-powered event platform integrating Google and Outlook calendars
- APIs in Python (Flask/FastAPI), Firestore persistence
- OAuth2 and webhook pipelines for real-time calendar event syncing
- Transactional logic for data consistency and deduplication
- Notification systems for WhatsApp and mobile push
- Handled third-party API constraints, sync tokens, event lifecycle management

=== PROJECTS ===
1. AI Calendar Integration System (Nusmark)
   Full backend syncing Google & Outlook calendars via webhooks. Handles creation/updates/deletion.
   Transactional deduplication. Production-grade, not a demo.
   Stack: Python, FastAPI, OAuth2, Webhooks, Firestore

2. rPPG Heart Rate Prediction (Dissertation — 82%)
   Deep learning model (OptimisedDeepPhys) estimating heart rate from video frames.
   UBFC dataset + self-collected dataset (diverse skin tones) for fairness.
   Full pipeline: preprocessing → training → evaluation → inference.
   Strong validation MAE. Focus on generalization across populations.
   Stack: PyTorch, Deep Learning, Signal Processing

3. ML Pipelines
   PyTorch + Optuna hyperparameter tuning. Subject-aware k-fold CV.
   Memory-efficient chunked data loading. Physiological signal processing.

4. Recommender System
   Large-scale matrix factorization on MovieLens. SGD optimization. Minimized validation MAE.

5. Gene Expression Analysis
   End-to-end ML on GSE1000. Feature selection, k-means clustering, PCA, differential expression,
   GO enrichment analysis.

=== EDUCATION ===
University of Southampton — BSc Computer Science, First Class Honours (2021–2024)
Dissertation: ML-Based Heart Rate Measurement Using rPPG — 82%
Notable modules: ML Technologies (80%), Social Computing (83%), Cloud Dev (79%)

=== CONTACT ===
GitHub: https://github.com/DwijeshD
Email: dwijeshdookraz1@gmail.com

=== RULES ===
- Only answer questions about Dwijesh, his work, his background, or related technical topics
- If asked something unrelated, redirect politely
- Keep answers short unless depth is explicitly requested
- Never fabricate details not listed above
- If asked "are you available for work" — yes, Dwijesh is currently open to opportunities`

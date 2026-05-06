// ─────────────────────────────────────────────────────────────────────────────
// Edit this file to update what the AI assistant knows about you.
// Sections are selectively included based on the visitor's question.
// ─────────────────────────────────────────────────────────────────────────────

export const profile = {
  identity: {
    name: 'Dwijesh Dookraz',
    role: 'Software Engineer — Backend, AI Systems, Applied Machine Learning',
    summary: `Computer Science graduate (First Class Honours) from the University of Southampton.
Focused on backend engineering and applied machine learning. Builds production-grade systems —
APIs, webhooks, OAuth flows, distributed data handling, and deployed ML models. Available for
new opportunities.`,
    available: true,
  },

  contact: {
    email:    'dwijeshdookraz1@gmail.com',
    github:   'https://github.com/DwijeshD',
    linkedin: 'https://linkedin.com/in/dwijesh-dookraz',
  },

  skills: {
    languages: ['Python (primary)', 'Java', 'JavaScript', 'TypeScript', 'Haskell', 'C'],
    backend:   ['Flask', 'FastAPI', 'REST API Design', 'Webhooks', 'OAuth2', 'Event-Driven Architecture'],
    databases: ['Firestore', 'NoSQL Patterns'],
    cloud:     ['Azure Functions', 'Serverless Architecture'],
    aiml:      ['PyTorch', 'Deep Learning', 'Signal Processing (rPPG)', 'Model Training Pipelines', 'Optuna', 'scikit-learn'],
    data:      ['Feature Engineering', 'Preprocessing', 'MAE Evaluation', 'k-Fold Cross-Validation'],
    tools:     ['Git', 'Docker', 'API Integrations', 'Automation Systems'],
  },

  experience: [
    {
      company: 'Nusmark',
      role:    'Backend Engineer',
      period:  '2024 — Present',
      bullets: [
        'Built backend for AI-powered event platform integrating Google and Outlook calendars',
        'Developed APIs in Python (Flask/FastAPI) with Firestore as persistence layer',
        'Implemented OAuth2 and webhook pipelines for real-time calendar event syncing',
        'Designed transactional logic to prevent duplicate entries and ensure consistency',
        'Engineered notification systems for WhatsApp and mobile push delivery',
        'Handled third-party API constraints, sync tokens, and full event lifecycle management',
      ],
    },
  ],

  projects: [
    {
      name:        'AI Calendar Integration System',
      context:     'Nusmark',
      description: 'Full backend syncing Google & Outlook calendars via webhooks. Handles event creation, updates, and deletion. Solves duplication and consistency using transactional logic. Production-grade.',
      stack:       ['Python', 'FastAPI', 'OAuth2', 'Webhooks', 'Firestore'],
    },
    {
      name:        'rPPG Heart Rate Prediction',
      context:     'Dissertation — 82%',
      description: 'Deep learning model (OptimisedDeepPhys) estimating heart rate from video. Combined UBFC dataset with self-collected dataset for skin-tone diversity and fairness. Full pipeline: preprocessing → training → evaluation → inference.',
      stack:       ['PyTorch', 'Deep Learning', 'Signal Processing', 'Python'],
    },
    {
      name:        'Machine Learning Pipelines',
      context:     'Various',
      description: 'Training pipelines with PyTorch and Optuna hyperparameter tuning. Subject-aware k-fold validation. Memory-efficient chunked data loading. Physiological signal processing.',
      stack:       ['PyTorch', 'Optuna', 'Python', 'k-Fold CV'],
    },
    {
      name:        'Recommender System',
      context:     'Matrix Factorization',
      description: 'Large-scale recommender using MovieLens dataset. Optimized via SGD with hyperparameter tuning to minimize validation MAE.',
      stack:       ['Python', 'Matrix Factorization', 'SGD'],
    },
    {
      name:        'Gene Expression Analysis',
      context:     'Computational Biology',
      description: 'End-to-end ML pipeline on GSE1000 dataset. Feature selection, k-means clustering, PCA, differential expression analysis, GO enrichment.',
      stack:       ['Python', 'scikit-learn', 'PCA', 'k-means'],
    },
  ],

  education: {
    institution:  'University of Southampton',
    degree:       'BSc Computer Science',
    grade:        'First Class Honours',
    period:       '2021 — 2024',
    dissertation: {
      title: 'Machine Learning-Based Heart Rate Measurement Using rPPG',
      grade: '82%',
    },
    modules: [
      { name: 'Machine Learning Technologies',       grade: '80%' },
      { name: 'Social Computing Techniques',         grade: '83%' },
      { name: 'Cloud Application Development',       grade: '79%' },
      { name: 'Software Engineering Group Project',  grade: '73%' },
    ],
  },
}

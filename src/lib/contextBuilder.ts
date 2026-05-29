import { profile } from './profile'

// ── Section serialisers ────────────────────────────────────────────────────

function identitySection(): string {
  const { name, role, summary, available } = profile.identity
  return `=== IDENTITY ===
Name: ${name}
Role: ${role}
${summary}
Available for opportunities: ${available ? 'Yes' : 'No'}`
}

function contactSection(): string {
  const { email, github, linkedin } = profile.contact
  return `=== CONTACT ===
Email:    ${email}
GitHub:   ${github}
LinkedIn: ${linkedin}`
}

function skillsSection(): string {
  const s = profile.skills
  return `=== SKILLS ===
Languages: ${s.languages.join(', ')}
Backend:   ${s.backend.join(', ')}
Databases: ${s.databases.join(', ')}
Cloud:     ${s.cloud.join(', ')}
AI / ML:   ${s.aiml.join(', ')}
Data:      ${s.data.join(', ')}
Tools:     ${s.tools.join(', ')}`
}

function experienceSection(): string {
  return profile.experience.map(e =>
    `=== EXPERIENCE ===
${e.company} — ${e.role} (${e.period})
${e.bullets.map(b => `• ${b}`).join('\n')}`
  ).join('\n\n')
}

function projectsSection(): string {
  return `=== PROJECTS ===\n` + profile.projects.map((p, i) =>
    `${i + 1}. ${p.name} [${p.context}]
   ${p.description}
   Stack: ${p.stack.join(', ')}`
  ).join('\n\n')
}

function educationSection(): string {
  const e = profile.education
  return `=== EDUCATION ===
${e.institution} — ${e.degree}, ${e.grade} (${e.period})
Dissertation: "${e.dissertation.title}" — ${e.dissertation.grade}
Notable modules:
${e.modules.map(m => `  • ${m.name}: ${m.grade}`).join('\n')}`
}

// ── Context builder ────────────────────────────────────────────────────────

const PATTERNS = {
  projects:   /project|built|work(ed)?|portfolio|calendar|rppg|heart|recommend|gene|ml pipeline|dissertation/i,
  skills:     /skill|tech|stack|language|framework|python|java|typescript|pytorch|flask|fastapi|api|tool/i,
  experience: /experience|job|work(ed)? at|company|nusmark|backend|engineer|position|role|employ/i,
  education:  /educati|university|degree|grade|module|southampton|studi|dissert|bsc|honours/i,
  contact:    /contact|email|github|linkedin|reach|available|hire|opportunit|get in touch/i,
}

export function buildContext(userMessage: string): string {
  const sections: string[] = [identitySection()]

  if (PATTERNS.projects.test(userMessage))   sections.push(projectsSection())
  if (PATTERNS.skills.test(userMessage))     sections.push(skillsSection())
  if (PATTERNS.experience.test(userMessage)) sections.push(experienceSection())
  if (PATTERNS.education.test(userMessage))  sections.push(educationSection())
  if (PATTERNS.contact.test(userMessage))    sections.push(contactSection())

  // Fallback: include all core sections if no pattern matched
  if (sections.length === 1) {
    sections.push(projectsSection(), skillsSection(), experienceSection())
  }

  return sections.join('\n\n')
}

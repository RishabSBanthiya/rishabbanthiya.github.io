// Fallback AI service using pattern matching for when Ollama is not available

interface KnowledgeBase {
  personal: {
    name: string;
    role: string;
    location: string;
    email: string;
    linkedin: string;
    github: string;
    interests: string[];
    personality: string[];
  };
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    cloud: string[];
    databases: string[];
  };
  experience: {
    current: string;
    previous: string[];
    highlights: string[];
  };
  education: {
    school: string;
    degree: string;
    years: string;
    gpa: string;
  };
  projects: {
    polymarket: string;
    sports: string;
  };
}

export function processFallbackAIQuery(query: string, knowledgeBase: KnowledgeBase): string {
  const lowerQuery = query.toLowerCase();

  // Greeting patterns
  if (lowerQuery.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/)) {
    return `Hello! I can help you learn about Rishab's background, skills, projects, and experience. What would you like to know?`;
  }

  // About/Who is Rishab
  if (lowerQuery.match(/\b(who|about|tell me about|introduce|background)\b/)) {
    return `Rishab Banthiya is a ${knowledgeBase.personal.role} based in ${knowledgeBase.personal.location}.

Education: ${knowledgeBase.education.degree} from ${knowledgeBase.education.school} (${knowledgeBase.education.years}), GPA: ${knowledgeBase.education.gpa}

He works on data engineering, backend systems, and quantitative finance projects.`;
  }

  // Skills queries
  if (lowerQuery.match(/\b(skills|technologies|tech stack|programming|coding|languages|technical)\b/)) {
    return `Rishab's technical skills:

Languages: ${knowledgeBase.skills.languages.join(', ')}
Frameworks: ${knowledgeBase.skills.frameworks.join(', ')}
Cloud & Data: ${knowledgeBase.skills.cloud.join(', ')}, ${knowledgeBase.skills.databases.join(', ')}
Tools: ${knowledgeBase.skills.tools.join(', ')}`;
  }

  // Experience queries
  if (lowerQuery.match(/\b(experience|work|job|career|resume)\b/)) {
    return `Rishab's professional experience:

Current: ${knowledgeBase.experience.current}

Previous roles:
${knowledgeBase.experience.previous.map(p => `- ${p}`).join('\n')}

Highlights:
${knowledgeBase.experience.highlights.map(h => `- ${h}`).join('\n')}`;
  }

  // Projects queries
  if (lowerQuery.match(/\b(projects|portfolio|work|built|created|developed)\b/)) {
    return `Rishab's projects:

Polymarket Analytics
${knowledgeBase.projects.polymarket}

Sports Betting Portfolio Optimizer
${knowledgeBase.projects.sports}

Check out his GitHub for more: github.com/rishabSBanthiya`;
  }

  // Contact queries
  if (lowerQuery.match(/\b(contact|email|reach|get in touch|linkedin|github|social)\b/)) {
    return `Contact Rishab:

Email: ${knowledgeBase.personal.email}
LinkedIn: ${knowledgeBase.personal.linkedin}
GitHub: ${knowledgeBase.personal.github}`;
  }

  // Education queries
  if (lowerQuery.match(/\b(education|school|university|college|degree|study)\b/)) {
    return `Education:

${knowledgeBase.education.school}
${knowledgeBase.education.degree}
${knowledgeBase.education.years}
GPA: ${knowledgeBase.education.gpa}`;
  }

  // What can you do queries
  if (lowerQuery.match(/\b(what can you do|help|commands|capabilities|assist)\b/)) {
    return `I can answer questions about Rishab's:

- Background and experience
- Technical skills
- Projects
- Education
- Contact information

Try: "What are Rishab's skills?" or "Tell me about his experience"`;
  }

  // Default response
  return `I can help you learn about Rishab's background, skills, projects, education, or contact info. What would you like to know?`;
}

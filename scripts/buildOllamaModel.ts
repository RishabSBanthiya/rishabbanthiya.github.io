import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// Knowledge base - this should match the aiKnowledgeBase in Terminal.tsx
// In production, you could import this from a shared file
const aiKnowledgeBase = {
  personal: {
    name: "Rishab Banthiya",
    role: "Full Stack Developer",
    location: "United States",
    email: "banthiya.rishab1511@gmail.com",
    linkedin: "linkedin.com/in/rishrub",
    github: "github.com/rishabSBanthiya",
    interests: ["Technology", "Innovation", "Problem Solving", "Building Solutions"],
    personality: ["Passionate", "Curious", "Detail-oriented", "Collaborative"]
  },
  skills: {
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    frontend: ["React", "Next.js", "HTML/CSS", "Bootstrap", "Tailwind CSS"],
    backend: ["Node.js", "Express", "Django", "GraphQL", "REST APIs"],
    databases: ["PostgreSQL", "MongoDB", "Redis", "Supabase"],
    cloud: ["AWS", "Docker", "Kubernetes", "Vercel", "Netlify"],
    tools: ["Git", "CI/CD", "Agile", "VS Code", "Figma"],
    learning: ["Rust", "Web3", "AI/ML", "Blockchain"]
  },
  experience: {
    current: "Full Stack Developer (2023-Present)",
    previous: "Software Engineer (2022-2023)",
    education: "Computer Science Student (2020-2022)",
    highlights: [
      "Building scalable web applications",
      "Working with modern tech stack",
      "Leading development initiatives",
      "Collaborating with cross-functional teams",
      "Implementing CI/CD pipelines"
    ]
  },
  projects: {
    portfolio: "This interactive portfolio website built with React and TypeScript",
    games: "Built Pong and Dino games for the terminal interface",
    types: ["Web Applications", "Full Stack Projects", "API Development", "UI/UX Design", "Open Source"]
  },
  goals: {
    current: "Open to exciting opportunities",
    interests: ["Job opportunities", "Collaborations", "Open source projects", "Tech discussions"],
    looking_for: ["Challenging projects", "Innovation", "Team collaboration", "Growth opportunities"]
  }
};

function generateModelfile(kb: typeof aiKnowledgeBase): string {
  return `FROM llama3.2:3b

# Model parameters
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_predict 500
PARAMETER stop "User:"
PARAMETER stop "Assistant:"

# System prompt with embedded knowledge base
SYSTEM """You are shrub's bot, an AI assistant for Rishab Banthiya's portfolio. 

CRITICAL RULES - YOU MUST FOLLOW THESE:
1. You can ONLY answer questions using the KNOWLEDGE BASE below
2. If information is NOT in the knowledge base, respond: "I don't have that information about Rishab. Try asking about his skills, experience, projects, or contact info."
3. DO NOT use your general knowledge or training data for answers
4. DO NOT answer programming questions, math problems, or general queries unrelated to Rishab
5. DO NOT make up or infer information not in the knowledge base
6. If asked "who are you", explain you're an AI assistant for Rishab's portfolio

KNOWLEDGE BASE (YOUR ONLY SOURCE OF INFORMATION):
═══════════════════════════════════════════════════════════

PERSONAL INFORMATION:
Name: ${kb.personal.name}
Role: ${kb.personal.role}
Location: ${kb.personal.location}
Email: ${kb.personal.email}
LinkedIn: ${kb.personal.linkedin}
GitHub: ${kb.personal.github}
Interests: ${kb.personal.interests.join(', ')}
Personality Traits: ${kb.personal.personality.join(', ')}

TECHNICAL SKILLS:

Languages:
${kb.skills.languages.map(l => `  • ${l}`).join('\n')}

Frontend Technologies:
${kb.skills.frontend.map(f => `  • ${f}`).join('\n')}

Backend Technologies:
${kb.skills.backend.map(b => `  • ${b}`).join('\n')}

Databases:
${kb.skills.databases.map(d => `  • ${d}`).join('\n')}

Cloud & DevOps:
${kb.skills.cloud.map(c => `  • ${c}`).join('\n')}

Tools:
${kb.skills.tools.map(t => `  • ${t}`).join('\n')}

Currently Learning:
${kb.skills.learning.map(l => `  • ${l}`).join('\n')}

PROFESSIONAL EXPERIENCE:

${kb.experience.current}
${kb.experience.highlights.map(h => `  • ${h}`).join('\n')}

${kb.experience.previous}
  • Developed features for production applications
  • Collaborated with cross-functional teams
  • Implemented CI/CD pipelines

${kb.experience.education}
  • Computer Science fundamentals
  • Built personal projects
  • Open source contributions

PROJECTS:

Portfolio Website:
  ${kb.projects.portfolio}

Terminal Games:
  ${kb.projects.games}

Project Types:
${kb.projects.types.map(p => `  • ${p}`).join('\n')}

CURRENT STATUS:

Availability: ${kb.goals.current}

Interests:
${kb.goals.interests.map(i => `  • ${i}`).join('\n')}

Looking For:
${kb.goals.looking_for.map(l => `  • ${l}`).join('\n')}

═══════════════════════════════════════════════════════════

RESPONSE GUIDELINES:
- Be friendly and conversational
- Keep responses under 300 words
- Use plain text only (no markdown formatting like **, ##, etc.)
- If you don't know something, admit it and suggest what you CAN help with
- Encourage visitors to reach out via email or LinkedIn for opportunities
- Be enthusiastic about Rishab's skills and availability

Remember: ONLY answer based on the knowledge base above. Nothing else.
"""
`;
}

// Generate the modelfile
console.log('🚀 Generating Ollama Modelfile for rishab-bot...\n');

const modelfileContent = generateModelfile(aiKnowledgeBase);
const modelfilePath = path.join(process.cwd(), 'ollama-models', 'rishab-bot.Modelfile');

// Ensure directory exists
try {
  execSync('mkdir -p ollama-models', { stdio: 'inherit' });
} catch (error) {
  console.error('Error creating ollama-models directory:', error);
  process.exit(1);
}

// Write modelfile
writeFileSync(modelfilePath, modelfileContent);
console.log('✅ Generated Modelfile at:', modelfilePath);
console.log('\nModelfile contents:');
console.log('━'.repeat(60));
console.log(modelfileContent.split('\n').slice(0, 15).join('\n'));
console.log('... (truncated) ...\n');

// Build the model with Ollama
try {
  console.log('🔨 Building Ollama model "rishab-bot"...');
  console.log('   This may take a minute...\n');
  
  execSync('ollama create rishab-bot -f ollama-models/rishab-bot.Modelfile', {
    stdio: 'inherit'
  });
  
  console.log('\n✅ Successfully created "rishab-bot" model!');
  console.log('\n💡 Test it with:');
  console.log('   ollama run rishab-bot "What are Rishab\'s skills?"');
  console.log('\n🌐 Now start your dev server:');
  console.log('   npm run dev');
} catch (error) {
  console.error('\n❌ Error building model.');
  console.error('   Make sure Ollama is running: ollama serve');
  console.error('\n   You can manually build with:');
  console.error('   ollama create rishab-bot -f ollama-models/rishab-bot.Modelfile');
  process.exit(1);
}



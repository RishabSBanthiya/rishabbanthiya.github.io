// Fallback AI service using pattern matching for when Ollama is not available
// Used in production environments where Ollama can't run

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
    frontend: string[];
    backend: string[];
    databases: string[];
    cloud: string[];
    tools: string[];
    learning: string[];
  };
  experience: {
    current: string;
    previous: string;
    education: string;
    highlights: string[];
  };
  projects: {
    portfolio: string;
    games: string;
    types: string[];
  };
  goals: {
    current: string;
    interests: string[];
    looking_for: string[];
  };
}

export function processFallbackAIQuery(query: string, knowledgeBase: KnowledgeBase): string {
  const lowerQuery = query.toLowerCase();
  
  // Greeting patterns
  if (lowerQuery.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/)) {
    return `Hello! I'm shrub's bot. I can help you learn about Rishab's background, skills, projects, and experience. What would you like to know?`;
  }
  
  // About/Who is Rishab
  if (lowerQuery.match(/\b(who|about|tell me about|introduce|background)\b/)) {
    return `Rishab Banthiya is a passionate Full Stack Developer based in the United States. He's a builder and explorer of technology and business, with a strong interest in innovation and problem-solving. 

Currently open to exciting opportunities, Rishab enjoys working on challenging projects that make a real impact. He has experience building scalable web applications and working with modern tech stacks.

You can learn more by asking about his skills, experience, projects, or contact information!`;
  }
  
  // Skills queries
  if (lowerQuery.match(/\b(skills|technologies|tech stack|programming|coding|languages|technical)\b/)) {
    return `Rishab's technical skills include:

Languages: ${knowledgeBase.skills.languages.join(', ')}
Frontend: ${knowledgeBase.skills.frontend.join(', ')}
Backend: ${knowledgeBase.skills.backend.join(', ')}
Databases: ${knowledgeBase.skills.databases.join(', ')}
Cloud & Tools: ${knowledgeBase.skills.cloud.join(', ')}
Currently Learning: ${knowledgeBase.skills.learning.join(', ')}

He's particularly strong in React, TypeScript, Node.js, and modern web development practices.`;
  }
  
  // Experience queries
  if (lowerQuery.match(/\b(experience|work|job|career|background|resume)\b/)) {
    return `Rishab's professional experience:

${knowledgeBase.experience.current}
   - Building scalable web applications
   - Working with modern tech stack
   - Leading development initiatives

${knowledgeBase.experience.previous}
   - Developed features for production applications
   - Collaborated with cross-functional teams
   - Implemented CI/CD pipelines

${knowledgeBase.experience.education}
   - Computer Science fundamentals
   - Building projects and contributing to open source

He's currently open to new opportunities and exciting challenges!`;
  }
  
  // Projects queries
  if (lowerQuery.match(/\b(projects|portfolio|work|built|created|developed)\b/)) {
    return `Rishab has worked on various projects including:

This Interactive Portfolio
   - Built with React, TypeScript, and Vite
   - Features terminal interface with games
   - Responsive design with Bootstrap

Terminal Games
   - Pong game with physics simulation
   - Dino game inspired by Chrome's offline game
   - Built using HTML5 Canvas and TypeScript

Other Projects
   - Full-stack web applications
   - API development and integration
   - UI/UX design and implementation
   - Open source contributions

Check out his GitHub (github.com/rishabSBanthiya) for more projects!`;
  }
  
  // Contact queries
  if (lowerQuery.match(/\b(contact|email|reach|get in touch|linkedin|github|social)\b/)) {
    return `You can reach Rishab through:

Email: ${knowledgeBase.personal.email}
LinkedIn: ${knowledgeBase.personal.linkedin}
GitHub: ${knowledgeBase.personal.github}

He's interested in:
- Job opportunities
- Collaborations
- Open source projects
- Tech discussions

Feel free to reach out - he's always excited to connect with fellow developers!`;
  }
  
  // Availability/Status queries
  if (lowerQuery.match(/\b(available|status|hiring|looking|opportunities|job search)\b/)) {
    return `Rishab is currently:

- Open to opportunities
- Available for collaborations
- Looking for challenging projects
- Interested in full-stack development roles
- Excited about innovation and growth

He's particularly interested in roles that involve:
- Modern web technologies
- Team collaboration
- Problem-solving challenges
- Continuous learning opportunities

Feel free to reach out if you have an opportunity that matches!`;
  }
  
  // What can you do queries
  if (lowerQuery.match(/\b(what can you do|help|commands|capabilities|assist)\b/)) {
    return `I can help you learn about Rishab! I can answer questions about:

- Personal background and interests
- Technical skills and technologies
- Professional experience and career
- Projects and portfolio work
- Contact information and availability
- This terminal's features and games

Just ask me anything like:
- "Tell me about Rishab's skills"
- "What projects has he worked on?"
- "How can I contact him?"
- "What technologies does he use?"

What would you like to know?`;
  }
  
  // Default response
  return `I'm not sure I understand that question about Rishab. I can help you learn about:

- His background and experience
- Technical skills and technologies  
- Projects and portfolio work
- Contact information
- Availability and opportunities

Try asking something like "What are Rishab's skills?" or "Tell me about his experience" and I'll be happy to help!`;
}



import React, { useState, useRef, useEffect } from 'react'
import PongGame from './PongGame'
import DinoGame from './DinoGame'
import { PokerGame } from './poker/PokerGame'
import { BSPokerGame } from './bspoker/BSPokerGame'

interface CommandHistory {
  command: string
  output: React.ReactNode
}

interface Position {
  x: number
  y: number
}

// Weather Display Component
const WeatherDisplay: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [weatherData, setWeatherData] = useState<string>('')

  useEffect(() => {
    // Create an AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    fetch('https://wttr.in/?format=j1', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(res => {
        clearTimeout(timeoutId)
        if (res.status === 200) {
          return res.json()
        } else {
          throw new Error('Non-200 response')
        }
      })
      .then(data => {
        const current = data.current_condition[0]
        const location = data.nearest_area[0]
        const weatherText = `Weather for ${location.areaName[0].value}, ${location.region[0].value}
========================
Condition: ${current.weatherDesc[0].value}
Temperature: ${current.temp_F}°F (${current.temp_C}°C)
Feels like: ${current.FeelsLikeF}°F
Humidity: ${current.humidity}%
Wind: ${current.windspeedMiles} mph ${current.winddir16Point}
Visibility: ${current.visibility} mi

Data from wttr.in ☕`
        setWeatherData(weatherText)
        setLoading(false)
      })
      .catch(() => {
        clearTimeout(timeoutId)
        setLoading(false)
        setError(true)
      })
  }, [])

  if (loading) {
    return (
      <div className="command-output">
        <p className="output-line">⏳ Fetching weather data from wttr.in...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="command-output">
        <p className="output-line error">❌ The meteorologist is on leave</p>
        <p className="output-line">Unable to fetch weather data at this time.</p>
      </div>
    )
  }

  return (
    <div className="command-output">
      <pre>{weatherData}</pre>
    </div>
  )
}

// JournalCtl Display Component (Twitter/X Feed)
const JournalCtlDisplay: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [tweets, setTweets] = useState<Array<{text: string, created_at: string, url?: string}>>([])
  const [error, setError] = useState(false)
  const [source, setSource] = useState<string>('')
  const [errorData, setErrorData] = useState<any>(null)

  useEffect(() => {
    const fetchTweets = async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      try {
        const username = 'ri_shrub'
        // Use backend proxy API
        const apiUrl = `http://localhost:3001/api/tweets/${username}?count=10`
        
        const response = await fetch(apiUrl, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        })

        clearTimeout(timeoutId)
        const data = await response.json()
        
        if (response.ok && data.success) {
          if (data.tweets && data.tweets.length > 0) {
            setTweets(data.tweets)
            setSource(data.source || 'backend')
            // Check if this is a rate-limited fallback response
            if (data.source === 'fallback-rate-limit' && data.rateLimitInfo) {
              setErrorData(data.rateLimitInfo)
            }
          } else {
            setTweets([])
            setSource(data.source || 'backend')
          }
          setLoading(false)
        } else {
          // Handle error response - store full error data
          console.log('Error response from API:', data)
          setErrorData(data)
          setError(true)
          setLoading(false)
        }
      } catch (err: unknown) {
        clearTimeout(timeoutId)
        console.error('Failed to fetch tweets:', err)
        // Only set error data if we don't already have it from the response
        if (!errorData) {
          if (err && typeof err === 'object' && 'message' in err) {
            setErrorData({ error: (err as Error).message })
          }
        }
        setError(true)
        setLoading(false)
      }
    }

    fetchTweets()
  }, [])

  if (loading) {
    return (
      <div className="command-output">
        <p className="output-line">Fetching tweets from @ri_shrub...</p>
      </div>
    )
  }

  // Check for rate limit info even if we have tweets (fallback scenario)
  const isRateLimited = errorData?.error === 'Rate Limit'

  if (error || tweets.length === 0) {
    const isServerDown = !errorData
    const isApiNotConfigured = errorData?.error === 'Twitter API not configured'
    const isInvalidToken = errorData?.error === 'Invalid Twitter Bearer Token'
    
    return (
      <div className="command-output">
        <p className="output-line"><strong>-- Logs from @ri_shrub --</strong></p>
        <p className="output-line"></p>
        
        {isServerDown && (
          <>
            <p className="output-line">Unable to connect to Twitter API.</p>
            <p className="output-line"></p>
            <p className="output-line">Check your internet connection and try again.</p>
            <p className="output-line"></p>
          </>
        )}
        
        {isApiNotConfigured && (
          <>
            <p className="output-line">Twitter API not configured</p>
            <p className="output-line"></p>
            <p className="output-line"><strong>Setup Instructions:</strong></p>
            <p className="output-line">1. Get a Bearer Token from Twitter Developer Portal</p>
            <p className="output-line">   <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" style={{color: '#1da1f2'}}>developer.twitter.com</a></p>
            <p className="output-line"></p>
            <p className="output-line">2. Create <code>server/.env</code> file</p>
            <p className="output-line"></p>
            <p className="output-line">3. Add your token:</p>
            <p className="output-line">   <code>TWITTER_BEARER_TOKEN=your_token_here</code></p>
            <p className="output-line"></p>
            <p className="output-line">4. Restart the server</p>
            <p className="output-line"></p>
            <p className="output-line">See <code>TWITTER_API_SETUP.md</code> for detailed instructions</p>
            <p className="output-line"></p>
          </>
        )}
        
        {isInvalidToken && (
          <>
            <p className="output-line">Invalid Twitter Bearer Token</p>
            <p className="output-line"></p>
            <p className="output-line"><strong>Fix Instructions:</strong></p>
            <p className="output-line">1. Go to <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" style={{color: '#1da1f2'}}>Twitter Developer Portal</a></p>
            <p className="output-line"></p>
            <p className="output-line">2. Sign in with your @ri_shrub account</p>
            <p className="output-line"></p>
            <p className="output-line">3. Create a new app or regenerate Bearer Token</p>
            <p className="output-line"></p>
            <p className="output-line">4. Ensure the token has "Read" permissions</p>
            <p className="output-line"></p>
            <p className="output-line">5. Update <code>server/.env</code> with the new token</p>
            <p className="output-line"></p>
            <p className="output-line">6. Restart the server</p>
            <p className="output-line"></p>
            <p className="output-line">Current token appears to be invalid or expired</p>
            <p className="output-line"></p>
          </>
        )}
        
        {isRateLimited && (
          <>
            <p className="output-line">{errorData?.message || "rishab's twitter is acting up, try again later"}</p>
            {errorData?.resetTime ? (
              <p className="output-line">
                Try again after: {new Date(errorData.resetTime).toLocaleString()}
              </p>
            ) : errorData?.resetDate ? (
              <p className="output-line">
                Try again after: {new Date(errorData.resetDate).toLocaleString()}
              </p>
            ) : null}
            <p className="output-line"></p>
          </>
        )}
        
        {!isServerDown && !isApiNotConfigured && !isInvalidToken && !isRateLimited && errorData && (
          <>
            <p className="output-line">{errorData.message || 'Failed to fetch tweets'}</p>
            <p className="output-line"></p>
          </>
        )}
        
        <p className="output-line">View latest tweets directly:</p>
        <p className="output-line">   <a href="https://x.com/ri_shrub" target="_blank" rel="noopener noreferrer" style={{color: '#1da1f2', textDecoration: 'underline'}}>https://x.com/ri_shrub</a></p>
      </div>
    )
  }

  return (
    <div className="command-output">
      <p className="output-line"><strong>-- Logs from @ri_shrub (Latest {tweets.length} tweets) --</strong></p>
      <p className="output-line"><span style={{color: '#666', fontSize: '0.9em'}}>Source: {source}</span></p>
      {isRateLimited && errorData?.resetTime && (
        <p className="output-line"><span style={{color: '#666', fontSize: '0.9em'}}>Last updated: {new Date(errorData.resetTime - 86400000).toLocaleString()}</span></p>
      )}
      <p className="output-line"></p>
      
      {tweets.map((tweet, index) => {
        const date = tweet.created_at ? new Date(tweet.created_at).toLocaleString() : 'Unknown date'
        return (
          <React.Fragment key={index}>
            <p className="output-line"><span style={{color: '#555'}}>[{date}]</span></p>
            <p className="output-line">→ {tweet.text}</p>
            {tweet.url && (
              <p className="output-line" style={{fontSize: '0.85em', color: '#666'}}>
                🔗 <a href={tweet.url} target="_blank" rel="noopener noreferrer" style={{color: '#1da1f2'}}>View tweet</a>
              </p>
            )}
            <p className="output-line"></p>
          </React.Fragment>
        )
      })}
      <p className="output-line">────────────────────────────────────────</p>
      <p className="output-line">View more at: <a href="https://x.com/ri_shrub" target="_blank" rel="noopener noreferrer" style={{color: '#1da1f2'}}>@ri_shrub</a></p>
    </div>
  )
}

// AI Agent Knowledge Base
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
}

// AI Agent Response Component
const AIAgentResponse: React.FC<{ response: string }> = ({ response }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < response.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + response[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 20) // Typing speed
      return () => clearTimeout(timer)
    }
  }, [currentIndex, response])

  return (
    <div className="command-output">
      <div className="ai-agent-response">
        <div className="ai-prompt">
          <span className="ai-name">shrub's bot:</span>
        </div>
        <div className="ai-content">
          <pre>{displayedText}</pre>
          {currentIndex < response.length && <span className="typing-cursor">|</span>}
        </div>
      </div>
    </div>
  )
}

// AI Agent Logic
const processAIQuery = (query: string): string => {
  const lowerQuery = query.toLowerCase()
  
  // Greeting patterns
  if (lowerQuery.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/)) {
    return `Hello! I'm shrub's bot. I can help you learn about Rishab's background, skills, projects, and experience. What would you like to know?`
  }
  
  // About/Who is Rishab
  if (lowerQuery.match(/\b(who|about|tell me about|introduce|background)\b/)) {
    return `Rishab Banthiya is a passionate Full Stack Developer based in the United States. He's a builder and explorer of technology and business, with a strong interest in innovation and problem-solving. 

Currently open to exciting opportunities, Rishab enjoys working on challenging projects that make a real impact. He has experience building scalable web applications and working with modern tech stacks.

You can learn more by asking about his skills, experience, projects, or contact information!`
  }
  
  // Skills queries
  if (lowerQuery.match(/\b(skills|technologies|tech stack|programming|coding|languages)\b/)) {
    return `Rishab's technical skills include:

Languages: ${aiKnowledgeBase.skills.languages.join(', ')}
Frontend: ${aiKnowledgeBase.skills.frontend.join(', ')}
Backend: ${aiKnowledgeBase.skills.backend.join(', ')}
Databases: ${aiKnowledgeBase.skills.databases.join(', ')}
Cloud & Tools: ${aiKnowledgeBase.skills.cloud.join(', ')}
Currently Learning: ${aiKnowledgeBase.skills.learning.join(', ')}

He's particularly strong in React, TypeScript, Node.js, and modern web development practices.`
  }
  
  // Experience queries
  if (lowerQuery.match(/\b(experience|work|job|career|background|resume)\b/)) {
    return `Rishab's professional experience:

${aiKnowledgeBase.experience.current}
   - Building scalable web applications
   - Working with modern tech stack
   - Leading development initiatives

${aiKnowledgeBase.experience.previous}
   - Developed features for production applications
   - Collaborated with cross-functional teams
   - Implemented CI/CD pipelines

${aiKnowledgeBase.experience.education}
   - Computer Science fundamentals
   - Building projects and contributing to open source

He's currently open to new opportunities and exciting challenges!`
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

Check out his GitHub (github.com/rishabSBanthiya) for more projects!`
  }
  
  // Contact queries
  if (lowerQuery.match(/\b(contact|email|reach|get in touch|linkedin|github|social)\b/)) {
    return `You can reach Rishab through:

Email: banthiya.rishab1511@gmail.com
LinkedIn: linkedin.com/in/rishrub
GitHub: github.com/rishabSBanthiya

He's interested in:
- Job opportunities
- Collaborations
- Open source projects
- Tech discussions

Feel free to reach out - he's always excited to connect with fellow developers!`
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

Feel free to reach out if you have an opportunity that matches!`
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

What would you like to know?`
  }
  
  // Default response
  return `I'm not sure I understand that question about Rishab. I can help you learn about:

- His background and experience
- Technical skills and technologies  
- Projects and portfolio work
- Contact information
- Availability and opportunities

Try asking something like "What are Rishab's skills?" or "Tell me about his experience" and I'll be happy to help!`
}

// Helper function to parse command flags
const parseCommand = (command: string) => {
  const parts = command.split(' ')
  const baseCommand = parts[0].toLowerCase()
  const args = parts.slice(1)
  const flags = args.filter(arg => arg.startsWith('-'))
  const params = args.filter(arg => !arg.startsWith('-'))
  return { baseCommand, args, flags, params }
}

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<CommandHistory[]>([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  const [activeGame, setActiveGame] = useState<'pong' | 'dino' | 'poker' | 'bspoker' | null>(null)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [currentDirectory, setCurrentDirectory] = useState('~')
  const [suggestion, setSuggestion] = useState('')
  const [historyPreview, setHistoryPreview] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isNavigatingHistory = useRef<boolean>(false)

  const commands: Record<string, () => React.ReactNode> = {
    help: () => (
      <div className="command-output">
        <div className="help-section">
          <p className="help-title">Available Commands:</p>
          <div className="command-list">
            <div className="command-item">
              <span className="cmd-name">about</span>
              <span className="cmd-desc">Learn more about me</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">resume</span>
              <span className="cmd-desc">View/download my resume</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">contact</span>
              <span className="cmd-desc">Get my contact information</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">linkedin</span>
              <span className="cmd-desc">Open my LinkedIn profile</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">github</span>
              <span className="cmd-desc">Open my GitHub profile</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">projects</span>
              <span className="cmd-desc">View my projects</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">play [game]</span>
              <span className="cmd-desc">Play Pong, Dino, Poker, or BS Poker!</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">ssh &lt;url&gt;</span>
              <span className="cmd-desc">Open a URL in a new tab</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">neofetch</span>
              <span className="cmd-desc">Display system information</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">cat &lt;file&gt;</span>
              <span className="cmd-desc">Read file contents (about.txt, skills.json, etc.)</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">history</span>
              <span className="cmd-desc">Show command history</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">ping</span>
              <span className="cmd-desc">Check if I'm available</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">weather</span>
              <span className="cmd-desc">Get current weather</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">cd &lt;section&gt;</span>
              <span className="cmd-desc">Navigate to section (about, projects, contact)</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">grep &lt;term&gt;</span>
              <span className="cmd-desc">Search through content</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">clear</span>
              <span className="cmd-desc">Clear the terminal</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">ai</span>
              <span className="cmd-desc">Chat with shrub's bot about Rishab</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">help</span>
              <span className="cmd-desc">Show this help message</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">skills</span>
              <span className="cmd-desc">Display technical skills by category</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">experience</span>
              <span className="cmd-desc">Show professional experience timeline</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">education</span>
              <span className="cmd-desc">View education and learning background</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">timeline</span>
              <span className="cmd-desc">Show career development timeline</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">uname</span>
              <span className="cmd-desc">Show system information</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">uptime</span>
              <span className="cmd-desc">Show portfolio uptime and current time</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">man</span>
              <span className="cmd-desc">Display manual for all commands</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">which &lt;cmd&gt;</span>
              <span className="cmd-desc">Show command location</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">alias</span>
              <span className="cmd-desc">Show terminal aliases</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">export</span>
              <span className="cmd-desc">Show environment variables</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">set</span>
              <span className="cmd-desc">Show terminal settings</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">history [flags]</span>
              <span className="cmd-desc">--clear, --count, --search &lt;term&gt;</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">journalctl</span>
              <span className="cmd-desc">Show recent tweets from @ri_shrub</span>
            </div>
          </div>
        </div>
      </div>
    ),

    about: () => (
      <div className="command-output">
        <p className="output-line">Rishab Banthiya</p>
        <p className="output-line">Builder, explorer of technology and business.</p>
        <p className="output-line"></p>
        <p className="output-line">I enjoy working on innovative projects and learning new technologies.</p>
      </div>
    ),

    resume: () => {
      window.open('/rishab-banthiya-resume.pdf', '_blank')
      return (
        <div className="command-output">
          <p className="output-line success">Opening resume...</p>
        </div>
      )
    },

    contact: () => (
      <div className="command-output">
        <p className="output-line">Email: <a href="mailto:banthiya.rishab1511@gmail.com" className="terminal-link">banthiya.rishab1511@gmail.com</a></p>
        <p className="output-line">LinkedIn: <a href="https://www.linkedin.com/in/rishrub/" target="_blank" rel="noopener noreferrer" className="terminal-link">linkedin.com/in/rishrub</a></p>
        <p className="output-line">GitHub: <a href="https://github.com/rishabSBanthiya/" target="_blank" rel="noopener noreferrer" className="terminal-link">github.com/rishabSBanthiya</a></p>
      </div>
    ),

    linkedin: () => {
      window.open('https://www.linkedin.com/in/rishrub/', '_blank')
      return (
        <div className="command-output">
          <p className="output-line success">Opening LinkedIn profile...</p>
        </div>
      )
    },

    github: () => {
      window.open('https://github.com/rishabSBanthiya/', '_blank')
      return (
        <div className="command-output">
          <p className="output-line success">Opening GitHub profile...</p>
        </div>
      )
    },

    projects: () => (
      <div className="command-output">
        <p className="output-line">Check out my GitHub for the latest projects.</p>
        <p className="output-line">Type 'github' to visit my profile.</p>
      </div>
    ),

    clear: () => null,

    whoami: () => (
      <div className="command-output">
        <p className="output-line">rishab-banthiya</p>
      </div>
    ),

    ls: () => (
      <div className="command-output">
        <p className="output-line">about.txt  resume.pdf  projects/  contact.txt</p>
      </div>
    ),

    date: () => (
      <div className="command-output">
        <p className="output-line">{new Date().toString()}</p>
      </div>
    ),

    echo: () => (
      <div className="command-output">
        <p className="output-line">{currentCommand.substring(5)}</p>
      </div>
    ),

    neofetch: () => (
      <div className="command-output">
        <pre className="neofetch-output">{`
   ___           Rishab Banthiya
  /   \\          ──────────────────────────
 | O O |         OS: Full Stack Developer
  \\___/          Shell: TypeScript + React
                 Uptime: ${new Date().getFullYear() - 2020}+ years coding
                 Languages: JavaScript, TypeScript, Python
                 Frameworks: React, Node.js, Express
                 Tools: Git, Docker, AWS
                 Editor: VS Code
                 Terminal: Zsh
                 Location: ${currentDirectory}
                 Status: Open to opportunities
`}</pre>
      </div>
    ),

    ping: () => {
      return (
        <div className="command-output">
          <p className="output-line success">64 bytes from rishab-banthiya.com: icmp_seq=1 ttl=64 time=0.420ms</p>
          <p className="output-line success">Ping successful! Currently available for opportunities ☕</p>
        </div>
      )
    },

    pwd: () => (
      <div className="command-output">
        <p className="output-line">/home/rishab/{currentDirectory}</p>
      </div>
    ),

    ai: () => {
      const query = currentCommand.substring(3).trim()
      if (!query) {
        return (
          <div className="command-output">
            <p className="output-line">shrub's bot: Hello! I'm here to help you learn about Rishab.</p>
            <p className="output-line">Try asking me something like:</p>
            <p className="output-line">- "What are Rishab's skills?"</p>
            <p className="output-line">- "Tell me about his experience"</p>
            <p className="output-line">- "What projects has he worked on?"</p>
            <p className="output-line">- "How can I contact him?"</p>
            <p className="output-line"></p>
            <p className="output-line">Usage: ai &lt;your question&gt;</p>
          </div>
        )
      }
      const response = processAIQuery(query)
      return <AIAgentResponse response={response} />
    },

    // NEW SYSTEM COMMANDS
    uname: () => (
      <div className="command-output">
        <p className="output-line">System: Portfolio Terminal</p>
        <p className="output-line">OS: Modern Web (React + TypeScript)</p>
        <p className="output-line">Kernel: Vite 4.5.14</p>
        <p className="output-line">Platform: Web Browser</p>
      </div>
    ),

    uptime: () => {
      const now = new Date()
      const daysSinceBirth = Math.floor((now.getTime() - new Date(2020, 0, 1).getTime()) / (1000 * 60 * 60 * 24))
      return (
        <div className="command-output">
          <p className="output-line">Portfolio uptime: {daysSinceBirth}+ days</p>
          <p className="output-line">Current time: {now.toLocaleString()}</p>
          <p className="output-line">Status: Online and accepting connections 🟢</p>
        </div>
      )
    },

    man: () => (
      <div className="command-output">
        <p className="output-line"><strong>Available Commands Manual:</strong></p>
        <p className="output-line"></p>
        <p className="output-line"><strong>Navigation:</strong> about, contact, projects, skills, experience</p>
        <p className="output-line"><strong>Files:</strong> cat [file], ls [-la/-l], pwd</p>
        <p className="output-line"><strong>Search:</strong> grep [term], history [--search/--clear/--count]</p>
        <p className="output-line"><strong>System:</strong> uname, uptime, date, whoami, neofetch</p>
        <p className="output-line"><strong>Tools:</strong> ssh [url], play [pong/dino], weather, ping</p>
        <p className="output-line"><strong>Advanced:</strong> alias, export, set, which [cmd]</p>
        <p className="output-line"></p>
        <p className="output-line">Use: man [command] for more details</p>
      </div>
    ),

    which: () => (
      <div className="command-output">
        <p className="output-line">/portfolio/bin/terminal</p>
        <p className="output-line">All commands are built-in to this terminal interface</p>
      </div>
    ),

    alias: () => (
      <div className="command-output">
        <p className="output-line"><strong>Terminal Aliases:</strong></p>
        <p className="output-line">ls → list directory contents</p>
        <p className="output-line">exp → show experience</p>
        <p className="output-line">edu → show education</p>
        <p className="output-line">tech → show technologies</p>
        <p className="output-line">info → show system information</p>
      </div>
    ),

    export: () => (
      <div className="command-output">
        <p className="output-line"><strong>Environment Variables:</strong></p>
        <p className="output-line">USER=rishab-banthiya</p>
        <p className="output-line">HOME=/portfolio</p>
        <p className="output-line">SHELL=/bin/terminal</p>
        <p className="output-line">ROLE=Full Stack Developer</p>
        <p className="output-line">STATUS=Open to opportunities</p>
      </div>
    ),

    set: () => (
      <div className="command-output">
        <p className="output-line"><strong>Terminal Settings:</strong></p>
        <p className="output-line">theme=dark</p>
        <p className="output-line">language=JavaScript/TypeScript</p>
        <p className="output-line">font=monospace</p>
        <p className="output-line">animations=enabled</p>
        <p className="output-line">autocomplete=enabled</p>
      </div>
    ),

    journalctl: () => <JournalCtlDisplay />,

    skills: () => (
      <div className="command-output">
        <p className="output-line"><strong>Technical Skills:</strong></p>
        <p className="output-line"></p>
        <p className="output-line"><strong>Languages:</strong> JavaScript, TypeScript, Python, Java</p>
        <p className="output-line"><strong>Frontend:</strong> React, Next.js, HTML/CSS, Bootstrap, Tailwind</p>
        <p className="output-line"><strong>Backend:</strong> Node.js, Express, Django, GraphQL, REST APIs</p>
        <p className="output-line"><strong>Databases:</strong> PostgreSQL, MongoDB, Redis, Supabase</p>
        <p className="output-line"><strong>Cloud:</strong> AWS, Docker, Kubernetes, Vercel, Netlify</p>
        <p className="output-line"><strong>Tools:</strong> Git, CI/CD, Agile, VS Code, Figma</p>
        <p className="output-line"></p>
        <p className="output-line">Learning: Rust, Web3, AI/ML, Blockchain</p>
      </div>
    ),

    experience: () => (
      <div className="command-output">
        <p className="output-line"><strong>Professional Experience:</strong></p>
        <p className="output-line"></p>
        <p className="output-line"><strong>[2023-Present]</strong> Full Stack Developer</p>
        <p className="output-line">  • Building scalable web applications</p>
        <p className="output-line">  • Working with modern tech stack</p>
        <p className="output-line">  • Leading development initiatives</p>
        <p className="output-line"></p>
        <p className="output-line"><strong>[2022-2023]</strong> Software Engineer</p>
        <p className="output-line">  • Developed features for production applications</p>
        <p className="output-line">  • Collaborated with cross-functional teams</p>
        <p className="output-line">  • Implemented CI/CD pipelines</p>
        <p className="output-line"></p>
        <p className="output-line"><strong>[2020-2022]</strong> Student & Learning</p>
        <p className="output-line">  • Computer Science fundamentals</p>
        <p className="output-line">  • Building projects and open source contributions</p>
      </div>
    ),

    education: () => (
      <div className="command-output">
        <p className="output-line"><strong>Education:</strong></p>
        <p className="output-line"></p>
        <p className="output-line">Computer Science Studies (2020-2022)</p>
        <p className="output-line">Focus on full-stack web development</p>
        <p className="output-line"></p>
        <p className="output-line"><strong>Self-Learning Achievements:</strong></p>
        <p className="output-line">✓ Modern web technologies (React, TypeScript)</p>
        <p className="output-line">✓ Backend development (Node.js, databases)</p>
        <p className="output-line">✓ Cloud platforms (AWS, Docker)</p>
        <p className="output-line">✓ DevOps & CI/CD practices</p>
      </div>
    ),

    timeline: () => (
      <div className="command-output">
        <p className="output-line"><strong>Career Timeline:</strong></p>
        <p className="output-line"></p>
        <p className="output-line">2020 ──► Started learning computer science</p>
        <p className="output-line">2021 ──► First coding projects, open source contributions</p>
        <p className="output-line">2022 ──► Internship & freelance work</p>
        <p className="output-line">2023 ──► Full Stack Developer role</p>
        <p className="output-line">2024 ──► Advanced projects & leadership</p>
        <p className="output-line">2025 ──► Open to new opportunities 🚀</p>
      </div>
    ),
  }

  // Get all available commands for autocomplete
  const availableCommands = [
    ...Object.keys(commands),
    'play',
    'ssh',
    'cat',
    'history',
    'weather',
    'cd',
    'grep',
    'neofetch',
    'ping',
    'echo',
    'ai',
    'uname',
    'uptime',
    'man',
    'which',
    'alias',
    'export',
    'set',
    'skills',
    'experience',
    'education',
    'timeline',
  ]

  // Available files for cat command
  const availableFiles = ['about.txt', 'skills.json', 'contact.txt', 'experience.log']

  // Available directories for cd command
  const availableDirectories = ['~', 'about', 'projects', 'contact', 'skills', '..']

  // Autocomplete function
  const getAutocomplete = (input: string): string => {
    if (!input) return ''

    const parts = input.toLowerCase().split(' ')
    const baseCommand = parts[0]
    
    // Autocomplete command
    if (parts.length === 1) {
      const matches = availableCommands.filter(cmd => 
        cmd.toLowerCase().startsWith(baseCommand)
      )
      if (matches.length === 1 && matches[0].toLowerCase() !== baseCommand) {
        return matches[0]
      }
    }
    
    // Autocomplete file for cat command
    if (parts.length === 2 && baseCommand === 'cat') {
      const partial = parts[1]
      const matches = availableFiles.filter(file => 
        file.toLowerCase().startsWith(partial)
      )
      if (matches.length === 1 && matches[0].toLowerCase() !== partial) {
        return `cat ${matches[0]}`
      }
    }
    
    // Autocomplete directory for cd command
    if (parts.length === 2 && baseCommand === 'cd') {
      const partial = parts[1]
      const matches = availableDirectories.filter(dir => 
        dir.toLowerCase().startsWith(partial)
      )
      if (matches.length === 1 && matches[0].toLowerCase() !== partial) {
        return `cd ${matches[0]}`
      }
    }

    // Autocomplete game for play command
    if (parts.length === 2 && baseCommand === 'play') {
      const partial = parts[1]
      const games = ['pong', 'dino', 'poker']
      const matches = games.filter(game => game.startsWith(partial))
      if (matches.length === 1 && matches[0] !== partial) {
        return `play ${matches[0]}`
      }
    }
    
    return ''
  }

  // Handle input change with autocomplete
  const handleInputChange = (value: string) => {
    // Check navigation status BEFORE modifying it
    const wasNavigating = isNavigatingHistory.current
    isNavigatingHistory.current = false
    
    setCurrentCommand(value)
    // Only reset history navigation when user is manually typing (not using arrow keys)
    if (!wasNavigating) {
      setHistoryIndex(-1)
      setHistoryPreview('')
    }
    const autocompletion = getAutocomplete(value)
    setSuggestion(autocompletion)
  }

  // Handle Tab key for autocomplete and arrow keys for history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent arrow keys from moving cursor and handle history navigation
    if (e.key === 'ArrowUp' || e.key === 'Up') {
      e.preventDefault()
      if (commandHistory.length === 0) return
      
      const newIndex = historyIndex === -1 
        ? commandHistory.length - 1 
        : Math.max(0, historyIndex - 1)
      
      isNavigatingHistory.current = true
      setHistoryIndex(newIndex)
      setHistoryPreview(commandHistory[newIndex])
      setSuggestion('')
      return
    }
    
    if (e.key === 'ArrowDown' || e.key === 'Down') {
      e.preventDefault()
      if (historyIndex === -1) return
      
      const newIndex = historyIndex + 1
      
      isNavigatingHistory.current = true
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1)
        setHistoryPreview('')
      } else {
        setHistoryIndex(newIndex)
        setHistoryPreview(commandHistory[newIndex])
      }
      setSuggestion('')
      return
    }
    
    if (e.key === 'Tab') {
      e.preventDefault()
      // Accept history preview first, then autocomplete suggestion
      if (historyPreview) {
        setCurrentCommand(historyPreview)
        setHistoryPreview('')
        setHistoryIndex(-1)
      } else if (suggestion) {
        setCurrentCommand(suggestion)
        setSuggestion('')
      }
    } else if (e.key === 'ArrowRight' || e.key === 'Right') {
      // Accept history preview with right arrow
      if (historyPreview && currentCommand === '') {
        e.preventDefault()
        setCurrentCommand(historyPreview)
        setHistoryPreview('')
        setHistoryIndex(-1)
      }
    }
  }

  // Helper function for cat command
  const handleCatCommand = (filename: string): React.ReactNode => {
    const files: Record<string, React.ReactNode> = {
      'about.txt': (
        <div className="command-output">
          <pre>{`Name: Rishab Banthiya
Role: Full Stack Developer
Location: United States
Interests: Technology, Innovation, Problem Solving

I'm passionate about building innovative solutions and exploring
new technologies. I enjoy working on challenging projects that
make a real impact.

Skills:
- Frontend: React, TypeScript, JavaScript
- Backend: Node.js, Express, Python
- Database: PostgreSQL, MongoDB, Redis
- Cloud: AWS, Docker, Kubernetes
- Tools: Git, CI/CD, Agile

Currently open to exciting opportunities!`}</pre>
        </div>
      ),
      'skills.json': (
        <div className="command-output">
          <pre>{JSON.stringify({
            "languages": ["JavaScript", "TypeScript", "Python", "Java"],
            "frontend": ["React", "Next.js", "HTML/CSS", "Bootstrap"],
            "backend": ["Node.js", "Express", "Django", "GraphQL"],
            "databases": ["PostgreSQL", "MongoDB", "Redis", "Supabase"],
            "tools": ["Git", "Docker", "AWS", "Vercel"],
            "currently_learning": ["Rust", "Web3", "AI/ML"]
          }, null, 2)}</pre>
        </div>
      ),
      'contact.txt': (
        <div className="command-output">
          <pre>{`Contact Information
==================

Email: banthiya.rishab1511@gmail.com
LinkedIn: linkedin.com/in/rishrub
GitHub: github.com/rishabSBanthiya

Feel free to reach out for:
- Job opportunities
- Collaborations
- Open source projects
- Tech discussions`}</pre>
        </div>
      ),
      'experience.log': (
        <div className="command-output">
          <pre>{`Work Experience
===============

[2023-Present] Full Stack Developer
- Building scalable web applications
- Working with modern tech stack
- Leading development initiatives

[2022-2023] Software Engineer
- Developed features for production applications
- Collaborated with cross-functional teams
- Implemented CI/CD pipelines

[2020-2022] Student & Learning
- Computer Science fundamentals
- Building projects
- Contributing to open source`}</pre>
        </div>
      ),
    }

    if (!filename) {
      return (
        <div className="command-output">
          <p className="output-line error">Usage: cat &lt;file&gt;</p>
          <p className="output-line">Available files: about.txt, skills.json, contact.txt, experience.log</p>
        </div>
      )
    }

    if (files[filename]) {
      return files[filename]
    }

    return (
      <div className="command-output">
        <p className="output-line error">cat: {filename}: No such file or directory</p>
        <p className="output-line">Available files: about.txt, skills.json, contact.txt, experience.log</p>
      </div>
    )
  }

  // Helper function for weather command
  const handleWeatherCommand = (): React.ReactNode => {
    return <WeatherDisplay />
  }

  // Helper function for cd command
  const handleCdCommand = (targetDir: string): React.ReactNode => {
    const validDirs = ['~', 'about', 'projects', 'contact', 'skills', '..']
    
    if (targetDir === '..' || targetDir === '~') {
      setCurrentDirectory('~')
      return (
        <div className="command-output">
          <p className="output-line success">Changed directory to ~</p>
        </div>
      )
    }

    if (validDirs.includes(targetDir)) {
      setCurrentDirectory(targetDir)
      return (
        <div className="command-output">
          <p className="output-line success">Changed directory to {targetDir}</p>
          <p className="output-line">Type 'ls' to see contents</p>
        </div>
      )
    }

    return (
      <div className="command-output">
        <p className="output-line error">cd: {targetDir}: No such directory</p>
        <p className="output-line">Available directories: about, projects, contact, skills</p>
      </div>
    )
  }

  // Helper function for grep command
  const handleGrepCommand = (searchTerm: string): React.ReactNode => {
    if (!searchTerm) {
      return (
        <div className="command-output">
          <p className="output-line error">Usage: grep &lt;search term&gt;</p>
          <p className="output-line">Example: grep react</p>
        </div>
      )
    }

    const searchableContent: Record<string, string[]> = {
      skills: ['React', 'TypeScript', 'JavaScript', 'Python', 'Node.js', 'Docker', 'AWS', 'GraphQL'],
      about: ['Full Stack Developer', 'Technology', 'Innovation', 'Problem Solving'],
      contact: ['Email: banthiya.rishab1511@gmail.com', 'LinkedIn', 'GitHub'],
      projects: ['Web Applications', 'Full Stack', 'API Development', 'UI/UX Design'],
    }

    const results: string[] = []
    const lowerSearch = searchTerm.toLowerCase()

    Object.entries(searchableContent).forEach(([category, items]) => {
      items.forEach(item => {
        if (item.toLowerCase().includes(lowerSearch)) {
          results.push(`${category}: ${item}`)
        }
      })
    })

    if (results.length === 0) {
      return (
        <div className="command-output">
          <p className="output-line">No matches found for "{searchTerm}"</p>
        </div>
      )
    }

    return (
      <div className="command-output">
        <p className="output-line success">Found {results.length} match(es):</p>
        {results.map((result, idx) => (
          <p key={idx} className="output-line">{result}</p>
        ))}
      </div>
    )
  }

  // Helper function for pipe operator
  const handlePipeCommand = (fullCommand: string): React.ReactNode => {
    const commands = fullCommand.split(' | ').map(cmd => cmd.trim())
    
    if (commands.length < 2) {
      return (
        <div className="command-output">
          <p className="output-line error">Invalid pipe usage</p>
        </div>
      )
    }

    // For now, support simple pipes like "history | grep term"
    const firstCmd = commands[0].toLowerCase()
    const secondCmd = commands[1].toLowerCase()

    if (firstCmd === 'history' && secondCmd.startsWith('grep ')) {
      const searchTerm = secondCmd.substring(5).toLowerCase()
      const filtered = commandHistory.filter(cmd => 
        cmd.toLowerCase().includes(searchTerm)
      )

      return (
        <div className="command-output">
          {filtered.length === 0 ? (
            <p className="output-line">No matches found</p>
          ) : (
            filtered.map((cmd, idx) => (
              <p key={idx} className="output-line">{cmd}</p>
            ))
          )}
        </div>
      )
    }

    return (
      <div className="command-output">
        <p className="output-line">Pipe combination not yet supported</p>
        <p className="output-line">Try: history | grep &lt;term&gt;</p>
      </div>
    )
  }

  const welcomeMessage = () => (
    <div className="welcome-message">
      <pre className="terminal-banner">
{`
██████╗ ██╗███████╗██╗  ██╗██████╗ ██╗   ██╗██████╗ ███████╗
██╔══██╗██║██╔════╝██║  ██║██╔══██╗██║   ██║██╔══██╗██╔════╝
██████╔╝██║███████╗███████║██████╔╝██║   ██║██████╔╝███████╗
██╔══██╗██║╚════██║██╔══██║██╔══██╗██║   ██║██╔══██╗╚════██║
██║  ██║██║███████║██║  ██║██║  ██║╚██████╔╝██████╔╝███████║
╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
`}
      </pre>
      <p className="output-line">Welcome to Rishab's portfolio! Type 'help' to get started.</p>
      <p className="output-line">Try shrub's bot: type 'ai' followed by any question about Rishab!</p>
      <p className="output-line"></p>
    </div>
  )

  useEffect(() => {
    setHistory([{ command: '', output: welcomeMessage() }])
    
    // Global arrow key listener for debugging
    const globalKeyHandler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        // setDebugInfo(prev => [...prev.slice(-4), `🌍 Global key detected: ${e.key} (target: ${(e.target as HTMLElement)?.tagName})`])
      }
    }
    
    document.addEventListener('keydown', globalKeyHandler)
    return () => document.removeEventListener('keydown', globalKeyHandler)
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (headerRef.current && headerRef.current.contains(e.target as Node)) {
      setIsDragging(true)
      // Calculate offset from click position to current terminal position
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedCommand = currentCommand.trim()

    if (!trimmedCommand) {
      setCurrentCommand('')
      return
    }

    // Add to command history and reset history index
    setCommandHistory(prev => {
      const newHistory = [...prev, trimmedCommand]
      return newHistory
    })
    setHistoryIndex(-1)
    setHistoryPreview('')

    if (trimmedCommand.toLowerCase() === 'clear') {
      setHistory([])
      setCurrentCommand('')
      return
    }

    // Handle pipe operator
    if (trimmedCommand.includes(' | ')) {
      const pipeOutput = handlePipeCommand(trimmedCommand)
      setHistory([...history, { command: currentCommand, output: pipeOutput }])
      setCurrentCommand('')
      return
    }

    let output: React.ReactNode
    const commandParts = trimmedCommand.toLowerCase().split(' ')
    const baseCommand = commandParts[0]

    // Handle "play [game]" command
    if (baseCommand === 'play') {
      const game = commandParts[1]
      if (game === 'pong') {
        setActiveGame('pong')
        output = (
          <div className="command-output">
            <p className="output-line success">Loading Pong...</p>
          </div>
        )
      } else if (game === 'dino') {
        setActiveGame('dino')
        output = (
          <div className="command-output">
            <p className="output-line success">Loading Dino Game...</p>
          </div>
        )
      } else if (game === 'poker') {
        setActiveGame('poker')
        output = (
          <div className="command-output">
            <p className="output-line success">🃏 Loading Terminal Poker Room...</p>
            <p className="output-line">Starting WebSocket connection...</p>
          </div>
        )
      } else if (game === 'bspoker') {
        setActiveGame('bspoker')
        output = (
          <div className="command-output">
            <p className="output-line success">🎴 Loading BS Poker (Liar's Poker)...</p>
            <p className="output-line">Starting WebSocket connection...</p>
          </div>
        )
      } else {
        output = (
          <div className="command-output">
            <p className="output-line error">Unknown game: {game || 'none'}</p>
            <p className="output-line">Available games: pong, dino, poker, bspoker</p>
          </div>
        )
      }
    } else if (baseCommand === 'ssh') {
      const url = commandParts.slice(1).join(' ')
      if (url) {
        // Add protocol if not present
        let fullUrl = url
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          fullUrl = 'https://' + url
        }
        try {
          window.open(fullUrl, '_blank', 'noopener,noreferrer')
          output = (
            <div className="command-output">
              <p className="output-line success">Opening {url}...</p>
            </div>
          )
        } catch (error) {
          output = (
            <div className="command-output">
              <p className="output-line error">Failed to open URL</p>
            </div>
          )
        }
      } else {
        output = (
          <div className="command-output">
            <p className="output-line error">Usage: ssh &lt;url&gt;</p>
            <p className="output-line">Example: ssh google.com</p>
          </div>
        )
      }
    } else if (baseCommand === 'cat') {
      const filename = commandParts[1]
      output = handleCatCommand(filename)
    } else if (baseCommand === 'history') {
      const { flags, params } = parseCommand(trimmedCommand)
      
      if (flags.includes('--clear') || flags.includes('-c')) {
        setCommandHistory([])
        output = (
          <div className="command-output">
            <p className="output-line success">Command history cleared</p>
          </div>
        )
      } else if (flags.includes('--count')) {
        output = (
          <div className="command-output">
            <p className="output-line">Total commands: {commandHistory.length}</p>
          </div>
        )
      } else if (flags.includes('--search') || flags.includes('-s')) {
        const searchTerm = params[0]?.toLowerCase() || ''
        const filtered = commandHistory.filter(cmd => cmd.toLowerCase().includes(searchTerm))
        output = (
          <div className="command-output">
            {filtered.length === 0 ? (
              <p className="output-line">No commands found matching "{searchTerm}"</p>
            ) : (
              <>
                <p className="output-line">Found {filtered.length} command(s):</p>
                {filtered.map((cmd, idx) => (
                  <p key={idx} className="output-line">{cmd}</p>
                ))}
              </>
            )}
          </div>
        )
      } else {
        output = (
          <div className="command-output">
            {commandHistory.length === 0 ? (
              <p className="output-line">No command history yet.</p>
            ) : (
              commandHistory.map((cmd, idx) => (
                <p key={idx} className="output-line">
                  {idx + 1}  {cmd}
                </p>
              ))
            )}
          </div>
        )
      }
    } else if (baseCommand === 'weather') {
      output = handleWeatherCommand()
    } else if (baseCommand === 'cd') {
      const targetDir = commandParts[1] || '~'
      output = handleCdCommand(targetDir)
    } else if (baseCommand === 'grep') {
      const searchTerm = commandParts.slice(1).join(' ')
      output = handleGrepCommand(searchTerm)
    } else if (commands[baseCommand]) {
      output = commands[baseCommand]()
    } else if (trimmedCommand.toLowerCase().startsWith('echo ')) {
      output = (
        <div className="command-output">
          <p className="output-line">{currentCommand.substring(5)}</p>
        </div>
      )
    } else {
      output = (
        <div className="command-output">
          <p className="output-line error">Command not found: {trimmedCommand}</p>
          <p className="output-line">Type 'help' for available commands.</p>
        </div>
      )
    }

    setHistory([...history, { command: currentCommand, output }])
    setCurrentCommand('')
  }

  const handleTerminalClick = () => {
    inputRef.current?.focus()
  }

  return (
    <>
    <div 
      className={`terminal-wrapper ${isDragging ? 'dragging' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="terminal-header" ref={headerRef}>
        <div className="terminal-buttons">
          <span className="terminal-button close"></span>
          <span className="terminal-button minimize"></span>
          <span className="terminal-button maximize"></span>
        </div>
        <div className="terminal-title">visitor@rishab:{currentDirectory}</div>
      </div>
      <div className="terminal-container" onClick={handleTerminalClick}>
        <div className="terminal-body" ref={terminalRef}>
          {history.map((item, index) => (
            <div key={index}>
              {item.command && (
                <div className="terminal-input-line">
                  <span className="terminal-prompt">visitor@rishab:{currentDirectory}$</span>
                  <span className="terminal-command">{item.command}</span>
                </div>
              )}
              {item.output}
            </div>
          ))}
          <form onSubmit={handleSubmit} className="terminal-input-form">
            <div className="terminal-input-line">
              <label htmlFor="terminal-input" className="terminal-prompt">
                visitor@rishab:{currentDirectory}$
              </label>
              <div className="terminal-input-wrapper">
                <input
                  id="terminal-input"
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="terminal-input"
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
                {historyPreview && !currentCommand && (
                  <span className="terminal-suggestion">
                    <span className="suggestion-text">{historyPreview}</span>
                  </span>
                )}
                {historyPreview && currentCommand && historyPreview.startsWith(currentCommand) && (
                  <span className="terminal-suggestion">
                    {currentCommand}
                    <span className="suggestion-text">
                      {historyPreview.substring(currentCommand.length)}
                    </span>
                  </span>
                )}
                {!historyPreview && suggestion && currentCommand && (
                  <span className="terminal-suggestion">
                    {currentCommand}
                    <span className="suggestion-text">
                      {suggestion.substring(currentCommand.length)}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    {activeGame === 'poker' && <PokerGame onClose={() => setActiveGame(null)} />}
    {activeGame === 'bspoker' && <BSPokerGame onClose={() => setActiveGame(null)} />}
    {activeGame === 'pong' && <PongGame onClose={() => setActiveGame(null)} />}
    {activeGame === 'dino' && <DinoGame onClose={() => setActiveGame(null)} />}
    </>
  )
}

export default Terminal


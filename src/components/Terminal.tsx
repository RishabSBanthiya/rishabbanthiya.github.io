import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { WeatherDisplay } from './terminal/WeatherDisplay'

interface CommandHistory {
  command: string
  output: React.ReactNode
}

interface Position {
  x: number
  y: number
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
  const { theme, setTheme } = useTheme()

  const [isLoading, setIsLoading] = useState(true)
  const [history, setHistory] = useState<CommandHistory[]>([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [currentDirectory, setCurrentDirectory] = useState('~')
  const [suggestion, setSuggestion] = useState('')
  const [historyPreview, setHistoryPreview] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isNavigatingHistory = useRef<boolean>(false)

  // ASCII Loading Animation Component
  const LoadingAnimation: React.FC = () => {
    const [frame, setFrame] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setFrame(prev => (prev + 1) % 4)
      }, 200)
      return () => clearInterval(interval)
    }, [])

    const frames = [
      '⠋ Loading portfolio...',
      '⠙ Loading portfolio...',
      '⠹ Loading portfolio...',
      '⠸ Loading portfolio...'
    ]

    return (
      <div className="loading-container">
        <div className="loading-content">
          <pre className="loading-ascii">
{`
██████╗ ██╗███████╗██╗  ██╗██████╗ ██╗   ██╗██████╗ ███████╗
██╔══██╗██║██╔════╝██║  ██║██╔══██╗██║   ██║██╔══██╗██╔════╝
██████╔╝██║███████╗███████║██████╔╝██║   ██║██████╔╝███████╗
██╔══██╗██║╚════██║██╔══██║██╔══██╗██║   ██║██╔══██╗╚════██║
██║  ██║██║███████║██║  ██║██║  ██║╚██████╔╝██████╔╝███████║
╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
`}
          </pre>
          <div className="loading-spinner">
            {frames[frame]}
          </div>
          <div className="loading-text">
            <p>Initializing terminal interface...</p>
            <p>Loading interactive features...</p>
          </div>
        </div>
      </div>
    )
  }

  const commands: Record<string, (args?: string) => React.ReactNode> = {
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
              <span className="cmd-name">theme &lt;name&gt;</span>
              <span className="cmd-desc">Change theme (terminal, win95)</span>
            </div>
          </div>
        </div>
      </div>
    ),

    theme: (args?: string) => {
      const themeName = args?.trim().toLowerCase()

      if (!themeName) {
        return (
          <div className="command-output">
            <p className="output-line">Current theme: {theme}</p>
            <p className="output-line">Available themes: terminal, win95</p>
            <p className="output-line">Usage: theme &lt;name&gt;</p>
          </div>
        )
      }

      if (themeName === 'terminal' || themeName === 'win95') {
        setTheme(themeName as 'terminal' | 'win95')
        return (
          <div className="command-output">
            <p className="output-line success">Theme changed to: {themeName}</p>
          </div>
        )
      }

      return (
        <div className="command-output">
          <p className="output-line error">Unknown theme: {themeName}</p>
          <p className="output-line">Available themes: terminal, win95</p>
        </div>
      )
    },

    about: () => (
      <div className="command-output">
        <p className="output-line">Rishab Banthiya</p>
        <p className="output-line">Programming Analyst at Societe Generale, Chicago</p>
        <p className="output-line"></p>
        <p className="output-line">UIUC CS + Economics 2024 | GPA: 3.8/4.0</p>
        <p className="output-line">Data engineering, backend systems, and quantitative finance.</p>
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
        <p className="output-line"><strong>Projects:</strong></p>
        <p className="output-line"></p>
        <p className="output-line"><strong>Polymarket Analytics</strong></p>
        <p className="output-line">  Live multi-agent trading system for prediction markets</p>
        <p className="output-line">  Four concurrent strategies: bond arb, flow copy-trading, stat arb, sports</p>
        <p className="output-line">  Python, asyncio, WebSockets, SQLite, scikit-learn</p>
        <p className="output-line"></p>
        <p className="output-line"><strong>Sports Betting Portfolio Optimizer</strong></p>
        <p className="output-line">  Modeling Premier League outcomes as binary options</p>
        <p className="output-line">  Markowitz optimization and Kelly criterion</p>
        <p className="output-line">  Python, NumPy, scikit-learn</p>
        <p className="output-line"></p>
        <p className="output-line">Type 'github' to see more.</p>
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
 | O O |         Role: Programming Analyst @ Societe Generale
  \\___/          Education: UIUC CS + Econ (3.8 GPA)
                 Languages: Python, Java, SQL, JavaScript
                 Frameworks: Spark, Pandas, Airflow, Spring Boot
                 Cloud: Azure, HDInsight, PostgreSQL
                 Tools: Docker, Jenkins, Git
                 Location: Chicago, IL
`}</pre>
      </div>
    ),

    ping: () => {
      return (
        <div className="command-output">
          <p className="output-line success">64 bytes from rishab-banthiya.com: icmp_seq=1 ttl=64 time=0.420ms</p>
          <p className="output-line success">Ping successful.</p>
        </div>
      )
    },

    pwd: () => (
      <div className="command-output">
        <p className="output-line">/home/rishab/{currentDirectory}</p>
      </div>
    ),

    // System commands
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
      return (
        <div className="command-output">
          <p className="output-line">Current time: {now.toLocaleString()}</p>
          <p className="output-line">Status: Online</p>
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
        <p className="output-line"><strong>Tools:</strong> ssh [url], weather, ping</p>
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
        <p className="output-line">ROLE=Programming Analyst</p>
        <p className="output-line">COMPANY=Societe Generale</p>
        <p className="output-line">LOCATION=Chicago, IL</p>
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

    skills: () => (
      <div className="command-output">
        <p className="output-line"><strong>Technical Skills:</strong></p>
        <p className="output-line"></p>
        <p className="output-line"><strong>Languages:</strong> Python, Java, SQL, JavaScript</p>
        <p className="output-line"><strong>Frameworks:</strong> Apache Spark, Pandas, Airflow, NumPy, Spring Boot</p>
        <p className="output-line"><strong>Cloud & Data:</strong> Microsoft Azure, PostgreSQL, HDInsight</p>
        <p className="output-line"><strong>Tools:</strong> Docker, Jenkins, Git</p>
        <p className="output-line"></p>
        <p className="output-line"><strong>Spoken:</strong> English (native), Hindi (fluent)</p>
      </div>
    ),

    experience: () => (
      <div className="command-output">
        <p className="output-line"><strong>Professional Experience:</strong></p>
        <p className="output-line"></p>
        <p className="output-line"><strong>[Jul 2024-Present]</strong> Programming Analyst, Societe Generale</p>
        <p className="output-line">  Chicago, IL</p>
        <p className="output-line">  - Built report delivery engine on Spark/Azure HDInsight</p>
        <p className="output-line">  - Reduced query times from 45 min to under 5 min</p>
        <p className="output-line">  - Built Python/Pandas data comparison platform</p>
        <p className="output-line">  - Won 1st place AMER in company hackathon (RAG search tool)</p>
        <p className="output-line"></p>
        <p className="output-line"><strong>[Jun-Aug 2023]</strong> Technology Analyst Intern, Societe Generale</p>
        <p className="output-line">  Chicago, IL</p>
        <p className="output-line">  - Built full-stack SLR reporting app</p>
        <p className="output-line">  - PostgreSQL, Spring Boot, Highcharts dashboards</p>
        <p className="output-line"></p>
        <p className="output-line"><strong>[Oct 2022-May 2023]</strong> Quantitative Analyst Intern, Banach Technologies</p>
        <p className="output-line">  Remote</p>
        <p className="output-line">  - Developed deep Q-learning trading agent for crypto markets</p>
        <p className="output-line"></p>
        <p className="output-line"><strong>[Jun-Aug 2022]</strong> Software Engineering Intern, Pfizer</p>
        <p className="output-line">  Groton, CT</p>
        <p className="output-line">  - Built Apache Airflow pipelines for research team</p>
      </div>
    ),

    education: () => (
      <div className="command-output">
        <p className="output-line"><strong>Education:</strong></p>
        <p className="output-line"></p>
        <p className="output-line"><strong>University of Illinois at Urbana-Champaign</strong></p>
        <p className="output-line">B.S. Computer Science + Economics</p>
        <p className="output-line">Aug 2020 - May 2024</p>
        <p className="output-line">GPA: 3.8/4.0</p>
        <p className="output-line"></p>
        <p className="output-line"><strong>Teaching:</strong></p>
        <p className="output-line">Course Assistant for CS 126 & CS 222 (Jun 2022 - May 2023)</p>
        <p className="output-line">Mentored students via code reviews and lab sections</p>
      </div>
    ),

    timeline: () => (
      <div className="command-output">
        <p className="output-line"><strong>Timeline:</strong></p>
        <p className="output-line"></p>
        <p className="output-line">2020 ── Started at UIUC (CS + Economics)</p>
        <p className="output-line">2022 ── Pfizer SWE Intern, started as Course Assistant</p>
        <p className="output-line">2022 ── Banach Technologies Quant Intern</p>
        <p className="output-line">2023 ── Societe Generale Technology Analyst Intern</p>
        <p className="output-line">2024 ── Graduated UIUC, joined Societe Generale full-time</p>
      </div>
    ),
  }

  // Get all available commands for autocomplete
  const availableCommands = [
    ...Object.keys(commands),
    'ssh',
    'cat',
    'history',
    'weather',
    'cd',
    'grep',
    'neofetch',
    'ping',
    'echo',
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
Role: Programming Analyst at Societe Generale
Location: Chicago, IL

Education:
- University of Illinois at Urbana-Champaign
- B.S. Computer Science + Economics (2020-2024)
- GPA: 3.8/4.0

Focus areas: Data engineering, backend systems, quantitative finance`}</pre>
        </div>
      ),
      'skills.json': (
        <div className="command-output">
          <pre>{JSON.stringify({
            "languages": ["Python", "Java", "SQL", "JavaScript"],
            "frameworks": ["Apache Spark", "Pandas", "Airflow", "NumPy", "Spring Boot"],
            "tools": ["Docker", "Jenkins", "Git"],
            "cloud": ["Microsoft Azure", "HDInsight"],
            "databases": ["PostgreSQL"],
            "spoken": ["English (native)", "Hindi (fluent)"]
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
Phone: (217) 200-6074`}</pre>
        </div>
      ),
      'experience.log': (
        <div className="command-output">
          <pre>{`Work Experience
===============

[Jul 2024-Present] Programming Analyst, Societe Generale (Chicago)
- Report delivery engine on Spark/Azure HDInsight
- Python/Pandas data comparison platform
- ETL pipeline for SAP BusinessObjects migration
- 1st place AMER hackathon (RAG search tool)

[Jun-Aug 2023] Technology Analyst Intern, Societe Generale (Chicago)
- Full-stack SLR reporting app
- PostgreSQL, Spring Boot, Highcharts

[Oct 2022-May 2023] Quantitative Analyst Intern, Banach Technologies
- Deep Q-learning trading agent for crypto

[Jun-Aug 2022] Software Engineering Intern, Pfizer (Groton, CT)
- Apache Airflow pipelines for research team`}</pre>
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
      skills: ['Python', 'Java', 'SQL', 'JavaScript', 'Spark', 'Pandas', 'Airflow', 'Spring Boot', 'Azure', 'PostgreSQL'],
      about: ['Programming Analyst', 'Societe Generale', 'UIUC', 'Computer Science', 'Economics'],
      contact: ['Email: banthiya.rishab1511@gmail.com', 'LinkedIn', 'GitHub', 'Chicago'],
      projects: ['Polymarket', 'Trading', 'Sports Betting', 'Q-learning', 'ETL'],
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
    const pipeCommands = fullCommand.split(' | ').map(cmd => cmd.trim())

    if (pipeCommands.length < 2) {
      return (
        <div className="command-output">
          <p className="output-line error">Invalid pipe usage</p>
        </div>
      )
    }

    // For now, support simple pipes like "history | grep term"
    const firstCmd = pipeCommands[0].toLowerCase()
    const secondCmd = pipeCommands[1].toLowerCase()

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
      <p className="output-line"></p>
    </div>
  )

  // Handle initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Initialize terminal with welcome message
  useEffect(() => {
    if (!isLoading) {
      setHistory([{ command: '', output: welcomeMessage() }])
    }
  }, [isLoading])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (headerRef.current && headerRef.current.contains(e.target as Node)) {
      setIsDragging(true)
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

    if (baseCommand === 'ssh') {
      const url = commandParts.slice(1).join(' ')
      if (url) {
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
        } catch {
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
    } else if (baseCommand === 'theme') {
      const themeName = commandParts.slice(1).join(' ')
      output = commands.theme(themeName)
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

  // Show loading animation while loading
  if (isLoading) {
    return <LoadingAnimation />
  }

  return (
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
  )
}

export default Terminal

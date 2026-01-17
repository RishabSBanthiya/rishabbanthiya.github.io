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

interface FileSystemNode {
  type: 'file' | 'directory'
  content?: string
  children?: Record<string, FileSystemNode>
}

// Virtual filesystem structure
const fileSystem: Record<string, FileSystemNode> = {
  '/home/rishab': {
    type: 'directory',
    children: {
      'about.txt': {
        type: 'file',
        content: `Name: Rishab Banthiya
Role: Programming Analyst at Societe Generale
Location: Chicago, IL

Education:
- University of Illinois at Urbana-Champaign
- B.S. Computer Science + Economics (2020-2024)
- GPA: 3.8/4.0

Focus areas: Data engineering, backend systems, quantitative finance`
      },
      'resume.pdf': {
        type: 'file',
        content: '[Binary file - use "resume" command to open]'
      },
      'contact.txt': {
        type: 'file',
        content: `Contact Information
==================

Email: banthiya.rishab1511@gmail.com
LinkedIn: linkedin.com/in/rishrub
GitHub: github.com/rishabSBanthiya
Phone: (217) 200-6074`
      },
      'projects': {
        type: 'directory',
        children: {
          'polymarket.md': {
            type: 'file',
            content: `# Polymarket Analytics

Live multi-agent trading system for prediction markets.

## Architecture
- Four concurrent strategies running in parallel
- Bond arbitrage, flow copy-trading, statistical arbitrage, sports

## Tech Stack
- Python, asyncio, WebSockets
- SQLite for local state
- scikit-learn for ML models

## Status: Active Development`
          },
          'sports-betting.md': {
            type: 'file',
            content: `# Sports Betting Portfolio Optimizer

Modeling Premier League outcomes as binary options.

## Approach
- Markowitz portfolio optimization
- Kelly criterion for position sizing
- Historical odds analysis

## Tech Stack
- Python, NumPy, scikit-learn
- Pandas for data processing

## Results
- Backtested on 3 seasons of data`
          },
          'README.md': {
            type: 'file',
            content: `# Projects

This directory contains documentation for my main projects.

- polymarket.md - Multi-agent trading system
- sports-betting.md - Portfolio optimization for sports betting`
          }
        }
      },
      'experience': {
        type: 'directory',
        children: {
          'socgen.log': {
            type: 'file',
            content: `=== Societe Generale ===
Role: Programming Analyst
Location: Chicago, IL
Period: Jul 2024 - Present

[2024-07] Joined full-time after internship conversion
[2024-08] Built report delivery engine on Spark/Azure HDInsight
[2024-09] Reduced query times from 45 min to under 5 min
[2024-10] Developed Python/Pandas data comparison platform
[2024-11] Won 1st place AMER in company hackathon (RAG search tool)
[2024-12] ETL pipeline for SAP BusinessObjects migration`
          },
          'socgen-intern.log': {
            type: 'file',
            content: `=== Societe Generale (Internship) ===
Role: Technology Analyst Intern
Location: Chicago, IL
Period: Jun 2023 - Aug 2023

[2023-06] Started summer internship
[2023-07] Built full-stack SLR reporting application
[2023-08] Implemented PostgreSQL backend with Spring Boot
[2023-08] Created Highcharts dashboards for data visualization`
          },
          'banach.log': {
            type: 'file',
            content: `=== Banach Technologies ===
Role: Quantitative Analyst Intern
Location: Remote
Period: Oct 2022 - May 2023

[2022-10] Joined as quant intern
[2022-11] Research on reinforcement learning for trading
[2023-01] Developed deep Q-learning trading agent
[2023-03] Backtesting framework for crypto markets
[2023-05] Final presentation on agent performance`
          },
          'pfizer.log': {
            type: 'file',
            content: `=== Pfizer ===
Role: Software Engineering Intern
Location: Groton, CT
Period: Jun 2022 - Aug 2022

[2022-06] Started summer internship
[2022-07] Built Apache Airflow pipelines
[2022-08] Automated data workflows for research team`
          }
        }
      },
      'education': {
        type: 'directory',
        children: {
          'uiuc.txt': {
            type: 'file',
            content: `University of Illinois at Urbana-Champaign
==========================================

Degree: B.S. Computer Science + Economics
Period: Aug 2020 - May 2024
GPA: 3.8/4.0

Relevant Coursework:
- Data Structures & Algorithms
- Database Systems
- Machine Learning
- Econometrics
- Financial Economics

Teaching Experience:
- Course Assistant for CS 126 (Software Design Studio)
- Course Assistant for CS 222 (Software Design Lab)
- Period: Jun 2022 - May 2023
- Mentored students via code reviews and lab sections`
          },
          'certifications.txt': {
            type: 'file',
            content: `Certifications & Training
=========================

- Azure Fundamentals (AZ-900)
- Spark Performance Tuning (Internal)
- Agile/Scrum Methodology`
          }
        }
      },
      'skills': {
        type: 'directory',
        children: {
          'technical.json': {
            type: 'file',
            content: JSON.stringify({
              "languages": ["Python", "Java", "SQL", "JavaScript"],
              "frameworks": ["Apache Spark", "Pandas", "Airflow", "NumPy", "Spring Boot"],
              "tools": ["Docker", "Jenkins", "Git"],
              "cloud": ["Microsoft Azure", "HDInsight"],
              "databases": ["PostgreSQL"],
              "spoken": ["English (native)", "Hindi (fluent)"]
            }, null, 2)
          },
          'languages.txt': {
            type: 'file',
            content: `Programming Languages
====================

Python     ████████████████████ Expert
Java       ████████████████░░░░ Advanced
SQL        ████████████████████ Expert
JavaScript ████████████░░░░░░░░ Intermediate
TypeScript ████████████░░░░░░░░ Intermediate`
          }
        }
      }
    }
  }
}

// Helper function to resolve path
const resolvePath = (currentPath: string, targetPath: string): string => {
  if (targetPath.startsWith('/')) {
    return targetPath
  }

  if (targetPath === '~') {
    return '/home/rishab'
  }

  const parts = currentPath.split('/').filter(p => p)
  const targetParts = targetPath.split('/').filter(p => p)

  for (const part of targetParts) {
    if (part === '..') {
      if (parts.length > 2) { // Don't go above /home/rishab
        parts.pop()
      }
    } else if (part !== '.') {
      parts.push(part)
    }
  }

  return '/' + parts.join('/')
}

// Helper function to get node at path
const getNode = (path: string): FileSystemNode | null => {
  if (path === '/home/rishab') {
    return fileSystem['/home/rishab']
  }

  const relativePath = path.replace('/home/rishab/', '')
  const parts = relativePath.split('/')

  let current: FileSystemNode | null = fileSystem['/home/rishab']

  for (const part of parts) {
    if (!part) continue
    if (current?.type !== 'directory' || !current.children?.[part]) {
      return null
    }
    current = current.children[part]
  }

  return current
}

// Helper function to get display path (with ~ for home)
const getDisplayPath = (path: string): string => {
  return path.replace('/home/rishab', '~')
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
  const [currentPath, setCurrentPath] = useState('/home/rishab')
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
      '⠋ Loading...',
      '⠙ Loading...',
      '⠹ Loading...',
      '⠸ Loading...'
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

  // Handle ls command
  const handleLsCommand = (args: string[], flags: string[]): React.ReactNode => {
    const targetPath = args[0] ? resolvePath(currentPath, args[0]) : currentPath
    const node = getNode(targetPath)

    if (!node) {
      return (
        <div className="command-output">
          <p className="output-line error">ls: cannot access '{args[0]}': No such file or directory</p>
        </div>
      )
    }

    if (node.type === 'file') {
      return (
        <div className="command-output">
          <p className="output-line">{args[0]}</p>
        </div>
      )
    }

    const entries = Object.entries(node.children || {})
    const showDetails = flags.includes('-l') || flags.includes('-la') || flags.includes('-al')
    const showHidden = flags.includes('-a') || flags.includes('-la') || flags.includes('-al')

    if (showDetails) {
      return (
        <div className="command-output">
          <p className="output-line">total {entries.length}</p>
          {showHidden && (
            <>
              <p className="output-line">drwxr-xr-x  {entries.length + 2} rishab rishab 4096 Jan 13 12:00 .</p>
              <p className="output-line">drwxr-xr-x  3 rishab rishab 4096 Jan 13 12:00 ..</p>
            </>
          )}
          {entries.map(([name, entry]) => (
            <p key={name} className="output-line">
              {entry.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--'}  1 rishab rishab {entry.type === 'directory' ? '4096' : (entry.content?.length || 0).toString().padStart(4)} Jan 13 12:00 <span className={entry.type === 'directory' ? 'directory-name' : ''}>{name}{entry.type === 'directory' ? '/' : ''}</span>
            </p>
          ))}
        </div>
      )
    }

    // Simple listing
    const dirs = entries.filter(([, e]) => e.type === 'directory').map(([n]) => n + '/')
    const files = entries.filter(([, e]) => e.type === 'file').map(([n]) => n)

    return (
      <div className="command-output">
        <p className="output-line">
          {[...dirs.map(d => <span key={d} className="directory-name">{d}  </span>), ...files.join('  ')]}
        </p>
      </div>
    )
  }

  // Handle cd command
  const handleCdCommand = (targetDir: string): React.ReactNode => {
    if (!targetDir || targetDir === '~') {
      setCurrentPath('/home/rishab')
      return null
    }

    const newPath = resolvePath(currentPath, targetDir)
    const node = getNode(newPath)

    if (!node) {
      return (
        <div className="command-output">
          <p className="output-line error">cd: {targetDir}: No such file or directory</p>
        </div>
      )
    }

    if (node.type !== 'directory') {
      return (
        <div className="command-output">
          <p className="output-line error">cd: {targetDir}: Not a directory</p>
        </div>
      )
    }

    setCurrentPath(newPath)
    return null
  }

  // Handle cat command
  const handleCatCommand = (filename: string): React.ReactNode => {
    if (!filename) {
      return (
        <div className="command-output">
          <p className="output-line error">cat: missing operand</p>
          <p className="output-line">Usage: cat &lt;file&gt;</p>
        </div>
      )
    }

    const filePath = resolvePath(currentPath, filename)
    const node = getNode(filePath)

    if (!node) {
      return (
        <div className="command-output">
          <p className="output-line error">cat: {filename}: No such file or directory</p>
        </div>
      )
    }

    if (node.type === 'directory') {
      return (
        <div className="command-output">
          <p className="output-line error">cat: {filename}: Is a directory</p>
        </div>
      )
    }

    return (
      <div className="command-output">
        <pre>{node.content}</pre>
      </div>
    )
  }

  // Handle tree command
  const handleTreeCommand = (targetPath?: string): React.ReactNode => {
    const path = targetPath ? resolvePath(currentPath, targetPath) : currentPath
    const node = getNode(path)

    if (!node || node.type !== 'directory') {
      return (
        <div className="command-output">
          <p className="output-line error">tree: {targetPath || '.'}: Not a directory</p>
        </div>
      )
    }

    const buildTree = (n: FileSystemNode, prefix: string = ''): string[] => {
      if (n.type !== 'directory' || !n.children) return []

      const entries = Object.entries(n.children)
      const lines: string[] = []

      entries.forEach(([name, child], idx) => {
        const isLast = idx === entries.length - 1
        const connector = isLast ? '└── ' : '├── '
        const childPrefix = isLast ? '    ' : '│   '

        if (child.type === 'directory') {
          lines.push(`${prefix}${connector}${name}/`)
          lines.push(...buildTree(child, prefix + childPrefix))
        } else {
          lines.push(`${prefix}${connector}${name}`)
        }
      })

      return lines
    }

    const treeLines = buildTree(node)

    return (
      <div className="command-output">
        <p className="output-line">{getDisplayPath(path)}</p>
        {treeLines.map((line, idx) => (
          <p key={idx} className="output-line" style={{ fontFamily: 'monospace' }}>{line}</p>
        ))}
        <p className="output-line"></p>
        <p className="output-line">{Object.values(node.children || {}).filter(c => c.type === 'directory').length} directories, {Object.values(node.children || {}).filter(c => c.type === 'file').length} files</p>
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
              <span className="cmd-name">ls [path]</span>
              <span className="cmd-desc">List directory contents (-l for details, -a for hidden)</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">cd &lt;dir&gt;</span>
              <span className="cmd-desc">Change directory (supports .., ~, relative/absolute paths)</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">cat &lt;file&gt;</span>
              <span className="cmd-desc">Display file contents</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">pwd</span>
              <span className="cmd-desc">Print working directory</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">tree [path]</span>
              <span className="cmd-desc">Display directory tree</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">resume</span>
              <span className="cmd-desc">View/download my resume</span>
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
              <span className="cmd-name">neofetch</span>
              <span className="cmd-desc">Display system information</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">weather</span>
              <span className="cmd-desc">Get current weather</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">grep &lt;term&gt;</span>
              <span className="cmd-desc">Search through content</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">history</span>
              <span className="cmd-desc">Show command history</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">theme &lt;name&gt;</span>
              <span className="cmd-desc">Change theme (terminal, win95)</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">clear</span>
              <span className="cmd-desc">Clear the terminal</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">help</span>
              <span className="cmd-desc">Show this help message</span>
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

    resume: () => {
      window.open('/rishab-banthiya-resume.pdf', '_blank')
      return (
        <div className="command-output">
          <p className="output-line success">Opening resume...</p>
        </div>
      )
    },

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

    clear: () => null,

    whoami: () => (
      <div className="command-output">
        <p className="output-line">rishab</p>
      </div>
    ),

    date: () => (
      <div className="command-output">
        <p className="output-line">{new Date().toString()}</p>
      </div>
    ),

    neofetch: () => (
      <div className="command-output">
        <pre className="neofetch-output">{`
   ___           rishab@local
  /   \\          ──────────────────────────
 | O O |         OS: Terminal v1.0
  \\___/          Host: rishab-banthiya.com
                 Uptime: since 2024
                 Shell: /bin/terminal

                 Role: Programming Analyst @ Societe Generale
                 Education: UIUC CS + Econ (3.8 GPA)
                 Languages: Python, Java, SQL, JavaScript
                 Frameworks: Spark, Pandas, Airflow, Spring Boot
                 Cloud: Azure, HDInsight, PostgreSQL
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
        <p className="output-line">{currentPath}</p>
      </div>
    ),

    uname: () => (
      <div className="command-output">
        <p className="output-line">Terminal 1.0.0 (React/TypeScript)</p>
      </div>
    ),

    uptime: () => {
      const now = new Date()
      return (
        <div className="command-output">
          <p className="output-line">{now.toLocaleTimeString()} up since 2024, 1 user, load average: 0.00, 0.01, 0.05</p>
        </div>
      )
    },

    hostname: () => (
      <div className="command-output">
        <p className="output-line">rishab-banthiya.com</p>
      </div>
    ),
  }

  // Get autocomplete suggestions
  const getAutocomplete = (input: string): string => {
    if (!input) return ''

    const parts = input.split(' ')
    const baseCommand = parts[0].toLowerCase()

    // Autocomplete command
    if (parts.length === 1) {
      const availableCommands = [...Object.keys(commands), 'ls', 'cd', 'cat', 'tree', 'grep', 'history', 'weather', 'echo', 'ssh']
      const matches = availableCommands.filter(cmd =>
        cmd.toLowerCase().startsWith(baseCommand)
      )
      if (matches.length === 1 && matches[0].toLowerCase() !== baseCommand) {
        return matches[0]
      }
    }

    // Autocomplete file/directory for ls, cd, cat, tree
    if (parts.length === 2 && ['ls', 'cd', 'cat', 'tree'].includes(baseCommand)) {
      const partial = parts[1]
      const partialPath = partial.includes('/') ? partial.substring(0, partial.lastIndexOf('/') + 1) : ''
      const partialName = partial.includes('/') ? partial.substring(partial.lastIndexOf('/') + 1) : partial

      const searchPath = resolvePath(currentPath, partialPath || '.')
      const node = getNode(searchPath)

      if (node?.type === 'directory' && node.children) {
        const matches = Object.entries(node.children)
          .filter(([name]) => name.toLowerCase().startsWith(partialName.toLowerCase()))
          .map(([name, child]) => name + (child.type === 'directory' ? '/' : ''))

        if (matches.length === 1) {
          return `${baseCommand} ${partialPath}${matches[0]}`
        }
      }
    }

    return ''
  }

  // Handle input change with autocomplete
  const handleInputChange = (value: string) => {
    const wasNavigating = isNavigatingHistory.current
    isNavigatingHistory.current = false

    setCurrentCommand(value)
    if (!wasNavigating) {
      setHistoryIndex(-1)
      setHistoryPreview('')
    }
    const autocompletion = getAutocomplete(value)
    setSuggestion(autocompletion)
  }

  // Handle Tab key for autocomplete and arrow keys for history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      if (historyPreview) {
        setCurrentCommand(historyPreview)
        setHistoryPreview('')
        setHistoryIndex(-1)
      } else if (suggestion) {
        setCurrentCommand(suggestion)
        setSuggestion('')
      }
    } else if (e.key === 'ArrowRight' || e.key === 'Right') {
      if (historyPreview && currentCommand === '') {
        e.preventDefault()
        setCurrentCommand(historyPreview)
        setHistoryPreview('')
        setHistoryIndex(-1)
      }
    }
  }

  // Helper function for weather command
  const handleWeatherCommand = (): React.ReactNode => {
    return <WeatherDisplay />
  }

  // Helper function for grep command
  const handleGrepCommand = (searchTerm: string): React.ReactNode => {
    if (!searchTerm) {
      return (
        <div className="command-output">
          <p className="output-line error">Usage: grep &lt;pattern&gt;</p>
        </div>
      )
    }

    const results: { file: string; line: string }[] = []
    const lowerSearch = searchTerm.toLowerCase()

    // Search through all files recursively
    const searchNode = (node: FileSystemNode, path: string) => {
      if (node.type === 'file' && node.content) {
        const lines = node.content.split('\n')
        lines.forEach(line => {
          if (line.toLowerCase().includes(lowerSearch)) {
            results.push({ file: path, line: line.trim() })
          }
        })
      } else if (node.type === 'directory' && node.children) {
        Object.entries(node.children).forEach(([name, child]) => {
          searchNode(child, `${path}/${name}`)
        })
      }
    }

    searchNode(getNode(currentPath)!, getDisplayPath(currentPath))

    if (results.length === 0) {
      return (
        <div className="command-output">
          <p className="output-line">No matches found for "{searchTerm}"</p>
        </div>
      )
    }

    return (
      <div className="command-output">
        {results.slice(0, 20).map((result, idx) => (
          <p key={idx} className="output-line">
            <span style={{ color: 'var(--accent-secondary)' }}>{result.file}</span>:{result.line}
          </p>
        ))}
        {results.length > 20 && (
          <p className="output-line">... and {results.length - 20} more matches</p>
        )}
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
      <p className="output-line">Welcome to Rishab's site! Type 'help' to get started.</p>
      <p className="output-line">Try: ls, cd projects, cat about.txt, tree</p>
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
    const { baseCommand, flags, params } = parseCommand(trimmedCommand)

    if (baseCommand === 'ls') {
      output = handleLsCommand(params, flags)
    } else if (baseCommand === 'cd') {
      output = handleCdCommand(params[0] || '~')
    } else if (baseCommand === 'cat') {
      output = handleCatCommand(params[0])
    } else if (baseCommand === 'tree') {
      output = handleTreeCommand(params[0])
    } else if (baseCommand === 'ssh') {
      const url = params.join(' ')
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
          </div>
        )
      }
    } else if (baseCommand === 'history') {
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
      } else {
        output = (
          <div className="command-output">
            {commandHistory.length === 0 ? (
              <p className="output-line">No command history yet.</p>
            ) : (
              commandHistory.map((cmd, idx) => (
                <p key={idx} className="output-line">
                  {(idx + 1).toString().padStart(4)}  {cmd}
                </p>
              ))
            )}
          </div>
        )
      }
    } else if (baseCommand === 'weather') {
      output = handleWeatherCommand()
    } else if (baseCommand === 'grep') {
      const searchTerm = params.join(' ')
      output = handleGrepCommand(searchTerm)
    } else if (baseCommand === 'theme') {
      const themeName = params.join(' ')
      output = commands.theme(themeName)
    } else if (baseCommand === 'echo') {
      output = (
        <div className="command-output">
          <p className="output-line">{trimmedCommand.substring(5)}</p>
        </div>
      )
    } else if (commands[baseCommand]) {
      output = commands[baseCommand]()
    } else {
      output = (
        <div className="command-output">
          <p className="output-line error">Command not found: {baseCommand}</p>
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

  const displayPath = getDisplayPath(currentPath)

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
        <div className="terminal-title">rishab@local:{displayPath}</div>
      </div>
      <div className="terminal-container" onClick={handleTerminalClick}>
        <div className="terminal-body" ref={terminalRef}>
          {history.map((item, index) => (
            <div key={index}>
              {item.command && (
                <div className="terminal-input-line">
                  <span className="terminal-prompt">rishab@local:{displayPath}$</span>
                  <span className="terminal-command">{item.command}</span>
                </div>
              )}
              {item.output}
            </div>
          ))}
          <form onSubmit={handleSubmit} className="terminal-input-form">
            <div className="terminal-input-line">
              <label htmlFor="terminal-input" className="terminal-prompt">
                rishab@local:{displayPath}$
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

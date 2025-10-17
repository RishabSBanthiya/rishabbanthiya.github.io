import React, { useState, useRef, useEffect } from 'react'

interface CommandHistory {
  command: string
  output: React.ReactNode
}

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<CommandHistory[]>([])
  const [currentCommand, setCurrentCommand] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

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
  }

  const welcomeMessage = () => (
    <div className="welcome-message">
      <p className="output-line">Welcome to Rishab's portfolio. Type 'help' to get started.</p>
      <p className="output-line"></p>
    </div>
  )

  useEffect(() => {
    setHistory([{ command: '', output: welcomeMessage() }])
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedCommand = currentCommand.trim().toLowerCase()

    if (!trimmedCommand) {
      setCurrentCommand('')
      return
    }

    if (trimmedCommand === 'clear') {
      setHistory([])
      setCurrentCommand('')
      return
    }

    let output: React.ReactNode
    const baseCommand = trimmedCommand.split(' ')[0]

    if (commands[baseCommand]) {
      output = commands[baseCommand]()
    } else if (trimmedCommand.startsWith('echo ')) {
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
    <div className="terminal-wrapper">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="terminal-button close"></span>
          <span className="terminal-button minimize"></span>
          <span className="terminal-button maximize"></span>
        </div>
        <div className="terminal-title">visitor@rishab:~</div>
      </div>
      <div className="terminal-container" onClick={handleTerminalClick}>
        <div className="terminal-body" ref={terminalRef}>
          {history.map((item, index) => (
            <div key={index}>
              {item.command && (
                <div className="terminal-input-line">
                  <span className="terminal-prompt">visitor@rishab:~$</span>
                  <span className="terminal-command">{item.command}</span>
                </div>
              )}
              {item.output}
            </div>
          ))}
          <form onSubmit={handleSubmit} className="terminal-input-form">
            <div className="terminal-input-line">
              <label htmlFor="terminal-input" className="terminal-prompt">
                visitor@rishab:~$
              </label>
              <input
                id="terminal-input"
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                className="terminal-input"
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Terminal


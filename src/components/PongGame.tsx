import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

interface PongGameProps {
  onClose: () => void
}

interface Position {
  x: number
  y: number
}

const PongGame: React.FC<PongGameProps> = ({ onClose }) => {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  const headerRef = useRef<HTMLDivElement>(null)
  
  const gameStateRef = useRef({
    paddle: { x: 0, y: 0, width: 10, height: 60, speed: 8 },
    ball: { x: 0, y: 0, dx: 3, dy: 3, radius: 6 },
    computer: { x: 0, y: 0, width: 10, height: 60, speed: 4 },
    keys: { up: false, down: false },
    animationId: 0,
    canvas: { width: 600, height: 400 }
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = gameStateRef.current
    
    // Initialize positions
    state.paddle.x = 20
    state.paddle.y = state.canvas.height / 2 - state.paddle.height / 2
    state.computer.x = state.canvas.width - 30
    state.computer.y = state.canvas.height / 2 - state.computer.height / 2
    state.ball.x = state.canvas.width / 2
    state.ball.y = state.canvas.height / 2

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        state.keys.up = true
        e.preventDefault()
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        state.keys.down = true
        e.preventDefault()
      }
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        state.keys.up = false
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        state.keys.down = false
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    // Game loop
    const gameLoop = () => {
      // Theme-aware colors
      const bgColor = theme === 'win95' ? '#008080' : '#1a1410'
      const lineColor = theme === 'win95' ? '#808080' : '#3d2f1f'
      const paddleColor = theme === 'win95' ? '#000080' : '#d4a574'
      const ballColor = theme === 'win95' ? '#ffffff' : '#d4a574'
      
      // Clear canvas
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, state.canvas.width, state.canvas.height)

      // Draw center line
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 2
      ctx.setLineDash([10, 10])
      ctx.beginPath()
      ctx.moveTo(state.canvas.width / 2, 0)
      ctx.lineTo(state.canvas.width / 2, state.canvas.height)
      ctx.stroke()
      ctx.setLineDash([])

      // Move player paddle
      if (state.keys.up && state.paddle.y > 0) {
        state.paddle.y -= state.paddle.speed
      }
      if (state.keys.down && state.paddle.y < state.canvas.height - state.paddle.height) {
        state.paddle.y += state.paddle.speed
      }

      // Computer AI
      const computerCenter = state.computer.y + state.computer.height / 2
      const ballY = state.ball.y
      
      if (computerCenter < ballY - 10) {
        state.computer.y += state.computer.speed
      } else if (computerCenter > ballY + 10) {
        state.computer.y -= state.computer.speed
      }

      // Keep computer paddle in bounds
      if (state.computer.y < 0) state.computer.y = 0
      if (state.computer.y > state.canvas.height - state.computer.height) {
        state.computer.y = state.canvas.height - state.computer.height
      }

      // Move ball
      state.ball.x += state.ball.dx
      state.ball.y += state.ball.dy

      // Ball collision with top/bottom
      if (state.ball.y - state.ball.radius <= 0 || 
          state.ball.y + state.ball.radius >= state.canvas.height) {
        state.ball.dy = -state.ball.dy
      }

      // Ball collision with player paddle
      if (
        state.ball.x - state.ball.radius <= state.paddle.x + state.paddle.width &&
        state.ball.y >= state.paddle.y &&
        state.ball.y <= state.paddle.y + state.paddle.height &&
        state.ball.dx < 0
      ) {
        state.ball.dx = -state.ball.dx * 1.05
        const hitPos = (state.ball.y - state.paddle.y) / state.paddle.height
        state.ball.dy = (hitPos - 0.5) * 8
        setScore(s => s + 1)
      }

      // Ball collision with computer paddle
      if (
        state.ball.x + state.ball.radius >= state.computer.x &&
        state.ball.y >= state.computer.y &&
        state.ball.y <= state.computer.y + state.computer.height &&
        state.ball.dx > 0
      ) {
        state.ball.dx = -state.ball.dx * 1.05
        const hitPos = (state.ball.y - state.computer.y) / state.computer.height
        state.ball.dy = (hitPos - 0.5) * 8
      }

      // Ball out of bounds (player loses)
      if (state.ball.x - state.ball.radius <= 0) {
        setGameOver(true)
        return
      }

      // Ball out of bounds (computer loses - reset)
      if (state.ball.x + state.ball.radius >= state.canvas.width) {
        state.ball.x = state.canvas.width / 2
        state.ball.y = state.canvas.height / 2
        state.ball.dx = -3
        state.ball.dy = 3
      }

      // Draw paddles
      ctx.fillStyle = paddleColor
      ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height)
      ctx.fillRect(state.computer.x, state.computer.y, state.computer.width, state.computer.height)

      // Draw ball
      ctx.fillStyle = ballColor
      ctx.beginPath()
      ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2)
      ctx.fill()

      // Continue game loop
      if (!gameOver) {
        state.animationId = requestAnimationFrame(gameLoop)
      }
    }

    gameLoop()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      if (state.animationId) {
        cancelAnimationFrame(state.animationId)
      }
    }
  }, [gameOver, onClose, theme])

  // Dragging functionality
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (headerRef.current && headerRef.current.contains(e.target as Node)) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
    }
  }

  return (
    <div className="pong-game-overlay">
      <div 
        className={`pong-game-container ${isDragging ? 'dragging' : ''}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="pong-game-header" ref={headerRef}>
          <div className="pong-terminal-buttons">
            <span className="pong-terminal-button close" onClick={onClose}></span>
            <span className="pong-terminal-button minimize"></span>
            <span className="pong-terminal-button maximize"></span>
          </div>
          <h2>pong@terminal:~$</h2>
        </div>
        <div className="pong-game-content">
          <div className="pong-info-bar">
            <span className="pong-score">Score: {score}</span>
            <span className="pong-controls">↑/↓ or W/S to move | ESC to quit</span>
          </div>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="pong-canvas"
          />
          {gameOver && (
            <div className="pong-game-over">
              <p className="game-over-text">Game Over!</p>
              <p className="final-score">Final Score: {score}</p>
              <button onClick={onClose} className="pong-close-btn">
                Close (or press ESC)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PongGame


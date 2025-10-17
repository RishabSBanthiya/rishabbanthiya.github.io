import React, { useEffect, useRef, useState } from 'react'

interface PongGameProps {
  onClose: () => void
}

const PongGame: React.FC<PongGameProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
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
      // Clear canvas
      ctx.fillStyle = '#1a1410'
      ctx.fillRect(0, 0, state.canvas.width, state.canvas.height)

      // Draw center line
      ctx.strokeStyle = '#3d2f1f'
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
      ctx.fillStyle = '#d4a574'
      ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height)
      ctx.fillRect(state.computer.x, state.computer.y, state.computer.width, state.computer.height)

      // Draw ball
      ctx.beginPath()
      ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2)
      ctx.fillStyle = '#e8d5b7'
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
  }, [gameOver, onClose])

  return (
    <div className="pong-game">
      <div className="pong-header">
        <span className="pong-score">Score: {score}</span>
        <span className="pong-controls">Use ↑/↓ or W/S to move | ESC to quit</span>
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
  )
}

export default PongGame


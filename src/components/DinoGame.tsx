import React, { useEffect, useRef, useState } from 'react'

interface DinoGameProps {
  onClose: () => void
}

interface Position {
  x: number
  y: number
}

const DinoGame: React.FC<DinoGameProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 150, y: 150 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  const headerRef = useRef<HTMLDivElement>(null)
  
  const gameStateRef = useRef({
    dino: { 
      x: 50, 
      y: 0, 
      width: 40, 
      height: 50, 
      velocityY: 0, 
      jumping: false,
      ducking: false
    },
    obstacles: [] as { x: number; width: number; height: number; type: 'cactus' | 'bird' }[],
    ground: { y: 350 },
    gravity: 0.6,
    jumpStrength: -12,
    gameSpeed: 6,
    frameCount: 0,
    score: 0,
    keys: { space: false, down: false },
    animationId: 0,
    canvas: { width: 800, height: 400 }
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = gameStateRef.current
    state.dino.y = state.ground.y - state.dino.height

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'ArrowUp') && !state.dino.jumping) {
        state.keys.space = true
        state.dino.jumping = true
        state.dino.velocityY = state.jumpStrength
        e.preventDefault()
      }
      if (e.key === 'ArrowDown') {
        state.keys.down = true
        state.dino.ducking = true
        e.preventDefault()
      }
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        state.keys.space = false
      }
      if (e.key === 'ArrowDown') {
        state.keys.down = false
        state.dino.ducking = false
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    // Spawn obstacles
    const spawnObstacle = () => {
      const type: 'cactus' | 'bird' = Math.random() > 0.7 ? 'bird' : 'cactus'
      const obstacle = {
        x: state.canvas.width,
        width: type === 'bird' ? 40 : 20,
        height: type === 'bird' ? 30 : 40,
        type
      }
      state.obstacles.push(obstacle)
    }

    // Game loop
    const gameLoop = () => {
      state.frameCount++

      // Clear canvas
      ctx.fillStyle = '#1a1410'
      ctx.fillRect(0, 0, state.canvas.width, state.canvas.height)

      // Draw ground
      ctx.strokeStyle = '#3d2f1f'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, state.ground.y)
      ctx.lineTo(state.canvas.width, state.ground.y)
      ctx.stroke()

      // Draw ground decoration (dashes)
      ctx.setLineDash([10, 10])
      for (let i = 0; i < state.canvas.width; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i - (state.frameCount % 20), state.ground.y + 5)
        ctx.lineTo(i + 10 - (state.frameCount % 20), state.ground.y + 5)
        ctx.stroke()
      }
      ctx.setLineDash([])

      // Update dino physics
      if (state.dino.jumping) {
        state.dino.velocityY += state.gravity
        state.dino.y += state.dino.velocityY

        if (state.dino.y >= state.ground.y - state.dino.height) {
          state.dino.y = state.ground.y - state.dino.height
          state.dino.jumping = false
          state.dino.velocityY = 0
        }
      }

      // Draw dino
      const dinoHeight = state.dino.ducking ? state.dino.height * 0.6 : state.dino.height
      const dinoY = state.dino.ducking ? state.ground.y - dinoHeight : state.dino.y
      
      ctx.fillStyle = '#d4a574'
      ctx.fillRect(state.dino.x, dinoY, state.dino.width, dinoHeight)
      
      // Dino eye
      ctx.fillStyle = '#1a1410'
      ctx.fillRect(state.dino.x + 5, dinoY + 5, 5, 5)

      // Spawn obstacles periodically
      if (state.frameCount % Math.max(80 - Math.floor(state.score / 100), 40) === 0) {
        spawnObstacle()
      }

      // Update and draw obstacles
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obstacle = state.obstacles[i]
        obstacle.x -= state.gameSpeed

        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) {
          state.obstacles.splice(i, 1)
          state.score += 10
          setScore(state.score)
          continue
        }

        // Draw obstacle
        ctx.fillStyle = '#c17a6a'
        if (obstacle.type === 'cactus') {
          // Draw cactus
          ctx.fillRect(obstacle.x, state.ground.y - obstacle.height, obstacle.width, obstacle.height)
          ctx.fillRect(obstacle.x - 5, state.ground.y - obstacle.height + 10, 5, 15)
          ctx.fillRect(obstacle.x + obstacle.width, state.ground.y - obstacle.height + 10, 5, 15)
        } else {
          // Draw bird
          const birdY = state.ground.y - 80
          ctx.fillRect(obstacle.x, birdY, obstacle.width, obstacle.height)
          // Wings
          ctx.fillRect(obstacle.x - 5, birdY + 10, 10, 3)
          ctx.fillRect(obstacle.x + obstacle.width - 5, birdY + 10, 10, 3)
        }

        // Collision detection
        const dinoRect = {
          x: state.dino.x + 5,
          y: dinoY + 5,
          width: state.dino.width - 10,
          height: dinoHeight - 10
        }

        const obstacleY = obstacle.type === 'cactus' ? state.ground.y - obstacle.height : state.ground.y - 80
        const obstacleRect = {
          x: obstacle.x + 5,
          y: obstacleY + 5,
          width: obstacle.width - 10,
          height: obstacle.height - 10
        }

        if (
          dinoRect.x < obstacleRect.x + obstacleRect.width &&
          dinoRect.x + dinoRect.width > obstacleRect.x &&
          dinoRect.y < obstacleRect.y + obstacleRect.height &&
          dinoRect.y + dinoRect.height > obstacleRect.y
        ) {
          // Collision detected
          if (state.score > highScore) {
            setHighScore(state.score)
          }
          setGameOver(true)
          return
        }
      }

      // Increase speed gradually
      if (state.frameCount % 100 === 0) {
        state.gameSpeed += 0.2
      }

      // Draw score
      ctx.fillStyle = '#d4a574'
      ctx.font = '16px "Courier New"'
      ctx.fillText(`Score: ${state.score}`, 10, 30)
      ctx.fillText(`High: ${highScore}`, 10, 50)

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
  }, [gameOver, highScore, onClose])

  const handleRestart = () => {
    setGameOver(false)
    setScore(0)
    const state = gameStateRef.current
    state.obstacles = []
    state.score = 0
    state.gameSpeed = 6
    state.frameCount = 0
  }

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
    <div className="dino-game-overlay">
      <div 
        className={`dino-game-container ${isDragging ? 'dragging' : ''}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="dino-game-header" ref={headerRef}>
          <div className="dino-terminal-buttons">
            <span className="dino-terminal-button close" onClick={onClose}></span>
            <span className="dino-terminal-button minimize"></span>
            <span className="dino-terminal-button maximize"></span>
          </div>
          <h2>dino@terminal:~$</h2>
        </div>
        <div className="dino-game-content">
          <div className="dino-info-bar">
            <span className="dino-scores">Score: {score} | High: {highScore}</span>
            <span className="dino-controls">SPACE/↑ jump | ↓ duck | ESC quit</span>
          </div>
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="dino-canvas"
          />
          {gameOver && (
            <div className="dino-game-over">
              <p className="game-over-text">Game Over!</p>
              <p className="final-score">Score: {score}</p>
              {score > 0 && score === highScore && (
                <p className="new-high-score">New High Score! 🎉</p>
              )}
              <div className="dino-buttons">
                <button onClick={handleRestart} className="dino-restart-btn">
                  Restart
                </button>
                <button onClick={onClose} className="dino-close-btn">
                  Close (ESC)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DinoGame


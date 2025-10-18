import React, { useEffect, useState, useRef } from 'react'
import { useBSPokerSocket } from '../../hooks/useBSPokerSocket'
import { BSPokerLobby } from './BSPokerLobby'
import { BSPokerTable } from './BSPokerTable'
import { CreateBSRoomRequest } from '../../types/bspoker.types'

interface BSPokerGameProps {
  onClose: () => void
}

interface Position {
  x: number
  y: number
}

export const BSPokerGame: React.FC<BSPokerGameProps> = ({ onClose }) => {
  const {
    socket,
    connected,
    currentRoom,
    gameState,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    makeAction,
    startGame,
    nextRound,
    listRooms,
    roundResult
  } = useBSPokerSocket()

  // Dragging state
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  const headerRef = useRef<HTMLDivElement>(null)

  // Session persistence: Try to rejoin last room on mount
  useEffect(() => {
    const savedRoomId = localStorage.getItem('bspoker_current_room')
    const savedPlayerName = localStorage.getItem('bspoker_player_name')

    if (savedRoomId && savedPlayerName && connected && !currentRoom) {
      console.log('🔄 Attempting to rejoin BS Poker room:', savedRoomId)
      // Try to rejoin (will fail if room doesn't exist anymore, which is fine)
      joinRoom({
        roomId: savedRoomId,
        playerName: savedPlayerName,
        password: undefined
      }).catch((err) => {
        console.log('Could not rejoin previous room:', err.message)
        localStorage.removeItem('bspoker_current_room')
      })
    }
  }, [connected])

  // Dragging functionality
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

  const handleCreateRoom = async (config: CreateBSRoomRequest) => {
    try {
      await createRoom(config)
      // Room joined event will be handled by socket hook
    } catch (err) {
      throw err
    }
  }

  const handleJoinRoom = async (roomId: string, password: string, playerName: string) => {
    try {
      await joinRoom({
        roomId,
        password: password || undefined,
        playerName
      })
    } catch (err) {
      throw err
    }
  }

  const handleLeaveRoom = () => {
    leaveRoom()
  }

  const handleClose = () => {
    if (currentRoom) {
      leaveRoom()
    }
    onClose()
  }

  // Connection status
  if (!connected) {
    return (
      <div className="poker-game-wrapper">
        <div className="poker-connecting">
          <h3>🔌 Connecting to BS Poker Server...</h3>
          {error && (
            <div className="poker-error">
              <p>{error}</p>
              <p className="poker-help-text">
                Make sure the poker server is running on port 3001.
                <br />
                Run: <code>cd server && npm run dev</code>
              </p>
            </div>
          )}
          <button className="poker-btn-secondary" onClick={onClose}>
            Back to Terminal
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="poker-game-overlay">
      <div 
        className={`poker-game-container ${isDragging ? 'dragging' : ''}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Header */}
        <div className="poker-game-header" ref={headerRef}>
          <div className="poker-terminal-buttons">
            <span className="poker-terminal-button close" onClick={handleClose}></span>
            <span className="poker-terminal-button minimize"></span>
            <span className="poker-terminal-button maximize"></span>
          </div>
          <h2>bspoker@terminal:~$</h2>
        </div>

        {/* Main Content */}
        <div className="poker-game-content">
          {!currentRoom ? (
            // Show lobby if not in a room
            <BSPokerLobby
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
              onListRooms={listRooms}
              error={error}
            />
          ) : (
            // Show BS poker table if in a room
            <BSPokerTable
              gameState={gameState}
              myPlayerId={socket?.id || ''}
              roundResult={roundResult}
              onAction={makeAction}
              onStartGame={startGame}
              onNextRound={nextRound}
              onLeaveRoom={handleLeaveRoom}
              roomName={currentRoom.config.roomName}
              roomId={currentRoom.config.roomId}
            />
          )}
        </div>
      </div>
    </div>
  )
}


import { useEffect, useState, useCallback, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import {
  BSRoom,
  BSGameState,
  BSPokerAction,
  BSRoundResult,
  BSRoomListItem,
  CreateBSRoomRequest,
  JoinBSRoomRequest
} from '../types/bspoker.types'

// Production server URL - Change to 'http://localhost:3001' for local development
const SOCKET_URL = 'https://rishabbanthiya-github-io.onrender.com'

interface UseBSPokerSocketReturn {
  socket: Socket | null
  connected: boolean
  currentRoom: BSRoom | null
  gameState: BSGameState | null
  error: string | null
  createRoom: (config: CreateBSRoomRequest) => Promise<string>
  joinRoom: (request: JoinBSRoomRequest) => Promise<void>
  leaveRoom: () => void
  makeAction: (action: BSPokerAction) => void
  startGame: () => void
  nextRound: () => void
  listRooms: () => Promise<BSRoomListItem[]>
  roundResult: BSRoundResult | null
}

export const useBSPokerSocket = (): UseBSPokerSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<BSRoom | null>(null)
  const [gameState, setGameState] = useState<BSGameState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [roundResult, setRoundResult] = useState<BSRoundResult | null>(null)
  const socketRef = useRef<Socket | null>(null)

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'], // Try polling first
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    newSocket.on('connect', () => {
      console.log('🔌 Connected to BS Poker server')
      setConnected(true)
      setError(null)
    })

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from BS Poker server')
      setConnected(false)
    })

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err)
      setError('Failed to connect to server. Is the poker server running?')
      setConnected(false)
    })

    // Room events
    newSocket.on('bspoker:room-joined', (room: BSRoom) => {
      console.log('✓ Joined BS Poker room:', room.config.roomId)
      setCurrentRoom(room)
      setError(null)
      
      // Save to localStorage for session persistence
      localStorage.setItem('bspoker_current_room', room.config.roomId)
    })

    newSocket.on('bspoker:room-updated', (room: BSRoom) => {
      console.log('↻ BS Poker room updated')
      setCurrentRoom(room)
    })

    newSocket.on('bspoker:game-state', (state: BSGameState) => {
      console.log('🎲 BS Poker game state updated, phase:', state.phase)
      setGameState(state)
      setRoundResult(null) // Clear previous round result
    })

    newSocket.on('bspoker:player-action', (playerId: string, action: BSPokerAction) => {
      console.log(`👤 Player action: ${playerId} - ${action.type}`)
    })

    newSocket.on('bspoker:round-end', (result: BSRoundResult) => {
      console.log('🏆 Round ended:', result)
      setRoundResult(result)
    })

    newSocket.on('bspoker:game-finished', () => {
      console.log('🎮 Game finished!')
    })

    newSocket.on('bspoker:player-left', (playerId: string) => {
      console.log(`👋 Player left: ${playerId}`)
    })

    newSocket.on('bspoker:error', (message: string) => {
      console.error('❌ BS Poker error:', message)
      setError(message)
    })

    setSocket(newSocket)
    socketRef.current = newSocket

    // Cleanup on unmount
    return () => {
      console.log('🔌 Cleaning up BS Poker socket connection')
      newSocket.close()
    }
  }, [])

  // Create room
  const createRoom = useCallback(
    (config: CreateBSRoomRequest): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (!socket) {
          reject(new Error('Socket not connected'))
          return
        }

        socket.emit('bspoker:create-room', config, (result: { success: boolean; roomId?: string; error?: string }) => {
          if (result.success && result.roomId) {
            resolve(result.roomId)
          } else {
            reject(new Error(result.error || 'Failed to create room'))
          }
        })
      })
    },
    [socket]
  )

  // Join room
  const joinRoom = useCallback(
    (request: JoinBSRoomRequest): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!socket) {
          reject(new Error('Socket not connected'))
          return
        }

        socket.emit('bspoker:join-room', request, (result: { success: boolean; error?: string }) => {
          if (result.success) {
            resolve()
          } else {
            reject(new Error(result.error || 'Failed to join room'))
          }
        })
      })
    },
    [socket]
  )

  // Leave room
  const leaveRoom = useCallback(() => {
    if (socket) {
      socket.emit('bspoker:leave-room')
      setCurrentRoom(null)
      setGameState(null)
      setRoundResult(null)
      localStorage.removeItem('bspoker_current_room')
    }
  }, [socket])

  // Start game
  const startGame = useCallback(() => {
    if (socket) {
      socket.emit('bspoker:start-game')
    }
  }, [socket])

  // Next round
  const nextRound = useCallback(() => {
    if (socket) {
      socket.emit('bspoker:next-round')
      setRoundResult(null)
    }
  }, [socket])

  // Make action
  const makeAction = useCallback(
    (action: BSPokerAction) => {
      if (socket) {
        socket.emit('bspoker:action', action)
      }
    },
    [socket]
  )

  // List rooms
  const listRooms = useCallback((): Promise<BSRoomListItem[]> => {
    return new Promise((resolve) => {
      if (!socket) {
        resolve([])
        return
      }

      socket.emit('bspoker:list-rooms', (rooms: BSRoomListItem[]) => {
        resolve(rooms)
      })
    })
  }, [socket])

  return {
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
  }
}


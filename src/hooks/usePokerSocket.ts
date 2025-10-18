import { useEffect, useState, useCallback, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import {
  Room,
  GameState,
  PokerAction,
  Winner,
  RoomListItem,
  CreateRoomRequest,
  JoinRoomRequest
} from '../types/poker.types'

// Production server URL - Change to 'http://localhost:3001' for local development
const SOCKET_URL = 'https://rishabbanthiya-github-io.onrender.com'
console.log('Poker Socket URL:', SOCKET_URL)

interface UsePokerSocketReturn {
  socket: Socket | null
  connected: boolean
  currentRoom: Room | null
  gameState: GameState | null
  error: string | null
  createRoom: (config: CreateRoomRequest) => Promise<string>
  joinRoom: (request: JoinRoomRequest) => Promise<void>
  leaveRoom: () => void
  makeAction: (action: PokerAction) => void
  listRooms: () => Promise<RoomListItem[]>
  winners: Winner[] | null
}

export const usePokerSocket = (): UsePokerSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [winners, setWinners] = useState<Winner[] | null>(null)
  const socketRef = useRef<Socket | null>(null)

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    })

    newSocket.on('connect', () => {
      console.log('🔌 Connected to poker server')
      setConnected(true)
      setError(null)
    })

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from poker server')
      setConnected(false)
    })

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err)
      setError('Failed to connect to server. Is the poker server running?')
      setConnected(false)
    })

    // Room events
    newSocket.on('poker:room-joined', (room: Room) => {
      console.log('✓ Joined room:', room.config.roomId)
      setCurrentRoom(room)
      setError(null)
      
      // Save to localStorage for session persistence
      localStorage.setItem('poker_current_room', room.config.roomId)
    })

    newSocket.on('poker:room-updated', (room: Room) => {
      console.log('↻ Room updated')
      setCurrentRoom(room)
    })

    newSocket.on('poker:game-state', (state: GameState) => {
      console.log('🎲 Game state updated, phase:', state.phase)
      setGameState(state)
      setWinners(null) // Clear previous winners
    })

    newSocket.on('poker:player-action', (playerId: string, action: PokerAction) => {
      console.log(`👤 Player action: ${playerId} - ${action.type}`)
    })

    newSocket.on('poker:round-start', (phase: GameState['phase']) => {
      console.log(`🎯 New round: ${phase}`)
      setWinners(null)
    })

    newSocket.on('poker:round-end', (winnersData: Winner[]) => {
      console.log('🏆 Round ended, winners:', winnersData)
      setWinners(winnersData)
    })

    newSocket.on('poker:player-left', (playerId: string) => {
      console.log(`👋 Player left: ${playerId}`)
    })

    newSocket.on('poker:error', (message: string) => {
      console.error('❌ Poker error:', message)
      setError(message)
    })

    setSocket(newSocket)
    socketRef.current = newSocket

    // Cleanup on unmount
    return () => {
      console.log('🔌 Cleaning up socket connection')
      newSocket.close()
    }
  }, [])

  // Create room
  const createRoom = useCallback(
    (config: CreateRoomRequest): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (!socket) {
          reject(new Error('Socket not connected'))
          return
        }

        socket.emit('poker:create-room', config, (result: { success: boolean; roomId?: string; error?: string }) => {
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
    (request: JoinRoomRequest): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!socket) {
          reject(new Error('Socket not connected'))
          return
        }

        socket.emit('poker:join-room', request, (result: { success: boolean; error?: string }) => {
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
      socket.emit('poker:leave-room')
      setCurrentRoom(null)
      setGameState(null)
      setWinners(null)
      localStorage.removeItem('poker_current_room')
    }
  }, [socket])

  // Make action
  const makeAction = useCallback(
    (action: PokerAction) => {
      if (socket) {
        socket.emit('poker:action', action)
      }
    },
    [socket]
  )

  // List rooms
  const listRooms = useCallback((): Promise<RoomListItem[]> => {
    return new Promise((resolve) => {
      if (!socket) {
        resolve([])
        return
      }

      socket.emit('poker:list-rooms', (rooms: RoomListItem[]) => {
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
    listRooms,
    winners
  }
}


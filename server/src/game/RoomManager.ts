import { nanoid } from 'nanoid'
import {
  Room,
  RoomConfig,
  CreateRoomRequest,
  RoomListItem,
  PokerAction,
  ActionResult,
  Winner
} from '../types/poker.types'
import { PokerRoom } from './PokerRoom'

export class RoomManager {
  private rooms: Map<string, PokerRoom> = new Map()

  /**
   * Create a new poker room
   */
  createRoom(creatorId: string, config: CreateRoomRequest): Room {
    // Generate unique room ID
    const prefix = config.isPublic ? 'PUB' : config.roomName.substring(0, 3).toUpperCase()
    const roomId = `${prefix}-${nanoid(4).toUpperCase()}`

    const roomConfig: RoomConfig = {
      roomId,
      roomName: config.roomName,
      password: config.password || null,
      maxPlayers: Math.min(Math.max(config.maxPlayers, 2), 6),
      buyIn: config.buyIn,
      smallBlind: config.smallBlind,
      bigBlind: config.bigBlind,
      isPublic: config.isPublic,
      createdBy: creatorId,
      createdAt: new Date()
    }

    const pokerRoom = new PokerRoom(roomConfig)
    this.rooms.set(roomId, pokerRoom)

    // Auto-join creator
    pokerRoom.addPlayer(creatorId, `Player${creatorId.slice(0, 4)}`)

    console.log(`✓ Room created: ${roomId} by ${creatorId}`)
    return pokerRoom.getRoom()
  }

  /**
   * Join an existing room
   */
  joinRoom(
    playerId: string,
    roomId: string,
    password: string | undefined,
    playerName: string
  ): Room {
    const room = this.rooms.get(roomId)

    if (!room) {
      throw new Error('Room not found')
    }

    const roomData = room.getRoom()

    // Check password
    if (roomData.config.password && roomData.config.password !== password) {
      throw new Error('Invalid password')
    }

    // Check if room is full
    if (roomData.players.length >= roomData.config.maxPlayers) {
      throw new Error('Room is full')
    }

    // Check if already in room
    if (roomData.players.some(p => p.id === playerId)) {
      throw new Error('Already in room')
    }

    // Add player
    const player = room.addPlayer(playerId, playerName)
    if (!player) {
      throw new Error('Failed to join room')
    }

    console.log(`✓ Player ${playerName} joined room ${roomId}`)
    return room.getRoom()
  }

  /**
   * Get list of public rooms
   */
  getPublicRooms(): RoomListItem[] {
    const publicRooms: RoomListItem[] = []

    this.rooms.forEach((room) => {
      const roomData = room.getRoom()

      if (roomData.config.isPublic) {
        publicRooms.push({
          roomId: roomData.config.roomId,
          roomName: roomData.config.roomName,
          currentPlayers: roomData.players.length,
          maxPlayers: roomData.config.maxPlayers,
          buyIn: roomData.config.buyIn,
          status: roomData.status,
          isPublic: true,
          hasPassword: !!roomData.config.password
        })
      }
    })

    // Sort by status (waiting first) then by player count
    return publicRooms.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'waiting' ? -1 : 1
      }
      return b.currentPlayers - a.currentPlayers
    })
  }

  /**
   * Get info about a specific room
   */
  getRoomInfo(roomId: string): RoomListItem | null {
    const room = this.rooms.get(roomId)

    if (!room) return null

    const roomData = room.getRoom()

    return {
      roomId: roomData.config.roomId,
      roomName: roomData.config.roomName,
      currentPlayers: roomData.players.length,
      maxPlayers: roomData.config.maxPlayers,
      buyIn: roomData.config.buyIn,
      status: roomData.status,
      isPublic: roomData.config.isPublic,
      hasPassword: !!roomData.config.password
    }
  }

  /**
   * Get full room data
   */
  getRoom(roomId: string): Room | null {
    const room = this.rooms.get(roomId)
    return room ? room.getRoom() : null
  }

  /**
   * Remove a player from a room
   */
  removePlayer(roomId: string, playerId: string): boolean {
    const room = this.rooms.get(roomId)

    if (!room) return false

    const removed = room.removePlayer(playerId)

    // Delete room if empty
    if (room.getRoom().players.length === 0) {
      this.rooms.delete(roomId)
      console.log(`✗ Room ${roomId} deleted (empty)`)
    }

    return removed
  }

  /**
   * Start a game in a room
   */
  startGame(roomId: string): void {
    const room = this.rooms.get(roomId)
    if (!room) {
      throw new Error('Room not found')
    }

    room.startGame()
    console.log(`▶ Game started in room ${roomId}`)
  }

  /**
   * Handle a player action
   */
  handleAction(roomId: string, playerId: string, action: PokerAction): ActionResult {
    const room = this.rooms.get(roomId)

    if (!room) {
      throw new Error('Room not found')
    }

    return room.handleAction(playerId, action)
  }

  /**
   * Evaluate winners at end of hand
   */
  evaluateWinner(roomId: string): Winner[] {
    const room = this.rooms.get(roomId)

    if (!room) {
      throw new Error('Room not found')
    }

    const winners = room.evaluateWinner()
    console.log(`🏆 Winners in room ${roomId}:`, winners.map(w => w.playerName).join(', '))
    return winners
  }

  /**
   * Start next hand in a room
   */
  startNextHand(roomId: string): void {
    const room = this.rooms.get(roomId)

    if (!room) {
      throw new Error('Room not found')
    }

    room.startNextHand()
  }

  /**
   * Check if a room can start
   */
  canStart(roomId: string): boolean {
    const room = this.rooms.get(roomId)
    return room ? room.canStart() : false
  }

  /**
   * Cleanup old empty rooms (call periodically)
   */
  cleanupOldRooms(): void {
    const now = Date.now()
    const MAX_AGE = 4 * 60 * 60 * 1000 // 4 hours

    this.rooms.forEach((room, roomId) => {
      const roomData = room.getRoom()
      const age = now - roomData.config.createdAt.getTime()

      // Delete old empty rooms
      if (roomData.players.length === 0 && age > MAX_AGE) {
        this.rooms.delete(roomId)
        console.log(`🧹 Cleaned up old room: ${roomId}`)
      }
    })
  }

  /**
   * Get total number of rooms
   */
  getRoomCount(): number {
    return this.rooms.size
  }

  /**
   * Get total number of players across all rooms
   */
  getTotalPlayers(): number {
    let total = 0
    this.rooms.forEach(room => {
      total += room.getRoom().players.length
    })
    return total
  }
}


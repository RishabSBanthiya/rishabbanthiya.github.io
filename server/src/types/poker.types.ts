// Card types
export type Suit = '♠' | '♥' | '♦' | '♣'
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'

export interface Card {
  rank: Rank
  suit: Suit
  symbol: string // Unicode card symbol
  value: number // Numeric value for comparison
}

// Player types
export interface Player {
  id: string
  name: string
  chips: number
  currentBet: number
  cards: Card[]
  folded: boolean
  allIn: boolean
  position: 'dealer' | 'small-blind' | 'big-blind' | 'player'
  isActive: boolean
  lastAction?: string
}

// Room configuration
export interface RoomConfig {
  roomId: string
  roomName: string
  password: string | null
  maxPlayers: number
  buyIn: number
  smallBlind: number
  bigBlind: number
  isPublic: boolean
  createdBy: string
  createdAt: Date
}

// Game state
export interface GameState {
  tableId: string
  players: Player[]
  communityCards: Card[]
  pot: number
  currentBet: number
  currentPlayerIndex: number
  dealerIndex: number
  phase: 'waiting' | 'preflop' | 'flop' | 'turn' | 'river' | 'showdown'
  deck: Card[]
  minPlayers: number
  maxPlayers: number
  smallBlind: number
  bigBlind: number
}

// Room interface
export interface Room {
  config: RoomConfig
  players: Player[]
  gameState: GameState | null
  status: 'waiting' | 'playing' | 'finished'
}

// Hand ranking
export interface HandRanking {
  rank: number // 1 = high card, 10 = royal flush
  name: string
  cards: Card[]
  tiebreaker: number[] // Array of values for breaking ties
}

// Action types
export type PokerAction =
  | { type: 'fold' }
  | { type: 'check' }
  | { type: 'call'; amount: number }
  | { type: 'raise'; amount: number }
  | { type: 'all-in'; amount: number }

// Request/Response types
export interface CreateRoomRequest {
  roomName: string
  password?: string
  maxPlayers: number
  buyIn: number
  smallBlind: number
  bigBlind: number
  isPublic: boolean
}

export interface JoinRoomRequest {
  roomId: string
  password?: string
  playerName: string
}

export interface RoomListItem {
  roomId: string
  roomName: string
  currentPlayers: number
  maxPlayers: number
  buyIn: number
  status: Room['status']
  isPublic: boolean
  hasPassword: boolean
}

export interface ActionResult {
  success: boolean
  error?: string
  roundComplete?: boolean
  phaseComplete?: boolean
}

export interface Winner {
  playerId: string
  playerName: string
  amount: number
  hand: HandRanking
}


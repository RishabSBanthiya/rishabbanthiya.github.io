// Card types
export type Suit = '♠' | '♥' | '♦' | '♣'
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'

export interface Card {
  rank: Rank
  suit: Suit
  symbol: string
  value: number
}

// Hand types for Liar's Poker (standard Texas Hold'em hands)
export type HandType =
  | 'high-card'
  | 'pair'
  | 'two-pair'
  | 'three-of-a-kind'
  | 'straight'
  | 'flush'
  | 'full-house'
  | 'four-of-a-kind'
  | 'straight-flush'

export interface HandGuess {
  type: HandType
  rank?: Rank // Primary rank (e.g., King for "pair of Kings")
  description: string // Human-readable description
}

// Player types
export interface BSPlayer {
  id: string
  name: string
  cards: Card[]
  cardCount: number
  isActive: boolean
  hasLost: boolean // True when player reaches 6 cards
  lastAction?: string
  position: number // Seat position at table
}

// Room configuration
export interface BSRoomConfig {
  roomId: string
  roomName: string
  password: string | null
  maxPlayers: number
  isPublic: boolean
  createdBy: string
  createdAt: Date
}

// Game state
export interface BSGameState {
  roomId: string
  players: BSPlayer[]
  currentPlayerIndex: number
  dealerIndex: number // Player who lost last round (starts next round)
  phase: 'waiting' | 'dealing' | 'bidding' | 'reveal' | 'round-end'
  currentGuess: HandGuess | null
  guessHistory: Array<{
    playerId: string
    playerName: string
    guess: HandGuess
  }>
  allCards: Card[] // All cards in play (face down until reveal)
  roundNumber: number
}

// Room interface
export interface BSRoom {
  config: BSRoomConfig
  players: BSPlayer[]
  gameState: BSGameState | null
  status: 'waiting' | 'playing' | 'finished'
}

// Action types
export type BSPokerAction =
  | { type: 'guess'; guess: HandGuess }
  | { type: 'bullshit' }
  | { type: 'start-game' }
  | { type: 'ready' }

// Request/Response types
export interface CreateBSRoomRequest {
  roomName: string
  password?: string
  maxPlayers: number
  isPublic: boolean
}

export interface JoinBSRoomRequest {
  roomId: string
  password?: string
  playerName: string
}

export interface BSRoomListItem {
  roomId: string
  roomName: string
  currentPlayers: number
  maxPlayers: number
  status: BSRoom['status']
  isPublic: boolean
  hasPassword: boolean
}

// Round result
export interface BSRoundResult {
  wasSuccessful: boolean // True if the guessed hand exists
  callerPlayerId: string
  callerPlayerName: string
  guesserPlayerId: string
  guesserPlayerName: string
  loserId: string
  loserName: string
  guess: HandGuess
  allCards: Card[]
  foundHand?: Card[] // The actual cards that make the hand (if found)
}


import {
  BSRoom,
  BSRoomConfig,
  BSPlayer,
  BSGameState,
  BSPokerAction,
  BSRoundResult,
  HandGuess,
  Card,
  Rank,
  Suit
} from '../types/bspoker.types'
import { BSHandEvaluator } from '../utils/bsHandEvaluator'

export class BSPokerRoom {
  private config: BSRoomConfig
  private players: BSPlayer[] = []
  private gameState: BSGameState | null = null
  private status: BSRoom['status'] = 'waiting'
  private deck: Card[] = []

  constructor(config: BSRoomConfig) {
    this.config = config
  }

  /**
   * Get current room state
   */
  getRoom(): BSRoom {
    return {
      config: this.config,
      players: this.players,
      gameState: this.gameState,
      status: this.status
    }
  }

  /**
   * Add a player to the room
   */
  addPlayer(playerId: string, playerName: string): BSPlayer | null {
    // Check if room is full
    if (this.players.length >= this.config.maxPlayers) {
      return null
    }

    // Check if player already exists
    if (this.players.some(p => p.id === playerId)) {
      return null
    }

    const player: BSPlayer = {
      id: playerId,
      name: playerName,
      cards: [],
      cardCount: 2, // Start with 2 cards
      isActive: true,
      hasLost: false,
      position: this.players.length
    }

    this.players.push(player)
    return player
  }

  /**
   * Remove a player from the room
   */
  removePlayer(playerId: string): boolean {
    const index = this.players.findIndex(p => p.id === playerId)
    if (index === -1) return false

    this.players.splice(index, 1)

    // If game is in progress and only one player left, end the game
    if (this.status === 'playing' && this.players.filter(p => !p.hasLost).length <= 1) {
      this.status = 'waiting'
      this.gameState = null
    }

    return true
  }

  /**
   * Start a new game
   */
  startGame(): void {
    if (this.players.length < 2) {
      throw new Error('Need at least 2 players to start')
    }

    this.status = 'playing'
    this.startNewRound()
  }

  /**
   * Start a new round
   */
  private startNewRound(): void {
    // Initialize deck
    this.deck = this.createDeck()
    this.shuffleDeck()

    // Reset players for new round
    this.players.forEach(player => {
      player.cards = []
      player.lastAction = undefined
    })

    // Deal cards to each player based on their card count
    this.players.forEach(player => {
      if (!player.hasLost) {
        for (let i = 0; i < player.cardCount; i++) {
          const card = this.deck.pop()
          if (card) {
            player.cards.push(card)
          }
        }
      }
    })

    // Collect all cards for validation
    const allCards: Card[] = []
    this.players.forEach(player => {
      allCards.push(...player.cards)
    })

    // Initialize game state
    const dealerIndex = this.gameState?.dealerIndex ?? 0
    const currentPlayerIndex = (dealerIndex + 1) % this.players.length

    this.gameState = {
      roomId: this.config.roomId,
      players: this.players,
      currentPlayerIndex,
      dealerIndex,
      phase: 'bidding',
      currentGuess: null,
      guessHistory: [],
      allCards,
      roundNumber: this.gameState ? this.gameState.roundNumber + 1 : 1
    }
  }

  /**
   * Handle a player action
   */
  handleAction(playerId: string, action: BSPokerAction): BSRoundResult | null {
    if (!this.gameState) {
      throw new Error('No game in progress')
    }

    if (this.gameState.phase !== 'bidding') {
      throw new Error('Not in bidding phase')
    }

    const player = this.players.find(p => p.id === playerId)
    if (!player) {
      throw new Error('Player not found')
    }

    const currentPlayer = this.players[this.gameState.currentPlayerIndex]
    if (currentPlayer.id !== playerId) {
      throw new Error('Not your turn')
    }

    if (action.type === 'guess') {
      return this.handleGuess(playerId, action.guess)
    } else if (action.type === 'bullshit') {
      return this.handleBullshit(playerId)
    }

    return null
  }

  /**
   * Handle a guess action
   */
  private handleGuess(playerId: string, guess: HandGuess): null {
    if (!this.gameState) return null

    const player = this.players.find(p => p.id === playerId)
    if (!player) return null

    // Validate guess is higher than current guess
    if (this.gameState.currentGuess) {
      if (!BSHandEvaluator.isHigherGuess(guess, this.gameState.currentGuess)) {
        throw new Error('Guess must be higher than the current guess')
      }
    }

    // Update game state
    this.gameState.currentGuess = guess
    this.gameState.guessHistory.push({
      playerId: player.id,
      playerName: player.name,
      guess
    })

    player.lastAction = `Guessed: ${guess.description}`

    // Move to next player
    this.gameState.currentPlayerIndex = this.getNextPlayerIndex(this.gameState.currentPlayerIndex)

    return null
  }

  /**
   * Handle a bullshit call
   */
  private handleBullshit(callerId: string): BSRoundResult {
    if (!this.gameState || !this.gameState.currentGuess) {
      throw new Error('No guess to call bullshit on')
    }

    const caller = this.players.find(p => p.id === callerId)
    if (!caller) {
      throw new Error('Caller not found')
    }

    // Get the last guesser
    const lastGuess = this.gameState.guessHistory[this.gameState.guessHistory.length - 1]
    const guesser = this.players.find(p => p.id === lastGuess.playerId)
    if (!guesser) {
      throw new Error('Guesser not found')
    }

    // Reveal all cards and check if the guess exists
    this.gameState.phase = 'reveal'
    const verification = BSHandEvaluator.verifyGuess(this.gameState.allCards, this.gameState.currentGuess)

    let loser: BSPlayer
    let wasSuccessful: boolean

    if (verification.exists) {
      // Guess was correct, caller loses
      loser = caller
      wasSuccessful = true
    } else {
      // Guess was incorrect, guesser loses
      loser = guesser
      wasSuccessful = false
    }

    // Increment loser's card count
    loser.cardCount++
    
    // Check if loser has reached 6 cards
    if (loser.cardCount >= 6) {
      loser.hasLost = true
      loser.isActive = false
    }

    // Create result
    const result: BSRoundResult = {
      wasSuccessful,
      callerPlayerId: caller.id,
      callerPlayerName: caller.name,
      guesserPlayerId: guesser.id,
      guesserPlayerName: guesser.name,
      loserId: loser.id,
      loserName: loser.name,
      guess: this.gameState.currentGuess,
      allCards: this.gameState.allCards,
      foundHand: verification.hand
    }

    // Update dealer index for next round
    this.gameState.dealerIndex = this.players.findIndex(p => p.id === loser.id)

    // Move to round end phase
    this.gameState.phase = 'round-end'

    // Check if game is over (only one player left)
    const activePlayers = this.players.filter(p => !p.hasLost)
    if (activePlayers.length <= 1) {
      this.status = 'finished'
    }

    return result
  }

  /**
   * Start next round after round end
   */
  continueToNextRound(): void {
    if (!this.gameState || this.gameState.phase !== 'round-end') {
      throw new Error('Cannot continue, not in round-end phase')
    }

    // Check if game should continue
    const activePlayers = this.players.filter(p => !p.hasLost)
    if (activePlayers.length <= 1) {
      this.status = 'finished'
      return
    }

    this.startNewRound()
  }

  /**
   * Get next player index (skipping players who have lost)
   */
  private getNextPlayerIndex(currentIndex: number): number {
    let nextIndex = (currentIndex + 1) % this.players.length
    let attempts = 0
    
    while (this.players[nextIndex].hasLost && attempts < this.players.length) {
      nextIndex = (nextIndex + 1) % this.players.length
      attempts++
    }
    
    return nextIndex
  }

  /**
   * Create a standard deck of cards
   */
  private createDeck(): Card[] {
    const suits: Suit[] = ['♠', '♥', '♦', '♣']
    const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    const deck: Card[] = []

    for (const suit of suits) {
      for (const rank of ranks) {
        const value = rank === 'A' ? 14 : rank === 'K' ? 13 : rank === 'Q' ? 12 : rank === 'J' ? 11 : parseInt(rank)
        deck.push({
          rank,
          suit,
          symbol: `${rank}${suit}`,
          value
        })
      }
    }

    return deck
  }

  /**
   * Shuffle the deck using Fisher-Yates algorithm
   */
  private shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
    }
  }

  /**
   * Get game state (with hidden cards for other players)
   */
  getGameStateForPlayer(playerId: string): BSGameState | null {
    if (!this.gameState) return null

    // Clone game state
    const state = JSON.parse(JSON.stringify(this.gameState)) as BSGameState

    // Hide other players' cards if not in reveal phase
    if (state.phase !== 'reveal' && state.phase !== 'round-end') {
      state.players.forEach(player => {
        if (player.id !== playerId) {
          player.cards = [] // Hide other players' cards
        }
      })
      state.allCards = [] // Hide all cards
    }

    return state
  }

  /**
   * Check if room can start game
   */
  canStartGame(): boolean {
    return this.players.length >= 2 && this.status === 'waiting'
  }

  /**
   * Get room config
   */
  getConfig(): BSRoomConfig {
    return this.config
  }

  /**
   * Get players
   */
  getPlayers(): BSPlayer[] {
    return this.players
  }

  /**
   * Get status
   */
  getStatus(): BSRoom['status'] {
    return this.status
  }
}


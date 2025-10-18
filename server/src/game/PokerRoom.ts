import {
  Room,
  RoomConfig,
  Player,
  GameState,
  PokerAction,
  ActionResult,
  Winner
} from '../types/poker.types'
import { DeckManager } from '../utils/deckManager'
import { HandEvaluator } from '../utils/handEvaluator'

export class PokerRoom {
  private config: RoomConfig
  private players: Player[] = []
  private gameState: GameState | null = null
  private status: Room['status'] = 'waiting'

  constructor(config: RoomConfig) {
    this.config = config
  }

  /**
   * Get current room state
   */
  getRoom(): Room {
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
  addPlayer(playerId: string, playerName: string): Player | null {
    // Check if room is full
    if (this.players.length >= this.config.maxPlayers) {
      return null
    }

    // Check if player already exists
    if (this.players.some(p => p.id === playerId)) {
      return null
    }

    const player: Player = {
      id: playerId,
      name: playerName,
      chips: this.config.buyIn,
      currentBet: 0,
      cards: [],
      folded: false,
      allIn: false,
      position: 'player',
      isActive: true
    }

    this.players.push(player)
    
    // Assign dealer if first player
    if (this.players.length === 1) {
      player.position = 'dealer'
    }

    return player
  }

  /**
   * Remove a player from the room
   */
  removePlayer(playerId: string): boolean {
    const index = this.players.findIndex(p => p.id === playerId)
    if (index === -1) return false

    this.players.splice(index, 1)

    // If game is in progress and player leaves, handle it
    if (this.status === 'playing' && this.gameState) {
      // If only one player left, end the game
      if (this.players.filter(p => !p.folded).length === 1) {
        this.status = 'waiting'
        this.gameState = null
      }
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
    this.startNewHand()
  }

  /**
   * Start a new hand
   */
  startNewHand(): void {
    // Reset player states
    this.players.forEach(player => {
      player.cards = []
      player.currentBet = 0
      player.folded = false
      player.allIn = false
      player.lastAction = undefined
    })

    // Remove broke players
    this.players = this.players.filter(p => p.chips > 0)

    if (this.players.length < 2) {
      this.status = 'finished'
      return
    }

    // Rotate dealer
    const currentDealerIndex = this.players.findIndex(p => p.position === 'dealer')
    this.players.forEach(p => {
      if (p.position !== 'player') p.position = 'player'
    })
    
    const newDealerIndex = (currentDealerIndex + 1) % this.players.length
    this.players[newDealerIndex].position = 'dealer'

    // Set blinds
    const smallBlindIndex = (newDealerIndex + 1) % this.players.length
    const bigBlindIndex = (newDealerIndex + 2) % this.players.length
    
    this.players[smallBlindIndex].position = 'small-blind'
    this.players[bigBlindIndex].position = 'big-blind'

    // Post blinds
    this.players[smallBlindIndex].currentBet = this.config.smallBlind
    this.players[smallBlindIndex].chips -= this.config.smallBlind
    this.players[bigBlindIndex].currentBet = this.config.bigBlind
    this.players[bigBlindIndex].chips -= this.config.bigBlind

    // Create and shuffle deck
    const deck = DeckManager.createShuffledDeck()

    // Deal hole cards (2 per player)
    let remainingDeck = deck
    this.players.forEach(player => {
      const { dealt, remaining } = DeckManager.dealCards(remainingDeck, 2)
      player.cards = dealt
      remainingDeck = remaining
    })

    // Initialize game state
    this.gameState = {
      tableId: this.config.roomId,
      players: this.players,
      communityCards: [],
      pot: this.config.smallBlind + this.config.bigBlind,
      currentBet: this.config.bigBlind,
      currentPlayerIndex: (bigBlindIndex + 1) % this.players.length,
      dealerIndex: newDealerIndex,
      phase: 'preflop',
      deck: remainingDeck,
      minPlayers: 2,
      maxPlayers: this.config.maxPlayers,
      smallBlind: this.config.smallBlind,
      bigBlind: this.config.bigBlind
    }
  }

  /**
   * Handle a player action
   */
  handleAction(playerId: string, action: PokerAction): ActionResult {
    if (!this.gameState) {
      return { success: false, error: 'Game not started' }
    }

    const player = this.players.find(p => p.id === playerId)
    if (!player) {
      return { success: false, error: 'Player not found' }
    }

    // Check if it's player's turn
    if (this.gameState.players[this.gameState.currentPlayerIndex].id !== playerId) {
      return { success: false, error: 'Not your turn' }
    }

    if (player.folded) {
      return { success: false, error: 'Already folded' }
    }

    // Process action
    let success = false
    switch (action.type) {
      case 'fold':
        player.folded = true
        player.lastAction = 'Fold'
        success = true
        break

      case 'check':
        if (player.currentBet < this.gameState.currentBet) {
          return { success: false, error: 'Cannot check, must call or raise' }
        }
        player.lastAction = 'Check'
        success = true
        break

      case 'call':
        const callAmount = this.gameState.currentBet - player.currentBet
        if (callAmount > player.chips) {
          return { success: false, error: 'Not enough chips' }
        }
        player.chips -= callAmount
        player.currentBet += callAmount
        this.gameState.pot += callAmount
        player.lastAction = `Call $${callAmount}`
        success = true
        break

      case 'raise':
        if (action.amount < this.gameState.currentBet * 2) {
          return { success: false, error: 'Raise must be at least 2x current bet' }
        }
        const raiseAmount = action.amount - player.currentBet
        if (raiseAmount > player.chips) {
          return { success: false, error: 'Not enough chips' }
        }
        player.chips -= raiseAmount
        player.currentBet += raiseAmount
        this.gameState.pot += raiseAmount
        this.gameState.currentBet = action.amount
        player.lastAction = `Raise to $${action.amount}`
        success = true
        break

      case 'all-in':
        const allInAmount = player.chips
        player.chips = 0
        player.currentBet += allInAmount
        this.gameState.pot += allInAmount
        player.allIn = true
        if (player.currentBet > this.gameState.currentBet) {
          this.gameState.currentBet = player.currentBet
        }
        player.lastAction = `All-in $${allInAmount}`
        success = true
        break
    }

    if (!success) {
      return { success: false, error: 'Invalid action' }
    }

    // Move to next player
    this.moveToNextPlayer()

    // Check if betting round is complete
    if (this.isBettingRoundComplete()) {
      this.advancePhase()
      return { success: true, phaseComplete: true }
    }

    // Check if hand is complete (only one player left)
    const activePlayers = this.players.filter(p => !p.folded)
    if (activePlayers.length === 1) {
      return { success: true, roundComplete: true }
    }

    return { success: true }
  }

  /**
   * Move to next active player
   */
  private moveToNextPlayer(): void {
    if (!this.gameState) return

    let attempts = 0
    do {
      this.gameState.currentPlayerIndex = 
        (this.gameState.currentPlayerIndex + 1) % this.players.length
      attempts++
    } while (
      this.players[this.gameState.currentPlayerIndex].folded && 
      attempts < this.players.length
    )
  }

  /**
   * Check if betting round is complete
   */
  private isBettingRoundComplete(): boolean {
    if (!this.gameState) return false

    const activePlayers = this.players.filter(p => !p.folded && !p.allIn)
    
    // If all but one player is all-in or folded
    if (activePlayers.length <= 1) return true

    // Check if all active players have matched the current bet
    return activePlayers.every(p => p.currentBet === this.gameState!.currentBet)
  }

  /**
   * Advance to next phase of the game
   */
  private advancePhase(): void {
    if (!this.gameState) return

    // Reset current bets for next round
    this.players.forEach(p => {
      p.currentBet = 0
      p.lastAction = undefined
    })
    this.gameState.currentBet = 0

    // Deal community cards based on phase
    switch (this.gameState.phase) {
      case 'preflop':
        // Deal flop (3 cards)
        const { dealt: flop, remaining: afterFlop } = DeckManager.dealCards(this.gameState.deck, 3)
        this.gameState.communityCards = flop
        this.gameState.deck = afterFlop
        this.gameState.phase = 'flop'
        break

      case 'flop':
        // Deal turn (1 card)
        const { dealt: turn, remaining: afterTurn } = DeckManager.dealCards(this.gameState.deck, 1)
        this.gameState.communityCards.push(...turn)
        this.gameState.deck = afterTurn
        this.gameState.phase = 'turn'
        break

      case 'turn':
        // Deal river (1 card)
        const { dealt: river, remaining: afterRiver } = DeckManager.dealCards(this.gameState.deck, 1)
        this.gameState.communityCards.push(...river)
        this.gameState.deck = afterRiver
        this.gameState.phase = 'river'
        break

      case 'river':
        // Go to showdown
        this.gameState.phase = 'showdown'
        break
    }

    // Reset to first player after dealer for new betting round
    this.gameState.currentPlayerIndex = (this.gameState.dealerIndex + 1) % this.players.length
    
    // Skip folded players
    while (this.players[this.gameState.currentPlayerIndex].folded) {
      this.gameState.currentPlayerIndex = 
        (this.gameState.currentPlayerIndex + 1) % this.players.length
    }
  }

  /**
   * Evaluate winner(s) at showdown
   */
  evaluateWinner(): Winner[] {
    if (!this.gameState) return []

    const activePlayers = this.players.filter(p => !p.folded)

    // If only one player left (everyone else folded)
    if (activePlayers.length === 1) {
      const winner = activePlayers[0]
      winner.chips += this.gameState.pot
      return [{
        playerId: winner.id,
        playerName: winner.name,
        amount: this.gameState.pot,
        hand: { rank: 0, name: 'Winner by default', cards: [], tiebreaker: [] }
      }]
    }

    // Evaluate all hands
    const playerHands = activePlayers.map(player => ({
      player,
      hand: HandEvaluator.evaluateHand(player.cards, this.gameState!.communityCards)
    }))

    // Sort by hand strength
    playerHands.sort((a, b) => HandEvaluator.compareHands(b.hand, a.hand))

    // Find all winners (in case of tie)
    const bestHand = playerHands[0].hand
    const winners = playerHands.filter(ph => 
      HandEvaluator.compareHands(ph.hand, bestHand) === 0
    )

    // Split pot among winners
    const winAmount = Math.floor(this.gameState.pot / winners.length)
    
    const results: Winner[] = winners.map(({ player, hand }) => {
      player.chips += winAmount
      return {
        playerId: player.id,
        playerName: player.name,
        amount: winAmount,
        hand
      }
    })

    return results
  }

  /**
   * Start next hand after current hand completes
   */
  startNextHand(): void {
    this.startNewHand()
  }

  /**
   * Get players still in the hand
   */
  getActivePlayers(): Player[] {
    return this.players.filter(p => !p.folded)
  }

  /**
   * Check if game can start
   */
  canStart(): boolean {
    return this.players.length >= 2 && this.status === 'waiting'
  }
}


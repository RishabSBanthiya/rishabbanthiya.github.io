import { Card, Suit, Rank } from '../types/poker.types'

// Card symbols mapping (Unicode playing cards)
const CARD_SYMBOLS: Record<string, string> = {
  // Spades
  '2♠': '🂢', '3♠': '🂣', '4♠': '🂤', '5♠': '🂥', '6♠': '🂦', '7♠': '🂧', '8♠': '🂨', '9♠': '🂩', '10♠': '🂪',
  'J♠': '🂫', 'Q♠': '🂭', 'K♠': '🂮', 'A♠': '🂡',
  // Hearts
  '2♥': '🂲', '3♥': '🂳', '4♥': '🂴', '5♥': '🂵', '6♥': '🂶', '7♥': '🂷', '8♥': '🂸', '9♥': '🂹', '10♥': '🂺',
  'J♥': '🂻', 'Q♥': '🂽', 'K♥': '🂾', 'A♥': '🂱',
  // Diamonds
  '2♦': '🃂', '3♦': '🃃', '4♦': '🃄', '5♦': '🃅', '6♦': '🃆', '7♦': '🃇', '8♦': '🃈', '9♦': '🃉', '10♦': '🃊',
  'J♦': '🃋', 'Q♦': '🃍', 'K♦': '🃎', 'A♦': '🃁',
  // Clubs
  '2♣': '🃒', '3♣': '🃓', '4♣': '🃔', '5♣': '🃕', '6♣': '🃖', '7♣': '🃗', '8♣': '🃘', '9♣': '🃙', '10♣': '🃚',
  'J♣': '🃛', 'Q♣': '🃝', 'K♣': '🃞', 'A♣': '🃑'
}

// Rank values for comparison
const RANK_VALUES: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
}

export class DeckManager {
  /**
   * Creates a standard 52-card deck
   */
  static createDeck(): Card[] {
    const suits: Suit[] = ['♠', '♥', '♦', '♣']
    const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    const deck: Card[] = []

    for (const suit of suits) {
      for (const rank of ranks) {
        const key = `${rank}${suit}`
        deck.push({
          rank,
          suit,
          symbol: CARD_SYMBOLS[key] || '🂠',
          value: RANK_VALUES[rank]
        })
      }
    }

    return deck
  }

  /**
   * Shuffles a deck using Fisher-Yates algorithm
   */
  static shuffle(deck: Card[]): Card[] {
    const shuffled = [...deck]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  /**
   * Deals cards from the deck
   */
  static dealCards(deck: Card[], count: number): { dealt: Card[]; remaining: Card[] } {
    const dealt = deck.slice(0, count)
    const remaining = deck.slice(count)
    return { dealt, remaining }
  }

  /**
   * Creates and shuffles a new deck
   */
  static createShuffledDeck(): Card[] {
    const deck = this.createDeck()
    return this.shuffle(deck)
  }

  /**
   * Gets a card's display string
   */
  static getCardString(card: Card): string {
    return `${card.rank}${card.suit}`
  }

  /**
   * Gets card back symbol
   */
  static getCardBack(): string {
    return '🂠'
  }
}


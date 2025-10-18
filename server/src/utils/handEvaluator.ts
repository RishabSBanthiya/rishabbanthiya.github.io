import { Card, HandRanking } from '../types/poker.types'

export class HandEvaluator {
  /**
   * Evaluates the best 5-card hand from player's cards and community cards
   */
  static evaluateHand(playerCards: Card[], communityCards: Card[]): HandRanking {
    const allCards = [...playerCards, ...communityCards]
    
    // Check all possible 5-card combinations if more than 5 cards
    if (allCards.length > 5) {
      return this.getBestHand(allCards)
    }
    
    // If exactly 5 cards, evaluate directly
    return this.evaluateFiveCards(allCards)
  }

  /**
   * Gets the best possible 5-card hand from available cards
   */
  private static getBestHand(cards: Card[]): HandRanking {
    const combinations = this.getCombinations(cards, 5)
    let bestHand: HandRanking | null = null

    for (const combo of combinations) {
      const hand = this.evaluateFiveCards(combo)
      if (!bestHand || this.compareHands(hand, bestHand) > 0) {
        bestHand = hand
      }
    }

    return bestHand!
  }

  /**
   * Evaluates exactly 5 cards
   */
  private static evaluateFiveCards(cards: Card[]): HandRanking {
    const sorted = [...cards].sort((a, b) => b.value - a.value)
    
    // Check hands in order of strength (highest to lowest)
    if (this.isRoyalFlush(sorted)) {
      return { rank: 10, name: 'Royal Flush', cards: sorted, tiebreaker: [10] }
    }
    
    const straightFlush = this.isStraightFlush(sorted)
    if (straightFlush) {
      return { rank: 9, name: 'Straight Flush', cards: sorted, tiebreaker: [straightFlush] }
    }
    
    const fourKind = this.isFourOfKind(sorted)
    if (fourKind) {
      return { rank: 8, name: 'Four of a Kind', cards: sorted, tiebreaker: fourKind }
    }
    
    const fullHouse = this.isFullHouse(sorted)
    if (fullHouse) {
      return { rank: 7, name: 'Full House', cards: sorted, tiebreaker: fullHouse }
    }
    
    const flush = this.isFlush(sorted)
    if (flush) {
      return { rank: 6, name: 'Flush', cards: sorted, tiebreaker: flush }
    }
    
    const straight = this.isStraight(sorted)
    if (straight) {
      return { rank: 5, name: 'Straight', cards: sorted, tiebreaker: [straight] }
    }
    
    const threeKind = this.isThreeOfKind(sorted)
    if (threeKind) {
      return { rank: 4, name: 'Three of a Kind', cards: sorted, tiebreaker: threeKind }
    }
    
    const twoPair = this.isTwoPair(sorted)
    if (twoPair) {
      return { rank: 3, name: 'Two Pair', cards: sorted, tiebreaker: twoPair }
    }
    
    const onePair = this.isOnePair(sorted)
    if (onePair) {
      return { rank: 2, name: 'Pair', cards: sorted, tiebreaker: onePair }
    }
    
    const highCard = this.getHighCard(sorted)
    return { rank: 1, name: 'High Card', cards: sorted, tiebreaker: highCard }
  }

  /**
   * Compares two hands: returns 1 if hand1 wins, -1 if hand2 wins, 0 if tie
   */
  static compareHands(hand1: HandRanking, hand2: HandRanking): number {
    if (hand1.rank !== hand2.rank) {
      return hand1.rank > hand2.rank ? 1 : -1
    }
    
    // Same rank, compare tiebreakers
    for (let i = 0; i < Math.max(hand1.tiebreaker.length, hand2.tiebreaker.length); i++) {
      const val1 = hand1.tiebreaker[i] || 0
      const val2 = hand2.tiebreaker[i] || 0
      if (val1 !== val2) {
        return val1 > val2 ? 1 : -1
      }
    }
    
    return 0 // Perfect tie
  }

  // Hand checking methods

  private static isRoyalFlush(cards: Card[]): boolean {
    if (!this.isFlush(cards)) return false
    const values = cards.map(c => c.value).sort((a, b) => b - a)
    return values.join(',') === '14,13,12,11,10' // A,K,Q,J,10
  }

  private static isStraightFlush(cards: Card[]): number | false {
    if (!this.isFlush(cards)) return false
    return this.isStraight(cards)
  }

  private static isFourOfKind(cards: Card[]): number[] | false {
    const groups = this.groupByRank(cards)
    const fourKind = Object.entries(groups).find(([, cards]) => cards.length === 4)
    if (!fourKind) return false
    
    const quadValue = parseInt(fourKind[0])
    const kicker = Math.max(...cards.filter(c => c.value !== quadValue).map(c => c.value))
    return [quadValue, kicker]
  }

  private static isFullHouse(cards: Card[]): number[] | false {
    const groups = this.groupByRank(cards)
    const threeKind = Object.entries(groups).find(([, cards]) => cards.length === 3)
    const pair = Object.entries(groups).find(([, cards]) => cards.length === 2)
    
    if (!threeKind || !pair) return false
    return [parseInt(threeKind[0]), parseInt(pair[0])]
  }

  private static isFlush(cards: Card[]): number[] | false {
    const suits = cards.map(c => c.suit)
    if (new Set(suits).size !== 1) return false
    return cards.map(c => c.value).sort((a, b) => b - a)
  }

  private static isStraight(cards: Card[]): number | false {
    const values = [...new Set(cards.map(c => c.value))].sort((a, b) => b - a)
    if (values.length !== 5) return false
    
    // Check for regular straight
    for (let i = 0; i < values.length - 1; i++) {
      if (values[i] - values[i + 1] !== 1) {
        // Check for wheel (A-2-3-4-5)
        if (values.join(',') === '14,5,4,3,2') {
          return 5 // Wheel is valued at 5-high
        }
        return false
      }
    }
    
    return values[0] // Highest card in straight
  }

  private static isThreeOfKind(cards: Card[]): number[] | false {
    const groups = this.groupByRank(cards)
    const threeKind = Object.entries(groups).find(([, cards]) => cards.length === 3)
    if (!threeKind) return false
    
    const tripValue = parseInt(threeKind[0])
    const kickers = cards
      .filter(c => c.value !== tripValue)
      .map(c => c.value)
      .sort((a, b) => b - a)
    
    return [tripValue, ...kickers]
  }

  private static isTwoPair(cards: Card[]): number[] | false {
    const groups = this.groupByRank(cards)
    const pairs = Object.entries(groups)
      .filter(([, cards]) => cards.length === 2)
      .map(([value]) => parseInt(value))
      .sort((a, b) => b - a)
    
    if (pairs.length !== 2) return false
    
    const kicker = Math.max(
      ...cards.filter(c => !pairs.includes(c.value)).map(c => c.value)
    )
    
    return [...pairs, kicker]
  }

  private static isOnePair(cards: Card[]): number[] | false {
    const groups = this.groupByRank(cards)
    const pair = Object.entries(groups).find(([, cards]) => cards.length === 2)
    if (!pair) return false
    
    const pairValue = parseInt(pair[0])
    const kickers = cards
      .filter(c => c.value !== pairValue)
      .map(c => c.value)
      .sort((a, b) => b - a)
    
    return [pairValue, ...kickers]
  }

  private static getHighCard(cards: Card[]): number[] {
    return cards.map(c => c.value).sort((a, b) => b - a)
  }

  // Helper methods

  private static groupByRank(cards: Card[]): Record<number, Card[]> {
    const groups: Record<number, Card[]> = {}
    for (const card of cards) {
      if (!groups[card.value]) {
        groups[card.value] = []
      }
      groups[card.value].push(card)
    }
    return groups
  }

  private static getCombinations(cards: Card[], k: number): Card[][] {
    if (k === 0) return [[]]
    if (cards.length === 0) return []
    
    const [first, ...rest] = cards
    const withFirst = this.getCombinations(rest, k - 1).map(combo => [first, ...combo])
    const withoutFirst = this.getCombinations(rest, k)
    
    return [...withFirst, ...withoutFirst]
  }

  /**
   * Gets a formatted string representation of a hand
   */
  static formatHand(hand: HandRanking): string {
    const cardStrs = hand.cards.map(c => `${c.rank}${c.suit}`).join(' ')
    return `${hand.name} (${cardStrs})`
  }
}


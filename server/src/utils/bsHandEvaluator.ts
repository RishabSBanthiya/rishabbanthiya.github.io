import { Card, HandGuess, Rank, Suit } from '../types/bspoker.types'

/**
 * BS Poker Hand Evaluator
 * Evaluates whether a guessed hand exists in the pool of all cards
 * 2s are wild and can be used as any card
 */

const RANK_VALUES: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
  '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
}

const RANK_ORDER: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

export class BSHandEvaluator {
  /**
   * Check if a guessed hand exists in the given cards
   */
  static verifyGuess(allCards: Card[], guess: HandGuess): { exists: boolean; hand?: Card[] } {
    const { type, rank } = guess

    switch (type) {
      case 'high-card':
        return this.verifyHighCard(allCards, rank!)
      case 'pair':
        return this.verifyPair(allCards, rank!)
      case 'two-pair':
        return this.verifyTwoPair(allCards, rank!)
      case 'three-of-a-kind':
        return this.verifyThreeOfAKind(allCards, rank!)
      case 'four-of-a-kind':
        return this.verifyFourOfAKind(allCards, rank!)
      case 'straight':
        return this.verifyStraight(allCards)
      case 'flush':
        return this.verifyFlush(allCards)
      case 'full-house':
        return this.verifyFullHouse(allCards)
      case 'straight-flush':
        return this.verifyStraightFlush(allCards)
      default:
        return { exists: false }
    }
  }

  /**
   * Check if a specific card rank exists
   */
  private static verifyHighCard(allCards: Card[], rank: Rank): { exists: boolean; hand?: Card[] } {
    const found = allCards.find(c => c.rank === rank)
    return { exists: !!found, hand: found ? [found] : undefined }
  }

  /**
   * Check if a pair of a specific rank exists
   */
  private static verifyPair(allCards: Card[], rank: Rank): { exists: boolean; hand?: Card[] } {
    const matching = allCards.filter(c => c.rank === rank)
    const wilds = allCards.filter(c => c.rank === '2' && rank !== '2')
    
    const totalCount = matching.length + wilds.length
    
    if (totalCount >= 2) {
      const hand: Card[] = []
      hand.push(...matching.slice(0, 2))
      if (hand.length < 2) {
        hand.push(...wilds.slice(0, 2 - hand.length))
      }
      return { exists: true, hand }
    }
    
    return { exists: false }
  }

  /**
   * Check if two pair exists (with the higher rank specified)
   */
  private static verifyTwoPair(allCards: Card[], highRank: Rank): { exists: boolean; hand?: Card[] } {
    // Need to find two different pairs
    const wilds = allCards.filter(c => c.rank === '2')
    let wildsUsed = 0
    const pairs: Card[][] = []

    // First, try to make the high pair
    const highMatching = allCards.filter(c => c.rank === highRank)
    if (highMatching.length + wilds.length - wildsUsed >= 2) {
      const pair: Card[] = []
      pair.push(...highMatching.slice(0, 2))
      if (pair.length < 2) {
        const needed = 2 - pair.length
        pair.push(...wilds.slice(wildsUsed, wildsUsed + needed))
        wildsUsed += needed
      }
      pairs.push(pair)
    } else {
      return { exists: false }
    }

    // Now try to find any other pair
    for (const rank of RANK_ORDER.reverse()) {
      if (rank === highRank || rank === '2') continue
      
      const matching = allCards.filter(c => c.rank === rank)
      if (matching.length + wilds.length - wildsUsed >= 2) {
        const pair: Card[] = []
        pair.push(...matching.slice(0, 2))
        if (pair.length < 2) {
          const needed = 2 - pair.length
          pair.push(...wilds.slice(wildsUsed, wildsUsed + needed))
          wildsUsed += needed
        }
        pairs.push(pair)
        break
      }
    }

    if (pairs.length === 2) {
      return { exists: true, hand: [...pairs[0], ...pairs[1]] }
    }

    return { exists: false }
  }

  /**
   * Check if three of a kind exists
   */
  private static verifyThreeOfAKind(allCards: Card[], rank: Rank): { exists: boolean; hand?: Card[] } {
    const matching = allCards.filter(c => c.rank === rank)
    const wilds = allCards.filter(c => c.rank === '2' && rank !== '2')
    
    const totalCount = matching.length + wilds.length
    
    if (totalCount >= 3) {
      const hand: Card[] = []
      hand.push(...matching.slice(0, 3))
      if (hand.length < 3) {
        hand.push(...wilds.slice(0, 3 - hand.length))
      }
      return { exists: true, hand }
    }
    
    return { exists: false }
  }

  /**
   * Check if four of a kind exists
   */
  private static verifyFourOfAKind(allCards: Card[], rank: Rank): { exists: boolean; hand?: Card[] } {
    const matching = allCards.filter(c => c.rank === rank)
    const wilds = allCards.filter(c => c.rank === '2' && rank !== '2')
    
    const totalCount = matching.length + wilds.length
    
    if (totalCount >= 4) {
      const hand: Card[] = []
      hand.push(...matching.slice(0, 4))
      if (hand.length < 4) {
        hand.push(...wilds.slice(0, 4 - hand.length))
      }
      return { exists: true, hand }
    }
    
    return { exists: false }
  }

  /**
   * Check if a straight exists (5 consecutive cards, no wrapping)
   * A can be high (10-J-Q-K-A) or low (A-2-3-4-5)
   */
  private static verifyStraight(allCards: Card[]): { exists: boolean; hand?: Card[] } {
    const wilds = allCards.filter(c => c.rank === '2')
    
    // Try normal straights (2-3-4-5-6 through 10-J-Q-K-A)
    for (let startIdx = 0; startIdx <= RANK_ORDER.length - 5; startIdx++) {
      const hand: Card[] = []
      let wildsUsed = 0
      
      for (let i = 0; i < 5; i++) {
        const targetRank = RANK_ORDER[startIdx + i]
        
        // Skip wild 2s when looking for natural cards
        const found = allCards.find(c => c.rank === targetRank && c.rank !== '2' && !hand.includes(c))
        
        if (found) {
          hand.push(found)
        } else if (wildsUsed < wilds.length) {
          hand.push(wilds[wildsUsed])
          wildsUsed++
        } else {
          break
        }
      }
      
      if (hand.length === 5) {
        return { exists: true, hand }
      }
    }
    
    // Try wheel (A-2-3-4-5) separately if we have an Ace
    const hasAce = allCards.some(c => c.rank === 'A')
    if (hasAce) {
      const hand: Card[] = []
      let wildsUsed = 0
      const wheelRanks: Rank[] = ['A', '2', '3', '4', '5']
      
      for (const targetRank of wheelRanks) {
        const found = allCards.find(c => c.rank === targetRank && c.rank !== '2' && !hand.includes(c))
        
        if (found) {
          hand.push(found)
        } else if (wildsUsed < wilds.length) {
          hand.push(wilds[wildsUsed])
          wildsUsed++
        } else {
          break
        }
      }
      
      if (hand.length === 5) {
        return { exists: true, hand }
      }
    }
    
    return { exists: false }
  }

  /**
   * Check if a flush exists (5 cards of the same suit)
   */
  private static verifyFlush(allCards: Card[]): { exists: boolean; hand?: Card[] } {
    const suits: Suit[] = ['♠', '♥', '♦', '♣']
    const wilds = allCards.filter(c => c.rank === '2')
    
    for (const suit of suits) {
      const suitCards = allCards.filter(c => c.suit === suit && c.rank !== '2')
      const totalCount = suitCards.length + wilds.length
      
      if (totalCount >= 5) {
        const hand: Card[] = [...suitCards.slice(0, 5)]
        if (hand.length < 5) {
          hand.push(...wilds.slice(0, 5 - hand.length))
        }
        return { exists: true, hand }
      }
    }
    
    return { exists: false }
  }

  /**
   * Check if a full house exists (three of a kind + pair)
   */
  private static verifyFullHouse(allCards: Card[]): { exists: boolean; hand?: Card[] } {
    const wilds = allCards.filter(c => c.rank === '2')
    
    // Try to find three of a kind first
    for (const rank1 of RANK_ORDER) {
      if (rank1 === '2') continue
      
      const matching1 = allCards.filter(c => c.rank === rank1)
      
      if (matching1.length + wilds.length < 3) continue
      
      const trips: Card[] = [...matching1.slice(0, 3)]
      if (trips.length < 3) {
        trips.push(...wilds.slice(0, 3 - trips.length))
      }
      
      // Now find a pair of a different rank
      for (const rank2 of RANK_ORDER) {
        if (rank2 === rank1 || rank2 === '2') continue
        
        const matching2 = allCards.filter(c => c.rank === rank2 && !trips.includes(c))
        const wildsLeft = wilds.filter(c => !trips.includes(c))
        
        if (matching2.length + wildsLeft.length >= 2) {
          const pair: Card[] = [...matching2.slice(0, 2)]
          if (pair.length < 2) {
            pair.push(...wildsLeft.slice(0, 2 - pair.length))
          }
          return { exists: true, hand: [...trips, ...pair] }
        }
      }
    }
    
    return { exists: false }
  }

  /**
   * Check if a straight flush exists (5 consecutive cards of same suit)
   */
  private static verifyStraightFlush(allCards: Card[]): { exists: boolean; hand?: Card[] } {
    const suits: Suit[] = ['♠', '♥', '♦', '♣']
    const wilds = allCards.filter(c => c.rank === '2')
    
    for (const suit of suits) {
      const suitCards = allCards.filter(c => c.suit === suit && c.rank !== '2')
      
      // Try normal straights (2-3-4-5-6 through 10-J-Q-K-A)
      for (let startIdx = 0; startIdx <= RANK_ORDER.length - 5; startIdx++) {
        const hand: Card[] = []
        let wildsUsed = 0
        
        for (let i = 0; i < 5; i++) {
          const targetRank = RANK_ORDER[startIdx + i]
          
          const found = suitCards.find(c => c.rank === targetRank && !hand.includes(c))
          
          if (found) {
            hand.push(found)
          } else if (wildsUsed < wilds.length) {
            hand.push(wilds[wildsUsed])
            wildsUsed++
          } else {
            break
          }
        }
        
        if (hand.length === 5) {
          return { exists: true, hand }
        }
      }
      
      // Try wheel (A-2-3-4-5) in this suit
      const hasAce = suitCards.some(c => c.rank === 'A')
      if (hasAce) {
        const hand: Card[] = []
        let wildsUsed = 0
        const wheelRanks: Rank[] = ['A', '2', '3', '4', '5']
        
        for (const targetRank of wheelRanks) {
          const found = suitCards.find(c => c.rank === targetRank && !hand.includes(c))
          
          if (found) {
            hand.push(found)
          } else if (wildsUsed < wilds.length) {
            hand.push(wilds[wildsUsed])
            wildsUsed++
          } else {
            break
          }
        }
        
        if (hand.length === 5) {
          return { exists: true, hand }
        }
      }
    }
    
    return { exists: false }
  }

  /**
   * Compare two guesses to see which is higher
   * Returns true if guess1 > guess2
   */
  static isHigherGuess(guess1: HandGuess, guess2: HandGuess): boolean {
    const rank1 = this.getHandRank(guess1)
    const rank2 = this.getHandRank(guess2)
    
    if (rank1 !== rank2) {
      return rank1 > rank2
    }
    
    // Same hand type, compare the rank (for applicable hands)
    if (guess1.rank && guess2.rank) {
      return RANK_VALUES[guess1.rank] > RANK_VALUES[guess2.rank]
    }
    
    return false
  }

  /**
   * Get numeric rank for hand type
   */
  private static getHandRank(guess: HandGuess): number {
    const baseRanks: Record<string, number> = {
      'high-card': 1,
      'pair': 2,
      'two-pair': 3,
      'three-of-a-kind': 4,
      'straight': 5,
      'flush': 6,
      'full-house': 7,
      'four-of-a-kind': 8,
      'straight-flush': 9
    }
    
    return baseRanks[guess.type] || 0
  }
}


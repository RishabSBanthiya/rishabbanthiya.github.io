# BS Poker (Liar's Poker) - Game Guide

## Overview

BS Poker, also known as Liar's Poker, is a multiplayer card game based on probability, memory, and deception. Unlike traditional poker, players don't just play their own cards - they make guesses about the highest poker hand that can be formed by combining ALL players' cards at the table.

Based on the rules from [Nat Eliason's blog post](https://www.nateliason.com/blog/liars-poker).

## How to Play

### Starting the Game

1. Open the terminal on the website
2. Type `play bspoker` to launch the game
3. Create a room or join an existing one
4. Wait for at least 2 players to join
5. Any player can type `start` to begin

### Basic Rules

1. **Starting Cards**: Each player begins with 2 cards (face down, hidden from other players)

2. **Making Guesses**: Players take turns guessing what they think is the highest poker hand that exists at the table by combining ALL cards that are currently in play

3. **Escalation**: Each guess must be HIGHER than the previous guess

4. **Calling BS**: Instead of making a higher guess, any player can call "bullshit" on the current guess

5. **Revealing**: When someone calls bullshit:
   - All cards are revealed
   - If the guessed hand EXISTS (using all cards at the table): The caller loses
   - If the guessed hand DOES NOT exist: The guesser loses

6. **Losing a Round**: The loser gets an extra card in the next round

7. **Game Over**: If a player reaches 6 cards, they're OUT of the game. Last player standing wins!

## Wild Cards

**2s are WILD!** Any 2 can be used as any card to complete a hand.

## Hand Rankings

Standard Texas Hold'em poker hands, in order from lowest to highest:

1. **High Card** - Single card (e.g., "Ace high")
2. **Pair** - Two cards of the same rank (e.g., "Pair of Kings")
3. **Two Pair** - Two different pairs
4. **Three of a Kind** - Three cards of the same rank
5. **Straight** - Five consecutive cards (A can be high: 10-J-Q-K-A, or low: A-2-3-4-5)
6. **Flush** - Five cards of the same suit
7. **Full House** - Three of a kind + a pair
8. **Four of a Kind** - Four cards of the same rank
9. **Straight Flush** - Five consecutive cards of the same suit

**Note**: Unlike the original rules, this implementation uses standard Texas Hold'em hands only. No extended hands (6+ cards) are supported to keep the game simple and strategy-focused.

## Strategy Tips

1. **Mix Truth and Lies**: Good players combine truthful guesses with complete lies to keep opponents guessing

2. **Set Traps**: Lie about having certain cards early, then call BS when someone builds a hand using your "imaginary" cards

3. **Table Position**: Make the most aggressive bet you can without the next person calling BS, trying to prevent the turn from coming back to you

4. **Remember the Cards**: Keep track of what cards have been claimed in guesses

5. **Progressive Betting**: In later rounds when everyone has more cards, you can make more aggressive opening bets (like "four of a kind" on the first turn)

## Commands

### In Lobby
- `1`, `2`, `3` - Navigate menu options
- `name <text>` - Set room/player name
- `pass <text>` - Set password
- `players <2-8>` - Set max players
- `public` - Toggle public/private room
- `create` - Create the room
- `join` - Join a room
- `back` - Return to menu

### In Game
- `guess <type> <rank>` - Make a guess
  - Examples:
    - `guess pair K` - Guess a pair of Kings
    - `guess flush` - Guess a flush
    - `guess straight` - Guess a straight
    - `guess three-of-a-kind A` - Guess three Aces
- `bs` or `bullshit` - Call BS on current guess
- `start` - Start the game (in waiting phase)
- `next` or `continue` - Continue to next round (after round ends)
- `leave` - Leave the room

## Example Round

**Setup**: 3 players with 2 cards each (6 cards total on table)

1. **Player A** has: [K♠] [3♦]
2. **Player B** has: [K♥] [7♣]
3. **Player C** has: [2♦] [9♠]

**Turn Sequence**:
1. Player A: "Pair of Kings" (truthful - sees one King, knows there's another)
2. Player B: "Two Pair, Kings high" (risky - guessing another pair exists)
3. Player C: "Three Kings" (using the wild 2 as a King - very aggressive!)
4. Player A: Calls "BS!"

**Reveal**:
- Cards shown: [K♠] [3♦] [K♥] [7♣] [2♦] [9♠]
- Three Kings CAN be made: K♠ + K♥ + 2♦ (wild 2 counts as K♦)
- Player A loses! Player A now has 3 cards for next round

## Table Talk

Encouraged! Players can:
- Claim they lied about previous guesses
- Lie about lying
- Try to convince others to call BS
- Boast about their cards (truthfully or not)

This adds to the psychological element of the game!

## Room Settings

- **Max Players**: 2-8 (optimal: 4-6)
- **Public/Private**: Public rooms appear in the lobby, private require room ID
- **Password**: Optional password protection
- **Game Duration**: Typically 20-45 minutes with 4-6 players

## Technical Notes

- Uses WebSocket for real-time multiplayer
- Cards are hidden from other players until reveal
- Server validates all guesses and hand combinations
- Automatic wild card detection (2s)
- Standard Texas Hold'em hands only (no extended hands)
- Straights: A can be high (10-J-Q-K-A) or low (A-2-3-4-5), but no wrapping


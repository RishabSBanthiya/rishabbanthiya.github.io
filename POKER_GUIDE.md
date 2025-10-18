# Terminal Poker Room - User Guide

## 🎮 Getting Started

### Starting the Application

1. **Start the Poker Server**
   ```bash
   cd server
   npm install  # First time only
   npm run dev
   ```
   Server will run on `http://localhost:3001`

2. **Start the Portfolio Website**
   ```bash
   cd ..  # Back to root
   npm install  # First time only
   npm run dev
   ```
   Website will run on `http://localhost:5173` (or similar)

3. **Open the Terminal**
   - Navigate to the website
   - The terminal interface will load automatically
   - Type `help` to see all available commands

## 🃏 Playing Poker

### Launching the Game

In the terminal, type:
```bash
play poker
```

This will open the Terminal Poker Room interface.

### Creating a Room

1. Select **[1] Create New Room**
2. Fill in the details:
   - **Room Name**: Give your room a memorable name
   - **Password** (optional): Protect your room
   - **Max Players**: 2-6 players
   - **Buy-in**: Starting chips ($500 - $10,000)
   - **Make Public**: Check to list in public rooms

3. Click **Create Room**
4. Share the **Room ID** with friends (e.g., `HST-A4F9`)

### Joining a Room

#### Join Private Room:
1. Select **[2] Join Private Room**
2. Enter your **Player Name**
3. Enter the **Room ID** (from your friend)
4. Enter **Password** (if required)
5. Click **Join Room**

#### Join Public Room:
1. Select **[3] Browse Public Rooms**
2. Browse the list of available rooms
3. Click **Join** on any room with open seats

## 🎯 Game Rules

### Texas Hold'em Basics

- Each player receives **2 hole cards** (private)
- **5 community cards** are dealt face-up
- Make the best 5-card hand from your 2 cards + 5 community cards
- Best hand wins the pot!

### Betting Rounds

1. **Pre-flop**: After receiving your 2 cards
2. **Flop**: After 3 community cards are revealed
3. **Turn**: After 4th community card
4. **River**: After 5th (final) community card
5. **Showdown**: Remaining players reveal hands

### Available Actions

When it's your turn, you can:

- **Fold** 🚫
  - Give up your hand
  - Cannot win the pot
  - No chips lost (beyond current bet)

- **Check** ✓
  - Pass action to next player
  - Only available if no bet to call
  - Stay in the hand for free

- **Call** 💰
  - Match the current bet
  - Stay in the hand
  - Chips go into the pot

- **Raise** 📈
  - Increase the bet
  - Must be at least 2x current bet
  - Other players must call or fold

- **All-In** 🔥
  - Bet all remaining chips
  - Can still win pot even if others bet more
  - High risk, high reward

### Hand Rankings (Best to Worst)

1. **Royal Flush** 👑
   - A♠ K♠ Q♠ J♠ 10♠
   - Unbeatable!

2. **Straight Flush** 
   - Five consecutive cards, same suit
   - Example: 9♥ 8♥ 7♥ 6♥ 5♥

3. **Four of a Kind** 
   - Four cards of same rank
   - Example: K♠ K♥ K♦ K♣ 5♠

4. **Full House** 
   - Three of a kind + pair
   - Example: A♠ A♥ A♦ 7♣ 7♠

5. **Flush** 
   - Five cards, same suit
   - Example: K♦ J♦ 8♦ 4♦ 2♦

6. **Straight** 
   - Five consecutive cards
   - Example: 9♠ 8♥ 7♦ 6♣ 5♠

7. **Three of a Kind** 
   - Three cards of same rank
   - Example: Q♠ Q♥ Q♦ 9♣ 4♠

8. **Two Pair** 
   - Two different pairs
   - Example: J♠ J♥ 8♦ 8♣ K♠

9. **Pair** 
   - Two cards of same rank
   - Example: 10♠ 10♥ A♦ 7♣ 3♠

10. **High Card** 
    - No matching cards
    - Highest card wins
    - Example: A♠ K♦ 9♣ 6♥ 2♠

## 🎲 Tips & Strategy

### For Beginners

1. **Start Conservative**
   - Fold weak hands (anything below pair or high cards)
   - Only play strong starting hands initially

2. **Watch Your Position**
   - Being the dealer (🔴 D) is advantageous
   - You act last and have more information

3. **Don't Chase Bad Hands**
   - If you need specific cards to win, fold
   - Chasing rarely pays off

4. **Manage Your Chips**
   - Don't go all-in on weak hands
   - Preserve chips for better opportunities

### Strong Starting Hands

**Premium Hands** (Always play):
- Pairs: A-A, K-K, Q-Q, J-J
- High cards: A-K, A-Q

**Good Hands** (Play in most situations):
- Pairs: 10-10, 9-9, 8-8
- High cards: A-J, K-Q

**Playable Hands** (Play cautiously):
- Pairs: 7-7, 6-6
- Connected cards: Q-J, J-10
- Suited cards: A-x same suit

## 💡 Features

### Session Persistence
- Your player name is saved
- Automatically rejoin if disconnected
- Room state persists across browser refreshes

### Real-time Updates
- Instant action updates
- Live player status
- Real-time pot calculation
- Automatic winner detection

### Smart Interface
- Color-coded players
- Turn indicators
- Hand history
- Chip counts

## 🔧 Troubleshooting

### "Failed to connect to server"
- Make sure poker server is running: `cd server && npm run dev`
- Check server is on port 3001
- Refresh the page

### "Room not found"
- Room may have been deleted (empty for 4+ hours)
- Check Room ID is correct
- Ask for a new Room ID

### "Cannot join room"
- Room may be full
- Password might be incorrect
- Try creating a new room instead

### Game freezes / No updates
- Check internet connection
- Refresh the page (will attempt to rejoin)
- Leave and rejoin the room

## 🎯 Testing Multiplayer

To test with multiple players locally:

1. Open the website in **multiple browser windows** or **different browsers**
2. In **Window 1**: Create a room and note the Room ID
3. In **Window 2**: Join using that Room ID
4. Game starts automatically when 2+ players join!

**Pro tip**: Use Chrome, Firefox, and Safari simultaneously for 3+ player testing.

## 📱 Keyboard Shortcuts

When in poker game:
- `ESC` - Leave game (click Leave button)
- `Tab` - Navigate between buttons
- `Enter` - Confirm action

## 🎮 Example Game Flow

```
1. You: Create room "Friday Night Poker"
   Room ID: FRI-A4F9

2. Friend joins with Room ID

3. Game auto-starts (2/6 players)

4. Pre-flop: You get A♠ K♥ (strong hand!)
   → Small blind posts $10
   → Big blind posts $20
   → Your turn: RAISE to $60

5. Opponent: CALLS $60

6. Flop: A♦ K♠ 7♣
   → You have TWO PAIR! 
   → Opponent: CHECKS
   → You: BET $100

7. Opponent: CALLS $100

8. Turn: 2♥
   → Opponent: CHECKS
   → You: BET $200

9. Opponent: FOLDS
   → You WIN $420! 🎉

10. Next hand begins automatically...
```

## 🏆 Winning

The game automatically:
- Evaluates hands at showdown
- Determines winner(s)
- Distributes pot
- Handles ties (split pot)
- Starts next hand after 5 seconds

## 🎊 Have Fun!

Poker is a game of:
- **Skill** - Making the right decisions
- **Psychology** - Reading your opponents
- **Patience** - Waiting for good hands
- **Luck** - Sometimes you need the cards!

Good luck at the tables! 🃏


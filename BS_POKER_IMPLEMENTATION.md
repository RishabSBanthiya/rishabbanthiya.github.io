# BS Poker (Liar's Poker) - Implementation Guide

## Architecture Overview

BS Poker follows a client-server architecture with real-time WebSocket communication, similar to the Texas Hold'em poker implementation.

### Technology Stack

**Frontend:**
- React + TypeScript
- Socket.io Client
- CSS (reusing poker.css)

**Backend:**
- Node.js + Express
- Socket.io Server
- TypeScript

## Project Structure

```
rishabbanthiya.github.io/
├── src/
│   ├── components/
│   │   ├── bspoker/
│   │   │   ├── BSPokerGame.tsx      # Main game container
│   │   │   ├── BSPokerLobby.tsx     # Room creation/joining UI
│   │   │   └── BSPokerTable.tsx     # Game table UI
│   │   └── Terminal.tsx             # Terminal interface (updated)
│   ├── hooks/
│   │   └── useBSPokerSocket.ts      # Socket.io hook
│   ├── types/
│   │   └── bspoker.types.ts         # TypeScript types
│   └── styles/
│       └── poker.css                # Shared styles
├── server/
│   └── src/
│       ├── game/
│       │   ├── BSPokerRoom.ts       # Game logic
│       │   └── BSRoomManager.ts     # Room management
│       ├── types/
│       │   └── bspoker.types.ts     # Server types
│       ├── utils/
│       │   └── bsHandEvaluator.ts   # Hand evaluation
│       └── server.ts                # Server entry (updated)
├── BS_POKER_GUIDE.md
└── BS_POKER_IMPLEMENTATION.md
```

## Core Components

### 1. Type Definitions (`bspoker.types.ts`)

Defines all game types:

```typescript
// Key types
- Card: Rank, Suit, Symbol, Value
- HandGuess: Type, Rank, Description (standard 5-card hands)
- BSPlayer: ID, Name, Cards, Card count, Status
- BSGameState: Players, Current guess, Phase, History
- BSRoom: Config, Players, Game state, Status
```

### 2. Hand Evaluator (`bsHandEvaluator.ts`)

Validates guessed hands against all cards in play:

**Key Features:**
- Wild card support (2s)
- Standard Texas Hold'em hand validation
- Hand comparison logic
- Straight support (A-2-3-4-5 low, 10-J-Q-K-A high, no wrapping)

**Methods:**
- `verifyGuess()` - Check if hand exists in card pool
- `isHigherGuess()` - Compare two guesses
- `verifyPair()`, `verifyFlush()`, etc. - Specific hand validators

### 3. Game Room (`BSPokerRoom.ts`)

Manages individual game instances:

**Key Methods:**
- `addPlayer()` - Add player to room
- `removePlayer()` - Remove player from room
- `startGame()` - Initialize game
- `startNewRound()` - Deal cards for new round
- `handleAction()` - Process player actions
- `handleGuess()` - Process guess action
- `handleBullshit()` - Process BS call, reveal cards
- `continueToNextRound()` - Start next round after result
- `getGameStateForPlayer()` - Get state with hidden cards

### 4. Room Manager (`BSRoomManager.ts`)

Manages multiple rooms:

**Key Methods:**
- `createRoom()` - Create new room with config
- `joinRoom()` - Add player to existing room
- `getPublicRooms()` - List public rooms
- `removePlayer()` - Remove player and cleanup
- `handleAction()` - Delegate action to room
- `cleanupOldRooms()` - Remove empty old rooms

### 5. Socket Hook (`useBSPokerSocket.ts`)

Client-side WebSocket communication:

**Exposed Methods:**
- `createRoom()` - Create room
- `joinRoom()` - Join room
- `leaveRoom()` - Leave room
- `makeAction()` - Send action
- `startGame()` - Start game
- `nextRound()` - Continue to next round
- `listRooms()` - Get public rooms

**Socket Events:**
- `bspoker:room-joined` - Successfully joined
- `bspoker:room-updated` - Room state changed
- `bspoker:game-state` - Game state updated
- `bspoker:round-end` - Round result
- `bspoker:player-left` - Player disconnected
- `bspoker:error` - Error occurred

### 6. React Components

#### BSPokerGame.tsx
- Main container component
- Manages draggable window
- Handles connection state
- Routes between lobby and table

#### BSPokerLobby.tsx
- Room creation interface
- Room joining interface
- Public room browser
- CLI-style interface

#### BSPokerTable.tsx
- Game table display
- Player cards and status
- Guess input and BS button
- Round result display
- CLI-style interface

## Game Flow

### 1. Room Creation/Joining

```
Client                Server                BSRoomManager
  |                     |                        |
  |--create-room------->|                        |
  |                     |----createRoom()------->|
  |                     |<---Room---------------|
  |<--room-joined-------|                        |
```

### 2. Starting Game

```
Client                Server                BSPokerRoom
  |                     |                      |
  |--start-game-------->|                      |
  |                     |----startGame()------>|
  |                     |                      |-Deal cards
  |                     |                      |-Initialize state
  |<--game-state--------|<--GameState---------|
```

### 3. Making Guess

```
Client                Server                BSPokerRoom
  |                     |                      |
  |--action(guess)----->|                      |
  |                     |----handleAction()--->|
  |                     |                      |-Validate guess
  |                     |                      |-Update state
  |<--game-state--------|<--GameState---------|
```

### 4. Calling BS

```
Client                Server                BSPokerRoom     BSHandEvaluator
  |                     |                      |                  |
  |--action(bs)-------->|                      |                  |
  |                     |----handleAction()--->|                  |
  |                     |                      |--verifyGuess()--->|
  |                     |                      |<--Result---------|
  |                     |                      |-Determine loser  |
  |                     |                      |-Update cards     |
  |<--round-end---------|<--RoundResult-------|                  |
```

### 5. Next Round

```
Client                Server                BSPokerRoom
  |                     |                      |
  |--next-round-------->|                      |
  |                     |----continueNext()--->|
  |                     |                      |-Deal new cards
  |                     |                      |-Reset state
  |<--game-state--------|<--GameState---------|
```

## WebSocket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `bspoker:create-room` | `CreateBSRoomRequest` | Create new room |
| `bspoker:join-room` | `JoinBSRoomRequest` | Join existing room |
| `bspoker:leave-room` | - | Leave current room |
| `bspoker:start-game` | - | Start game in room |
| `bspoker:action` | `BSPokerAction` | Make game action |
| `bspoker:next-round` | - | Continue to next round |
| `bspoker:list-rooms` | - | Get public rooms |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `bspoker:room-joined` | `BSRoom` | Successfully joined room |
| `bspoker:room-updated` | `BSRoom` | Room state changed |
| `bspoker:game-state` | `BSGameState` | Game state updated |
| `bspoker:player-action` | `playerId`, `action` | Player made action |
| `bspoker:round-end` | `BSRoundResult` | Round ended |
| `bspoker:game-finished` | - | Game finished |
| `bspoker:player-left` | `playerId` | Player left room |
| `bspoker:error` | `string` | Error occurred |

## Hand Evaluation Algorithm

### Wild Card Support

```typescript
// When checking for N of a kind:
const matching = cards.filter(c => c.rank === targetRank)
const wilds = cards.filter(c => c.rank === '2')
const totalCount = matching.length + wilds.length

if (totalCount >= N) {
  // Hand exists!
}
```

### Straight Detection

```typescript
// Try all possible starting points (2-3-4-5-6 through 10-J-Q-K-A)
for (startIdx = 0; startIdx <= RANK_ORDER.length - 5; startIdx++) {
  // Try to build 5 consecutive cards
  // Use natural cards first, then wilds
}

// Also check for wheel (A-2-3-4-5) as special case
if (hasAce) {
  // Check A-2-3-4-5 combination
}
```

### Flush Detection

```typescript
// For each suit
for (suit of suits) {
  const suitCards = cards.filter(c => c.suit === suit && c.rank !== '2')
  const totalCount = suitCards.length + wilds.length
  
  if (totalCount >= 5) {
    // Flush exists!
  }
}
```

## State Management

### Server State

Each `BSPokerRoom` maintains:
- Room configuration
- Player list with card counts
- Current game state
- Deck of cards

### Client State

Each client maintains:
- Socket connection
- Current room info
- Game state (with hidden cards for others)
- Round result
- Error state

### State Synchronization

1. Server is source of truth
2. Clients receive filtered game state
3. Cards hidden until reveal phase
4. Real-time updates via WebSocket

## Security Considerations

1. **Card Privacy**: Other players' cards hidden until reveal
2. **Action Validation**: Server validates all actions
3. **Room Access**: Password protection available
4. **Cheat Prevention**: Server-side hand evaluation

## Performance Optimizations

1. **Efficient Hand Checking**: Early exit when hand found
2. **Wild Card Optimization**: Check natural cards first
3. **State Updates**: Only send necessary data
4. **Room Cleanup**: Automatic cleanup of empty rooms

## Testing Strategy

### Unit Tests
- Hand evaluator logic
- Card dealing
- Guess validation

### Integration Tests
- Room creation/joining
- Game flow
- Action handling

### E2E Tests
- Full game playthrough
- Multi-player scenarios
- Edge cases (disconnects, etc.)

## Design Decisions

### Why Standard Hands Only?

This implementation uses standard Texas Hold'em hands instead of the extended hands (6+ cards) from the original rules:

1. **Simplicity**: Easier to learn and play, especially for poker players
2. **Strategy Focus**: Players focus on bluffing and memory rather than complex hand calculations
3. **Faster Gameplay**: Reduces decision paralysis with too many hand options
4. **Balanced Progression**: Card count increases naturally create more possibilities without needing extended hands

### Straight Rules

- A can be high (10-J-Q-K-A) or low (A-2-3-4-5)
- No wrapping straights (e.g., K-A-2-3-4 is not valid)
- This matches standard Texas Hold'em rules

## Future Enhancements

1. **Game Variants**
   - Liar's Hold'em (community cards)
   - Custom card count progression
   - Tournament mode

2. **UI Improvements**
   - Visual card display
   - Animation for reveals
   - Hand probability calculator

3. **Social Features**
   - Chat during games
   - Player stats/leaderboard
   - Replay functionality

4. **AI Player**
   - Bot opponents
   - Difficulty levels
   - Strategy analysis

## Deployment

### Local Development

1. Start server:
```bash
cd server
npm install
npm run dev
```

2. Start client:
```bash
npm install
npm run dev
```

### Production

1. Build client:
```bash
npm run build
```

2. Deploy server to hosting service
3. Configure WebSocket URL in production

## Troubleshooting

### Connection Issues
- Verify server is running on port 3001
- Check firewall settings
- Confirm WebSocket support

### Game State Issues
- Check server logs
- Verify hand evaluation logic
- Ensure proper state synchronization

### Performance Issues
- Monitor room count
- Check for memory leaks
- Optimize hand evaluation

## Resources

- [Original Rules by Nat Eliason](https://www.nateliason.com/blog/liars-poker)
- [Socket.io Documentation](https://socket.io/docs/)
- [Poker Hand Rankings](https://en.wikipedia.org/wiki/List_of_poker_hands)


# Terminal Poker Room - Server

WebSocket-based multiplayer poker server with Twitter integration, built with Express and Socket.io.

## Features

- 🎮 Real-time multiplayer poker games (Texas Hold'em & BS Poker)
- 🏠 Private and public room system
- 🔐 Password-protected rooms
- 🃏 Full Texas Hold'em implementation
- 🎴 BS Poker (Liar's Poker) with wild 2s
- 🎯 Automatic hand evaluation
- 💾 Session persistence
- 🧹 Automatic room cleanup
- 🐦 Twitter/X API integration for `journalctl` command

## Quick Start

### Installation

```bash
cd server
npm install
```

### Development

```bash
npm run dev
```

Server will start on `http://localhost:3001`

### Production

```bash
npm run build
npm start
```

## API Endpoints

### HTTP

- `GET /health` - Health check endpoint
- `GET /api/tweets/:username?count=10` - Fetch recent tweets (for `journalctl` command)
  - Supports Twitter API v2 (with Bearer Token) or RSS fallback
  - Returns JSON with tweet data

### WebSocket Events

#### Client -> Server

- `poker:create-room` - Create a new poker room
- `poker:join-room` - Join an existing room
- `poker:leave-room` - Leave current room
- `poker:list-rooms` - Get list of public rooms
- `poker:room-info` - Get info about a specific room
- `poker:action` - Make a poker action (fold, check, call, raise, all-in)

#### Server -> Client

- `poker:room-joined` - Successfully joined a room
- `poker:room-updated` - Room state changed
- `poker:game-state` - Game state updated
- `poker:player-action` - Another player made an action
- `poker:round-start` - New betting round started
- `poker:round-end` - Hand completed, winners announced
- `poker:player-joined` - New player joined room
- `poker:player-left` - Player left room
- `poker:error` - Error message

## Project Structure

```
server/
├── src/
│   ├── game/
│   │   ├── PokerRoom.ts       # Individual game logic
│   │   └── RoomManager.ts     # Multi-room management
│   ├── types/
│   │   └── poker.types.ts     # TypeScript interfaces
│   ├── utils/
│   │   ├── deckManager.ts     # Card deck utilities
│   │   └── handEvaluator.ts   # Poker hand ranking
│   └── server.ts              # Main server & Socket.io
├── package.json
└── tsconfig.json
```

## Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=3001

# Twitter API Configuration (Optional)
# Get your Bearer Token from: https://developer.twitter.com/en/portal/dashboard
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
```

### Twitter API Setup (Optional)

The `journalctl` command fetches tweets from @ri_shrub. For best results:

1. **Get Twitter API Access**:
   - Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
   - Create a new app or use an existing one
   - Generate a Bearer Token

2. **Configure Environment**:
   ```bash
   # In server/.env
   TWITTER_BEARER_TOKEN=your_actual_bearer_token_here
   ```

3. **Fallback**:
   - If no Bearer Token is set, the server uses RSS2JSON service
   - This may have rate limits or reliability issues
   - Twitter profile link is always shown as fallback

## Game Rules

### Texas Hold'em

- 2-6 players per table
- Each player receives 2 hole cards
- 5 community cards (flop, turn, river)
- Best 5-card hand wins
- Standard betting rounds: preflop, flop, turn, river

### Actions

- **Fold**: Give up your hand
- **Check**: Pass action (only if no bet to call)
- **Call**: Match the current bet
- **Raise**: Increase the bet (minimum 2x current bet)
- **All-In**: Bet all remaining chips

### Hand Rankings (Highest to Lowest)

1. Royal Flush
2. Straight Flush
3. Four of a Kind
4. Full House
5. Flush
6. Straight
7. Three of a Kind
8. Two Pair
9. Pair
10. High Card

## Testing

Test the server with a simple client:

```javascript
const io = require('socket.io-client')
const socket = io('http://localhost:3001')

socket.on('connect', () => {
  console.log('Connected!')
  
  // Create a room
  socket.emit('poker:create-room', {
    roomName: 'Test Room',
    maxPlayers: 4,
    buyIn: 1000,
    smallBlind: 10,
    bigBlind: 20,
    isPublic: true
  }, (result) => {
    console.log('Room created:', result)
  })
})
```

## Performance

- Handles multiple concurrent games
- Automatic cleanup of empty rooms (every hour)
- Efficient state synchronization
- Memory-safe card shuffling

## License

MIT


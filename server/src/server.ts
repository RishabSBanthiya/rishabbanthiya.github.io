import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import cors from 'cors'
import OAuth from 'oauth-1.0a'
import { RoomManager } from './game/RoomManager'
import {
  CreateRoomRequest,
  JoinRoomRequest,
  PokerAction,
  RoomListItem
} from './types/poker.types'
import { BSRoomManager } from './game/BSRoomManager'
import {
  CreateBSRoomRequest,
  JoinBSRoomRequest,
  BSPokerAction,
  BSRoomListItem
} from './types/bspoker.types'

const app = express()
const httpServer = createServer(app)

// Configure CORS for Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: '*', // In production, specify your domain
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// Central room managers
const roomManager = new RoomManager()
const bsRoomManager = new BSRoomManager()

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'online',
    pokerRooms: roomManager.getRoomCount(),
    pokerPlayers: roomManager.getTotalPlayers(),
    bsPokerRooms: bsRoomManager.getRoomCount(),
    bsPokerPlayers: bsRoomManager.getTotalPlayers(),
    uptime: process.uptime()
  })
})

// Twitter/X API endpoint
app.get('/api/tweets/:username', async (req, res) => {
  const { username } = req.params
  const count = parseInt(req.query.count as string) || 10

  try {
    // Check if Twitter API credentials are configured
    const consumerKey = process.env.TWITTER_CONSUMER_KEY
    const consumerSecret = process.env.TWITTER_CONSUMER_SECRET
    const accessToken = process.env.TWITTER_ACCESS_TOKEN
    const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET

    if (consumerKey && consumerSecret && accessToken && accessTokenSecret) {
      console.log(`🔍 Attempting to fetch tweets for @${username} using OAuth 1.0a`)
      
      // Set up OAuth 1.0a
      const oauth = new OAuth({
        consumer: { key: consumerKey, secret: consumerSecret },
        signature_method: 'HMAC-SHA1',
        hash_function: (baseString, key) => {
          const crypto = require('crypto')
          return crypto.createHmac('sha1', key).update(baseString).digest('base64')
        }
      })

      // Get user ID first
      const userRequestData = {
        url: `https://api.twitter.com/1.1/users/show.json?screen_name=${username}`,
        method: 'GET'
      }

      const userAuthHeader = oauth.toHeader(oauth.authorize(userRequestData, {
        key: accessToken,
        secret: accessTokenSecret
      }))

      const userResponse = await fetch(userRequestData.url, {
        headers: {
          ...userAuthHeader,
          'Content-Type': 'application/json'
        }
      })

      console.log(`📡 User lookup response status: ${userResponse.status}`)
      
      if (!userResponse.ok) {
        const errorText = await userResponse.text()
        console.log(`❌ Twitter API error: ${userResponse.status} - ${errorText}`)
        
        // If 401 Unauthorized, the credentials are invalid
        if (userResponse.status === 401) {
          res.status(401).json({
            success: false,
            error: 'Invalid Twitter OAuth Credentials',
            message: 'The provided OAuth credentials are invalid or expired',
            instructions: {
              step1: 'Go to https://developer.twitter.com/en/portal/dashboard',
              step2: 'Sign in with your @ri_shrub account',
              step3: 'Create a new app or regenerate OAuth credentials',
              step4: 'Ensure the app has "Read" permissions',
              step5: 'Update server/.env with the new credentials'
            },
            note: 'Current OAuth credentials appear to be invalid or expired'
          })
          return
        }
        
        // If 429 Too Many Requests, rate limit exceeded
        if (userResponse.status === 429) {
          res.status(429).json({
            success: false,
            error: 'Twitter API Rate Limit Exceeded',
            message: 'Too many requests to Twitter API. Please wait before trying again.',
            instructions: {
              step1: 'Wait 15-30 minutes for rate limit to reset',
              step2: 'Consider upgrading to Twitter API Pro for higher limits',
              step3: 'Or try again later when rate limit resets'
            },
            note: 'Free tier has strict rate limits. Try again in a few minutes.',
            retryAfter: 15 * 60 // 15 minutes in seconds
          })
          return
        }
        
        throw new Error(`Failed to get user info: ${userResponse.status} - ${errorText}`)
      }

      const userData = await userResponse.json() as { id_str: string }
      const userId = userData.id_str

      // Fetch tweets using OAuth 1.0a
      const tweetsRequestData = {
        url: `https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=${userId}&count=${Math.min(count, 200)}&tweet_mode=extended`,
        method: 'GET'
      }

      const tweetsAuthHeader = oauth.toHeader(oauth.authorize(tweetsRequestData, {
        key: accessToken,
        secret: accessTokenSecret
      }))

      const tweetsResponse = await fetch(tweetsRequestData.url, {
        headers: {
          ...tweetsAuthHeader,
          'Content-Type': 'application/json'
        }
      })

      console.log(`📡 Tweets response status: ${tweetsResponse.status}`)

      if (!tweetsResponse.ok) {
        const errorText = await tweetsResponse.text()
        console.log(`❌ Twitter API error: ${tweetsResponse.status} - ${errorText}`)
        throw new Error(`Failed to fetch tweets: ${tweetsResponse.status} - ${errorText}`)
      }

      const tweetsData = await tweetsResponse.json() as Array<{ 
        full_text: string; 
        created_at: string; 
        id_str: string;
        user: { screen_name: string }
      }>
      
      // Transform tweets to match expected format
      const tweets = tweetsData.map(tweet => ({
        text: tweet.full_text,
        created_at: tweet.created_at,
        url: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
      }))
      
      res.json({
        success: true,
        tweets: tweets,
        source: 'twitter-api-oauth'
      })
    } else {
      // No Twitter API configured - return helpful message
      res.status(501).json({
        success: false,
        error: 'Twitter API not configured',
        message: 'Please configure Twitter OAuth credentials',
        instructions: {
          step1: 'Get OAuth credentials from https://developer.twitter.com/en/portal/dashboard',
          step2: 'Create server/.env file',
          step3: 'Add: TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET',
          step4: 'Restart the server'
        },
        note: 'See TWITTER_API_SETUP.md for detailed instructions'
      })
      return
    }
  } catch (error) {
    console.error('Twitter API error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tweets',
      message: error instanceof Error ? error.message : 'Unknown error',
      note: 'Set Twitter OAuth credentials for Twitter API access'
    })
  }
})

// Socket.io connection handler
io.on('connection', (socket: Socket) => {
  console.log(`🔌 Player connected: ${socket.id}`)

  // Create room
  socket.on('poker:create-room', (config: CreateRoomRequest, callback) => {
    try {
      const room = roomManager.createRoom(socket.id, config)

      // Join the socket to the room
      socket.join(room.config.roomId)

      // Store room info on socket
      socket.data.roomId = room.config.roomId
      socket.data.playerId = socket.id

      callback({
        success: true,
        roomId: room.config.roomId
      })

      // Send initial room state
      socket.emit('poker:room-joined', room)

      console.log(`✓ Room ${room.config.roomId} created by ${socket.id}`)
    } catch (error) {
      console.error('Create room error:', error)
      callback({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create room'
      })
    }
  })

  // Join room
  socket.on('poker:join-room', (request: JoinRoomRequest, callback) => {
    try {
      const room = roomManager.joinRoom(
        socket.id,
        request.roomId,
        request.password,
        request.playerName
      )

      // Join the socket to the room
      socket.join(request.roomId)

      // Store room info on socket
      socket.data.roomId = request.roomId
      socket.data.playerId = socket.id

      callback({ success: true })

      // Notify all players in room
      io.to(request.roomId).emit('poker:room-updated', room)

      // Start game if minimum players reached and game not started
      if (room.players.length >= 2 && room.status === 'waiting') {
        setTimeout(() => {
          try {
            roomManager.startGame(request.roomId)
            const updatedRoom = roomManager.getRoom(request.roomId)
            if (updatedRoom) {
              io.to(request.roomId).emit('poker:room-updated', updatedRoom)
              io.to(request.roomId).emit('poker:game-state', updatedRoom.gameState)
            }
          } catch (error) {
            console.error('Start game error:', error)
          }
        }, 3000)
      }

      console.log(`✓ ${request.playerName} joined room ${request.roomId}`)
    } catch (error) {
      console.error('Join room error:', error)
      callback({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to join room'
      })
    }
  })

  // List public rooms
  socket.on('poker:list-rooms', (callback: (rooms: RoomListItem[]) => void) => {
    try {
      const rooms = roomManager.getPublicRooms()
      callback(rooms)
    } catch (error) {
      console.error('List rooms error:', error)
      callback([])
    }
  })

  // Get room info
  socket.on('poker:room-info', (roomId: string, callback: (room: RoomListItem | null) => void) => {
    try {
      const room = roomManager.getRoomInfo(roomId)
      callback(room)
    } catch (error) {
      console.error('Room info error:', error)
      callback(null)
    }
  })

  // Leave room
  socket.on('poker:leave-room', () => {
    const roomId = socket.data.roomId
    if (roomId) {
      try {
        roomManager.removePlayer(roomId, socket.id)
        socket.leave(roomId)

        // Notify others
        const room = roomManager.getRoom(roomId)
        if (room) {
          io.to(roomId).emit('poker:player-left', socket.id)
          io.to(roomId).emit('poker:room-updated', room)
        }

        delete socket.data.roomId
        delete socket.data.playerId

        console.log(`✓ Player ${socket.id} left room ${roomId}`)
      } catch (error) {
        console.error('Leave room error:', error)
      }
    }
  })

  // Game action
  socket.on('poker:action', (action: PokerAction) => {
    const roomId = socket.data.roomId
    if (!roomId) {
      socket.emit('poker:error', 'Not in a room')
      return
    }

    try {
      const result = roomManager.handleAction(roomId, socket.id, action)

      if (result.success) {
        // Broadcast action to all players
        io.to(roomId).emit('poker:player-action', socket.id, action)

        // Send updated state
        const room = roomManager.getRoom(roomId)
        if (room) {
          io.to(roomId).emit('poker:game-state', room.gameState)
        }

        // Handle phase completion
        if (result.phaseComplete) {
          setTimeout(() => {
            const room = roomManager.getRoom(roomId)
            if (room && room.gameState) {
              io.to(roomId).emit('poker:round-start', room.gameState.phase)
              io.to(roomId).emit('poker:game-state', room.gameState)
            }
          }, 1500)
        }

        // Handle round completion (showdown)
        if (result.roundComplete || (room && room.gameState?.phase === 'showdown')) {
          const winners = roomManager.evaluateWinner(roomId)
          io.to(roomId).emit('poker:round-end', winners)

          // Start next hand after delay
          setTimeout(() => {
            try {
              roomManager.startNextHand(roomId)
              const updatedRoom = roomManager.getRoom(roomId)
              if (updatedRoom) {
                io.to(roomId).emit('poker:game-state', updatedRoom.gameState)
              }
            } catch (error) {
              console.error('Start next hand error:', error)
            }
          }, 5000)
        }
      } else {
        socket.emit('poker:error', result.error || 'Invalid action')
      }
    } catch (error) {
      console.error('Action error:', error)
      socket.emit('poker:error', error instanceof Error ? error.message : 'Action failed')
    }
  })

  // ===== BS POKER HANDLERS =====

  // Create BS Poker room
  socket.on('bspoker:create-room', (config: CreateBSRoomRequest, callback) => {
    try {
      const room = bsRoomManager.createRoom(socket.id, config)

      // Join the socket to the room
      socket.join(room.config.roomId)

      // Store room info on socket
      socket.data.bsRoomId = room.config.roomId
      socket.data.bsPlayerId = socket.id

      callback({
        success: true,
        roomId: room.config.roomId
      })

      // Send initial room state
      socket.emit('bspoker:room-joined', room)

      console.log(`✓ BS Poker room ${room.config.roomId} created by ${socket.id}`)
    } catch (error) {
      console.error('Create BS Poker room error:', error)
      callback({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create room'
      })
    }
  })

  // Join BS Poker room
  socket.on('bspoker:join-room', (request: JoinBSRoomRequest, callback) => {
    try {
      const room = bsRoomManager.joinRoom(
        socket.id,
        request.roomId,
        request.password,
        request.playerName
      )

      // Join the socket to the room
      socket.join(request.roomId)

      // Store room info on socket
      socket.data.bsRoomId = request.roomId
      socket.data.bsPlayerId = socket.id

      callback({ success: true })

      // Notify all players in room
      io.to(request.roomId).emit('bspoker:room-updated', room)

      console.log(`✓ ${request.playerName} joined BS Poker room ${request.roomId}`)
    } catch (error) {
      console.error('Join BS Poker room error:', error)
      callback({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to join room'
      })
    }
  })

  // List public BS Poker rooms
  socket.on('bspoker:list-rooms', (callback: (rooms: BSRoomListItem[]) => void) => {
    try {
      const rooms = bsRoomManager.getPublicRooms()
      callback(rooms)
    } catch (error) {
      console.error('List BS Poker rooms error:', error)
      callback([])
    }
  })

  // Start BS Poker game
  socket.on('bspoker:start-game', () => {
    const roomId = socket.data.bsRoomId
    if (!roomId) {
      socket.emit('bspoker:error', 'Not in a room')
      return
    }

    try {
      bsRoomManager.startGame(roomId)
      const room = bsRoomManager.getRoom(roomId)
      
      if (room) {
        // Notify all players
        io.to(roomId).emit('bspoker:room-updated', room)
        
        // Send game state to each player (with hidden cards for others)
        io.in(roomId).fetchSockets().then(sockets => {
          sockets.forEach(s => {
            const gameState = bsRoomManager.getGameStateForPlayer(roomId, s.id)
            s.emit('bspoker:game-state', gameState)
          })
        })
      }
      
      console.log(`✓ BS Poker game started in room ${roomId}`)
    } catch (error) {
      console.error('Start BS Poker game error:', error)
      socket.emit('bspoker:error', error instanceof Error ? error.message : 'Failed to start game')
    }
  })

  // Leave BS Poker room
  socket.on('bspoker:leave-room', () => {
    const roomId = socket.data.bsRoomId
    if (roomId) {
      try {
        bsRoomManager.removePlayer(roomId, socket.id)
        socket.leave(roomId)

        // Notify others
        const room = bsRoomManager.getRoom(roomId)
        if (room) {
          io.to(roomId).emit('bspoker:player-left', socket.id)
          io.to(roomId).emit('bspoker:room-updated', room)
        }

        delete socket.data.bsRoomId
        delete socket.data.bsPlayerId

        console.log(`✓ Player ${socket.id} left BS Poker room ${roomId}`)
      } catch (error) {
        console.error('Leave BS Poker room error:', error)
      }
    }
  })

  // BS Poker game action
  socket.on('bspoker:action', (action: BSPokerAction) => {
    const roomId = socket.data.bsRoomId
    if (!roomId) {
      socket.emit('bspoker:error', 'Not in a room')
      return
    }

    try {
      const result = bsRoomManager.handleAction(roomId, socket.id, action)

      // Broadcast action to all players
      io.to(roomId).emit('bspoker:player-action', socket.id, action)

      // Send updated state to each player (with hidden cards)
      io.in(roomId).fetchSockets().then(sockets => {
        sockets.forEach(s => {
          const gameState = bsRoomManager.getGameStateForPlayer(roomId, s.id)
          s.emit('bspoker:game-state', gameState)
        })
      })

      // If result exists, it means someone called bullshit
      if (result) {
        // Broadcast round result
        setTimeout(() => {
          io.to(roomId).emit('bspoker:round-end', result)

          // Check if game is finished
          const room = bsRoomManager.getRoom(roomId)
          if (room && room.status === 'finished') {
            io.to(roomId).emit('bspoker:game-finished')
          }
        }, 1000)
      }
    } catch (error) {
      console.error('BS Poker action error:', error)
      socket.emit('bspoker:error', error instanceof Error ? error.message : 'Action failed')
    }
  })

  // Continue to next round in BS Poker
  socket.on('bspoker:next-round', () => {
    const roomId = socket.data.bsRoomId
    if (!roomId) {
      socket.emit('bspoker:error', 'Not in a room')
      return
    }

    try {
      bsRoomManager.continueToNextRound(roomId)
      
      const room = bsRoomManager.getRoom(roomId)
      if (room) {
        io.to(roomId).emit('bspoker:room-updated', room)
        
        // Send new game state to each player
        io.in(roomId).fetchSockets().then(sockets => {
          sockets.forEach(s => {
            const gameState = bsRoomManager.getGameStateForPlayer(roomId, s.id)
            s.emit('bspoker:game-state', gameState)
          })
        })
      }
      
      console.log(`✓ BS Poker room ${roomId} starting next round`)
    } catch (error) {
      console.error('BS Poker next round error:', error)
      socket.emit('bspoker:error', error instanceof Error ? error.message : 'Failed to start next round')
    }
  })

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`🔌 Player disconnected: ${socket.id}`)
    const roomId = socket.data.roomId
    const bsRoomId = socket.data.bsRoomId

    // Handle poker room disconnect
    if (roomId) {
      try {
        const removed = roomManager.removePlayer(roomId, socket.id)

        if (removed) {
          const room = roomManager.getRoom(roomId)

          if (room) {
            // Notify others
            io.to(roomId).emit('poker:player-left', socket.id)
            io.to(roomId).emit('poker:room-updated', room)
          }
        }
      } catch (error) {
        console.error('Disconnect cleanup error:', error)
      }
    }

    // Handle BS poker room disconnect
    if (bsRoomId) {
      try {
        const removed = bsRoomManager.removePlayer(bsRoomId, socket.id)

        if (removed) {
          const room = bsRoomManager.getRoom(bsRoomId)

          if (room) {
            // Notify others
            io.to(bsRoomId).emit('bspoker:player-left', socket.id)
            io.to(bsRoomId).emit('bspoker:room-updated', room)
          }
        }
      } catch (error) {
        console.error('BS Poker disconnect cleanup error:', error)
      }
    }
  })
})

// Cleanup task - run every hour
setInterval(() => {
  console.log('🧹 Running room cleanup...')
  roomManager.cleanupOldRooms()
  bsRoomManager.cleanupOldRooms()
}, 60 * 60 * 1000)

// Start server
const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () => {
  const twitterStatus = process.env.TWITTER_ACCESS_TOKEN 
    ? '✓ Twitter API configured' 
    : '⚠ OAuth credentials needed'
    
  console.log(`
╔═══════════════════════════════════════╗
║   🃏  POKER SERVER ONLINE  🃏          ║
╠═══════════════════════════════════════╣
║  Port: ${PORT}                           ║
║  Games: Texas Hold'em & BS Poker      ║
║  Twitter: ${twitterStatus}            ║
║  Status: Ready to deal cards          ║
╚═══════════════════════════════════════╝
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...')
  httpServer.close(() => {
    console.log('✓ Server closed')
    process.exit(0)
  })
})


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

// Twitter API cache
const twitterCache = new Map<string, { data: any, timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours (daily)

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
    // Check cache first - but only use cache if it has tweets
    const cacheKey = `tweets_${username}_${count}`
    const cached = twitterCache.get(cacheKey)
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION && cached.data.length > 0) {
      console.log(`📦 Returning cached tweets for @${username}`)
      res.json({
        success: true,
        tweets: cached.data,
        source: 'cache',
        cached: true
      })
      return
    }
    
    // If cache exists but has no tweets, clear it and try API again
    if (cached && cached.data.length === 0) {
      console.log(`🔄 Cache has no tweets, clearing and trying API again for @${username}`)
      twitterCache.delete(cacheKey)
    }

    // Check if Twitter API credentials are configured
    const bearerToken = process.env.TWITTER_BEARER_TOKEN

    if (bearerToken && bearerToken !== 'your_bearer_token_here' && bearerToken.length > 50) {
      console.log(`🔍 Attempting to fetch tweets for @${username} using X API v2`)
      console.log(`🔑 Token length: ${bearerToken.length}`)
      
      // Use X API v2 - Get user ID first
      const userResponse = await fetch(
        `https://api.twitter.com/2/users/by/username/${username}`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`
          }
        }
      )

      console.log(`📡 User lookup response status: ${userResponse.status}`)
      
      if (!userResponse.ok) {
        const errorText = await userResponse.text()
        console.log(`❌ Twitter API error: ${userResponse.status} - ${errorText}`)
        console.log(`🔍 Full user lookup response:`, {
          status: userResponse.status,
          statusText: userResponse.statusText,
          headers: Object.fromEntries(userResponse.headers.entries()),
          body: errorText
        })
        
        // If 401 Unauthorized, the token is invalid
        if (userResponse.status === 401) {
          res.status(401).json({
            success: false,
            error: 'Invalid Twitter Bearer Token',
            message: 'The provided Bearer Token is invalid or expired',
            instructions: {
              step1: 'Go to https://developer.twitter.com/en/portal/dashboard',
              step2: 'Sign in with your @ri_shrub account',
              step3: 'Create a new app or regenerate Bearer Token',
              step4: 'Ensure the token has "Read" permissions',
              step5: 'Update server/.env with the new token'
            },
            note: 'Current token appears to be invalid or expired'
          })
          return
        }
        
        // If 403 Forbidden, access level issue
        if (userResponse.status === 403) {
          res.status(403).json({
            success: false,
            error: 'Twitter API Access Level Insufficient',
            message: 'Your current access level does not support this endpoint',
            instructions: {
              step1: 'Go to https://developer.twitter.com/en/portal/products',
              step2: 'Upgrade to Basic ($200/month) or Pro ($5000/month) access',
              step3: 'Or use X API v2 endpoints which are available in Free tier',
              step4: 'Check the X API documentation for supported endpoints'
            },
            note: 'Free tier has limited v1.1 endpoint access. Consider upgrading for full access.',
            link: 'https://docs.x.com/x-api/getting-started/about-x-api'
          })
          return
        }
        
        // If 429 Too Many Requests, rate limit exceeded
        if (userResponse.status === 429) {
          // Get rate limit reset time from headers
          // Check both 15-minute and 24-hour rate limits
          const rateLimitReset = userResponse.headers.get('x-rate-limit-reset')
          const appLimitReset = userResponse.headers.get('x-app-limit-24hour-reset')
          const appLimitRemaining = userResponse.headers.get('x-app-limit-24hour-remaining')
          
          // Use the 24-hour reset if we're out of daily requests, otherwise use 15-minute reset
          const isAppLimitExceeded = appLimitRemaining === '0'
          const resetTime = isAppLimitExceeded && appLimitReset ? appLimitReset : rateLimitReset
          const resetTimestamp = resetTime ? parseInt(resetTime) * 1000 : null
          const resetDate = resetTimestamp ? new Date(resetTimestamp) : null
          
          const limitType = isAppLimitExceeded ? '24-hour' : '15-minute'
          
          // Provide sample tweets as fallback during rate limit
          const fallbackTweets = [
            {
              text: "am brown and listen to ice spice - friends call me a curry munch",
              created_at: new Date('2023-03-30').toISOString(),
              url: `https://x.com/${username}`
            },
            {
              text: "itching to gamble my net worth someone give me a sign",
              created_at: new Date('2024-10-16').toISOString(),
              url: `https://x.com/${username}`
            },
            {
              text: "just found out some people play catan without the knights? i'm beginning to see how \"woke\" is ruining this country",
              created_at: new Date('2024-10-13').toISOString(),
              url: `https://x.com/${username}`
            },
            {
              text: "proof of stake, proof of work, proof of utility, proof of reach.. where is the proof of your bitches?",
              created_at: new Date('2024-10-12').toISOString(),
              url: `https://x.com/${username}`
            }
          ]
          
          res.status(200).json({
            success: true,
            tweets: fallbackTweets,
            source: 'fallback-rate-limit',
            rateLimitInfo: {
              error: 'Rate Limit',
              message: `rishab's twitter is acting up, try again later`,
              resetTime: resetTimestamp,
              resetDate: resetDate ? resetDate.toISOString() : null,
              limitType: limitType
            }
          })
          return
        }
        
        throw new Error(`Failed to get user ID: ${userResponse.status} - ${errorText}`)
      }

      const userData = await userResponse.json() as { data?: { id: string }, errors?: Array<any> }
      console.log(`✅ User lookup successful:`, userData)
      
      // Check if user data exists
      if (!userData.data || !userData.data.id) {
        console.log(`❌ User not found or invalid response for @${username}`)
        res.status(404).json({
          success: false,
          error: 'User not found',
          message: `Twitter user @${username} not found`,
          details: userData.errors || 'No user data returned from Twitter API'
        })
        return
      }
      
      const userId = userData.data.id
      console.log(`🆔 User ID for @${username}: ${userId}`)

      // Fetch tweets using X API v2 (min 5, max 100)
      const maxResults = Math.max(5, Math.min(count, 100))
      const tweetsResponse = await fetch(
        `https://api.twitter.com/2/users/${userId}/tweets?max_results=${maxResults}&tweet.fields=created_at,public_metrics`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`
          }
        }
      )

      console.log(`📡 Tweets response status: ${tweetsResponse.status}`)

      if (!tweetsResponse.ok) {
        const errorText = await tweetsResponse.text()
        console.log(`❌ Twitter API error: ${tweetsResponse.status} - ${errorText}`)
        console.log(`🔍 Full tweets response:`, {
          status: tweetsResponse.status,
          statusText: tweetsResponse.statusText,
          headers: Object.fromEntries(tweetsResponse.headers.entries()),
          body: errorText
        })
        throw new Error(`Failed to fetch tweets: ${tweetsResponse.status} - ${errorText}`)
      }

      const tweetsData = await tweetsResponse.json() as { data?: Array<{ text: string; created_at: string; id: string }> }
      console.log(`✅ Tweets fetch successful:`, {
        tweetCount: tweetsData.data?.length || 0,
        rawData: tweetsData
      })
      
      // Transform tweets to match expected format
      const tweets = (tweetsData.data || []).map(tweet => ({
        text: tweet.text,
        created_at: tweet.created_at,
        url: `https://twitter.com/${username}/status/${tweet.id}`
      }))
      
      console.log(`📝 Transformed tweets:`, tweets)
      
      // Only cache if there are tweets
      if (tweets.length > 0) {
        twitterCache.set(cacheKey, { data: tweets, timestamp: Date.now() })
        console.log(`💾 Cached ${tweets.length} tweets for @${username}`)
      } else {
        console.log(`⚠️  No tweets to cache for @${username}`)
      }
      
      res.json({
        success: true,
        tweets: tweets,
        source: 'twitter-api-v2'
      })
    } else {
      // No valid Twitter API configured - return helpful message with fallback data
      console.log(`⚠️  No valid Twitter API token configured, returning fallback data for @${username}`)
      
      // Return some sample tweets as fallback
      const fallbackTweets = [
        {
          text: `Welcome to @${username}'s Twitter feed! 🐦`,
          created_at: new Date().toISOString(),
          url: `https://x.com/${username}`
        },
        {
          text: "This is a demo tweet. To see real tweets, configure a valid Twitter Bearer Token.",
          created_at: new Date(Date.now() - 3600000).toISOString(),
          url: `https://x.com/${username}`
        },
        {
          text: "Check out the setup guide in TWITTER_OAUTH_SETUP.md for OAuth 2.0 integration!",
          created_at: new Date(Date.now() - 7200000).toISOString(),
          url: `https://x.com/${username}`
        }
      ]
      
      res.json({
        success: true,
        tweets: fallbackTweets,
        source: 'fallback-demo',
        note: 'Configure TWITTER_BEARER_TOKEN for real tweets'
      })
      return
    }
  } catch (error) {
    console.error('Twitter API error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tweets',
      message: error instanceof Error ? error.message : 'Unknown error',
      note: 'Set TWITTER_BEARER_TOKEN environment variable for Twitter API access'
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
  const twitterStatus = process.env.TWITTER_BEARER_TOKEN 
    ? '✓ Twitter API configured' 
    : '⚠ Bearer token needed'
    
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


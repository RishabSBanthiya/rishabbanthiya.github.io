import React, { useState, useEffect } from 'react'
import { CreateRoomRequest, RoomListItem } from '../../types/poker.types'

interface PokerLobbyProps {
  onCreateRoom: (config: CreateRoomRequest) => Promise<void>
  onJoinRoom: (roomId: string, password: string, playerName: string) => Promise<void>
  onListRooms: () => Promise<RoomListItem[]>
  error: string | null
}

type LobbyView = 'menu' | 'create' | 'join' | 'list'

export const PokerLobby: React.FC<PokerLobbyProps> = ({
  onCreateRoom,
  onJoinRoom,
  onListRooms,
  error: propError
}) => {
  const [view, setView] = useState<LobbyView>('menu')
  const [publicRooms, setPublicRooms] = useState<RoomListItem[]>([])
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Create room form state
  const [roomName, setRoomName] = useState('')
  const [password, setPassword] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(6)
  const [buyIn, setBuyIn] = useState(1000)
  const [isPublic, setIsPublic] = useState(false)

  // Join room form state
  const [joinRoomId, setJoinRoomId] = useState('')
  const [joinPassword, setJoinPassword] = useState('')
  const [playerName, setPlayerName] = useState(() => {
    // Load saved player name
    return localStorage.getItem('poker_player_name') || ''
  })

  useEffect(() => {
    if (propError) {
      setError(propError)
    }
  }, [propError])

  useEffect(() => {
    if (view === 'list') {
      loadPublicRooms()
      const interval = setInterval(loadPublicRooms, 3000)
      return () => clearInterval(interval)
    }
  }, [view])

  const loadPublicRooms = async () => {
    try {
      const rooms = await onListRooms()
      setPublicRooms(rooms)
    } catch (err) {
      console.error('Failed to load rooms:', err)
    }
  }

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      setError('Room name is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const config: CreateRoomRequest = {
        roomName: roomName.trim(),
        password: password || undefined,
        maxPlayers,
        buyIn,
        smallBlind: Math.floor(buyIn / 100),
        bigBlind: Math.floor(buyIn / 50),
        isPublic
      }

      await onCreateRoom(config)
      // Success - parent component will handle room transition
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRoom = async (roomId?: string) => {
    const targetRoomId = roomId || joinRoomId

    if (!targetRoomId.trim()) {
      setError('Room ID is required')
      return
    }

    if (!playerName.trim()) {
      setError('Player name is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Save player name for future sessions
      localStorage.setItem('poker_player_name', playerName.trim())
      
      await onJoinRoom(targetRoomId.trim().toUpperCase(), joinPassword, playerName.trim())
      // Success - parent component will handle room transition
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room')
    } finally {
      setLoading(false)
    }
  }

  const renderMenu = () => (
    <div className="poker-cli-container">
      <pre className="poker-cli-output">{`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         ♠♥♦♣     TERMINAL POKER ROOM     ♠♥♦♣                ║
║                   TEXAS HOLD'EM                               ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Select an option:                                            ║
║                                                               ║
║    1  - Create New Room                                       ║
║    2  - Join Private Room                                     ║
║    3  - Browse Public Rooms                                   ║
║                                                               ║
║  Type a number (1-3) and press Enter                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
${error ? `\n⚠️  ERROR: ${error}\n` : ''}
`}</pre>
      <div className="poker-cli-input-line">
        <span className="poker-cli-prompt">poker&gt;</span>
        <input
          type="text"
          value={playerName || ''}
          onChange={(e) => {
            const val = e.target.value
            if (val === '1') setView('create')
            else if (val === '2') setView('join')
            else if (val === '3') setView('list')
            else setPlayerName(val)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = playerName
              if (val === '1') setView('create')
              else if (val === '2') setView('join')
              else if (val === '3') setView('list')
              setPlayerName('')
            }
          }}
          className="poker-cli-input"
          placeholder="Enter 1, 2, or 3"
          autoFocus
        />
      </div>
    </div>
  )

  const renderCreateRoom = () => (
    <div className="poker-cli-container">
      <pre className="poker-cli-output">{`
╔═══════════════════════════════════════════════════════════════╗
║                     CREATE NEW ROOM                           ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Room Name:        ${roomName.padEnd(43)}║
║  Password:         ${password ? '****'.padEnd(43) : '(none)'.padEnd(43)}║
║  Max Players:      ${maxPlayers.toString().padEnd(43)}║
║  Buy-in:           $${buyIn.toLocaleString().padEnd(42)}║
║  Public:           ${(isPublic ? 'Yes' : 'No').padEnd(43)}║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║  Commands:                                                    ║
║    name <text>     - Set room name                            ║
║    pass <text>     - Set password (optional)                  ║
║    players <2-6>   - Set max players                          ║
║    buyin <amount>  - Set buy-in (500/1000/2500/5000/10000)   ║
║    public          - Toggle public/private                    ║
║    create          - Create the room                          ║
║    back            - Return to menu                           ║
╚═══════════════════════════════════════════════════════════════╝
${error ? `\n⚠️  ERROR: ${error}\n` : ''}
${loading ? '\n⏳ Creating room...\n' : ''}
`}</pre>
      <div className="poker-cli-input-line">
        <span className="poker-cli-prompt">create&gt;</span>
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const cmd = e.currentTarget.value.trim().toLowerCase()
              const parts = e.currentTarget.value.trim().split(' ')
              
              if (cmd === 'back') setView('menu')
              else if (cmd === 'create') handleCreateRoom()
              else if (cmd === 'public') setIsPublic(!isPublic)
              else if (parts[0] === 'name' && parts.length > 1) setRoomName(parts.slice(1).join(' '))
              else if (parts[0] === 'pass' && parts.length > 1) setPassword(parts.slice(1).join(' '))
              else if (parts[0] === 'players') setMaxPlayers(Math.min(6, Math.max(2, parseInt(parts[1]) || 6)))
              else if (parts[0] === 'buyin') setBuyIn(parseInt(parts[1]) || 1000)
              
              e.currentTarget.value = ''
            }
          }}
          className="poker-cli-input"
          placeholder="Enter command (e.g., 'name My Room', 'create')"
          autoFocus
          disabled={loading}
        />
      </div>
    </div>
  )

  const renderJoinRoom = () => (
    <div className="poker-cli-container">
      <pre className="poker-cli-output">{`
╔═══════════════════════════════════════════════════════════════╗
║                      JOIN ROOM                                ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Your Name:        ${playerName.padEnd(43)}║
║  Room ID:          ${joinRoomId.padEnd(43)}║
║  Password:         ${joinPassword ? '****'.padEnd(43) : '(none)'.padEnd(43)}║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║  Commands:                                                    ║
║    name <text>     - Set your player name                     ║
║    room <id>       - Set room ID (e.g., HST-A4F9)             ║
║    pass <text>     - Set password (if required)               ║
║    join            - Join the room                            ║
║    back            - Return to menu                           ║
╚═══════════════════════════════════════════════════════════════╝
${error ? `\n⚠️  ERROR: ${error}\n` : ''}
${loading ? '\n⏳ Joining room...\n' : ''}
`}</pre>
      <div className="poker-cli-input-line">
        <span className="poker-cli-prompt">join&gt;</span>
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const cmd = e.currentTarget.value.trim().toLowerCase()
              const parts = e.currentTarget.value.trim().split(' ')
              
              if (cmd === 'back') setView('menu')
              else if (cmd === 'join') handleJoinRoom()
              else if (parts[0] === 'name' && parts.length > 1) setPlayerName(parts.slice(1).join(' '))
              else if (parts[0] === 'room' && parts.length > 1) setJoinRoomId(parts[1].toUpperCase())
              else if (parts[0] === 'pass' && parts.length > 1) setJoinPassword(parts.slice(1).join(' '))
              
              e.currentTarget.value = ''
            }
          }}
          className="poker-cli-input"
          placeholder="Enter command (e.g., 'room HST-A4F9', 'join')"
          autoFocus
          disabled={loading}
        />
      </div>
    </div>
  )

  const renderRoomList = () => {
    let output = `
╔═══════════════════════════════════════════════════════════════╗
║                     PUBLIC ROOMS                              ║
╠═══════════════════════════════════════════════════════════════╣
`
    
    if (publicRooms.length === 0) {
      output += `║                                                               ║
║         No public rooms available.                            ║
║         Create one to start playing!                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

Commands: back, refresh`
    } else {
      output += `║  ID          Room Name         Players  Buy-in   Status      ║
╟───────────────────────────────────────────────────────────────╢
`
      publicRooms.forEach(room => {
        const id = room.roomId.padEnd(12)
        const name = (room.roomName + (room.hasPassword ? ' 🔒' : '')).padEnd(18)
        const players = `${room.currentPlayers}/${room.maxPlayers}`.padEnd(8)
        const buyin = `$${room.buyIn.toLocaleString()}`.padEnd(9)
        const status = room.status.padEnd(12)
        output += `║  ${id} ${name} ${players} ${buyin}${status}║\n`
      })
      output += `╚═══════════════════════════════════════════════════════════════╝

Commands:
  join <room-id>  - Join a room (e.g., 'join PUB-A4F9')
  refresh         - Refresh room list
  back            - Return to menu`
    }
    
    return (
      <div className="poker-cli-container">
        <pre className="poker-cli-output">{output}</pre>
        <div className="poker-cli-input-line">
          <span className="poker-cli-prompt">rooms&gt;</span>
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const cmd = e.currentTarget.value.trim().toLowerCase()
                const parts = e.currentTarget.value.trim().split(' ')
                
                if (cmd === 'back') setView('menu')
                else if (cmd === 'refresh') loadPublicRooms()
                else if (parts[0] === 'join' && parts.length > 1) {
                  setJoinRoomId(parts[1].toUpperCase())
                  setView('join')
                }
                
                e.currentTarget.value = ''
              }
            }}
            className="poker-cli-input"
            placeholder="Enter command (e.g., 'join PUB-A4F9', 'refresh')"
            autoFocus
          />
        </div>
      </div>
    )
  }

  return (
    <div className="poker-lobby">
      {view === 'menu' && renderMenu()}
      {view === 'create' && renderCreateRoom()}
      {view === 'join' && renderJoinRoom()}
      {view === 'list' && renderRoomList()}
    </div>
  )
}


import React, { useState, useRef, useEffect } from 'react'
import { GameState, PokerAction, Winner, Card } from '../../types/poker.types'

interface PokerTableProps {
  gameState: GameState | null
  myPlayerId: string
  winners: Winner[] | null
  onAction: (action: PokerAction) => void
  onLeaveRoom: () => void
  roomName: string
  roomId: string
}

export const PokerTable: React.FC<PokerTableProps> = ({
  gameState,
  myPlayerId,
  winners,
  onAction,
  onLeaveRoom,
  roomName,
  roomId
}) => {
  const [command, setCommand] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Auto-scroll output to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [gameState, winners])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  if (!gameState) {
    return (
      <div className="poker-cli-container">
        <pre className="poker-cli-output">
{`
╔════════════════════════════════════════════════════════════════╗
║                    🃏  ${roomName.padEnd(42)}║
║                    Room ID: ${roomId.padEnd(35)}║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║              Waiting for game to start...                     ║
║              Need at least 2 players                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

Type 'quit' to leave room
`}
        </pre>
        <div className="poker-cli-input-line">
          <span className="poker-cli-prompt">poker&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && command.trim().toLowerCase() === 'quit') {
                onLeaveRoom()
              }
            }}
            className="poker-cli-input"
            autoFocus
          />
        </div>
      </div>
    )
  }

  const me = gameState.players.find((p) => p.id === myPlayerId)
  const opponents = gameState.players.filter((p) => p.id !== myPlayerId)
  const isMyTurn = gameState.players[gameState.currentPlayerIndex]?.id === myPlayerId
  const currentPlayer = gameState.players[gameState.currentPlayerIndex]

  const renderCardAscii = (card: Card): string => {
    const rank = card.rank.padEnd(2)
    const suit = card.suit
    return `[${rank}${suit}]`
  }

  const renderCardBack = (): string => {
    return '[##]'
  }

  const canCheck = me ? me.currentBet === gameState.currentBet : false
  const callAmount = me ? gameState.currentBet - me.currentBet : 0
  const minRaise = gameState.currentBet * 2

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const parts = trimmed.split(' ')
    const action = parts[0]

    setCommandHistory([...commandHistory, cmd])

    if (action === 'quit' || action === 'exit' || action === 'leave') {
      onLeaveRoom()
      return
    }

    if (!isMyTurn) {
      return
    }

    switch (action) {
      case 'fold':
      case 'f':
        onAction({ type: 'fold' })
        break

      case 'check':
      case 'ch':
        if (canCheck) {
          onAction({ type: 'check' })
        }
        break

      case 'call':
      case 'c':
        if (callAmount > 0) {
          onAction({ type: 'call', amount: callAmount })
        }
        break

      case 'raise':
      case 'r':
        const raiseAmount = parseInt(parts[1])
        if (raiseAmount && raiseAmount >= minRaise) {
          onAction({ type: 'raise', amount: raiseAmount })
        }
        break

      case 'allin':
      case 'all-in':
      case 'a':
        if (me) {
          onAction({ type: 'all-in', amount: me.chips })
        }
        break
    }

    setCommand('')
  }

  // Build CLI output
  const buildOutput = (): string => {
    let output = '\n'

    // Header
    output += `╔════════════════════════════════════════════════════════════════╗\n`
    output += `║  🃏  TEXAS HOLD'EM - ${roomName.padEnd(42)}║\n`
    output += `║  Room: ${roomId.padEnd(49)}POT: $${gameState.pot.toString().padStart(5)} ║\n`
    output += `╠════════════════════════════════════════════════════════════════╣\n\n`

    // Winners announcement
    if (winners && winners.length > 0) {
      output += `╔════════════════════════════════════════════════════════════════╗\n`
      output += `║                        🏆 WINNER(S) 🏆                          ║\n`
      output += `╠════════════════════════════════════════════════════════════════╣\n`
      winners.forEach(w => {
        output += `║  ${w.playerName.padEnd(20)} ${w.hand.name.padEnd(20)} +$${w.amount.toString().padStart(6)} ║\n`
      })
      output += `╚════════════════════════════════════════════════════════════════╝\n\n`
    }

    // Community cards
    output += `  COMMUNITY CARDS [${gameState.phase.toUpperCase().padEnd(8)}]  POT: $${gameState.pot}\n`
    output += `  ┌─────────────────────────────────────────────────┐\n`
    output += `  │  `
    
    const cardsToShow = ['preflop', 'waiting'].includes(gameState.phase) ? 0 : 
                        gameState.phase === 'flop' ? 3 :
                        gameState.phase === 'turn' ? 4 : 5
    
    for (let i = 0; i < 5; i++) {
      if (i < cardsToShow && gameState.communityCards[i]) {
        output += renderCardAscii(gameState.communityCards[i]) + ' '
      } else {
        output += '[  ??  ] '
      }
    }
    output += `│\n`
    output += `  └─────────────────────────────────────────────────┘\n\n`

    // Opponents
    if (opponents.length > 0) {
      output += `  OPPONENTS:\n`
      opponents.forEach(opp => {
        const pos = opp.position === 'dealer' ? '[D]' : 
                    opp.position === 'small-blind' ? '[SB]' : 
                    opp.position === 'big-blind' ? '[BB]' : '[P]'
        const active = currentPlayer?.id === opp.id ? ' ← TURN' : ''
        const status = opp.folded ? ' [FOLDED]' : opp.allIn ? ' [ALL-IN]' : ''
        output += `  ${pos} ${opp.name.padEnd(15)} $${opp.chips.toString().padStart(5)} | Bet: $${opp.currentBet.toString().padStart(4)}${status}${active}\n`
        if (!opp.folded) {
          output += `      Cards: ${renderCardBack()} ${renderCardBack()}`
          if (opp.lastAction) output += `  Last: ${opp.lastAction}`
          output += `\n`
        }
      })
      output += `\n`
    }

    // My hand
    if (me) {
      output += `╔════════════════════════════════════════════════════════════════╗\n`
      output += `║  YOUR HAND${' '.repeat(53)}║\n`
      output += `╠════════════════════════════════════════════════════════════════╣\n`
      const pos = me.position === 'dealer' ? 'DEALER' : 
                  me.position === 'small-blind' ? 'SMALL BLIND' : 
                  me.position === 'big-blind' ? 'BIG BLIND' : 'PLAYER'
      output += `║  Position: ${pos.padEnd(20)} Chips: $${me.chips.toString().padStart(10)}        ║\n`
      output += `║  Current Bet: $${me.currentBet.toString().padStart(10)}                                    ║\n`
      output += `║                                                                ║\n`
      output += `║  Cards:  `
      me.cards.forEach(card => {
        output += `${renderCardAscii(card)} `
      })
      output += `${' '.repeat(41)}║\n`
      output += `╚════════════════════════════════════════════════════════════════╝\n\n`

      // Available actions
      if (isMyTurn && !me.folded && gameState.phase !== 'showdown') {
        output += `  YOUR TURN! Available commands:\n`
        output += `  ┌──────────────────────────────────────────────────────┐\n`
        output += `  │  fold           - Fold your hand                    │\n`
        if (canCheck) {
          output += `  │  check          - Check (no bet)                    │\n`
        } else {
          output += `  │  call           - Call $${callAmount.toString().padStart(4)}                          │\n`
        }
        output += `  │  raise <amt>    - Raise to <amt> (min: $${minRaise.toString().padStart(4)})      │\n`
        output += `  │  allin          - Go all-in ($${me.chips.toString().padStart(4)})                 │\n`
        output += `  │  quit           - Leave game                         │\n`
        output += `  └──────────────────────────────────────────────────────┘\n`
      } else if (!isMyTurn && !me.folded) {
        output += `  Waiting for ${currentPlayer?.name}...\n`
      } else if (me.folded) {
        output += `  You folded this hand. Waiting for next hand...\n`
      }
    }

    return output
  }

  return (
    <div className="poker-cli-container">
      <div className="poker-cli-output" ref={outputRef}>
        <pre>{buildOutput()}</pre>
      </div>
      
      <div className="poker-cli-input-line">
        <span className="poker-cli-prompt">poker&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCommand(command)
            }
          }}
          className="poker-cli-input"
          placeholder={isMyTurn ? "Enter command (e.g., 'call', 'raise 100', 'fold')" : "Type 'quit' to leave"}
          autoFocus
        />
      </div>
    </div>
  )
}


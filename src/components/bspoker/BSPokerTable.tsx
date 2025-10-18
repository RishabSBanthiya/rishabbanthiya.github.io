import React, { useState } from 'react'
import { BSGameState, BSPokerAction, BSRoundResult, Card, HandGuess, Rank } from '../../types/bspoker.types'

interface BSPokerTableProps {
  gameState: BSGameState | null
  myPlayerId: string
  roundResult: BSRoundResult | null
  onAction: (action: BSPokerAction) => void
  onStartGame: () => void
  onNextRound: () => void
  onLeaveRoom: () => void
  roomName: string
  roomId: string
}

const HAND_TYPES = [
  { value: 'high-card', label: 'High Card' },
  { value: 'pair', label: 'Pair' },
  { value: 'two-pair', label: 'Two Pair' },
  { value: 'three-of-a-kind', label: 'Three of a Kind' },
  { value: 'straight', label: 'Straight' },
  { value: 'flush', label: 'Flush' },
  { value: 'full-house', label: 'Full House' },
  { value: 'four-of-a-kind', label: 'Four of a Kind' },
  { value: 'straight-flush', label: 'Straight Flush' }
]

const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

export const BSPokerTable: React.FC<BSPokerTableProps> = ({
  gameState,
  myPlayerId,
  roundResult,
  onAction,
  onStartGame,
  onNextRound,
  onLeaveRoom,
  roomName,
  roomId
}) => {
  const [selectedHandType, setSelectedHandType] = useState('pair')
  const [selectedRank, setSelectedRank] = useState<Rank>('K')

  if (!gameState) {
    // Waiting for game to start
    return (
      <div className="poker-cli-container">
        <pre className="poker-cli-output">{`
╔═══════════════════════════════════════════════════════════════╗
║                   BS POKER - WAITING                          ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Room: ${roomName.padEnd(56)}║
║  ID:   ${roomId.padEnd(56)}║
║                                                               ║
║  Players: ${gameState?.players.length || 0}                                                     ║
║                                                               ║
║  Waiting for game to start...                                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`}</pre>
        <div className="poker-cli-input-line">
          <span className="poker-cli-prompt">game&gt;</span>
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const cmd = e.currentTarget.value.trim().toLowerCase()
                if (cmd === 'start') onStartGame()
                else if (cmd === 'leave') onLeaveRoom()
                e.currentTarget.value = ''
              }
            }}
            className="poker-cli-input"
            placeholder="Commands: start, leave"
            autoFocus
          />
        </div>
      </div>
    )
  }

  const myPlayer = gameState.players.find(p => p.id === myPlayerId)
  const currentPlayer = gameState.players[gameState.currentPlayerIndex]
  const isMyTurn = currentPlayer?.id === myPlayerId

  const renderCard = (card: Card): string => {
    return `[${card.rank}${card.suit}]`
  }

  const renderMyCards = (): string => {
    if (!myPlayer) return ''
    return myPlayer.cards.map(renderCard).join(' ')
  }

  const renderAllCardsRevealed = (): string => {
    if (gameState.phase !== 'reveal' && gameState.phase !== 'round-end') return ''
    
    let output = '\n\n╔═══════════════════════════════════════════════════════════════╗\n'
    output += '║                    ALL CARDS REVEALED                         ║\n'
    output += '╠═══════════════════════════════════════════════════════════════╣\n'
    
    gameState.players.forEach(player => {
      const name = player.name.padEnd(15)
      const cards = player.cards.map(renderCard).join(' ')
      output += `║  ${name}: ${cards.padEnd(41)}║\n`
    })
    
    output += '╚═══════════════════════════════════════════════════════════════╝\n'
    return output
  }

  const renderRoundResult = (): string => {
    if (!roundResult) return ''
    
    let output = '\n╔═══════════════════════════════════════════════════════════════╗\n'
    output += '║                      ROUND RESULT                             ║\n'
    output += '╠═══════════════════════════════════════════════════════════════╣\n'
    output += `║  Guesser:  ${roundResult.guesserPlayerName.padEnd(50)}║\n`
    output += `║  Guess:    ${roundResult.guess.description.padEnd(50)}║\n`
    output += `║  Caller:   ${roundResult.callerPlayerName.padEnd(50)}║\n`
    output += '║                                                               ║\n'
    
    if (roundResult.wasSuccessful) {
      output += `║  ✓ The hand EXISTS! ${roundResult.callerPlayerName} loses!${' '.repeat(Math.max(0, 31 - roundResult.callerPlayerName.length))}║\n`
    } else {
      output += `║  ✗ The hand does NOT exist! ${roundResult.guesserPlayerName} loses!${' '.repeat(Math.max(0, 24 - roundResult.guesserPlayerName.length))}║\n`
    }
    
    output += '║                                                               ║\n'
    output += `║  ${roundResult.loserName} now has ${roundResult.wasSuccessful ? 
      gameState.players.find(p => p.id === roundResult.loserId)?.cardCount || 0 : 
      gameState.players.find(p => p.id === roundResult.loserId)?.cardCount || 0} cards.${' '.repeat(Math.max(0, 35 - roundResult.loserName.length))}║\n`
    
    const loser = gameState.players.find(p => p.id === roundResult.loserId)
    if (loser && loser.hasLost) {
      output += '║                                                               ║\n'
      output += `║  💀 ${roundResult.loserName} is OUT OF THE GAME!${' '.repeat(Math.max(0, 38 - roundResult.loserName.length))}║\n`
    }
    
    output += '╚═══════════════════════════════════════════════════════════════╝\n'
    return output
  }

  const handleMakeGuess = () => {
    const handType = HAND_TYPES.find(h => h.value === selectedHandType)
    if (!handType) return

    const guess: HandGuess = {
      type: selectedHandType as HandGuess['type'],
      rank: selectedRank,
      description: `${handType.label}${selectedRank ? ' of ' + selectedRank + 's' : ''}`
    }

    onAction({ type: 'guess', guess })
  }

  const handleCallBullshit = () => {
    onAction({ type: 'bullshit' })
  }

  if (roundResult) {
    // Show round result
    const output = `
╔═══════════════════════════════════════════════════════════════╗
║                    BS POKER - ROUND ${gameState.roundNumber.toString().padStart(2, '0')}                       ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Room: ${roomName.padEnd(56)}║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

Players:
${gameState.players.map(p => {
  const status = p.hasLost ? '💀' : (p.id === myPlayerId ? '👤' : '  ')
  const name = p.name.padEnd(15)
  const cards = `(${p.cardCount} cards)`
  return `  ${status} ${name} ${cards}`
}).join('\n')}
${renderAllCardsRevealed()}
${renderRoundResult()}
`

    return (
      <div className="poker-cli-container">
        <pre className="poker-cli-output">{output}</pre>
        <div className="poker-cli-input-line">
          <span className="poker-cli-prompt">result&gt;</span>
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const cmd = e.currentTarget.value.trim().toLowerCase()
                if (cmd === 'next' || cmd === 'continue') onNextRound()
                else if (cmd === 'leave') onLeaveRoom()
                e.currentTarget.value = ''
              }
            }}
            className="poker-cli-input"
            placeholder="Commands: next, leave"
            autoFocus
          />
        </div>
      </div>
    )
  }

  const output = `
╔═══════════════════════════════════════════════════════════════╗
║                    BS POKER - ROUND ${gameState.roundNumber.toString().padStart(2, '0')}                       ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Room: ${roomName.padEnd(56)}║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

Your Cards: ${renderMyCards()}

Players:
${gameState.players.map(p => {
  const isCurrent = p.id === currentPlayer.id
  const marker = isCurrent ? '▶' : ' '
  const status = p.hasLost ? '💀' : (p.id === myPlayerId ? '👤' : '  ')
  const name = p.name.padEnd(15)
  const cards = `(${p.cardCount} cards)`
  const action = p.lastAction || ''
  return `${marker} ${status} ${name} ${cards} ${action}`
}).join('\n')}

Current Guess: ${gameState.currentGuess ? gameState.currentGuess.description : 'None'}
${gameState.guessHistory.length > 0 ? `
Recent Guesses:
${gameState.guessHistory.slice(-3).reverse().map(h => 
  `  ${h.playerName}: ${h.guess.description}`
).join('\n')}
` : ''}
${isMyTurn ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR TURN!

Type your guess:
  guess <type> <rank>
  Examples:
    - guess pair K
    - guess flush
    - guess straight
    - guess three-of-a-kind A
  
Or call bullshit:
  bs
  
Leave game:
  leave
` : `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Waiting for ${currentPlayer.name}...

${gameState.currentGuess ? 'You can call bullshit by typing: bs' : ''}
Commands: leave
`}
`

  return (
    <div className="poker-cli-container">
      <pre className="poker-cli-output">{output}</pre>
      <div className="poker-cli-input-line">
        <span className="poker-cli-prompt">game&gt;</span>
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const input = e.currentTarget.value.trim().toLowerCase()
              const parts = input.split(' ')
              
              if (input === 'leave') {
                onLeaveRoom()
              } else if (input === 'bs' || input === 'bullshit') {
                if (gameState.currentGuess) {
                  handleCallBullshit()
                }
              } else if (parts[0] === 'guess' && parts.length >= 2) {
                // Parse guess command
                const handType = parts[1]
                const rank = parts[2]?.toUpperCase() as Rank || 'K'
                
                const handTypeObj = HAND_TYPES.find(h => 
                  h.value === handType || h.label.toLowerCase().replace(/\s/g, '-') === handType
                )
                
                if (handTypeObj && isMyTurn) {
                  const guess: HandGuess = {
                    type: handTypeObj.value as HandGuess['type'],
                    rank: rank,
                    description: `${handTypeObj.label}${rank ? ' of ' + rank + 's' : ''}`
                  }
                  onAction({ type: 'guess', guess })
                }
              }
              
              e.currentTarget.value = ''
            }
          }}
          className="poker-cli-input"
          placeholder={isMyTurn ? "guess <type> <rank> or 'bs'" : "Type 'bs' or 'leave'"}
          autoFocus
          disabled={!isMyTurn && !gameState.currentGuess}
        />
      </div>
    </div>
  )
}


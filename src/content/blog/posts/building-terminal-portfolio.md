---
title: "Building a Terminal-Style Portfolio with React and TypeScript"
date: "2025-10-21"
description: "A deep dive into creating an interactive terminal portfolio website using React, TypeScript, and modern web technologies."
tags: ["react", "typescript", "portfolio", "terminal", "web-development"]
---

# Building a Terminal-Style Portfolio with React and TypeScript

Creating a unique portfolio that stands out can be challenging. In this post, I'll walk you through building an interactive terminal-style portfolio using React, TypeScript, and some creative CSS.

## The Inspiration

The idea came from my love for terminal interfaces and the desire to create something memorable. A terminal portfolio offers:

- **Unique User Experience**: Interactive commands instead of static pages
- **Developer Appeal**: Speaks directly to the developer audience
- **Engagement**: Users actively explore rather than passively scroll
- **Nostalgia**: Appeals to those who grew up with command-line interfaces

## Tech Stack

Here's what I used to build this portfolio:

```typescript
// Core Technologies
- React 18 with TypeScript
- Vite for fast development and building
- Bootstrap 5 for responsive design
- Socket.io for real-time features

// Additional Libraries
- marked: Markdown parsing for blog posts
- highlight.js: Syntax highlighting
- Custom CSS: Terminal styling and animations
```

## Key Features Implemented

### 1. Interactive Terminal Interface

The core of the portfolio is a draggable terminal window that responds to user commands:

```typescript
interface CommandHistory {
  command: string
  output: React.ReactNode
}

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<CommandHistory[]>([])
  const [currentCommand, setCurrentCommand] = useState('')
  
  // Command processing logic
  const processCommand = (command: string) => {
    // Parse and execute commands
  }
}
```

### 2. Real-time Multiplayer Games

I integrated WebSocket-based poker games directly into the terminal:

```typescript
// Poker game integration
const PokerGame: React.FC = () => {
  const { socket, isConnected } = usePokerSocket()
  
  useEffect(() => {
    if (socket) {
      socket.on('gameUpdate', handleGameUpdate)
      return () => socket.off('gameUpdate', handleGameUpdate)
    }
  }, [socket])
}
```

### 3. AI Assistant Integration

Added an AI-powered assistant using Ollama for local AI processing:

```typescript
const AIAgentResponse: React.FC<{ query: string }> = ({ query }) => {
  const [response, setResponse] = useState('')
  
  useEffect(() => {
    queryOllamaStream(query, setResponse)
  }, [query])
}
```

## Styling Challenges and Solutions

### Terminal Aesthetics

Creating an authentic terminal look required careful attention to:

- **Font**: Monospace fonts for that authentic feel
- **Colors**: Dark backgrounds with green/amber text
- **Animations**: Typewriter effects and cursor blinking
- **Responsiveness**: Making it work on all screen sizes

```css
.terminal-window {
  font-family: 'Courier New', monospace;
  background: #1a1a1a;
  color: #00ff00;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.terminal-cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

### Draggable Window

Implementing a draggable terminal window:

```typescript
const [position, setPosition] = useState({ x: 100, y: 100 })
const [isDragging, setIsDragging] = useState(false)

const handleMouseDown = (e: React.MouseEvent) => {
  setIsDragging(true)
  // Calculate drag offset
}
```

## Performance Optimizations

### Code Splitting

Lazy load heavy components like games:

```typescript
const PokerGame = lazy(() => import('./poker/PokerGame'))
const BSPokerGame = lazy(() => import('./bspoker/BSPokerGame'))
```

### State Management

Efficient state updates and memoization:

```typescript
const memoizedCommand = useMemo(() => {
  return processCommand(currentCommand)
}, [currentCommand])
```

## Lessons Learned

1. **User Experience Matters**: Even a unique concept needs intuitive navigation
2. **Performance is Key**: Terminal interfaces can be resource-intensive
3. **Accessibility**: Ensure keyboard navigation works properly
4. **Mobile Responsiveness**: Terminal interfaces need special mobile considerations

## Future Enhancements

Some ideas for future improvements:

- **Theme System**: Multiple terminal themes (retro, modern, etc.)
- **Plugin Architecture**: Allow users to add custom commands
- **File System Simulation**: Navigate through a virtual file system
- **Multi-window Support**: Multiple terminal instances

## Conclusion

Building this terminal portfolio was both challenging and rewarding. It demonstrates that with creativity and modern web technologies, you can create truly unique user experiences.

The key is to balance novelty with usability - make it interesting but not confusing, unique but not unusable.

---

*Want to see the code? Check out the [GitHub repository](https://github.com/rishabSBanthiya/rishabbanthiya.github.io) for the full implementation!*

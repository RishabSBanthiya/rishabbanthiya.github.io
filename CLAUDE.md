# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Frontend (root directory)
npm install          # Install dependencies
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # Build for production (tsc && vite build)
npm run type-check   # TypeScript type checking only
npm run lint         # ESLint check
npm run lint:fix     # ESLint with auto-fix

# Backend server (for poker/websocket features)
cd server
npm install          # First time only
npm run dev          # Start WebSocket server (port 3001)

# Deployment (GitHub Pages)
./deploy.sh          # Build and copy to root for branch-based deployment
```

## Architecture

Personal portfolio website with an interactive terminal interface.

### Frontend (`src/`)
- **React 18 + TypeScript + Vite** with Bootstrap 5
- **Entry**: `main.tsx` wraps `App.tsx` with `ThemeContext` provider
- **Terminal** (`components/Terminal.tsx`): Main interactive component with commands
- **Games**: `components/poker/`, `components/bspoker/`, `PongGame.tsx`, `DinoGame.tsx`
- **Hooks**: `usePokerSocket.ts`, `useBSPokerSocket.ts` - Socket.io WebSocket management
- **Blog**: Markdown posts in `src/content/blog/posts/`

### Backend (`server/src/`)
- **Express + Socket.io** WebSocket server for multiplayer games
- **server.ts**: Main server with Socket.io event handlers
- **game/**: `PokerRoom.ts`, `RoomManager.ts`

## Code Style

- Use functional components with TypeScript interfaces (prefer `interface` over `type`)
- Avoid enums; use maps instead
- Use descriptive variable names with auxiliary verbs (isLoading, hasError)
- Avoid `any`; use `unknown` if type is truly unknown
- Follow Bootstrap 5.3 utility classes for styling

# Rishab Banthiya - Portfolio Website

A modern TypeScript/React portfolio website built with Vite.

## 🚀 Features

- **TypeScript**: Full type safety and modern JavaScript features
- **React 18**: Latest React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Bootstrap 5**: Responsive design framework
- **Terminal Interface**: Interactive command-line interface with games
- **Terminal Poker Room** 🃏: Real-time multiplayer poker games
  - **Texas Hold'em**: Classic poker with community cards (2-6 players)
  - **BS Poker (Liar's Poker)** 🎴: Bluffing game with wild 2s (2-8 players)
    - Standard Texas Hold'em hands only
    - Guess what hands exist combining all players' cards
    - Call "bullshit" to challenge guesses
  - WebSocket-based multiplayer (Socket.io)
  - Private and public rooms
  - Session persistence
  - Full poker hand evaluation with wild card support
- **ESLint**: Code linting and formatting

## 🛠️ Development

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

### 🃏 Running the Poker Server

To use the Terminal Poker Room features:

```bash
# In a separate terminal
cd server
npm install  # First time only
npm run dev  # Starts on port 3001
```

Then in the portfolio terminal, type:
- `play poker` for Texas Hold'em
- `play bspoker` for BS Poker (Liar's Poker)

See [POKER_GUIDE.md](POKER_GUIDE.md) and [BS_POKER_GUIDE.md](BS_POKER_GUIDE.md) for complete instructions!

### Build for Production

```bash
npm run build
```

This will create a `dist` folder with the production build.

### Preview Production Build

```bash
npm run preview
```

### Type Checking

```bash
npm run type-check
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.tsx      # Navigation component
│   ├── Hero.tsx        # Hero section component
│   ├── Terminal.tsx    # Terminal interface
│   ├── PongGame.tsx    # Pong game
│   ├── DinoGame.tsx    # Dino game
│   └── poker/          # Poker game components
│       ├── PokerGame.tsx      # Main poker wrapper
│       ├── PokerLobby.tsx     # Room creation/joining
│       └── PokerTable.tsx     # Game table UI
├── hooks/              # Custom React hooks
│   └── usePokerSocket.ts     # WebSocket management
├── types/              # TypeScript types
│   └── poker.types.ts        # Poker game types
├── styles/             # CSS styles
│   ├── index.css       # Global styles
│   ├── App.css         # App-specific styles
│   └── poker.css       # Poker game styles
├── assets/             # Static assets
├── App.tsx             # Main App component
└── main.tsx            # Entry point

server/                 # Poker server (WebSocket)
├── src/
│   ├── game/          # Game logic
│   │   ├── PokerRoom.ts      # Individual game
│   │   └── RoomManager.ts    # Multi-room manager
│   ├── utils/         # Utilities
│   │   ├── deckManager.ts    # Card handling
│   │   └── handEvaluator.ts  # Hand ranking
│   ├── types/         # TypeScript types
│   └── server.ts      # Main server & Socket.io
├── package.json
└── tsconfig.json
```

## 🚀 Deployment

This project is configured for GitHub Pages deployment with automatic CI/CD.

### Automatic Deployment (Recommended)

1. **Enable GitHub Pages**: Go to your repository Settings → Pages → Source: "GitHub Actions"
2. **Push to main branch**: The site will automatically build and deploy
3. **Access your site**: https://rishabbanthiya.github.io/rishabbanthiya.github.io/

### Manual Deployment

If you prefer manual deployment:

1. **Install Node.js** (if not already installed)
2. **Install dependencies**: `npm install`
3. **Build the project**: `npm run build`
4. **Deploy**: Run `./deploy.sh` or manually copy `dist/*` contents to repository root
5. **Commit and push**: `git add . && git commit -m "Deploy" && git push`

### GitHub Actions Workflow

The project includes a `.github/workflows/deploy.yml` file that automatically:
- Builds the TypeScript project
- Deploys to GitHub Pages
- Runs on every push to main branch

## 📝 About

This is Rishab Banthiya's personal portfolio website showcasing his work and experience in technology, software engineering, and fintech.

### Contact

- Email: rishabb3@illinois.edu
- LinkedIn: [rishab-banthiya](https://www.linkedin.com/in/rishrub/)
- GitHub: [rishabSBanthiya](https://github.com/rishabSBanthiya/)

## 🤝 Connect with me:

<a href="https://www.linkedin.com/in/rishab-banthiya-2b4501193/">
<img src="images/linkedin.png" alt="alternate text"
width="30px" height="height">
</a> 

<br>

## 💼 Technical Skills 

![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![PyTorch](https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white) ![NumPy](https://img.shields.io/badge/numpy-%23013243.svg?style=for-the-badge&logo=numpy&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white) ![JQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)

[![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=rishabsbanthiya&layout=compact)](https://github.com/rishabsbanthiya)# Trigger deployment
# Trigger deployment Fri Oct 17 10:59:40 CDT 2025

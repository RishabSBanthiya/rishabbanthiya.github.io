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

# Deployment (GitHub Pages)
./deploy.sh          # Build and copy to root for branch-based deployment
```

`index.html.template` is the HTML source; the root `index.html` is the last deployed build. For `npm run dev`, first run `cp index.html.template index.html`.

## Architecture

Minimal single-page personal website: a name, a one-line blurb, and links to the resume, LinkedIn and Substack.

- **React 18 + TypeScript + Vite** with Bootstrap 5
- **Entry**: `src/main.tsx` renders `src/App.tsx`, which holds the whole page
- **Styles**: `src/styles/index.css` overrides Bootstrap's palette and font; light/dark follows the system setting via `data-bs-theme`
- **Resume**: `public/rishab-banthiya-resume.pdf`
- **Hosting**: GitHub Pages serves the root of `main`, so a change is live only after `./deploy.sh`, commit and push

## Code Style

- Use functional components with TypeScript interfaces (prefer `interface` over `type`)
- Avoid enums; use maps instead
- Use descriptive variable names with auxiliary verbs (isLoading, hasError)
- Avoid `any`; use `unknown` if type is truly unknown
- Follow Bootstrap 5.3 utility classes for styling

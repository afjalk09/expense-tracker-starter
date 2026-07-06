# AGENTS.md - Expense Tracker Starter

## Project Overview
React + Vite expense tracker starter project (intentionally buggy/messy for a course).

## Commands
```bash
npm install       # install deps
npm run dev       # dev server (Vite, port 5173)
npm run build     # production build
npm run lint      # ESLint (flat config)
npm run preview   # preview production build
```

## Project Structure
- `src/` - React app entry (`main.jsx` → `App.jsx`)
- `src/App.jsx` - Single component with all logic (intentionally messy)
- `vite.config.js` - Minimal Vite + React config
- `eslint.config.js` - Flat ESLint config (ESLint 9 flat config)

## Key Notes
- **No test suite** - no test runner configured
- **No TypeScript** - plain JSX
- **No typecheck script** - only `npm run lint`
- **ESLint flat config** (eslint.config.js) - uses flat config format
- **React 19** + **Vite 7** - modern stack
- Starter project for a course - intentionally has bugs/messy code
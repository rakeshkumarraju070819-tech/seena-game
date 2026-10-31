# FLYING BALAYA 🍾

A mobile-first Flappy-Bird-style arcade game with Telugu meme flavour.
React + Vite + HTML5 Canvas, Web Audio API, LocalStorage, Lucide icons. No backend.

## Install & run
```bash
npm install
npm run dev        # http://localhost:5173 (also reachable on your LAN for phone testing)
```

## Production build
```bash
npm run build      # outputs /dist
npm run preview    # test the production build locally
```

## Deploy to Vercel
**Dashboard:** push the project to GitHub -> vercel.com -> *Add New Project* -> import repo. Vercel auto-detects Vite
(Build: `npm run build`, Output: `dist`) -> *Deploy*.

**CLI:**
```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

## Controls
Tap / click / Space / Arrow Up / W = fly. P or Esc = pause. M = mute.

## Replacing artwork
Put your transparent PNGs in `public/assets/...` and edit paths in `src/config.js`:
- `ASSETS.character` – flying player (face + wings + glow)
- `ASSETS.obstacle` – obstacle image, head at the TOP (auto-flipped for the upper one; set OBSTACLE_ASPECT = width/height)
- `MEMES.start`, `MEMES.over` – start / game-over meme images
Dialogues (Telugu) are also in `src/config.js`. Gameplay tuning (gravity, gap, speed) is in `src/utils/gamePhysics.js`.
Replace the placeholder art with your own licensed images; the bundled art is a generic cartoon placeholder.

## Structure
```
src/components  StartScreen, GameCanvas, GameOver, ScoreBoard, SoundButton
src/hooks       useGame.js (state machine + requestAnimationFrame loop)
src/utils       gamePhysics, collisionDetection, renderer, audioManager, storage
public/assets   characters, obstacles, memes, sounds
```
# seena-game

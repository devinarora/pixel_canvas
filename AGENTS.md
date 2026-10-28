# AGENTS.md

## What this is

A browser-based 64×64 pixel art canvas, built as the subject of an experiment in iterative feature development with an OpenCode harness.

## Commands

```sh
npm run dev        # Vite on port 5173 (strict; Playwright depends on it)
npm run build      # typecheck, then production build
npm run typecheck
npm test           # Vitest unit tests in src/
npm run test:watch
npm run test:e2e   # Playwright; first run needs: npx playwright install chromium
```

No linter or formatter is configured yet. Do not invent one without updating this file.

## Architecture

- `src/pixelGrid.ts` — framework-free pixel grid and Bresenham line sampling. Put drawing/model logic here so Vitest can test it without a DOM.
- `src/PixelCanvas.tsx` — canvas rendering and pointer handling. The backing store is 64×64; CSS scales it up with `image-rendering: pixelated`. Pointer positions are mapped through `getBoundingClientRect`, not the canvas `width`/`height`.
- `src/App.tsx` — tool and color state plus the sidebar. Tool ids live in `src/tools.ts`.
- `src/pixelGrid.test.ts` — colocated unit tests. Browser tests live in `e2e/`.

## Gotchas

- The eraser stores `null` (transparent). The checkerboard is a CSS background behind the canvas, not painted into it. Its 2×2 tile is sized to match one canvas pixel; update `background-size` in `src/styles.css` if `GRID_SIZE` changes.
- A stroke interpolates between sampled pointer positions; keep that or fast drags leave gaps.
- The canvas starts blank. There is no undo, persistence, or export yet.
- Playwright reads real pixels with `getImageData`, so changing the canvas backing size requires updating `e2e/canvas.spec.ts`.

# Pixel Canvas

A minimal 64×64 pixel art canvas built with React, Vite, and TypeScript.

## Run

```sh
npm install
npm run dev
```

## Tools

- **Pencil** paints with the selected color.
- **Eraser** clears pixels back to transparent.
- **Color picker** samples a painted pixel and makes it the current color.
- The color input under the tools sets the pencil color directly.

## Verify

```sh
npm run typecheck
npm test
npm run test:e2e   # first run: npx playwright install chromium
npm run build
```

# Sketch Vault

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-black?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-teal?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

An archive of interactive and generative sketches. Every piece runs live in the browser with tweakable parameters.

| No. | Sketch | Medium |
| --- | --- | --- |
| 001 | Planetary System | Three.js |
| 002 | Snake AI (A* pathfinding) | p5.js |
| 003 | Flow Field (Perlin noise) | Canvas 2D |
| 004 | Game of Life | Canvas 2D |
| 005 | Boids (flocking) | Canvas 2D |

There is also a **Studio** (`/live-sketch`) with four generators, palettes and kaleidoscope symmetry.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build
```

## Viewer shortcuts

`Space` play/pause · `R` reset · `S` save PNG · `P` toggle panel · `F` fullscreen · `←` `→` previous/next sketch

Add `?embed` to any sketch URL to render only the stage (useful for iframes and thumbnails).

## Adding a sketch

1. Add an entry to `src/data/sketches.ts` (catalogue number, copy, controls with defaults).
2. Create the piece in `src/sketches/`. For 2D canvas work, write an `EngineFactory` and render it with
   `CanvasSketch`, which handles sizing, the frame loop, resets and actions. See `FlowField.tsx` for an example.
3. Register the component in the `pieces` map in `src/components/viewer/SketchViewer.tsx`.
4. Drop a 4:3 thumbnail in `public/sketches/`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# Cindi workspace

The project is split into npm workspaces:

- `client/` — React, TypeScript, Vite, Tailwind, and all browser-facing code/assets.
- `server/` — reserved for future backend implementation; no backend stack has been selected or installed.
- `design-system.md` — shared product/brand design reference.

From the repository root, run `npm install`, `npm run dev`, or `npm run build`. The root scripts delegate to the client workspace. Server-specific scripts and dependencies should be added when its framework and backend requirements are decided.

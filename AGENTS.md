# Repository Guidelines

## Project Structure & Module Organization
- App Router: `app/` (entry: `layout.tsx`, `page.tsx`).
- Components: `components/` (feature sections) and `components/ui/` (shadcn/ui primitives).
- Hooks: `hooks/` (React hooks, prefix with `use-`).
- Utilities: `lib/utils.ts`.
- Styles: `app/globals.css` (primary global styles), plus `styles/` if needed.
- Static assets: `public/`.

## Build, Test, and Development Commands
- Dev server: `npm run dev` (or `pnpm dev`) — starts Next.js at `http://localhost:3000`.
- Production build: `npm run build` (or `pnpm build`).
- Start production: `npm start` after a build.
- Lint: `npm run lint` — run locally; `next.config.mjs` currently ignores lint/TS errors during builds.

## Coding Style & Naming Conventions
- Language: TypeScript + React, Tailwind CSS for styling.
- Indentation: 2 spaces; max line length ~100 chars.
- File names: kebab-case (`components/hero-section.tsx`); component identifiers: PascalCase.
- Hooks: files start with `use-` and exports start with `use` (e.g., `hooks/use-mobile.tsx`).
- Styling: prefer utility classes; share variants via `lib/utils.ts` helpers (e.g., `cn`).
- Paths: use `@/*` alias per `tsconfig.json`.

## Testing Guidelines
- No test runner is configured. If adding tests, colocate as `*.test.ts(x)` or under `__tests__/`.
- Suggested stack: Jest + React Testing Library for units; Playwright for e2e.
- Add `test` script (e.g., `"test": "jest"`) and keep coverage sensible for changed code.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, etc.
- Keep commits focused and descriptive; reference issues (`#123`).
- PRs: include summary, screenshots for UI changes, steps to verify, and linked issues.

## Security & Configuration Tips
- Do not commit secrets; use `.env.local` and `NEXT_PUBLIC_*` only for client-safe values.
- Images are `unoptimized: true`; consider Next Image or a CDN for production.
- `next.config.mjs` ignores lint/TS errors during builds—fix issues locally before merging.

## Agent-Specific Notes
- Follow these conventions across the repo; keep changes scoped and avoid unrelated refactors. Update this file if structure or tooling changes.

# Performance Dashboard

React 19 + TypeScript + Vite SPA. TanStack Router, TanStack Query, ECharts, Zustand, Tailwind CSS v4, shadcn/ui.

## Commands
- `npm run dev` — dev server on :5173
- `npm run build` — `tsc -b && vite build`
- `npm run lint` — ESLint
- `npx vitest` — unit tests (jsdom, vitest.config.ts)
- `npx playwright test` — e2e tests (playwright.config.ts)
- `npx prettier --write .` — format

## Architecture

```
src/
  components/  charts/ controls/ dashboard/ ui/    ← shadcn/ui in ui/
  hooks/       useMetricData, useMetrics, useDownsampledData, useViewportWidth
  lib/         utils (cn, etc.)
  routes/      __root.tsx, index.tsx, compare.tsx, metric.$id.tsx
  store/       ui-store.ts (Zustand)
  test/        vitest setup
  types/
```

Path alias: `@/` → `src/` (configured in both vite and vitest).
Base path: `/performance-dashboard/` (deployed to GitHub Pages).

## CodeGraph
This repo is CodeGraph-indexed. Prefer `codegraph_explore` over grep/file reads for code questions.

## Comet Workflow
Active OpenSpec + Comet development process. Phase guard rules in `.claude/rules/comet-phase-guard.md`. Before writing code, check for active comet change at `openspec/changes/<name>/.comet.yaml`.

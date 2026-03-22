# expensify Frontend

expensify is a Next.js App Router frontend scaffold for an editorial-style personal finance product. This repository bootstraps the shell, design tokens, component ownership boundaries, and test/tooling foundation without implementing backend product flows yet.

## Prerequisites

- Node.js 24 LTS for the pinned repo baseline. Next.js 16 also runs on Node 20.9+, which is the minimum supported runtime.
- pnpm 10.32.1. The repo pins this via the `packageManager` field.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The root route redirects to `/dashboard`.

## Scripts

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:e2e`
- `pnpm build`
- `pnpm format`

## Architecture

- Route files live under `src/app` and stay thin.
- Feature code lives under `src/features/<feature>`.
- Reusable UI lives under `src/ui`.
- Raw `shadcn` primitives live under `src/ui/internal/shadcn`.
- App-owned primitive wrappers live under `src/ui/base`.
- App-level building blocks live under `src/ui/composite`.

See [frontend-conventions.md](/C:/Users/sunka/source/repos/BigTechHQ/expensify-app-frontend/docs/architecture/frontend-conventions.md) for the working rules.

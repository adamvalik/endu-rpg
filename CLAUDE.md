# Endu RPG

Fitness RPG that syncs with Strava — real-world activities earn XP, levels, and character progression.

## Project Structure

pnpm monorepo:

- `apps/mobile` — Expo (React Native) mobile app
- `apps/web` — Next.js 16 (App Router) web app, **static export** (`output: 'export'`)
- `packages/functions` — Firebase Cloud Functions v2 (onCall)
- `packages/shared` — Shared TypeScript types (`@endu/shared`)

## Static Export Constraint (Web)

The web app uses `output: 'export'` — no SSR, no API routes, no middleware, no `headers()`/`cookies()` imports. All pages with interactivity must use `'use client'`. All data fetching is client-side via Firebase JS SDK calling Cloud Functions.

## Web App Conventions

### Data Fetching

Use `@tanstack/react-query` for all server state:

- `useQuery` for reads, `useMutation` for writes
- Invalidate relevant queries after mutations via `queryClient.invalidateQueries`
- Use query key factory pattern from `@/lib/api/query-keys.ts`
- All backend calls go through typed `httpsCallable` wrappers in `@/lib/firebase/functions.ts`
- Never read Firestore directly from the web client

### UI Components

- Use shadcn (radix-mira style, neutral base color) — add via `pnpm dlx shadcn@latest add <component>` from `apps/web`
- Don't modify files in `src/components/ui/` directly unless extending
- Icons: `lucide-react`

### Forms

- `react-hook-form` + `@hookform/resolvers/standard-schema` with `zod/v4` schemas (zod v4 implements Standard Schema; don't use `zodResolver` — it has type incompatibilities with zod v4)
- Define zod schema in the same file or co-located `schema.ts`

### Styling

- Tailwind CSS v4 with `cn()` utility from `@/lib/utils`
- Use CSS variables from `globals.css` for theming
- No inline style objects

### Authentication

- Firebase JS SDK (`firebase/auth`) for client-side auth
- `signInWithCustomToken` after calling `signUpOrLogIn` callable function
- Auth state via `AuthProvider` context using `onAuthStateChanged`
- Persistence: `browserLocalPersistence`

### Types

- Import shared types from `@endu/shared/types` (subpath export) — never duplicate types that exist in the shared package

### Environment Variables

- Prefix with `NEXT_PUBLIC_` for client-side access in Next.js

### Error Handling

- Extract errors from `FirebaseError` (code + message)
- Display via toast (sonner) or inline form errors
- No `alert()`

### Formatting

- Prettier runs via pre-commit hook (husky + lint-staged)
- Import sorting via `@trivago/prettier-plugin-sort-imports`

## Commands

```bash
pnpm dev:web          # Start web dev server
pnpm dev:mobile       # Start Expo mobile app
pnpm dev:emulators    # Start Firebase emulators
pnpm build:web        # Build web (static export)
pnpm build:functions  # Build Cloud Functions
pnpm deploy:all       # Build + deploy everything
```

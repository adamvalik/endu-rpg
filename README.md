# Endu

## Project Structure

```
apps/
  mobile/       → Expo / React Native app (@endu/mobile)
  web/          → Next.js web app (@endu/web)
packages/
  shared/       → Shared types & utils (@endu/shared)
  functions/    → Firebase Cloud Functions (@endu/functions)
```

## Prerequisites

- [Node.js](https://nodejs.org/) v22
- [pnpm](https://pnpm.io/) v10+
- [Firebase CLI](https://firebase.google.com/docs/cli)

## Setup

```bash
pnpm install
```

## Development

| Command              | Description                                |
| -------------------- | ------------------------------------------ |
| `pnpm dev:web`       | Start Next.js dev server                   |
| `pnpm dev:mobile`    | Start Expo dev server                      |
| `pnpm dev:emulators` | Build functions & start Firebase emulators |

## Build

| Command                | Description                                  |
| ---------------------- | -------------------------------------------- |
| `pnpm build:web`       | Build Next.js for production (static export) |
| `pnpm build:functions` | Compile Cloud Functions                      |

## Deploy

| Command                 | Description                                |
| ----------------------- | ------------------------------------------ |
| `pnpm deploy:web`       | Build & deploy web to Firebase Hosting     |
| `pnpm deploy:functions` | Deploy Cloud Functions                     |
| `pnpm deploy:all`       | Build & deploy everything                  |
| `pnpm deploy:dev`       | Deploy all to dev project (strava-rpg)     |
| `pnpm deploy:prod`      | Deploy all to production (endu-production) |

## Code Quality

| Command             | Description                      |
| ------------------- | -------------------------------- |
| `pnpm format`       | Format all files with Prettier   |
| `pnpm format:check` | Check formatting without writing |
| `pnpm lint`         | Run ESLint across all packages   |

Prettier runs automatically on staged files before each commit via husky + lint-staged.

## Firebase Projects

| Alias | Project ID      | Purpose                                 |
| ----- | --------------- | --------------------------------------- |
| dev   | strava-rpg      | Development (auth + functions only)     |
| prod  | endu-production | Production (hosting + auth + functions) |

Switch with `firebase use dev` or `firebase use prod`.

## CI/CD

GitHub Actions deploy automatically:

- Push to `main` → deploys web + functions to production
- Push to `dev` → deploys functions to dev

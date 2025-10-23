# Repository Summary

- **Project**: Sawala LearnHub — Backend
- **Framework**: NestJS (TypeScript)
- **Hosting**: Vercel (serverless/edge)
- **Database & Auth**: Supabase (Postgres + Supabase Auth)
- **Primary Modules**: `users`, `posts`, `comments`, `tasks`, `resources`, `interns`, `division`, `auth`

## Setup & Development
1. Install dependencies with `npm install`.
2. Run the development server using `npm run start:dev`.
3. Build the project via `npm run build`.
4. Start the production build locally with `npm run start:prod`.

## Environment Variables
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `NODE_ENV`

## Directory Highlights
- `src/modules` — Feature-specific NestJS modules.
- `src/infra` — Integrations (e.g., Supabase client).
- `src/common` — Shared utilities, enums, DTOs, and helpers.
- `docs/` — API reference and architecture notes.

## Helpful Scripts
- `npm run format` — Format code with Prettier.
- `npm run lint` — Lint and auto-fix using ESLint.
- `npm run start:dev` — Run NestJS in watch mode.
- `npm run build` — Compile TypeScript sources into `dist/`.
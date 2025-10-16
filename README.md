# Sawala LearnHub — Backend

This repository contains the backend for the Sawala LearnHub project built with NestJS, TypeScript and Supabase.

This README contains quick setup instructions, recommended environment variables, and common scripts so other developers (or reviewers) can run and inspect the project quickly.

## Quick summary
- Framework: NestJS (TypeScript)
- Database & Auth: Supabase (Postgres + Auth)
- Storage: Supabase Storage buckets
- Deployment: Vercel (serverless/edge as configured)

## Requirements
- Node.js 18+ (recommended)
- npm
- Supabase project (URL + service role key)

## Environment variables (required)
- SUPABASE_URL - your Supabase project URL
- SUPABASE_SERVICE_ROLE_KEY - Supabase service role key (server-side, keep secret)
- JWT_SECRET - secret used to sign JWT for auth (if used by your auth flow)
- NODE_ENV - development | production

Create a `.env` file (or configure these in your deployment environment / Vercel) with the values above.

## Install & run locally
1. Install dependencies

```powershell
npm install
```

2. Run in development

```powershell
npm run start:dev
```

3. Build for production

```powershell
npm run build
```

4. Run production build locally

```powershell
npm run start:prod
```

## Useful scripts
- `npm run format` — format project using Prettier
- `npm run lint` — lint and auto-fix using ESLint
- `npm run build` — compile TypeScript and produce `dist/`
- `npm run start:dev` — start Nest in watch mode

## Project structure (high level)
- `src/modules` - feature modules (users, tasks, posts,...)
- `src/infra` - external/integration code (Supabase client)
- `src/common` - shared utilities, enums and types
- `src/main.ts` - nest bootstrap

## API docs & architecture
See `docs/API.md` and `docs/ARCHITECTURE.md` for a concise reference of key endpoints and the high-level architecture.

## Contributing / Code style
- Please run `npm run format` before creating a PR
- Add unit or integration tests for new features when possible

---
If you want, I can also add a minimal smoke-test script or a small Postman/Insomnia collection next.Servi
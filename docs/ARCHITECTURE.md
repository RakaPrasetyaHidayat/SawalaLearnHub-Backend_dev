# Architecture Overview

This document summarizes the high-level architecture and where to make changes.

## High-level
- NestJS application structured by modules (`src/modules/*`). Each module contains controller, service and DTOs.
- Supabase used for:
  - Postgres database (tables: users, tasks, task_submissions, posts, comments, post_likes, divisions, etc.)
  - Storage buckets for file uploads (e.g. `post-media`, `task-files`, `submission-files`)
  - Auth (optional) — JWT issued by Auth flow and verified by JwtAuthGuard

## Key patterns
- Services use a `SupabaseService` wrapper to get a client; admin/server actions use `getClient(true)` (service role) to bypass RLS where needed.
- Controllers are thin and delegate business logic to services. Services handle DB queries, validations and error mapping.
- `src/common/enums/database.enum.ts` is the canonical enum source used across the codebase (re-exported in `src/common/enums/index.ts`). Keep database enum strings consistent with Postgres enum values.

## Recommended extension points
- Add `src/test/smoke` for a few HTTP smoke tests using `supertest` to verify authentication and core endpoints before every deploy.
- Add OpenAPI generation (Nest swagger module) for automatic API docs and client generation.

## Deployment
- Vercel is used in current setup; `vercel.json` is present. Build command uses `npm run vercel-build` which matches `npm run build`.
- Ensure the following envs are present in Vercel dashboard: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`.

## Security notes
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret and only used on server side.
- Prefer using service-role operations (admin client) only for admin flows; rely on RLS for user-scoped flows when possible.


Merge notes — API & client changes
=================================

This document summarizes the concrete code changes made to the frontend to fix failing API calls and to consume the backend "me" endpoints. Add this to the PR description or paste into your merge notes so other frontend devs can review and test quickly.

1) Goals
  - Make frontend call the real backend "me" endpoints so profile/task/post pages work:
    - GET https://learnhubbackenddev.vercel.app/api/auth/me (and variants)
    - GET https://learnhubbackenddev.vercel.app/api/users/me
    - GET https://learnhubbackenddev.vercel.app/api/tasks/me
    - GET https://learnhubbackenddev.vercel.app/api/post/me
  - Fix pending-users and user-status update endpoints so admin flows don't 404:
    - PATCH/PUT https://learnhubbackenddev.vercel.app/api/users/:id/status
  - Provide safe fallbacks (relative /api/* routes) when absolute backend calls fail (CORS or missing endpoint).

2) Files changed (summary)
  - src/services/fetcher.ts
    - apiFetcher now accepts absolute URLs, prefers relative `/api/*` in-browser to hit Next.js proxy, and correctly joins API_BASE + path when needed. Adds Authorization header from stored token automatically.

  - src/services/apiClients.ts
    - Fixed missing leading-slash bugs and added exported helpers:
      - getMyProfile() — tries `${API_BASE}/api/users/me` then fallbacks `/api/users/profile` and `/users/me`.
      - updateMyProfile(profileData) — tries `${API_BASE}/api/users/me` (PUT) then fallbacks to `/api/users/profile` and `/api/users/pending/:id`.
      - updateUserStatus(userId, status) — now prefers `${API_BASE}/api/users/${userId}/status` then falls back to `/api/users/pending/${userId}/status`.

  - src/services/postsService.ts
    - listMyPosts() now attempts `${API_BASE}/api/post/me` and normalizes the response; falls back to the existing listPosts() if that fails.

  - src/services/tasksService.ts
    - Added TasksService.getMyTasks() which calls `${API_BASE}/api/tasks/me` and returns normalized Task[]; falls back safely (returns [] on failure).

  - src/components/client/my-tasks-client.tsx
    - Replaced mock data with real-load: uses TasksService.getMyTasks() (with loading/error UI) so the Tasks profile page loads the user's tasks.

  - src/services/userService.ts
    - updateUserStatus now uses apiFetcher and tries the absolute backend `/api/users/:id/status` endpoint first, then falls back to the pending path.

  - src/services/authService.ts
    - getCurrentUser() already tries multiple absolute and relative variants. It was kept but left with improved debug logging.

3) What changed (behavioral highlights)
  - The app will now attempt to use the backend host provided by `process.env.NEXT_PUBLIC_API_URL` (fallback: https://learnhubbackenddev.vercel.app) for "me" endpoints and key status updates.
  - If the absolute backend rejects the request (404, CORS, etc.), the code will attempt to fall back to relative Next.js routes (`/api/...`) to keep pages working.
  - Authorization is handled by `apiFetcher` which attaches the saved token (localStorage key `auth_token`). The same token is used for absolute backend calls.

4) How to verify locally (quick checklist)
  - Ensure .env or environment exposes NEXT_PUBLIC_API_URL if you want a different backend; otherwise default is the dev backend used above.
  - Start dev server:
    ```powershell
    npm run dev
    ```
  - In the browser (DevTools → Network):
    - Visit Profile edit page → observe GET for profile sources.
      - Should attempt: `https://learnhubbackenddev.vercel.app/api/post/me` or `api/post/me` depending on CORS/proxy.
    - Visit My Tasks page → should call `https://learnhubbackenddev.vercel.app/api/tasks/me` first.
    - In Admin → Pending users, approve/reject a user → observe PUT to `https://learnhubbackenddev.vercel.app/api/users/:id/status`. If that fails, a fallback PUT to `/api/users/pending/:id/status` will be attempted.

5) Common failure modes & recommended fixes
  - CORS on absolute backend endpoints
    - Symptoms: network errors, blocked by CORS in browser console. Endpoint returns no response or a CORS preflight error.
    - Quick fix: Add a server-side proxy to forward the request. Recommended pattern (Next.js app router): create `src/app/api/proxy/users/[id]/status/route.ts` & `src/app/api/proxy/post/me/route.ts` etc. The proxy should forward Authorization header and body to the backend.
    - I can implement these proxy routes in this repo if you'd like — it’s a small server-side route that avoids CORS entirely.

  - 401 Unauthorized from backend
    - Symptoms: backend responds 401; fetcher clears stored token and throws. The UI should respond by redirecting to login.
    - Fix: ensure user has a valid token in `localStorage` under `auth_token`. The login flow uses `/api/auth-proxy/login` which already handles several backend login variants.

6) Notes for reviewers / frontend teammate
  - Key helper functions to inspect/replace in your code:
    - `apiFetcher(path, options)` — central fetch wrapper
    - `getMyProfile()` / `updateMyProfile()` in `src/services/apiClients.ts` — use these for profile read/update flows
    - `TasksService.getMyTasks()` and `PostsService.listMyPosts()` — these now call `/api/tasks/me` and `/api/post/me` respectively.
    - `updateUserStatus()` in `src/services/userService.ts` — admin approve/reject flow. The hook `useAdminUsers` and pages call this.

  - When merging: run `npx tsc --noEmit` and smoke-test the dev site. If any network calls 404, check the network tab to confirm whether the absolute backend or fallback path was used.

7) Recommended follow-ups (low-effort, high-value)
  - Add a Next.js server-side proxy route for each absolute endpoint that is blocked by CORS (users/me, tasks/me, post/me, user status). I can implement these quickly.
  - Add a small integration test (Jest + msw) for `apiFetcher` and posts/tasks service methods to assert the normalization logic.
  - Provide a short README snippet on how tokens are stored/cleared and how to test login in dev (use `localStorage.setItem('auth_token', '<token>')`).

8) Contact
  - If you want me to add the server-side proxy files, reply with: "Please add the proxy routes" and I will create them and run a typecheck.

— End of merge notes

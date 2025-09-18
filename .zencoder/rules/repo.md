# Repo Summary

- Name: 07328e52f0a671c842f9e980fdf955cdeba9fe27ab0c00f74f571d994c83515b
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- UI: Radix UI, shadcn, Tailwind v4
- Auth storage: localStorage/sessionStorage token via src/services/fetcher.ts
- Login flow: client calls /api/\_auth/login (proxy to backend) then stores token + user_data in localStorage
- Notable pages: src/app/page.tsx, src/app/login, src/app/register, src/app/main-Page
- API routes: src/app/api/\_auth/login, auth-proxy/login, resources
- Build outputs: .next/, dist/

## Observations

- No explicit "role" usage found in codebase; admin role likely not wired in client.
- getAuthState() reads user_data from localStorage; schema can be extended with role.
- For admin-only pages, prefer dedicated route /admin with guard.

## Suggestions

- Add user.role in auth response and persist in user_data.
- Implement AdminGuard (client) and consider middleware cookie-based auth later.
- Ensure backend authorizes admin endpoints by role.

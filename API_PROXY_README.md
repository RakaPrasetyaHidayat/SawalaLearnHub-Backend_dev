Server-side proxy for division counts

This project includes a Next.js App Router API route at:

  /api/proxy/divisions?year=2025

What it does
- Queries the backend endpoints (learnhubbackenddev.vercel.app) for division counts
- Uses a server-side token (if provided) to authenticate to backend and avoid CORS / auth issues in browser
- Returns unified JSON: { ok: true, year, counts: { frontend: 4, backend: 8, uiux: 0, devops: 2, all: 14 } }

Environment
- Set a server token in your hosting environment (Vercel/Netlify) as `LEARNHUB_SERVER_TOKEN` or `SERVER_API_TOKEN` or `NEXT_SERVER_API_TOKEN`.
- The route will use `NEXT_PUBLIC_API_URL` as backend base if set, otherwise defaults to https://learnhubbackenddev.vercel.app

Usage (client-side)
- Call `/api/proxy/divisions?year=2025` from the frontend (no additional headers needed).

Security
- Keep `LEARNHUB_SERVER_TOKEN` secret and do not expose it to the browser.

Notes
- The proxy tries several slug variants for UI/UX (UI_UX, ui-ux, uiux). If backend requires a UUID, you can update the endpoints list or map env-UUID values into the proxy.

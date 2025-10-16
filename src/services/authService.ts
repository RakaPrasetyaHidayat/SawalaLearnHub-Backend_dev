import { apiFetcher } from "./fetcher";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: "admin" | "user";
  [key: string]: any;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function loginUser(email: string, password: string) {
  // Use internal proxy route to avoid CORS and skip auth headers
  const res = await fetch("/api/auth-proxy/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  let raw: any = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    raw = await res.json().catch(() => null);
  } else {
    const text = await res.text().catch(() => "");
    raw = text ? { message: text } : null;
  }

  if (!res.ok) {
    const message =
      (raw && (raw.message || raw.error)) || `Login failed (${res.status})`;
    throw new Error(message);
  }

  // Normalize different possible response shapes from backend
  const token =
    raw?.token ??
    raw?.data?.token ??
    raw?.accessToken ??
    raw?.data?.accessToken ??
    raw?.access_token ??
    raw?.data?.access_token;
  const userRaw =
    raw?.user ?? raw?.data?.user ?? raw?.profile ?? raw?.data?.profile;

  if (!token || !userRaw) {
    console.error("Unexpected login response:", raw);
    throw new Error("Login response invalid: token or user missing");
  }

  // Derive role consistently
  let role: "admin" | "user" | undefined;
  const directRole = (userRaw.role || raw?.role || "").toString().toLowerCase();
  const rolesArr: any[] = (userRaw.roles || raw?.roles || []) as any[];
  const isAdminFlag = Boolean(
    userRaw.isAdmin || userRaw.is_admin || raw?.isAdmin || raw?.is_admin
  );

  if (directRole === "admin") role = "admin";
  else if (
    Array.isArray(rolesArr) &&
    rolesArr.some((r) => String(r).toLowerCase() === "admin")
  )
    role = "admin";
  else if (isAdminFlag) role = "admin";
  else role = "user";

  const user: AuthUser = { ...userRaw, role };

  return { token, user } as AuthResponse;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  division_id?: string;
  angkatan: number;
}) {
  return apiFetcher<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Normalize different possible shapes from backend for /auth/me endpoints
function normalizeMe(raw: any): any {
  return raw && typeof raw === "object" && "data" in raw
    ? (raw as any).data
    : raw;
}

// Fetch current user with method and path fallbacks
export async function getCurrentUser(): Promise<any> {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "https://learnhubbackenddev.vercel.app";

  const attempts: Array<{ endpoint: string; options?: RequestInit }> = [
    // Try absolute backend endpoints first to avoid local Next.js API proxy 404s
    { endpoint: `${API_BASE}/api/v1/auth/me` },
    { endpoint: `${API_BASE}/api/v1/auth/me`, options: { method: "POST" } },

    { endpoint: `${API_BASE}/api/v1/users/me` },
    { endpoint: `${API_BASE}/api/v1/users/me`, options: { method: "POST" } },

    { endpoint: `${API_BASE}/api/auth/me` },
    { endpoint: `${API_BASE}/api/auth/me`, options: { method: "POST" } },

    { endpoint: `${API_BASE}/auth/me` },
    { endpoint: `${API_BASE}/auth/me`, options: { method: "POST" } },

    { endpoint: `${API_BASE}/users/me` },
    { endpoint: `${API_BASE}/users/me`, options: { method: "POST" } },

    // Fallback to relative/local patterns (useful when proxied through Next.js)
    { endpoint: "/api/auth/me" },
    { endpoint: "/api/auth/me", options: { method: "POST" } },

    { endpoint: "/users/me" },
    { endpoint: "/users/me", options: { method: "POST" } },

    { endpoint: "/api/me" },
    { endpoint: "/api/me", options: { method: "POST" } },
  ];

  let lastError: any = null;
  for (const a of attempts) {
    try {
      // Helpful debug logging to see which endpoint is attempted and with which method
      try {
        // avoid sensitive headers printing — we only log endpoint and method
        console.debug("getCurrentUser: trying endpoint", a.endpoint, a.options?.method || "GET");
      } catch {}
      const raw = await apiFetcher<any>(a.endpoint, a.options || {});
      return normalizeMe(raw);
    } catch (e: any) {
      try {
        console.debug("getCurrentUser: endpoint failed", a.endpoint, e?.message || e);
      } catch {}
      lastError = e;
      const msg = e?.message || "";
      // Only continue to next attempt on 404/405 or method/path issues
      if (
        /404|405|Cannot\s+(GET|POST)|Method Not Allowed|Not Found/i.test(msg)
      ) {
        continue;
      }
      // For other errors (e.g., 401), stop and rethrow
      throw e;
    }
  }
  throw lastError || new Error("Failed to fetch current user");
}

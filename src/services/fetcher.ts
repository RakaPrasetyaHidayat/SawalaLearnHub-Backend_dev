const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://learnhubbackenddev.vercel.app";

// Token storage
const TOKEN_KEY = "auth_token";
let _inMemoryToken: string | null = null;

export function setAuthToken(token: string | null, persist = true) {
  _inMemoryToken = token;
  if (typeof window !== "undefined") {
    try {
      if (persist && token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      // ignore storage errors
      console.warn("Unable to access localStorage for auth token");
    }
  }
}

export function getAuthToken(): string | null {
  if (_inMemoryToken) return _inMemoryToken;
  if (typeof window !== "undefined") {
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      if (t) {
        _inMemoryToken = t;
        return t;
      }
    } catch (e) {
      // ignore
    }
  }
  return null;
}

export function removeAuthToken() {
  _inMemoryToken = null;
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      // ignore
    }
  }
}

export async function apiFetcher<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  // Use relative path for /api/* routes in browser to hit Next.js proxy
  const isBrowser = typeof window !== "undefined";
  const isAbsolute = /^https?:\/\//i.test(path);
  const useRelative = isBrowser && path.startsWith("/api");
  // Ensure we correctly join API_BASE and a non-leading-slash path
  const url = useRelative
    ? path
    : isAbsolute
    ? path
    : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  console.log("Fetching:", url);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s

  // Build headers and attach Authorization if token exists and header not provided
  const headers = new Headers(options.headers as HeadersInit | undefined);
  if (!headers.has("Authorization")) {
    const token = getAuthToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const fetchOptions: RequestInit = { ...options, headers, signal: controller.signal };
    if (useRelative) {
      (fetchOptions as any).credentials = 'same-origin';
    }
    const res = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    if (res.status === 401) {
      // Clear stored token so UI can react and force re-login
      removeAuthToken();
      const msg = await res.text().catch(() => "");
      const err: any = new Error(`Unauthorized: ${msg}`);
      err.status = 401;
      throw err;
    }

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      const err: any = new Error(`API Error ${res.status}: ${msg}`);
      err.status = res.status;
      throw err;
    }

    // Try to parse JSON, fallback to text
    const text = await res.text().catch(() => "");
    try {
      // Let the caller's generic drive the return type; parse JSON if available
      return (text ? JSON.parse(text) : null) as unknown as T;
    } catch (e) {
      return (text as unknown) as T;
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error?.name === "AbortError") {
      throw new Error("Request timeout - API server may be unavailable");
    }
    throw error;
  }
}

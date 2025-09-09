import { apiFetcher } from "./fetcher";

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
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
  const user =
    raw?.user ?? raw?.data?.user ?? raw?.profile ?? raw?.data?.profile;

  if (!token || !user) {
    console.error("Unexpected login response:", raw);
    throw new Error("Login response invalid: token or user missing");
  }
  return { token, user } as AuthResponse;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  division: string;
  angkatan: number;
}) {
  return apiFetcher<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

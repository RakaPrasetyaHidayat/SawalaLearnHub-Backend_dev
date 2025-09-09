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
  const raw = await apiFetcher<any>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
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

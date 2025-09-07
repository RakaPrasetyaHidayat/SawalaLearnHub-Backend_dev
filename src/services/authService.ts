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
  return apiFetcher<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
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

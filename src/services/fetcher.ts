// Token management utilities
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
}

export function setAuthToken(token: string, persistent: boolean = true): void {
  if (typeof window === 'undefined') return;
  if (persistent) {
    localStorage.setItem('auth_token', token);
  } else {
    sessionStorage.setItem('auth_token', token);
  }
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
}

export async function apiFetcher<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://learnhubbackenddev.vercel.app';
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Add authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${baseUrl}${endpoint}`, {
    headers,
    ...options,
  });

  if (!res.ok) {
    // Handle 401 specifically
    if (res.status === 401) {
      removeAuthToken(); // Clear invalid token
      throw new Error(`Authentication required. Please log in again.`);
    }
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Alternative fetcher for external APIs (bypasses auth)
export async function externalApiFetcher<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
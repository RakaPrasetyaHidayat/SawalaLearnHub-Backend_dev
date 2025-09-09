// Token management utilities
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const token =
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
  console.log("Retrieved auth token:", token);
  return token;
}

export function setAuthToken(token: string, persistent: boolean = true): void {
  if (typeof window === "undefined") return;
  console.log("Setting auth token:", token, "Persistent:", persistent);
  if (persistent) {
    localStorage.setItem("auth_token", token);
  } else {
    sessionStorage.setItem("auth_token", token);
  }
}

export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_token");
}

export async function apiFetcher<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://learnhubbackenddev.vercel.app";
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers || {}) as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log("Fetching URL:", `${baseUrl}${endpoint}`);
  console.log("Request headers:", headers);
  console.log("Request options:", options);
  console.log("Using token:", token);

  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      headers,
      ...options,
    });

    if (!res.ok) {
      if (res.status === 401) {
        removeAuthToken();
        console.error("Authentication failed.");
        if (typeof window !== "undefined") {
          const p = window.location.pathname || "";
          if (!p.startsWith("/login") && !p.startsWith("/register")) {
            // Only redirect on protected pages to avoid flicker on login/register
            // window.location.href = "/login";
          }
        }
        throw new Error("Unauthorized");
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error(
      "Failed to fetch data. Please check your network connection or contact support."
    );
  }
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
    throw new Error(`External API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Token management utilities
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const token =
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");
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
    const url = `${baseUrl}${endpoint}`;
    const res = await fetch(url, {
      headers,
      ...options,
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type") || "";
      let rawBody: any = null;
      let bodyText = "";
      try {
        if (contentType.includes("application/json")) {
          rawBody = await res.json().catch(() => null);
        } else {
          bodyText = await res.text().catch(() => "");
        }
      } catch {}

      const backendMsg =
        (rawBody && (rawBody.message || rawBody.error)) ||
        bodyText ||
        res.statusText;

      if (res.status === 401) {
        removeAuthToken();
        console.error("Authentication failed:", backendMsg);
        throw new Error(
          `Authentication required. ${backendMsg || "Please log in again."}`
        );
      }

      const detail =
        typeof backendMsg === "string"
          ? backendMsg.slice(0, 500)
          : res.statusText;
      throw new Error(`API Error ${res.status}: ${detail}`);
    }

    if (res.status === 204) {
      // No Content
      return null as unknown as T;
    }

    return res.json();
  } catch (error: any) {
    console.error("Fetch error:", error);
    // Preserve original error message to aid debugging
    throw new Error(error?.message || "Network error while calling API");
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

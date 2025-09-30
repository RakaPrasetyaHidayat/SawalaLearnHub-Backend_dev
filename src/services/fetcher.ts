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
  options: RequestInit = {},
  tokenOverride?: string | null
): Promise<T> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://learnhubbackenddev.vercel.app";
  const token = tokenOverride ?? getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers || {}) as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // If running in browser and caller used a local API route (startsWith '/api'), prefer same-origin
  const isBrowser = typeof window !== "undefined";
  const useRelative = isBrowser && String(endpoint).startsWith("/api");
  const url = useRelative ? endpoint : `${baseUrl}${endpoint}`;

  console.log("Fetching URL:", url, { useRelative, baseUrl, endpoint });
  const mask = (t?: string | null) => {
    if (!t) return null;
    if (t.length <= 10) return t.replace(/.(?=.{2})/g, "*");
    return `${t.slice(0, 6)}...${t.slice(-4)}`;
  };

  console.log("Request headers:", headers);
  console.log("Request options:", options);
  console.log("Using token (masked):", mask(token));

  try {
    // Add timeout and better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // If body is FormData, let the browser set Content-Type (remove header)
    const finalHeaders = { ...headers };
    const body = (options as any).body;
    if (typeof FormData !== "undefined" && body instanceof FormData) {
      delete (finalHeaders as any)["Content-Type"];
    }

    const fetchOptions: RequestInit = {
      ...options,
      headers: finalHeaders,
      signal: controller.signal,
    };
    // When using relative proxy on same-origin, include credentials so cookies (if any) are forwarded
    if (useRelative) {
      (fetchOptions as any).credentials = "same-origin";
    }

    const res = await fetch(url, fetchOptions);

    clearTimeout(timeoutId);

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

      // If unauthorized, clear token and give clear message
      if (res.status === 401) {
        removeAuthToken();
        console.error("Authentication failed:", backendMsg);
        throw new Error(
          `Authentication required when calling ${url}. ${
            backendMsg || "Please log in again."
          }`
        );
      }

      // Detect HTML error pages (common when a proxy/route returns an HTML page)
      const isHtmlResponse =
        String(bodyText || "")
          .toLowerCase()
          .includes("<!doctype html") ||
        String(bodyText || "")
          .toLowerCase()
          .includes("<html");

      const detail = (() => {
        if (isHtmlResponse) {
          // show small HTML snippet so developer can recognize it's an HTML error page
          const snippet = String(bodyText || "")
            .slice(0, 400)
            .replace(/\s+/g, " ");
          return `Non-JSON (HTML) response received from ${url}. Response snippet: ${snippet}`;
        }
        return typeof backendMsg === "string"
          ? backendMsg.slice(0, 500)
          : res.statusText;
      })();

      // Log the full HTML response for debugging purposes
      if (isHtmlResponse) {
        console.error("Full HTML response:", bodyText);
      }

      throw new Error(`API Error ${res.status} when calling ${url}: ${detail}`);
    }

    if (res.status === 204) {
      // No Content
      return null as unknown as T;
    }

    return res.json();
  } catch (error: any) {
    // Don't log 404 errors for user profile endpoints since this is expected
    // when the backend doesn't support individual user fetching
    const isUserProfile404 =
      error?.message?.includes("API Error 404") &&
      endpoint?.includes("/api/v1/users/") &&
      !endpoint?.includes("/status") &&
      !endpoint?.includes("/pending");

    if (!isUserProfile404) {
      console.error("Fetch error:", error);
    }

    // Handle specific error types
    if (error.name === "AbortError") {
      throw new Error("Request timeout - API server may be unavailable");
    }

    if (error.message?.includes("Failed to fetch")) {
      throw new Error(
        "Network error - Cannot connect to API server. Please check your internet connection or try again later."
      );
    }

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

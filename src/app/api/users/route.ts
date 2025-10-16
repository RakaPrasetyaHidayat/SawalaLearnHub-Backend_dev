import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/services/fetcher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function extractMessage(data: unknown): string | undefined {
  if (data && typeof data === "object") {
    const obj = data as { message?: unknown; error?: unknown };
    if (typeof obj.message === "string") return obj.message;
    if (typeof obj.error === "string") return obj.error;
  }
  return undefined;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const role = searchParams.get("role") || "";

    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    if (!base) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing NEXT_PUBLIC_API_BASE_URL on server",
        },
        { status: 500 }
      );
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (role) params.append("role", role);

    const queryString = params.toString();
    const start = Date.now();

    // Try different endpoint variations
    const attempts: Array<{
      method: "GET";
      url: string;
      headers: Record<string, string>;
    }> = [
      {
        method: "GET",
        url: `${base}/api/users?${queryString}`,
        headers: { Accept: "application/json" },
      },
      {
        method: "GET",
        url: `${base}/users?${queryString}`,
        headers: { Accept: "application/json" },
      },
      {
        method: "GET",
        url: `${base}/api/users/pending?${queryString}`,
        headers: { Accept: "application/json" },
      },
      
    ];

    // Get authorization header from the incoming request
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      attempts.forEach((attempt) => {
        attempt.headers["Authorization"] = authHeader;
      });
    }

    let backendRes: Response | null = null;
    let lastText = "";
    const tried: string[] = [];
    let lastStatus = 0;
    let lastErrorMsg = "";

    for (const attempt of attempts) {
      if (Date.now() - start > 25000) {
        lastErrorMsg = "Global timeout exceeded";
        break;
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const safePath = attempt.url.replace(/^https?:\/\/[^/]+/i, "");
      tried.push(`GET ${safePath}`);

      try {
        backendRes = await fetch(attempt.url, {
          method: attempt.method,
          headers: attempt.headers,
          signal: controller.signal,
          cache: "no-store",
        });
      } catch (e: unknown) {
        if (e instanceof Error) {
          lastErrorMsg =
            e.name === "AbortError"
              ? "Attempt timeout"
              : e.message || "Network error";
        } else {
          lastErrorMsg = "Network error";
        }
      } finally {
        clearTimeout(timeoutId);
      }

      if (!backendRes) continue;
      if (backendRes.ok) break;

      lastStatus = backendRes.status;
      lastText = await backendRes
        .clone()
        .text()
        .catch(() => "");
      if (
        lastStatus === 404 ||
        lastStatus === 405 ||
        /Cannot GET|Method Not Allowed|Not Found/i.test(lastText)
      ) {
        backendRes = null;
        continue;
      } else {
        break;
      }
    }

    // If we got a backend response but it was a client error (400/422) for the users endpoint,
    // try a couple of lenient fallbacks before giving up. Some backend versions require a
    // limit or different path like /api/users/all.
    if (backendRes && !backendRes.ok) {
      try {
        const lastSafe = attempts[0]?.url.replace(/^https?:\/\/[^/]+/i, "") || "";
        if (/\/api\/users\b/i.test(lastSafe)) {
          const fallbacks = [
            `${base}/api/users?limit=1000`,
            `${base}/api/users/all`,
          ];
          for (const fb of fallbacks) {
            const controllerFb = new AbortController();
            const timeoutFb = setTimeout(() => controllerFb.abort(), 10000);
            try {
              const fbRes = await fetch(fb, {
                method: "GET",
                headers: { Accept: "application/json", ...(authHeader ? { Authorization: authHeader } : {}) },
                signal: controllerFb.signal,
                cache: "no-store",
              });
              clearTimeout(timeoutFb);
              if (fbRes && fbRes.ok) {
                backendRes = fbRes;
                tried.push(`GET ${fb.replace(/^https?:\/\//i, "")}`);
                break;
              } else {
                const txt = await fbRes?.clone().text().catch(() => "");
                tried.push(`GET ${fb.replace(/^https?:\/\//i, "")} -> ${fbRes?.status} ${txt.slice(0,200)}`);
              }
            } catch (e) {
              clearTimeout(timeoutFb);
              // continue to next fallback
            }
          }
        }
      } catch (e) {
        // ignore fallback failures
      }
    }

    if (!backendRes) {
      return NextResponse.json(
        {
          status: "error",
          message: lastErrorMsg || "No response from backend",
          tried,
        },
        { status: 502 }
      );
    }

    let data: unknown = null;
    const contentType = backendRes.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await backendRes.json().catch(() => null);
    } else {
      const text = await backendRes.text().catch(() => "");
      data = text ? { message: text } : null;
    }

    if (!backendRes.ok) {
      const message = extractMessage(data) || "Request failed";
      return NextResponse.json(
        { status: "error", message, data, statusCode: backendRes.status },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.name === "AbortError"
          ? "Request timeout"
          : err.message || "Network error"
        : "Network error";
    return NextResponse.json(
      { status: "error", message: `Proxy error: ${message}` },
      { status: 502 }
    );
  }
}

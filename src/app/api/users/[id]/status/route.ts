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

export async function PUT(request: NextRequest, context: any) {
  try {
    const params = context?.params || {};
    const userId = params.id as string | undefined;
    if (!userId) {
      return NextResponse.json(
        { status: "error", message: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => null);
    const { status } = body || {};

    if (!status) {
      return NextResponse.json(
        { status: "error", message: "Status is required" },
        { status: 400 }
      );
    }

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

    const start = Date.now();

    // Try different endpoint variations for updating user status
    const attempts: Array<{
      method: "PUT";
      url: string;
      headers: Record<string, string>;
      body: string;
    }> = [
      {
        method: "PUT",
        url: `${base}/api/users/${userId}/status`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status }),
      },
      {
        method: "PUT",
        url: `${base}/users/${userId}/status`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status }),
      },
      {
        method: "PUT",
        url: `${base}/api/users/pending/${userId}/status`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status }),
      },
      {
        method: "PUT",
        url: `${base}/v1/users/${userId}/status`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status }),
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
      tried.push(`PUT ${safePath}`);

      try {
        backendRes = await fetch(attempt.url, {
          method: attempt.method,
          headers: attempt.headers,
          body: attempt.body,
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
        /Cannot PUT|Method Not Allowed|Not Found/i.test(lastText)
      ) {
        backendRes = null;
        continue;
      } else {
        break;
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

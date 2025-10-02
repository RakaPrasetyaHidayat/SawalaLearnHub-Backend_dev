import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "https://learnhubbackenddev.vercel.app";
const TASKS_ENDPOINT = `${BASE_URL}/api/tasks`;

type NormalizedResponse = {
  ok: boolean;
  status: number;
  payload: any;
  message?: string;
};

async function readResponse(res: Response): Promise<NormalizedResponse> {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson
    ? await res.json().catch(() => null)
    : await res.text().catch(() => "");

  if (!res.ok) {
    const message =
      payload && typeof payload === "object"
        ? (payload as any).message || (payload as any).error
        : undefined;
    return { ok: false, status: res.status, payload, message };
  }

  return { ok: true, status: res.status, payload };
}

function createHeaders(request: NextRequest, contentType?: string) {
  const headers: Record<string, string> = {
    Accept: "application/json, */*",
  };
  const authHeader = request.headers.get("authorization");
  if (authHeader) headers.Authorization = authHeader;
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
}

function buildTargetUrl(request: NextRequest): string {
  const incomingUrl = new URL(request.url);
  const targetUrl = new URL(TASKS_ENDPOINT);
  incomingUrl.searchParams.forEach((value, key) =>
    targetUrl.searchParams.set(key, value),
  );
  return targetUrl.toString();
}

export async function GET(request: NextRequest) {
  try {
    const targetUrl = buildTargetUrl(request);
  const headers = createHeaders(request);
  const incomingAuth = request.headers.get("authorization");
    
  console.log("Proxy URL:", targetUrl);
  console.log("Proxy Headers:", headers);
  console.log("Incoming Authorization header:", incomingAuth);
    
    const res = await fetch(targetUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const normalized = await readResponse(res);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    if (!normalized.ok) {
      return NextResponse.json(
        {
          message: normalized.message || "Failed to fetch tasks",
          data: normalized.payload,
        },
        { status: normalized.status, headers: corsHeaders },
      );
    }

    return NextResponse.json(normalized.payload ?? [], {
      status: normalized.status,
      headers: corsHeaders,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch tasks";
    return NextResponse.json({ message }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
  }
}

export async function POST(request: NextRequest) {
  try {
    const incomingType = (request.headers.get("content-type") || "").toLowerCase();
    const isMultipart = incomingType.includes("multipart/form-data");

    // Build headers: don't force Content-Type for multipart; pass through Authorization
    const baseHeaders = createHeaders(request);
    let headers: Record<string, string> = { ...baseHeaders };
    let body: BodyInit | null = null;

    if (isMultipart) {
      // Forward stream as-is for file uploads
      // Preserve original content-type (with boundary) so backend can parse
      const ct = request.headers.get("content-type");
      if (ct) headers["Content-Type"] = ct;
      body = request.body as any; // ReadableStream passthrough
      console.log("Create task (multipart) - Proxy URL:", TASKS_ENDPOINT);
      console.log("Create task (multipart) - Forwarding stream body");
    } else {
      // Try JSON; if parse fails, forward raw text with original content-type
      let jsonPayload: any = null;
      try {
        jsonPayload = await request.json();
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(jsonPayload || {});
      } catch {
        const rawText = await request.text().catch(() => "");
        const ct = request.headers.get("content-type");
        if (ct) headers["Content-Type"] = ct;
        body = rawText;
      }
      console.log("Create task (json/text) - Proxy URL:", TASKS_ENDPOINT);
      console.log("Create task - Headers:", headers);
    }

    const res = await fetch(TASKS_ENDPOINT, {
      method: "POST",
      headers,
      body,
    });

    const normalized = await readResponse(res);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    if (!normalized.ok) {
      return NextResponse.json(
        {
          message: normalized.message || "Failed to create task",
          data: normalized.payload,
        },
        { status: normalized.status, headers: corsHeaders },
      );
    }

    const status = normalized.status === 200 ? 201 : normalized.status;
    return NextResponse.json(normalized.payload ?? {}, { status, headers: corsHeaders });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create task";
    return NextResponse.json({ message }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
  }
}

// Handle preflight CORS requests
export async function OPTIONS() {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  return NextResponse.json({}, { status: 204, headers });
}
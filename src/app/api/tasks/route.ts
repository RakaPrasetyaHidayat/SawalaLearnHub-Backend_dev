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
    Accept: "application/json",
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
    if (!normalized.ok) {
      return NextResponse.json(
        {
          message: normalized.message || "Failed to fetch tasks",
          data: normalized.payload,
        },
        { status: normalized.status },
      );
    }

    return NextResponse.json(normalized.payload ?? [], {
      status: normalized.status,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch tasks";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const headers = createHeaders(request, "application/json");
    
    console.log("POST Proxy URL:", TASKS_ENDPOINT);
    console.log("POST Proxy Headers:", headers);
    console.log("POST Body:", body);

    const res = await fetch(TASKS_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const normalized = await readResponse(res);
    if (!normalized.ok) {
      return NextResponse.json(
        {
          message: normalized.message || "Failed to create task",
          data: normalized.payload,
        },
        { status: normalized.status },
      );
    }

    const status = normalized.status === 200 ? 201 : normalized.status;
    return NextResponse.json(normalized.payload ?? {}, { status });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create task";
    return NextResponse.json({ message }, { status: 500 });
  }
}
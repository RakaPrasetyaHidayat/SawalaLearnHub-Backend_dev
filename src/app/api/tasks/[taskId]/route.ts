import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "https://learnhubbackenddev.vercel.app";

function createHeaders(request: NextRequest) {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const authHeader = request.headers.get("authorization");
  if (authHeader) headers.Authorization = authHeader;
  return headers;
}

export async function GET(request: NextRequest, context: any) {
  try {
    const params = context?.params || {};
    const taskId = params.taskId as string | undefined;

    if (!taskId) {
      return NextResponse.json(
        { message: "Task ID parameter is required" },
        { status: 400 }
      );
    }

    const targetUrl = `${BASE_URL}/api/tasks/${taskId}`;
    const headers = createHeaders(request);

    console.log("Get task by ID - Proxy URL:", targetUrl);
    console.log("Get task by ID - Proxy Headers:", headers);

    const res = await fetch(targetUrl, {
      method: "GET",
      headers,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson
      ? await res.json().catch(() => null)
      : await res.text().catch(() => "");

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (!res.ok) {
      const message = data && typeof data === "object" ? data.message || data.error : data || `Failed to get task ${taskId}`;
      console.warn("Backend error:", { status: res.status, message, data });
      return NextResponse.json({ message, data }, { status: res.status, headers: corsHeaders });
    }

    console.log("Get task by ID response:", data);
    return NextResponse.json(data, { status: res.status, headers: corsHeaders });
  } catch (error) {
    console.warn("Proxy error:", error);
    const message = error instanceof Error ? error.message : "Failed to get task";
    return NextResponse.json({ message }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
  }
}

export async function OPTIONS() {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  return NextResponse.json({}, { status: 204, headers });
}
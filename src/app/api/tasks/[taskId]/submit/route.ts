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

export async function POST(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params;
    
    if (!taskId) {
      return NextResponse.json(
        { message: "Task ID parameter is required" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const targetUrl = `${BASE_URL}/api/tasks/${taskId}/submit`;
    const headers = createHeaders(request);
    
    console.log("Submit specific task - Proxy URL:", targetUrl);
    console.log("Submit specific task - Proxy Headers:", headers);
    console.log("Submit specific task - Body:", body);

    const res = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson
      ? await res.json().catch(() => null)
      : await res.text().catch(() => "");

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (!res.ok) {
      const message = data && typeof data === "object" ? data.message || data.error : data || `Failed to submit task ${taskId}`;
      console.warn("Backend error:", { status: res.status, message, data });
      return NextResponse.json({ message, data }, { status: res.status, headers: corsHeaders });
    }

    console.log("Submit specific task response:", data);
    return NextResponse.json(data, { status: res.status, headers: corsHeaders });
  } catch (error) {
    console.warn("Proxy error:", error);
    const message = error instanceof Error ? error.message : "Failed to submit task";
    return NextResponse.json({ message }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
  }
}

export async function OPTIONS() {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  return NextResponse.json({}, { status: 204, headers });
}
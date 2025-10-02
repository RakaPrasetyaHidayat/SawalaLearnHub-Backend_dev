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

export async function PATCH(
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
    const targetUrl = `${BASE_URL}/api/tasks/${taskId}/status`;
    const headers = createHeaders(request);
    
    console.log("Update task status - Proxy URL:", targetUrl);
    console.log("Update task status - Proxy Headers:", headers);
    console.log("Update task status - Body:", body);

    const res = await fetch(targetUrl, {
      method: "PATCH",
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
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS,PATCH,PUT,DELETE",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (!res.ok) {
      const message = data && typeof data === "object" ? data.message || data.error : data || `Failed to update task status`;
      console.warn("Backend error:", { status: res.status, message, data });
      return NextResponse.json({ message, data }, { status: res.status, headers: corsHeaders });
    }

    console.log("Update task status response:", data);
    return NextResponse.json(data, { status: res.status, headers: corsHeaders });
  } catch (error) {
    console.warn("Proxy error:", error);
    const message = error instanceof Error ? error.message : "Failed to update task status";
    return NextResponse.json({ message }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
  }
}

export async function OPTIONS() {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS,PATCH,PUT,DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  return NextResponse.json({}, { status: 204, headers });
}
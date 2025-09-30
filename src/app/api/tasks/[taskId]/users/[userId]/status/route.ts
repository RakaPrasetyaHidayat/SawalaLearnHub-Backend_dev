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

export async function PUT(
  request: NextRequest,
  { params }: { params: { taskId: string; userId: string } }
) {
  try {
    const { taskId, userId } = params;
    
    if (!taskId || !userId) {
      return NextResponse.json(
        { message: "Task ID and User ID parameters are required" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const targetUrl = `${BASE_URL}/api/tasks/${taskId}/users/${userId}/status`;
    const headers = createHeaders(request);
    
    console.log("Update task status - Proxy URL:", targetUrl);
    console.log("Update task status - Proxy Headers:", headers);
    console.log("Update task status - Body:", body);

    const res = await fetch(targetUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson
      ? await res.json().catch(() => null)
      : await res.text().catch(() => "");

    if (!res.ok) {
      const message =
        data && typeof data === "object"
          ? data.message || data.error
          : data || `Failed to update task status`;
      
      console.error("Backend error:", { status: res.status, message, data });
      return NextResponse.json(
        { message, data },
        { status: res.status }
      );
    }

    console.log("Update task status response:", data);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update task status";
    return NextResponse.json({ message }, { status: 500 });
  }
}
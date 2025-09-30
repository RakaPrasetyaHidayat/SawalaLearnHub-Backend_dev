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

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    if (!userId) {
      return NextResponse.json(
        { message: "User ID parameter is required" },
        { status: 400 }
      );
    }

    const targetUrl = `${BASE_URL}/api/tasks/users/${userId}`;
    const headers = createHeaders(request);
    
    console.log("Tasks by user - Proxy URL:", targetUrl);
    console.log("Tasks by user - Proxy Headers:", headers);

    const res = await fetch(targetUrl, {
      method: "GET",
      headers,
      cache: "no-store",
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
          : data || `Failed to fetch tasks for user ${userId}`;
      
      console.error("Backend error:", { status: res.status, message, data });
      return NextResponse.json(
        { message, data },
        { status: res.status }
      );
    }

    console.log("Tasks by user response:", data);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch tasks by user";
    return NextResponse.json({ message }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "https://learnhubbackenddev.vercel.app";
const GET_POSTS_ENDPOINT = `${BASE_URL}/api/posts/list`;
const CREATE_POST_ENDPOINT = `${BASE_URL}/api/posts`;

function createHeaders(request: NextRequest, contentType?: string) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  const authHeader = request.headers.get("authorization");
  if (authHeader) headers.Authorization = authHeader;
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
}

export async function GET(request: NextRequest) {
  try {
    const headers = createHeaders(request);
    
    console.log("Get posts - Proxy URL:", GET_POSTS_ENDPOINT);
    console.log("Get posts - Proxy Headers:", headers);

    const res = await fetch(GET_POSTS_ENDPOINT, {
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
          : data || "Failed to fetch posts";
      
      console.error("Backend error:", { status: res.status, message, data });
      return NextResponse.json(
        { message, data },
        { status: res.status }
      );
    }

    console.log("Get posts response:", data);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch posts";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const headers = createHeaders(request, "application/json");
    
    console.log("Create post - Proxy URL:", CREATE_POST_ENDPOINT);
    console.log("Create post - Proxy Headers:", headers);
    console.log("Create post - Body:", body);

    const res = await fetch(CREATE_POST_ENDPOINT, {
      method: "POST",
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
          : data || "Failed to create post";
      
      console.error("Backend error:", { status: res.status, message, data });
      return NextResponse.json(
        { message, data },
        { status: res.status }
      );
    }

    console.log("Create post response:", data);
    const status = res.status === 200 ? 201 : res.status;
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error("Proxy error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json({ message }, { status: 500 });
  }
}
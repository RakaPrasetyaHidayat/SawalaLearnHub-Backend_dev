import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "https://learnhubbackenddev.vercel.app";

function createHeaders(request: NextRequest, contentType?: string) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  const authHeader = request.headers.get("authorization");
  if (authHeader) headers.Authorization = authHeader;
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    
    if (!postId) {
      return NextResponse.json(
        { message: "Post ID parameter is required" },
        { status: 400 }
      );
    }

    const targetUrl = `${BASE_URL}/api/posts/${postId}`;
    const headers = createHeaders(request);
    
    console.log("Get post by ID - Proxy URL:", targetUrl);
    console.log("Get post by ID - Proxy Headers:", headers);

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
          : data || `Failed to fetch post ${postId}`;
      
      console.error("Backend error:", { status: res.status, message, data });
      return NextResponse.json(
        { message, data },
        { status: res.status }
      );
    }

    console.log("Get post by ID response:", data);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch post";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    
    if (!postId) {
      return NextResponse.json(
        { message: "Post ID parameter is required" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const targetUrl = `${BASE_URL}/api/posts/${postId}`;
    const headers = createHeaders(request, "application/json");
    
    console.log("Update post - Proxy URL:", targetUrl);
    console.log("Update post - Proxy Headers:", headers);
    console.log("Update post - Body:", body);

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
          : data || `Failed to update post ${postId}`;
      
      console.error("Backend error:", { status: res.status, message, data });
      return NextResponse.json(
        { message, data },
        { status: res.status }
      );
    }

    console.log("Update post response:", data);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update post";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    
    if (!postId) {
      return NextResponse.json(
        { message: "Post ID parameter is required" },
        { status: 400 }
      );
    }

    const targetUrl = `${BASE_URL}/api/posts/${postId}`;
    const headers = createHeaders(request);
    
    console.log("Delete post - Proxy URL:", targetUrl);
    console.log("Delete post - Proxy Headers:", headers);

    const res = await fetch(targetUrl, {
      method: "DELETE",
      headers,
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
          : data || `Failed to delete post ${postId}`;
      
      console.error("Backend error:", { status: res.status, message, data });
      return NextResponse.json(
        { message, data },
        { status: res.status }
      );
    }

    console.log("Delete post response:", data);
    return NextResponse.json(data || { success: true }, { status: res.status });
  } catch (error) {
    console.error("Proxy error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete post";
    return NextResponse.json({ message }, { status: 500 });
  }
}
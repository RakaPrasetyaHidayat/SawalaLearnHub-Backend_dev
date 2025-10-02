import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://learnhubbackenddev.vercel.app";
const SUBMIT_ENDPOINT = new URL("/api/tasks/submit", BASE_URL).toString();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(request.headers.get("authorization")
        ? { Authorization: request.headers.get("authorization")! }
        : {}),
    };

    console.log("Submit task - Proxy URL:", SUBMIT_ENDPOINT);
    console.log("Submit task - Proxy Headers:", headers);
    console.log("Submit task - Body:", body);

    const res = await fetch(SUBMIT_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await res.json().catch(() => null)
      : await res.text().catch(() => "");

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (!res.ok) {
      const message = payload && typeof payload === "object" ? (payload as any).message || (payload as any).error : undefined;
      return NextResponse.json({ message: message || `Backend error (status ${res.status})`, data: payload }, { status: res.status, headers: corsHeaders });
    }

    return NextResponse.json(payload ?? { success: true }, { status: res.status, headers: corsHeaders });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to submit task";
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
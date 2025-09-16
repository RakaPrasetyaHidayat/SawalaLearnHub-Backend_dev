import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://learnhubbackenddev.vercel.app";
const TARGET = new URL("/api/resources", BASE).toString();

// Passthrough GET to backend API (ke database), forward query + Authorization
export async function GET(request: Request) {
  try {
    const incoming = new URL(request.url);
    const target = new URL(TARGET);
    // forward query params
    incoming.searchParams.forEach((v, k) => target.searchParams.set(k, v));

    const authHeader = request.headers.get("authorization") || "";

    const res = await fetch(target.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      cache: "no-store",
    });

    const ct = res.headers.get("content-type") || "";
    const payload = ct.includes("application/json")
      ? await res.json().catch(() => null)
      : await res.text().catch(() => "");

    if (!res.ok) {
      const message =
        (payload && (payload.message || payload.error)) ||
        `Backend error (status ${res.status})`;
      return NextResponse.json(
        { message, data: payload },
        { status: res.status }
      );
    }

    return NextResponse.json(payload ?? []);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to load resources";
    return NextResponse.json({ message }, { status: 500 });
  }
}

// Passthrough POST to backend API (ke database) tanpa fallback file lokal
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const reqCt = request.headers.get("content-type") || "";

    let res: Response;

    if (reqCt.includes("application/json")) {
      // Forward JSON body persis seperti yang dikirim form
      const json = await request.json().catch(() => ({}));
      res = await fetch(TARGET, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(json),
      });
    } else if (reqCt.includes("multipart/form-data")) {
      // Rebuild FormData to let fetch set the correct boundary automatically
      const incomingForm = await request.formData().catch(() => null);
      const forwardForm = new FormData();
      if (incomingForm) {
        for (const [key, value] of incomingForm.entries()) {
          // value can be string or File/Blob
          forwardForm.append(key, value as any);
        }
      }

      res = await fetch(TARGET, {
        method: "POST",
        headers: {
          Accept: "application/json",
          // Do NOT set Content-Type manually so boundary is generated correctly
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: forwardForm,
      });
    } else {
      // Forward other content-types as raw bytes, preserving original content-type
      const raw = await request.arrayBuffer().catch(() => null);
      res = await fetch(TARGET, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": reqCt || "application/octet-stream",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: raw ?? undefined,
      });
    }

    const ct = res.headers.get("content-type") || "";
    const payload = ct.includes("application/json")
      ? await res.json().catch(() => null)
      : await res.text().catch(() => "");

    if (!res.ok) {
      const message =
        (payload && (payload.message || payload.error)) ||
        `Backend error (status ${res.status})`;
      return NextResponse.json(
        { message, data: payload },
        { status: res.status }
      );
    }

    return NextResponse.json(payload ?? { success: true }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to save resource";
    return NextResponse.json({ message }, { status: 500 });
  }
}

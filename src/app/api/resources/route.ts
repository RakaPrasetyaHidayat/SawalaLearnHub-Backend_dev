import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const dataDir = path.join(process.cwd(), "src", "data");
const dataFile = path.join(dataDir, "resources.json");
const uploadsDir = path.join(process.cwd(), "public", "uploads");

export type Resource = {
  id: string;
  title: string;
  author: string;
  division_id: string;
  description: string;
  date: string;
  likes: number;
  type: "file" | "text";
  fileName: string | null;
  fileUrl: string | null;
  createdAt: number;
};

async function ensureDirs() {
  await fs.mkdir(dataDir, { recursive: true }).catch(() => {});
  await fs.mkdir(uploadsDir, { recursive: true }).catch(() => {});
}

async function readResources(): Promise<Resource[]> {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Resource[];
    return [];
  } catch (e: unknown) {
    const code = (e as { code?: unknown })?.code;
    if (typeof code === "string" && code === "ENOENT") return [];
    throw e;
  }
}

async function writeResources(list: Resource[]) {
  await ensureDirs();
  await fs.writeFile(dataFile, JSON.stringify(list, null, 2), "utf8");
}

function formatDate(date = new Date()) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const d = String(date.getDate()).padStart(2, "0");
  const m = months[date.getMonth()];
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

export async function GET(request: Request) {
  try {
    const incoming = new URL(request.url);
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://learnhubbackenddev.vercel.app";

    const attempts = [
      "/api/resources",
      "/resources",
      "/api/v1/resources",
      "/v1/resources",
    ];

    const authHeader = request.headers.get("authorization") || "";

    let backendRes: Response | null = null;
    let lastErr = "";

    for (const path of attempts) {
      const url = new URL(path, base);
      // forward query params
      incoming.searchParams.forEach((v, k) => url.searchParams.set(k, v));

      try {
        backendRes = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(authHeader ? { Authorization: authHeader } : {}),
          },
          cache: "no-store",
        });
      } catch (e: unknown) {
        lastErr = e instanceof Error ? e.message : "Network error";
        backendRes = null;
      }

      if (!backendRes) continue;
      if (backendRes.ok) break;
      if (backendRes.status === 404 || backendRes.status === 405) {
        backendRes = null; // try next variant
        continue;
      } else {
        break; // stop on other status
      }
    }

    if (!backendRes) {
      return NextResponse.json(
        { message: lastErr || "No response from resources backend" },
        { status: 502 }
      );
    }

    const ct = backendRes.headers.get("content-type") || "";
    if (!backendRes.ok) {
      const payload = ct.includes("application/json")
        ? await backendRes.json().catch(() => null)
        : await backendRes.text().catch(() => "");
      const message =
        (payload && (payload.message || payload.error)) ||
        `Backend error (status ${backendRes.status})`;
      return NextResponse.json(
        { message, data: payload },
        { status: backendRes.status }
      );
    }

    const data = ct.includes("application/json")
      ? await backendRes.json().catch(() => null)
      : await backendRes.text().catch(() => "");
    return NextResponse.json(data ?? []);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to load resources";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://learnhubbackenddev.vercel.app";

    const attempts = [
      "/api/resources",
      "/resources",
      "/api/v1/resources",
      "/v1/resources",
      "/api/resources/create",
      "/api/resources/add",
      "/api/v1/resources/create",
      "/api/v1/resources/add",
      "/v1/resources/create",
      "/v1/resources/add",
    ];

    const authHeader = request.headers.get("authorization") || "";
    const reqCt = request.headers.get("content-type") || "";

    let backendRes: Response | null = null;
    let lastErr = "";

    if (reqCt.includes("application/json")) {
      // Forward JSON payload as JSON
      const json = await request.json().catch(() => ({}));
      for (const path of attempts) {
        const url = new URL(path, base);
        try {
          backendRes = await fetch(url.toString(), {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: JSON.stringify(json),
          });
        } catch (e: unknown) {
          lastErr = e instanceof Error ? e.message : "Network error";
          backendRes = null;
        }
        if (!backendRes) continue;
        if (backendRes.ok) break;
        if (backendRes.status === 404 || backendRes.status === 405) {
          backendRes = null; // try next variant
          continue;
        } else {
          break; // stop on other status
        }
      }
    } else {
      // Pass through original body (multipart/form-data or others) to backend
      const originalCt =
        request.headers.get("content-type") || "application/octet-stream";
      const blob = await request.blob().catch(() => null);
      for (const path of attempts) {
        const url = new URL(path, base);
        try {
          backendRes = await fetch(url.toString(), {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": originalCt,
              ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: blob ?? undefined,
          });
        } catch (e: unknown) {
          lastErr = e instanceof Error ? e.message : "Network error";
          backendRes = null;
        }
        if (!backendRes) continue;
        if (backendRes.ok) break;
        if (backendRes.status === 404 || backendRes.status === 405) {
          backendRes = null; // try next variant
          continue;
        } else {
          break; // stop on other status
        }
      }
    }

    if (!backendRes) {
      return NextResponse.json(
        { message: lastErr || "No response from resources backend" },
        { status: 502 }
      );
    }

    const ct = backendRes.headers.get("content-type") || "";
    const payload = ct.includes("application/json")
      ? await backendRes.json().catch(() => null)
      : await backendRes.text().catch(() => "");

    if (!backendRes.ok) {
      const message =
        (payload && (payload.message || payload.error)) ||
        `Backend error (status ${backendRes.status})`;
      return NextResponse.json(
        { message, data: payload },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(payload ?? { success: true }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to save resource";
    return NextResponse.json({ message }, { status: 500 });
  }
}

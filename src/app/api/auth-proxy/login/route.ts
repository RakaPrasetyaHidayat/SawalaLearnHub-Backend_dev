import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function extractMessage(data: unknown): string | undefined {
  if (data && typeof data === 'object') {
    const obj = data as { message?: unknown; error?: unknown };
    if (typeof obj.message === 'string') return obj.message;
    if (typeof obj.error === 'string') return obj.error;
  }
  return undefined;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const password = searchParams.get('password');

    if (!email || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Missing email or password' },
        { status: 400 }
      );
    }

    // Using per-attempt timeouts below

    const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    if (!base) {
      return NextResponse.json(
        { status: 'error', message: 'Missing NEXT_PUBLIC_API_BASE_URL on server' },
        { status: 500 }
      );
    }
    const params = new URLSearchParams({ email, password }).toString();
    const start = Date.now();

    const attempts: Array<{ method: 'GET' | 'POST'; url: string; headers: Record<string, string>; body?: string }> = [
      // Prefer POST first
      { method: 'POST', url: `${base}/api/auth/login`, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ email, password }) },
      { method: 'POST', url: `${base}/auth/login`, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ email, password }) },
      { method: 'POST', url: `${base}/api/v1/auth/login`, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ email, password }) },
      { method: 'POST', url: `${base}/v1/auth/login`, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ email, password }) },
      // Then GET fallbacks
      { method: 'GET', url: `${base}/api/auth/login?${params}`, headers: { 'Accept': 'application/json' } },
      { method: 'GET', url: `${base}/auth/login?${params}`, headers: { 'Accept': 'application/json' } },
      { method: 'GET', url: `${base}/api/v1/auth/login?${params}`, headers: { 'Accept': 'application/json' } },
      { method: 'GET', url: `${base}/v1/auth/login?${params}`, headers: { 'Accept': 'application/json' } },
    ];

    let backendRes: Response | null = null;
    let lastText = '';

    const tried: string[] = [];
    let lastStatus = 0;
    let lastErrorMsg = '';

    for (const attempt of attempts) {
      // Global deadline guard (25s)
      if (Date.now() - start > 25000) { lastErrorMsg = 'Global timeout exceeded'; break; }
      // per-attempt timeout controller (10s)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      // Record attempted path without leaking query/password
      const safePath = attempt.url.replace(/^https?:\/\/[^/]+/i, '').split('?')[0];
      tried.push(`${attempt.method} ${safePath}`);

      try {
        backendRes = await fetch(attempt.url, {
          method: attempt.method,
          headers: attempt.headers,
          body: attempt.body,
          signal: controller.signal,
          cache: 'no-store',
        });
      } catch (e: unknown) {
        if (e instanceof Error) {
          lastErrorMsg = e.name === 'AbortError' ? 'Attempt timeout' : (e.message || 'Network error');
        } else {
          lastErrorMsg = 'Network error';
        }
      } finally {
        clearTimeout(timeoutId);
      }

      if (!backendRes) {
        // Try next endpoint if fetch failed (e.g., timeout)
        continue;
      }

      if (backendRes.ok) break;

      lastStatus = backendRes.status;
      lastText = await backendRes.clone().text().catch(() => '');
      if (lastStatus === 404 || lastStatus === 405 || /Cannot (GET|POST)|Method Not Allowed|Not Found/i.test(lastText)) {
        // Try next variant if endpoint not found or method not allowed
        backendRes = null;
        continue;
      } else {
        // Stop on other errors (e.g., 400/401 etc.) and return their payload
        break;
      }
    }

    
    if (!backendRes) {
      return NextResponse.json(
        { status: 'error', message: lastErrorMsg || 'No response from auth backend', tried },
        { status: 502 }
      );
    }

    let data: unknown = null;
    const contentType = backendRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await backendRes.json().catch(() => null);
    } else {
      const text = await backendRes.text().catch(() => '');
      data = text ? { message: text } : null;
    }

    if (!backendRes.ok) {
      const message = extractMessage(data) || 'Login failed';
      return NextResponse.json(
        { status: 'error', message, data, statusCode: backendRes.status },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error
      ? (err.name === 'AbortError' ? 'Request timeout' : (err.message || 'Network error'))
      : 'Network error';
    return NextResponse.json({ status: 'error', message: `Proxy error: ${message}` }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = body?.email;
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Missing email or password' },
        { status: 400 }
      );
    }

    // Using per-attempt timeouts below

    const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    if (!base) {
      return NextResponse.json(
        { status: 'error', message: 'Missing NEXT_PUBLIC_API_BASE_URL on server' },
        { status: 500 }
      );
    }
    const params = new URLSearchParams({ email, password }).toString();
    const start = Date.now();

    const attempts: Array<{ method: 'GET' | 'POST'; url: string; headers: Record<string, string>; body?: string }> = [
      // Prefer POST first
      { method: 'POST', url: `${base}/api/auth/login`, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ email, password }) },
      { method: 'POST', url: `${base}/auth/login`, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ email, password }) },
      { method: 'POST', url: `${base}/api/v1/auth/login`, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ email, password }) },
      { method: 'POST', url: `${base}/v1/auth/login`, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ email, password }) },
      // Then GET fallbacks
      { method: 'GET', url: `${base}/api/auth/login?${params}`, headers: { 'Accept': 'application/json' } },
      { method: 'GET', url: `${base}/auth/login?${params}`, headers: { 'Accept': 'application/json' } },
      { method: 'GET', url: `${base}/api/v1/auth/login?${params}`, headers: { 'Accept': 'application/json' } },
      { method: 'GET', url: `${base}/v1/auth/login?${params}`, headers: { 'Accept': 'application/json' } },
    ];

    let backendRes: Response | null = null;
    let lastText = '';

    const tried: string[] = [];
    let lastStatus = 0;
    let lastErrorMsg = '';

    for (const attempt of attempts) {
      // Global deadline guard (25s)
      if (Date.now() - start > 25000) { lastErrorMsg = 'Global timeout exceeded'; break; }
      // per-attempt timeout controller (10s)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      // Record attempted path without leaking query/password
      const safePath = attempt.url.replace(/^https?:\/\/[^/]+/i, '').split('?')[0];
      tried.push(`${attempt.method} ${safePath}`);

      try {
        backendRes = await fetch(attempt.url, {
          method: attempt.method,
          headers: attempt.headers,
          body: attempt.body,
          signal: controller.signal,
          cache: 'no-store',
        });
      } catch (e: unknown) {
        if (e instanceof Error) {
          lastErrorMsg = e.name === 'AbortError' ? 'Attempt timeout' : (e.message || 'Network error');
        } else {
          lastErrorMsg = 'Network error';
        }
      } finally {
        clearTimeout(timeoutId);
      }

      if (!backendRes) {
        // Try next endpoint if fetch failed (e.g., timeout)
        continue;
      }

      if (backendRes.ok) break;

      lastStatus = backendRes.status;
      lastText = await backendRes.clone().text().catch(() => '');
      if (lastStatus === 404 || lastStatus === 405 || /Cannot (GET|POST)|Method Not Allowed|Not Found/i.test(lastText)) {
        // Try next variant if endpoint not found or method not allowed
        backendRes = null;
        continue;
      } else {
        // Stop on other errors (e.g., 400/401 etc.) and return their payload
        break;
      }
    }

    
    if (!backendRes) {
      return NextResponse.json(
        { status: 'error', message: lastErrorMsg || 'No response from auth backend', tried },
        { status: 502 }
      );
    }

    let data: unknown = null;
    const contentType = backendRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await backendRes.json().catch(() => null);
    } else {
      const text = await backendRes.text().catch(() => '');
      data = text ? { message: text } : null;
    }

    if (!backendRes.ok) {
      const message = extractMessage(data) || 'Login failed';
      return NextResponse.json(
        { status: 'error', message, data, statusCode: backendRes.status },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error
      ? (err.name === 'AbortError' ? 'Request timeout' : (err.message || 'Network error'))
      : 'Network error';
    return NextResponse.json({ status: 'error', message: `Proxy error: ${message}` }, { status: 502 });
  }
}
import { NextResponse } from 'next/server';

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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
        cache: 'no-store',
      }
    );

    clearTimeout(timeoutId);

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
      const message = (data && (data.message || data.error)) || 'Login failed';
      return NextResponse.json(
        { status: 'error', message, data },
        { status: backendRes.status }
      );
    }

    // Pass-through the successful response
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error
      ? (err.name === 'AbortError' ? 'Request timeout' : (err.message || 'Network error'))
      : 'Network error';
    return NextResponse.json({ status: 'error', message }, { status: 408 });
  }
}

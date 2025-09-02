    export async function getUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}
export async function login(email: string, password: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s client timeout
  try {
    const res = await fetch('/api/auth-proxy/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });

    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await res.json().catch(() => null)
      : await res.text().then(t => (t ? { message: t } : null)).catch(() => null);

    if (!res.ok) {
      const backendMsg = (data && (data.message || data.error)) || '';
      let message = backendMsg || 'Login failed';
      switch (res.status) {
        case 400:
          message = backendMsg || 'Email atau password tidak boleh kosong';
          break;
        case 401:
          message = backendMsg || 'Email atau password salah';
          break;
        case 408:
          message = 'Koneksi lambat atau tidak stabil. Silakan coba lagi.';
          break;
        case 429:
          message = backendMsg || 'Terlalu banyak percobaan. Coba beberapa saat lagi.';
          break;
        case 502:
        case 503:
        case 504:
          message = backendMsg || 'Server sedang bermasalah. Coba lagi nanti.';
          break;
        default:
          message = backendMsg || `Login failed (status ${res.status})`;
      }
      throw new Error(message);
    }

    return data;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function register(payload: { email: string; password: string; username?: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || 'Register failed';
    throw new Error(message);
  }
  return data;
}

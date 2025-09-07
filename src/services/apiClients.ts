// API Base URL
const API_BASE_URL = 'https://learnhubbackenddev.vercel.app';

// Generic API fetch function
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json().catch(() => null)
      : await response.text().then(t => (t ? { message: t } : null)).catch(() => null);

    if (!response.ok) {
      const backendMsg = (data && (data.message || data.error)) || '';
      let message = backendMsg || `Request failed with status ${response.status}`;
      
      switch (response.status) {
        case 400:
          message = backendMsg || 'Bad request - please check your input';
          break;
        case 401:
          message = backendMsg || 'Unauthorized - please check your credentials';
          break;
        case 403:
          message = backendMsg || 'Forbidden - you don\'t have permission';
          break;
        case 404:
          message = backendMsg || 'Resource not found';
          break;
        case 408:
          message = 'Request timeout - please try again';
          break;
        case 429:
          message = backendMsg || 'Too many requests - please try again later';
          break;
        case 500:
          message = backendMsg || 'Internal server error';
          break;
        case 502:
        case 503:
        case 504:
          message = backendMsg || 'Server is temporarily unavailable';
          break;
        default:
          message = backendMsg || `Request failed (status ${response.status})`;
      }
      throw new Error(message);
    }

    return data;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timeout - please check your connection');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

// User management functions
export async function getUsers() {
  return apiRequest<any>('/api/users');
}

// Authentication functions
export async function login(email: string, password: string) {
  return apiRequest<any>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(payload: { 
  email: string; 
  password: string; 
  username?: string;
  fullName?: string;
  division?: string;
  angkatan?: number;
}) {
  return apiRequest<any>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Profile management functions
export async function getUserProfile(userId: string) {
  return apiRequest<any>(`/api/users/${userId}`);
}

export async function updateUserProfile(userId: string, profileData: any) {
  return apiRequest<any>(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

// Generic data fetching functions
export async function getData<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint);
}

export async function postData<T>(endpoint: string, data: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function putData<T>(endpoint: string, data: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteData<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
  });
}
import { apiFetcher } from "./fetcher";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://learnhubbackenddev.vercel.app";

// Use the authenticated fetcher instead of custom apiRequest

// User management functions
export async function getUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.status) queryParams.append("status", params.status);
  if (params?.role) queryParams.append("role", params.role);

  const queryString = queryParams.toString();
  const endpoint = queryString
    
     "/api/users/pending";

  return apiFetcher<any>(endpoint);
}

// Admin specific user management functions
export async function getPendingUsers() {
  return apiFetcher<any>("/api/users/pending");
}

export async function updateUserStatus(
  userId: string | number,
  status: string
) {
  // Prefer backend canonical endpoint /api/users/:id/status (absolute),
  // fall back to older /api/users/pending/:id/status if needed.
  try {
    return await apiFetcher<any>(`${API_BASE}/api/users/${userId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  } catch (err) {
    console.warn("apiClients.updateUserStatus: absolute endpoint failed, falling back:", err);
    return apiFetcher<any>(`/api/users/pending/${userId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }
}

export async function deleteUser(userId: string | number) {
  return apiFetcher<any>(`/api/users/pending/${userId}`, {
    method: "DELETE",
  });
}

// Authentication functions
export async function login(email: string, password: string) {
  return apiFetcher<any>("/api/v1/auth/login", {
    method: "POST",
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
  return apiFetcher<any>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Profile management functions
export async function getUserProfile(userId: string) {
  console.log("Fetching user profile for userId:", userId);
  return apiFetcher<any>(`/api/users/pending/${userId}`);
}

export async function updateUserProfile(userId: string, profileData: any) {
  return apiFetcher<any>(`/api/users/pending/${userId}`, {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}

// Helpers for the current authenticated user (me)
export async function getMyProfile() {
  // Try absolute backend /api/users/me first
  try {
    return await apiFetcher<any>(`${API_BASE}/api/users/me`);
  } catch (err) {
    console.warn("getMyProfile absolute endpoint failed, trying relative fallbacks:", err);
    // Try some reasonable relative fallbacks
    try {
      return await apiFetcher<any>(`/api/users/profile`);
    } catch (err2) {
      console.warn("getMyProfile fallback /api/users/profile failed, trying /users/me:", err2);
      return apiFetcher<any>(`/users/me`);
    }
  }
}

export async function updateMyProfile(profileData: any) {
  // Prefer backend absolute /api/users/me (PUT) when available
  try {
    return await apiFetcher<any>(`${API_BASE}/api/users/me`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  } catch (err) {
    console.warn("updateMyProfile absolute endpoint failed, trying relative fallbacks:", err);
    try {
      return await apiFetcher<any>(`/api/users/profile`, {
        method: "PUT",
        body: JSON.stringify(profileData),
      });
    } catch (err2) {
      console.warn("updateMyProfile fallback /api/users/profile failed, trying /api/users/pending:", err2);
      return apiFetcher<any>(`/api/users/pending/${profileData?.id}`, {
        method: "PUT",
        body: JSON.stringify(profileData),
      });
    }
  }
}

// Generic data fetching functions
export async function getData<T>(endpoint: string): Promise<T> {
  return apiFetcher<T>(endpoint);
}

export async function postData<T>(endpoint: string, data: any): Promise<T> {
  return apiFetcher<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function putData<T>(endpoint: string, data: any): Promise<T> {
  return apiFetcher<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteData<T>(endpoint: string): Promise<T> {
  return apiFetcher<T>(endpoint, {
    method: "DELETE",
  });
}

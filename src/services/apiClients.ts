import { apiFetcher } from "./fetcher";

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
    ? `/api/v1/users?${queryString}`
    : "/api/v1/users";

  return apiFetcher<any>(endpoint);
}

// Admin specific user management functions
export async function getPendingUsers() {
  return apiFetcher<any>("/api/v1/users/pending");
}

export async function updateUserStatus(
  userId: string | number,
  status: string
) {
  return apiFetcher<any>(`/api/v1/users/${userId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function deleteUser(userId: string | number) {
  return apiFetcher<any>(`/api/v1/users/${userId}`, {
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
  return apiFetcher<any>(`/api/v1/users/${userId}`);
}

export async function updateUserProfile(userId: string, profileData: any) {
  return apiFetcher<any>(`/api/v1/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
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

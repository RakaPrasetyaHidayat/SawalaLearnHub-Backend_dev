const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://learnhubbackenddev.vercel.app";

// Get auth token from localStorage/sessionStorage
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const token =
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");
  return token;
}

async function request(path: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers || {}) as Record<string, string>),
  };

  // Add authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log("API request to:", `${BASE_URL}${path}`);
  console.log("Request headers:", headers);
  console.log("Using token:", token);

  // Prefer relative path when called from browser to hit the Next.js proxy (/api/*)
  const isBrowser = typeof window !== "undefined";
  const useRelative = isBrowser && path.startsWith("/api");
  const url = useRelative ? path : `${BASE_URL}${path}`;

  const finalHeaders = { ...headers };
  const body = (options as any).body;
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    delete (finalHeaders as any)["Content-Type"];
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers: finalHeaders,
  };
  if (useRelative) (fetchOptions as any).credentials = 'same-origin';

  const res = await fetch(url, fetchOptions);
  
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/* ----------------- TASKS ----------------- */
export async function getAllTasks() {
  return request("/api/tasks");
}

export async function createTask(taskData: any) {
  return request("/api/tasks", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
}

export async function submitTask(submitData: any) {
  return request("/api/tasks/submit", {
    method: "POST",
    body: JSON.stringify(submitData),
  });
}

export async function updateTaskStatus(id: string, status: string) {
  return request(`/api/tasks/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

/* ----------------- POSTS ----------------- */
export async function getPosts() {
  return request("/api/posts");
}

export async function createPost(postData: any) {
  return request("/api/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });
}

export async function deletePost(id: string) {
  return request(`/api/posts/${id}`, {
    method: "DELETE",
  });
}

/* ----------------- TYPES ----------------- */
export interface User {
  id: string | number;
  name: string;
  email: string;
  division?: string;
  angkatan?: number;
  role?: string;
  status?: string;
  [key: string]: any;
}

export interface DivisionStats {
  all: number;
  uiux: number;
  frontend: number;
  backend: number;
  devops: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/* ----------------- API CLIENT ----------------- */
export const apiClient = {
  async getAllUsersByDivisions(): Promise<ApiResponse<User[]>> {
    try {
      const data = await request("/api/users");
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getUsersByDivision(divisionId: string): Promise<ApiResponse<{ users: User[] }>> {
    try {
      const data = await request(`/api/users/division/${divisionId}`);
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const data = await request("/api/users");
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async login(credentials: { email: string; password: string }): Promise<ApiResponse<any>> {
    try {
      const data = await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async register(userData: any): Promise<ApiResponse<any>> {
    try {
      const data = await request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async updateUserProfile(profileData: any): Promise<ApiResponse<any>> {
    try {
      const data = await request("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      });
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

/* ----------------- LEGACY API OBJECT ----------------- */
export const api = {
  getAllTasks,
  createTask,
  submitTask,
  updateTaskStatus,
  getPosts,
  createPost,
  deletePost,
};
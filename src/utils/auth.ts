import {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
} from "@/services/fetcher";

export interface User {
  id: string;
  name: string;
  email: string;
  division?: string;
  angkatan?: number;
  role?: "admin" | "user";
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Get current authentication state
 */
export function getAuthState(): AuthState {
  const token = getAuthToken();

  if (!token) {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  }

  // Try to get user data from localStorage
  let user: User | null = null;
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        user = JSON.parse(userData);
      } catch (e) {
        console.warn("Failed to parse user data from localStorage");
      }
    }
  }

  return {
    isAuthenticated: true,
    user,
    token,
  };
}

/**
 * Login with email and password
 */
export async function login(
  email: string,
  password: string
): Promise<AuthState> {
  try {
    const response = await fetch("/api/_auth/login", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    console.log("Login response data:", data);

    if (data.token && data.user) {
      setAuthToken(data.token, true);

      // Store user data
      if (typeof window !== "undefined") {
        localStorage.setItem("user_data", JSON.stringify(data.user));
      }

      return {
        isAuthenticated: true,
        user: data.user,
        token: data.token,
      };
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Logout user
 */
export function logout(): void {
  removeAuthToken();
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_data");
  }
}

/**
 * Check if user needs to authenticate for API access
 */
export function requiresAuth(): boolean {
  const authState = getAuthState();
  return !authState.isAuthenticated;
}

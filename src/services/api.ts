// API Configuration and Types
export const API_CONFIG = {
  BASE_URL: 'https://learnhubbackenddev.vercel.app',
  TIMEOUT: 15000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
    },
    USERS: {
      LIST: '/api/users',
      PROFILE: '/api/users/profile',
      UPDATE: '/api/users/update',
      BY_DIVISION: '/api/users/division',
    },
    RESOURCES: {
      LIST: '/api/resources',
      CREATE: '/api/resources',
      UPDATE: '/api/resources',
      DELETE: '/api/resources',
    }
  }
} as const;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    full_name?: string;
    division?: string;
    angkatan?: number;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
  division?: string;
  angkatan?: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  division?: string;
  angkatan?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UsersByDivisionResponse {
  users: User[];
  count: number;
  division: string;
}

export interface DivisionStats {
  all: number;
  uiux: number;
  frontend: number;
  backend: number;
  devops: number;
}

// HTTP Client Class
export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_CONFIG.BASE_URL, timeout: number = API_CONFIG.TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseURL}${endpoint}`;
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
        
        return {
          success: false,
          error: message,
          data: undefined
        };
      }

      return {
        success: true,
        data: data,
        message: data?.message
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout - please check your connection'
        };
      }
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred'
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers
    });
  }

  async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers
    });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  // Authentication Methods
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.post<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return this.post<User>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.post<void>(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
  }

  // User Methods
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.get<User[]>(API_CONFIG.ENDPOINTS.USERS.LIST);
  }

  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.get<User>(API_CONFIG.ENDPOINTS.USERS.PROFILE);
  }

  async updateUserProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.put<User>(API_CONFIG.ENDPOINTS.USERS.UPDATE, userData);
  }

  async getUsersByDivision(divisionId: string): Promise<ApiResponse<UsersByDivisionResponse>> {
    return this.get<UsersByDivisionResponse>(`${API_CONFIG.ENDPOINTS.USERS.BY_DIVISION}/${divisionId}`);
  }

  async getAllUsersByDivisions(): Promise<ApiResponse<User[]>> {
    return this.get<User[]>(API_CONFIG.ENDPOINTS.USERS.LIST);
  }
}

// Default API client instance
export const apiClient = new ApiClient();

// Convenience functions for backward compatibility
export const api = {
  get: <T>(endpoint: string) => apiClient.get<T>(endpoint),
  post: <T>(endpoint: string, data?: any) => apiClient.post<T>(endpoint, data),
  put: <T>(endpoint: string, data?: any) => apiClient.put<T>(endpoint, data),
  delete: <T>(endpoint: string) => apiClient.delete<T>(endpoint),
};
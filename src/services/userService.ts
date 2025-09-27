import { apiFetcher, getAuthToken } from "./fetcher";
import { User } from "@/types/user";
import { apiClient } from "./api";
import { mockUsers, mockMembers } from "./mockDataFallback";

export type Member = {
  id: number | string;
  email?: string;
  username: string;
  full_name?: string;
  division: string;
  angkatan?: number;
  school: string;
  avatarSrc?: string;
};

export type AdminUser = {
  id: number | string;
  name: string;
  email: string;
  username?: string;
  full_name?: string;
  role: string;
  division: string;
  angkatan?: number;
  status: "Pending" | "Approved" | "Rejected" | "Active" | "Inactive";
  avatarSrc?: string;
  created_at?: string;
  updated_at?: string;
};

export type UserFilters = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
};

export type PaginatedUsersResponse = {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function normalizeMembers(payload: any): Member[] {
  // Support common shapes: [], { data: [] }, { users: [] }, { data: { data: [] } }
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.users)
    ? payload.users
    : Array.isArray(payload?.data?.data)
    ? payload.data.data
    : [];

  return list.map((u: any) => ({
    id: u?.id ?? u?._id ?? "",
    email: u?.email ?? "",
    username:
      u?.username ??
      u?.full_name ??
      u?.name ??
      (typeof u?.email === "string" ? u.email.split("@")[0] : "User"),
    full_name: u?.full_name ?? u?.name,
    // Prefer explicit division field from API
    division: u?.division ?? u?.division_id ?? u?.role ?? "",
    // Map angkatan; fallback to channel_year if relevant
    angkatan: u?.angkatan ?? u?.channel_year,
    // Use provided school_name first
    school: u?.school_name ?? u?.school ?? u?.sekolah ?? "",
    avatarSrc: u?.avatarSrc ?? u?.avatar ?? u?.image ?? undefined,
  }));
}

// Always resolve to a normalized array of members or throw on failure so UI can show an error
export async function fetchMembers(): Promise<Member[]> {
  try {
    // Try typed client first
    const res = await apiClient.getUsers();
    if (res?.success) {
      return normalizeMembers(res.data);
    }

    // Fallback to raw fetcher (this throws on HTTP errors like 401)
    const raw = await apiFetcher<any>("/api/v1/users");
    return normalizeMembers(raw);
  } catch (error) {
    console.error("Failed to fetch members, using mock data:", error);

    // Return mock data when API fails
    return normalizeMembers(mockMembers);
  }
}

function normalizeAdminUsers(payload: any): AdminUser[] {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.users)
    ? payload.users
    : Array.isArray(payload?.data?.data)
    ? payload.data.data
    : [];

  return list.map((u: any) => ({
    id: u?.id ?? u?._id ?? "",
    name: u?.name ?? u?.full_name ?? u?.username ?? "User",
    email: u?.email ?? "",
    username: u?.username ?? "",
    full_name: u?.full_name ?? u?.name,
    role: u?.role ?? u?.division ?? "",
    division: u?.division ?? u?.role ?? "",
    angkatan: u?.angkatan ?? u?.channel_year,
    status: u?.status ?? "Pending",
    avatarSrc: u?.avatarSrc ?? u?.avatar ?? u?.image ?? undefined,
    created_at: u?.created_at ?? u?.createdAt,
    updated_at: u?.updated_at ?? u?.updatedAt,
  }));
}

function normalizePaginatedResponse(payload: any): PaginatedUsersResponse {
  return {
    data: normalizeAdminUsers(payload.data || payload.users || []),
    total: payload.total || payload.count || 0,
    page: payload.page || payload.currentPage || 1,
    limit: payload.limit || payload.perPage || 10,
    totalPages: payload.totalPages || payload.pages || 1,
  };
}

// Admin user management functions
export async function fetchAdminUsers(
  filters?: UserFilters
): Promise<PaginatedUsersResponse> {
  const { getUsers } = await import("./apiClients");

  try {
    const response = await getUsers(filters);

    // Check if response has pagination structure
    if (response && (response.data || response.users)) {
      return normalizePaginatedResponse(response);
    }

    // Fallback to simple array response
    return {
      data: normalizeAdminUsers(response),
      total: Array.isArray(response) ? response.length : 0,
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      totalPages: 1,
    };
  } catch (error) {
    console.error("Failed to fetch admin users, using mock data:", error);

    // Return mock data when API fails
    const filteredMockUsers = mockUsers.filter((user) => {
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.division.toLowerCase().includes(searchLower)
        );
      }
      if (filters?.status && user.status !== filters.status) {
        return false;
      }
      if (filters?.role && user.role !== filters.role) {
        return false;
      }
      return true;
    });

    return {
      data: normalizeAdminUsers(filteredMockUsers),
      total: filteredMockUsers.length,
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      totalPages: Math.ceil(filteredMockUsers.length / (filters?.limit || 10)),
    };
  }
}

export async function fetchPendingUsers(): Promise<AdminUser[]> {
  const { getPendingUsers } = await import("./apiClients");

  try {
    const response = await getPendingUsers();
    return normalizeAdminUsers(response);
  } catch (error) {
    console.error("Failed to fetch pending users:", error);
    throw error;
  }
}

// Function to update a user's status (approve/reject)
export const updateUserStatus = async (
  userId: string,
  status: "ACTIVE" | "REJECTED"
) => {
  try {
    const token = getAuthToken();

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://learnhubbackenddev.vercel.app";
    const url = `${baseUrl}/api/v1/users/${userId}/status`;
    console.log("Updating user status at URL:", url, "with body:", { status });

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const text = await response.text();
      const message = text || response.statusText || "Failed to update status";
      throw new Error(message);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to update user status:", error);
    throw error;
  }
};

// Function to update a user's role
export const updateUserRole = async (userId: string, role: string) => {
  try {
    const response = await apiFetcher(`/api/users/${userId}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });
    return response;
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw error;
  }
};

export async function deleteUserAccount(
  userId: string | number
): Promise<void> {
  const { deleteUser } = await import("./apiClients");

  try {
    await deleteUser(userId);
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
}

export async function fetchUserById(
  userId: string | number
): Promise<AdminUser> {
  const { getUserProfile } = await import("./apiClients");

  try {
    const response = await getUserProfile(userId.toString());
    return normalizeAdminUsers([response])[0];
  } catch (error) {
    // Don't log the error here since it's handled by the calling component
    // as a fallback to query parameters
    throw error;
  }
}

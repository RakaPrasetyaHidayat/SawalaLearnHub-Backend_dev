import { apiFetcher, getAuthToken } from "./fetcher";
import { apiClient } from "./api";
import { mockUsers, mockMembers } from "./mockDataFallback";
import { DivisionService } from "./division";

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
  const raw = await apiFetcher("/api/v1/users");
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

// Build a division endpoint path that preserves slash-separated slugs like "ui/ux"
function buildDivisionPath(div: string, query = "") {
  const segments = String(div || "").split("/").filter(Boolean).map(encodeURIComponent).join("/");
  return `/api/users/division/${segments}${query}`;
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
  status: string
) => {
  try {
    const token = getAuthToken();

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://learnhubbackenddev.vercel.app";
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

/**
 * Robust fetch for users by division UUID (or id). Tries the division endpoint
 * with retries for transient errors and falls back to DivisionService filtering.
 */
export async function getUsersByDivisionSafe(
  divisionId: string,
  year?: string | number
): Promise<Member[]> {
  const q = year ? `?year=${encodeURIComponent(String(year))}` : "";

  // Build sensible variants for division identifiers to handle inputs like 'ui/ux', 'ui-ux', 'uiux'
  const norm = (s: string) => String(s || "").trim();
  const base = norm(divisionId);
  const variants = Array.from(
    new Set([
      base,
      base.replace(/\//g, ""),
      base.replace(/\//g, "-"),
      base.replace(/[^a-z0-9]/gi, ""),
      base.toLowerCase(),
      base.toLowerCase().replace(/[^a-z0-9]/g, ""),
    ])
  ).filter(Boolean);

  let lastErr: any = null;

  // Try each variant and perform a small number of retries for transient issues
  for (const variant of variants) {
    const endpoint = buildDivisionPath(variant, q);
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const resp = await apiFetcher(endpoint);

        // Try to extract array from common shapes
        const list = Array.isArray(resp)
          ? resp
          : Array.isArray(resp?.data)
          ? resp.data
          : Array.isArray(resp?.users)
          ? resp.users
          : Array.isArray(resp?.data?.data)
          ? resp.data.data
          : null;

        if (Array.isArray(list)) {
          return normalizeMembers(list);
        }

        // If response contains grouped counts (channel_year/count), this endpoint returned counts not members
        if (Array.isArray(resp?.data) && resp.data.length > 0 && resp.data[0] && "count" in resp.data[0]) {
          // Not a member list; caller may expect members. Fall back to DivisionService.
          throw new Error("Division endpoint returned grouped counts instead of member list");
        }

        // Unexpected shape - throw to trigger fallback/retry
        throw new Error("Unexpected response shape from division endpoint");
      } catch (err: any) {
        lastErr = err;
        const msg = String(err?.message || "").toLowerCase();
        if (err?.status === 401) throw err; // auth handled elsewhere
        const isTimeout = msg.includes("timeout") || msg.includes("request timeout");
        const isNetwork = msg.includes("failed to fetch") || msg.includes("network error");
        const isServerErr = typeof err?.status === "number" && err.status >= 500;
        if (attempt < 2 && (isTimeout || isNetwork || isServerErr)) {
          await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
          continue;
        }
        // Try next variant
        break;
      }
    }
  }

  // Fallback: use DivisionService client-side filtering and mapping
  try {
    const yearStr = year ? String(year) : String(new Date().getFullYear());
    const fallback = await DivisionService.getDivisionMembers(divisionId, yearStr);
    return fallback.map((u: any) => ({
      id: u.id,
      email: u.email,
      username: u.username,
      full_name: u.full_name,
      division: u.division,
      angkatan: u.angkatan,
      school: u.school,
      avatarSrc: u.avatarSrc,
    }));
  } catch (e) {
    console.error("Division fallback failed:", e, "lastErr:", lastErr);
    // As a last resort, return mock data
    return normalizeMembers(mockMembers);
  }
}

// Get users by division (per channel_year)
export async function fetchUsersByDivision(
  divisionId: string,
  year?: string | number
): Promise<AdminUser[] | { channel_year: number; count: number }[]> {
  try {
  const queryParams = year ? `?year=${encodeURIComponent(String(year))}` : "";
  const endpoint = buildDivisionPath(divisionId, queryParams);
  const response = await apiFetcher(endpoint);

    if (response?.status === "success" && Array.isArray(response.data)) {
      // Check if it's the grouped counts response or user list
      if (response.data.length > 0 && typeof response.data[0] === "object" && "count" in response.data[0]) {
        // Grouped counts response
        return response.data as { channel_year: number; count: number }[];
      } else {
        // User list response
        return normalizeAdminUsers(response.data);
      }
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Failed to fetch users by division:", error);
    throw error;
  }
}

/**
 * Fetch counts for multiple divisions for a given year.
 * Tries the division counts API first (grouped response). If the endpoint
 * returns a user list or fails (401/404/etc), falls back to `getUsersByDivisionSafe`
 * and counts members matching the year.
 */
export async function fetchDivisionCounts(
  divisions: string[],
  year?: string | number
): Promise<Record<string, number | { error: string }>> {
  const results: Record<string, number | { error: string }> = {};

  await Promise.all(
    divisions.map(async (division) => {
      try {
        // Try the API first; this may return grouped counts or a user list
        const resp = await fetchUsersByDivision(division, year);

        // If resp is grouped counts array
        if (Array.isArray(resp) && resp.length > 0 && typeof resp[0] === 'object' && 'count' in resp[0]) {
          const countsByYear = resp as { channel_year: number; count: number }[];
          if (typeof year !== 'undefined') {
            const match = countsByYear.find((r) => String(r.channel_year) === String(year));
            results[division] = match ? match.count : 0;
          } else {
            const total = countsByYear.reduce((acc, entry) => acc + (entry.count || 0), 0);
            results[division] = total;
          }
          return;
        }

        // If resp is a user list
        if (Array.isArray(resp)) {
          results[division] = (resp as AdminUser[]).length;
          return;
        }

        // Fallback: use safe fetch (will return members array)
        const members = await getUsersByDivisionSafe(division, year);
        results[division] = Array.isArray(members) ? members.length : 0;
      } catch (err: any) {
        try {
          // If the API call failed (401/404 etc), fallback to safe fetch
          const members = await getUsersByDivisionSafe(division, year);
          results[division] = Array.isArray(members) ? members.length : { error: 'fallback failed' };
        } catch (e: any) {
          console.error('fetchDivisionCounts failed for', division, err || e);
          results[division] = { error: String((e || err)?.message || 'unknown') };
        }
      }
    })
  );

  return results;
}

/**
 * Fetch full backend endpoints directly for a list of divisions using exact slugs
 * (for example: UI_UX, frontend, backend, devops). This will attach Authorization
 * header from getAuthToken() if available. Returns raw parsed JSON per-division.
 */
export async function fetchAllDivisionData(divisions: string[], year?: string | number) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://learnhubbackenddev.vercel.app'
  const token = getAuthToken();
  const y = year ? `?year=${encodeURIComponent(String(year))}` : '';

  const requests = divisions.map(async (division) => {
    const url = `${base}/api/users/division/${division}${y}`;
    const headers: Record<string,string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const res = await fetch(url, { headers });
      const text = await res.text();
      try { return { division, status: res.status, body: text ? JSON.parse(text) : null } } catch { return { division, status: res.status, body: text } }
    } catch (err: any) {
      return { division, status: 0, error: String(err?.message || err) };
    }
  });

  const results = await Promise.all(requests);
  return results.reduce((acc: Record<string, any>, r: any) => { acc[r.division] = r; return acc }, {});
}

// Approve user (admin only) - set role
export async function approveUser(userId: string, role: "SISWA" | "ADMIN"): Promise<any> {
  try {
    const response = await apiFetcher(`/api/users/${userId}/accept`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    if (response?.status === "success") {
      return response;
    }

    throw new Error("Failed to approve user");
  } catch (error) {
    console.error("Failed to approve user:", error);
    throw error;
  }
}

import { apiFetcher } from "./fetcher";
import { apiClient } from "./api";

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
  // Try typed client first
  const res = await apiClient.getUsers();
  if (res?.success) {
    return normalizeMembers(res.data);
  }

  // Fallback to raw fetcher (this throws on HTTP errors like 401)
  const raw = await apiFetcher<any>("/api/users");
  return normalizeMembers(raw);
}

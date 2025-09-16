import { apiFetcher } from "./fetcher";

export type PostItem = {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  file?: { name: string; type: "image" | "document"; url?: string };
  createdAt: string; // ISO string
  likes: number;
  comments: number;
};

function detectFileType(nameOrMime?: string): "image" | "document" {
  if (!nameOrMime) return "document";
  const lower = nameOrMime.toLowerCase();
  if (lower.startsWith("image/")) return "image";
  if (/(\.png|\.jpg|\.jpeg|\.gif|\.webp|\.bmp|\.svg)$/i.test(lower))
    return "image";
  return "document";
}

function normalizePost(raw: any): PostItem {
  const user = raw?.user ?? raw?.author ?? {};
  const avatar =
    user?.avatar ||
    user?.avatar_url ||
    user?.image ||
    "/assets/icons/profile.png";
  const content = raw?.content ?? raw?.text ?? raw?.caption ?? "";
  const createdAt =
    raw?.created_at ??
    raw?.createdAt ??
    raw?.timestamp ??
    new Date().toISOString();
  const likes =
    typeof raw?.likes_count === "number"
      ? raw.likes_count
      : Array.isArray(raw?.likes)
      ? raw.likes.length
      : typeof raw?.likes === "number"
      ? raw.likes
      : 0;
  const comments =
    typeof raw?.comments_count === "number"
      ? raw.comments_count
      : Array.isArray(raw?.comments)
      ? raw.comments.length
      : typeof raw?.comments === "number"
      ? raw.comments
      : 0;

  const fileUrl =
    raw?.file_url || raw?.attachment_url || raw?.image_url || raw?.file?.url;
  const fileName =
    raw?.file?.name ||
    (typeof fileUrl === "string" ? fileUrl.split("/").pop() : undefined);
  const fileType = detectFileType(raw?.file?.type || fileName);

  return {
    id: String(raw?.id ?? raw?._id ?? ""),
    userName: user?.full_name || user?.username || user?.name || "Unknown",
    userAvatar: avatar,
    content,
    file:
      fileUrl || fileName
        ? {
            name: fileName || "attachment",
            type: fileType,
            url: fileUrl,
          }
        : undefined,
    createdAt,
    likes,
    comments,
  };
}

function isPostLike(o: any): boolean {
  if (!o || typeof o !== "object") return false;
  // Heuristics: has content/text/caption or created_at, or user/id
  return (
    typeof o.content === "string" ||
    typeof o.text === "string" ||
    typeof o.caption === "string" ||
    typeof o.created_at === "string" ||
    typeof o.createdAt === "string" ||
    typeof o.timestamp === "string" ||
    typeof o.id !== "undefined"
  );
}

function findFirstArrayOfObjects(node: any, depth = 0): any[] | null {
  if (depth > 4) return null; // avoid deep recursion
  if (!node) return null;
  if (Array.isArray(node)) {
    return node.length && typeof node[0] === "object" ? node : null;
  }
  if (typeof node === "object") {
    for (const key of Object.keys(node)) {
      const value = (node as any)[key];
      if (
        Array.isArray(value) &&
        value.length &&
        typeof value[0] === "object"
      ) {
        return value;
      }
    }
    for (const key of Object.keys(node)) {
      const found = findFirstArrayOfObjects((node as any)[key], depth + 1);
      if (found) return found;
    }
  }
  return null;
}

function normalizePosts(payload: any): { items: PostItem[]; meta?: any } {
  // Support: [], { data: [] }, { posts: [] }, { data: { data: [] } }, { data: { posts: [] } }, { results: [] }
  let list: any[] = [];
  if (Array.isArray(payload)) list = payload;
  else if (Array.isArray(payload?.data)) list = payload.data;
  else if (Array.isArray(payload?.posts)) list = payload.posts;
  else if (Array.isArray(payload?.data?.data)) list = payload.data.data;
  else if (Array.isArray(payload?.data?.posts)) list = payload.data.posts;
  else if (Array.isArray(payload?.results)) list = payload.results;

  // Fallback: recursively find the first array of objects
  if (!list.length) {
    const found = findFirstArrayOfObjects(payload);
    if (found && found.some(isPostLike)) list = found;
  }

  const meta =
    payload?.data && !Array.isArray(payload.data) ? payload.data : undefined;
  return { items: list.map(normalizePost), meta };
}

export async function listPosts(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const search = params?.search ?? "";
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) qs.append("search", search);

  // Try common list endpoints
  const candidates = [
    `/api/posts/list?${qs}`,
    `/api/posts?${qs}`,
    `/api/post?${qs}`,
  ];
  for (const url of candidates) {
    try {
      const res = await apiFetcher<any>(url);
      const normalized = normalizePosts(res);
      if (normalized.items.length) return normalized;
      // if empty but structure looks right, return anyway
      if (Array.isArray((res as any)?.data) || Array.isArray(res as any))
        return normalized;
    } catch {}
  }

  // Fallback: return empty
  return { items: [], meta: { from: "fallback" } };
}

// Get minimal current user info
export async function getCurrentUserBasic(): Promise<{
  id: string;
  name: string;
  username?: string;
  email?: string;
}> {
  const raw = await apiFetcher<any>(`/api/auth/me`);
  const data =
    raw && typeof raw === "object" && "data" in raw ? (raw as any).data : raw;
  const id = String(data?.id ?? data?._id ?? "");
  const name =
    data?.name ||
    data?.username ||
    data?.full_name ||
    (typeof data?.email === "string" ? data.email.split("@")[0] : "User") ||
    "User";
  return { id, name, username: data?.username, email: data?.email };
}

// Try to list only posts created by the current user
export async function listMyPosts(params?: { page?: number; limit?: number }) {
  const me = await getCurrentUserBasic();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });

  // 1) Use confirmed endpoint first
  try {
    const res = await apiFetcher<any>(
      `/api/posts/user/${encodeURIComponent(me.id)}?${qs}`
    );
    return normalizePosts(res);
  } catch (e) {
    // ignore and try next strategies
  }

  // 2) Try common dedicated endpoints
  const candidateEndpoints = [
    `/api/posts/my`,
    `/api/posts/me`,
    `/api/my/posts`,
  ];
  for (const ep of candidateEndpoints) {
    try {
      const res = await apiFetcher<any>(ep);
      const normalized = normalizePosts(res);
      if (normalized.items.length) return normalized;
    } catch (e) {
      // ignore 404s or other errors, continue to next strategy
    }
  }

  // 3) Try user-filtered endpoints if backend supports query/path filters
  const userCandidates = [
    `/api/posts?userId=${encodeURIComponent(me.id)}&${qs}`,
    `/api/posts/list?userId=${encodeURIComponent(me.id)}&${qs}`,
    `/api/users/${encodeURIComponent(me.id)}/posts?${qs}`,
  ];
  for (const url of userCandidates) {
    try {
      const res = await apiFetcher<any>(url);
      const normalized = normalizePosts(res);
      return normalized; // even if empty, it’s the correct endpoint
    } catch (e) {
      // ignore and try next
    }
  }

  // 4) Fallback: filter general list by current user's name/username
  const all = await listPosts({ page, limit });
  const mine = all.items.filter(
    (p) => p.userName === me.name || p.userName === me.username
  );
  return { items: mine, meta: { filteredFromAll: true, count: mine.length } };
}

// NOTE: This creates text-only posts. File upload usually requires multipart/form-data support.
export async function createPost(payload: {
  content: string /*, file?: File | null */;
}): Promise<PostItem> {
  const res = await apiFetcher<any>(`/api/posts`, {
    method: "POST",
    body: JSON.stringify({ content: payload.content }),
  });
  // Try to pick created post from common shapes
  const raw = res?.data ?? res?.post ?? res;
  const item = Array.isArray(raw?.data) ? raw?.data?.[0] : raw;
  return normalizePost(item);
}

export async function toggleLike(postId: string): Promise<void> {
  // Backend typically toggles like on POST; if it requires a body, adjust as needed
  try {
    await apiFetcher<any>(`/api/posts/${postId}/likes`, { method: "POST" });
  } catch (e) {
    // Non-fatal for UI; keeping local optimistic update
    console.warn("Like toggle failed:", e);
  }
}

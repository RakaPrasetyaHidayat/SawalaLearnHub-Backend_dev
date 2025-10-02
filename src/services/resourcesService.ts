import { apiFetcher, getAuthToken } from "./fetcher";

/**
 * Create a new resource. Accepts either a plain object payload (JSON) or a FormData
 * instance (for file uploads). Uses `apiFetcher` so token/timeout/401 handling is centralized.
 */
export async function createResource(payload: Record<string, any> | FormData) {
  try {
    if (payload instanceof FormData) {
      // Let apiFetcher attach Authorization header; do not set Content-Type so boundary is preserved
      return await apiFetcher(`/api/resources`, {
        method: "POST",
        body: payload as any,
      });
    }

    // JSON path
    return await apiFetcher(`/api/resources`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err: any) {
    // Re-throw enriched error for caller to handle
    throw err;
  }
}

export function canCurrentUserCreate(): boolean {
  // The backend may allow anonymous creation; but if token is required, check presence
  return !!getAuthToken();
}

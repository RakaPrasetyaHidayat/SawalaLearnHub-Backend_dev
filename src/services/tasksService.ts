import { apiFetcher } from "./fetcher";
import { formatYearForAPI } from "@/hooks/useDivisions";

export type TaskStatus = "submitted" | "revision" | "approved";

export interface Task {
  id: string | number;
  title: string;
  description?: string;
  division?: string; // normalized slug (e.g., devops, frontend, uiux)
  rawDivision?: string; // original division text/id (could be UUID)
  deadline?: string; // ISO or displayable string
  status?: TaskStatus; // status for current user if available
  unread?: boolean;
  // keep raw for debugging/future mapping
  raw?: any;
}

function extractYearNumber(year: string | number): number {
  if (typeof year === "number") return year;
  const m = year.match(/(\d{4})/);
  return m ? parseInt(m[1], 10) : new Date().getFullYear();
}

function normalizeDivision(
  value: string | number | undefined | null
): string | undefined {
  if (value == null) return undefined;
  const s = String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/designer|dev|developer/g, "");
  return s || undefined;
}

// Map raw division (including UUID) to slug using NEXT_PUBLIC_* env IDs
function mapDivisionSlug(rawDivision: string | undefined): string | undefined {
  if (!rawDivision) return undefined;
  const raw = String(rawDivision).trim();
  const val = raw.toLowerCase();
  const envMap: Record<string, string | undefined> = {
    uiux: process.env.NEXT_PUBLIC_DIVISION_UIUX_ID,
    frontend: process.env.NEXT_PUBLIC_DIVISION_FRONTEND_ID,
    backend: process.env.NEXT_PUBLIC_DIVISION_BACKEND_ID,
    devops: process.env.NEXT_PUBLIC_DIVISION_DEVOPS_ID,
  };
  const uuidRe = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;

  // If raw value looks like a UUID, try to match it to env-configured UUIDs
  const rawUuidMatch = raw.match(uuidRe);
  if (rawUuidMatch) {
    const rawUuid = rawUuidMatch[0].toLowerCase().replace(/-/g, "");
    for (const [slug, value] of Object.entries(envMap)) {
      if (!value) continue;
      const m = String(value).match(uuidRe);
      if (!m) continue;
      const envUuid = m[0].toLowerCase().replace(/-/g, "");
      if (envUuid === rawUuid) return slug;
    }
    // If no env mapping available, return undefined so callers will treat division as unknown
    return undefined;
  }

  // Try matching textual names (e.g., 'Frontend', 'UI/UX') to known slugs
  const normalized = normalizeDivision(raw);
  if (normalized === "uiux" || normalized.includes("uiux") || normalized.includes("ui-ux")) return "uiux";
  if (normalized.includes("frontend") || normalized.includes("fe") || normalized.includes("front")) return "frontend";
  if (normalized.includes("backend") || normalized.includes("be") || normalized.includes("back")) return "backend";
  if (normalized.includes("devops") || normalized.includes("devops")) return "devops";

  // Fallback to the normalized division string (may be undefined)
  return normalized;
}

function mapStatus(value: any): TaskStatus | undefined {
  if (!value) return undefined;
  const s = String(value).toLowerCase();
  if (s.includes("approve")) return "approved";
  if (s.includes("revisi") || s.includes("revision") || s.includes("review"))
    return "revision";
  if (s.includes("submit")) return "submitted";
  return undefined;
}

function pickDeadline(obj: any): string | undefined {
  const candidates = [
    "deadline",
    "dueDate",
    "due_date",
    "end_at",
    "dueAt",
    "due_at",
  ];
  for (const key of candidates) {
    if (obj?.[key]) return String(obj[key]);
  }
  return undefined;
}

function pickTitle(obj: any): string {
  const candidates = ["title", "name", "taskTitle", "judul"];
  for (const key of candidates) {
    if (obj?.[key]) return String(obj[key]);
  }
  // fallback
  return "Task";
}

function pickDivisionRaw(obj: any): string | undefined {
  const candidates = [
    "division",
    "division_id",
    "divisionId",
    "divisionName",
    "division_name",
    "divisi",
  ];
  for (const key of candidates) {
    if (obj?.[key]) return String(obj[key]);
  }
  return undefined;
}

function pickUnread(obj: any): boolean | undefined {
  const candidates = ["unread", "is_new", "isNew", "has_update", "hasUpdate"];
  for (const key of candidates) {
    if (typeof obj?.[key] !== "undefined") return Boolean(obj[key]);
  }
  return undefined;
}

function pickId(obj: any): string | number {
  const candidates = ["id", "taskId", "_id"];
  for (const key of candidates) {
    if (typeof obj?.[key] !== "undefined") return obj[key];
  }
  return Math.random().toString(36).slice(2);
}

export class TasksService {
  static async getInfo(): Promise<any> {
    return apiFetcher<any>(`/api/tasks/info`);
  }

  static async createTask(payload: any): Promise<any> {
    return apiFetcher<any>(`/api/tasks`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async submitTask(taskId: string | number, payload: any): Promise<any> {
    return apiFetcher<any>(`/api/tasks/${taskId}/submit`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async updateUserTaskStatus(
    taskId: string | number,
    userId: string | number,
    status: "submitted" | "revision" | "approved" | string
  ): Promise<any> {
    console.log("Updating task status:", { taskId, userId, status });
    try {
      // Gunakan method PUT sesuai backend API
      const result = await apiFetcher<any>(`/api/tasks/${taskId}/users/${userId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      console.log("Update status result:", result);
      return result;
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  }

  static async getTasksByYear(year: string | number): Promise<Task[]> {
    const y = extractYearNumber(formatYearForAPI(year));
    console.log("Fetching tasks for year:", y);

    try {
      // Prefer a year-filtered endpoint if available, otherwise fallback to /api/tasks
      let data: any;
      try {
        data = await apiFetcher<any>(`/api/tasks/year?year=${y}`);
      } catch (err) {
        console.warn("/api/tasks/year not available, falling back to /api/tasks", err);
        data = await apiFetcher<any>(`/api/tasks`);
      }

      const items: any[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.tasks)
        ? data.tasks
        : [];

      // If we fell back to /api/tasks, client-filter by channel_year
      const filtered = items.filter((raw: any) => {
        const cy = raw?.channel_year ?? raw?.year ?? raw?.angkatan;
        const num = Number.parseInt(String(cy), 10);
        return Number.isFinite(num) ? num === y : true;
      });

      return filtered.map((raw) => {
        const rawDivision = pickDivisionRaw(raw);
        const division = mapDivisionSlug(rawDivision);
        const status = mapStatus(raw.status || raw.userStatus || raw.status_user);
        return {
          id: pickId(raw),
          title: pickTitle(raw),
          description: raw.description,
          division,
          rawDivision,
          deadline: pickDeadline(raw),
          status,
          unread: pickUnread(raw),
          raw,
        } as Task;
      });
    } catch (error) {
      console.error("Error fetching tasks by year:", error);
      throw error;
    }
  }

  static async getTasksByDivisionAndYear(
    divisionId: string,
    year: string | number
  ): Promise<Task[]> {
    const all = await this.getTasksByYear(year);
    const target = normalizeDivision(divisionId);
    // If no target or target is 'all', return all tasks (no filtering)
    if (!target || target === "all") return all;

    return all.filter((t) => !t.division || t.division === target);
  }

  static async getTasksByUser(userId: string | number): Promise<Task[]> {
    const data = await apiFetcher<any>(`/api/tasks/users/${userId}`);
    const items: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.tasks)
      ? data.tasks
      : [];

    return items.map((raw) => {
      const rawDivision = pickDivisionRaw(raw);
      const division = mapDivisionSlug(rawDivision);
      const status = mapStatus(raw.status || raw.userStatus || raw.status_user);
      return {
        id: pickId(raw),
        title: pickTitle(raw),
        description: raw.description,
        division,
        rawDivision,
        deadline: pickDeadline(raw),
        status,
        unread: pickUnread(raw),
        raw,
      } as Task;
    });
  }
}

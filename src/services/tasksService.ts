
import { apiFetcher } from "./fetcher";
import { formatYearForAPI } from "@/hooks/useDivisions";
import { mockTasks } from "./mockDataFallback";

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
  raw?: any;
}

function extractYearNumber(year: string | number): number {
  if (typeof year === "number") return year;
  const m = String(year).match(/(\d{4})/);
  return m ? parseInt(m[1], 10) : new Date().getFullYear();
}

function normalizeDivision(value: string | number | undefined | null): string | undefined {
  if (value == null) return undefined;
  const s = String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/designer|dev|developer/g, "");
  return s || undefined;
}

function mapDivisionSlug(rawDivision: string | undefined): string | undefined {
  if (!rawDivision) return undefined;
  const raw = String(rawDivision).trim();
  const normalized = normalizeDivision(raw);
  if (!normalized) return undefined;
  if (normalized === "uiux" || normalized.includes("uiux") || normalized.includes("ui-ux")) return "uiux";
  if (normalized.includes("frontend") || normalized.includes("fe") || normalized.includes("front")) return "frontend";
  if (normalized.includes("backend") || normalized.includes("be") || normalized.includes("back")) return "backend";
  if (normalized.includes("devops")) return "devops";
  return normalized;
}

function mapStatus(value: any): TaskStatus | undefined {
  if (!value) return undefined;
  const s = String(value).toLowerCase();
  if (s.includes("approve")) return "approved";
  if (s.includes("revisi") || s.includes("revision") || s.includes("review")) return "revision";
  if (s.includes("submit")) return "submitted";
  return undefined;
}

function pickDeadline(obj: any): string | undefined {
  const candidates = ["deadline", "dueDate", "due_date", "end_at", "dueAt", "due_at"];
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
  return "Task";
}

function pickDivisionRaw(obj: any): string | undefined {
  if (!obj) return undefined;
  return obj.division ?? obj.rawDivision ?? obj.division_id ?? obj.divisionId ?? obj.channel ?? obj.channel_id ?? undefined;
}

function pickId(obj: any): string | number {
  return obj?.id ?? obj?._id ?? obj?.taskId ?? obj?.identifier ?? Math.random().toString(36).slice(2);
}

function pickUnread(obj: any): boolean {
  if (obj == null) return false;
  return Boolean(obj.unread || obj.is_unread || obj._unread);
}

export class TasksService {
  // Simple createTask: always POST JSON to /api/tasks (apiFetcher will use NEXT_PUBLIC_API_URL)
  static async createTask(payload: any): Promise<any> {
  return apiFetcher(`/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  static async submitTask(taskId: string | number, payload: any): Promise<any> {
  return apiFetcher(`/api/tasks/${taskId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  static async updateUserTaskStatus(
    taskId: string | number,
    userId: string | number,
    status: "submitted" | "revision" | "approved" | string
  ): Promise<any> {
    try {
  const result = await apiFetcher(`/api/tasks/${taskId}/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return result;
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  }

  static async getTasksByYear(year: string | number): Promise<Task[]> {
    const y = extractYearNumber(formatYearForAPI(year));

    // Try year-specific endpoint, fallback to /api/tasks, then to mock data
    try {
      let data: any;
      try {
  data = await apiFetcher(`/api/tasks/year?year=${y}`);
      } catch (err) {
  data = await apiFetcher(`/api/tasks`);
      }

      const items: any[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.tasks)
        ? data.tasks
        : [];

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
    } catch (err) {
      console.warn("Tasks API failed, falling back to mock data:", err);
      const items = Array.isArray(mockTasks) ? mockTasks : [];
      return items.map((raw: any) => ({
        id: raw.id ?? Math.random().toString(36).slice(2),
        title: raw.title ?? raw.name ?? "Task",
        description: raw.description,
        division: undefined,
        rawDivision: undefined,
        deadline: raw.deadline ?? raw.dueDate ?? raw.due_date,
        status: (raw.status || raw.state || "submitted") as TaskStatus,
        unread: Boolean(raw.unread),
        raw,
      } as Task));
    }
  }

  static async getTasksByDivisionAndYear(divisionId: string, year: string | number): Promise<Task[]> {
    const all = await this.getTasksByYear(year);
    const target = normalizeDivision(divisionId);
    if (!target || target === "all") return all;
    return all.filter((t) => !t.division || t.division === target);
  }

  static async getTasksByUser(userId: string | number): Promise<Task[]> {
  const data = await apiFetcher(`/api/tasks/users/${userId}`);
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
